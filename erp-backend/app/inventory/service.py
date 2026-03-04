from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.inventory.models import Item, StockMovement, Batch, SerialNumber, Category, Warehouse
from datetime import date
from typing import List
from app.inventory.cache import cache_inventory_list, clear_inventory_cache


@cache_inventory_list(ttl=60)
def list_items(db: Session, tenant_id: int, skip: int = 0, limit: int = 50):
    items = db.query(Item).filter(Item.tenant_id == tenant_id).offset(skip).limit(limit).all()
    
    summary = db.query(
        StockMovement.item_id,
        func.sum(StockMovement.quantity).label("total_stock")
    ).filter(StockMovement.tenant_id == tenant_id).group_by(StockMovement.item_id).all()
    
    stock_map = {row.item_id: row.total_stock for row in summary}
    
    results = []
    for i in items:
        item_data = {
            "id": i.id,
            "name": i.name,
            "sku": i.sku,
            "unit": i.unit,
            "reorder_level": i.reorder_level,
            "valuation_rate": float(i.valuation_rate or 0),
            "barcode_value": i.barcode_value,
            "is_active": i.is_active,
            "current_stock": float(stock_map.get(i.id, 0) or 0),
            "category_id": i.category_id,
            "category": i.category.name if i.category else "Uncategorized",
            "item_group_id": i.item_group_id,
            "item_group": i.item_group.name if i.item_group else "None"
        }
        results.append(item_data)
        
    return results


def get_current_stock(
    db: Session,
    tenant_id: int,
    item_id: int,
    warehouse_id: int
) -> int:
    result = db.query(
        func.coalesce(func.sum(StockMovement.quantity), 0)
    ).filter(
        StockMovement.tenant_id == tenant_id,  # Tenant Filter
        StockMovement.item_id == item_id,
        StockMovement.warehouse_id == warehouse_id
    ).scalar()

    return float(result or 0)


def create_stock_movement(
    db: Session,
    *,
    tenant_id: int,
    item_id: int,
    warehouse_id: int,
    quantity: float,
    movement_type: str,
    performed_by: int,
    reference: str = None,
    work_order_id: int = None,
    unit_cost: float = 0.0,
    batch_id: int = None,
    serial_id: int = None,
    bin_id: int = None,
    ref_type: str = None,
    ref_id: int = None
):
    if quantity == 0:
        raise HTTPException(status_code=400, detail="Quantity cannot be zero")

    current_stock = get_current_stock(db, tenant_id, item_id, warehouse_id)
 
    # Prevent negative stock
    if quantity < 0 and current_stock + quantity < 0:
        raise HTTPException(
            status_code=409,
            detail="Insufficient stock"
        )

    movement = StockMovement(
        tenant_id=tenant_id,  # Auto-assign tenant
        item_id=item_id,
        warehouse_id=warehouse_id,
        quantity=quantity,
        movement_type=movement_type,
        reference=reference,
        work_order_id=work_order_id,
        unit_cost=unit_cost,
        batch_id=batch_id,
        serial_id=serial_id,
        bin_id=bin_id,
        ref_type=ref_type,
        ref_id=ref_id,
        performed_by=performed_by,
    )

    db.add(movement)
    db.flush()

    # Clear cache on movement
    clear_inventory_cache()

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=performed_by,
        action=f"STOCK_{movement_type}",
        module="INVENTORY",
        entity_type="StockMovement",
        entity_id=movement.id
    )

    return movement


def transfer_stock(
    db: Session,
    *,
    tenant_id: int,
    item_id: int,
    from_warehouse: int,
    to_warehouse: int,
    quantity: float,
    performed_by: int,
    from_bin: int = None,
    to_bin: int = None,
    reference: str = None
):
    quantity = float(quantity)
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")

    try:
        # OUT movement
        create_stock_movement(
            db,
            tenant_id=tenant_id,
            item_id=item_id,
            warehouse_id=from_warehouse,
            bin_id=from_bin,
            quantity=-quantity,
            movement_type="TRANSFER",
            ref_type="TRANSFER",
            performed_by=performed_by,
            reference=reference or f"TRANSFER_OUT to {to_warehouse}"
        )

        # IN movement
        create_stock_movement(
            db,
            tenant_id=tenant_id,
            item_id=item_id,
            warehouse_id=to_warehouse,
            bin_id=to_bin,
            quantity=quantity,
            movement_type="TRANSFER",
            ref_type="TRANSFER",
            performed_by=performed_by,
            reference=reference or f"TRANSFER_IN from {from_warehouse}"
        )

        db.commit()

    except Exception:
        db.rollback()
        raise


def get_stock_summary(db: Session, tenant_id: int):
    summary = (
        db.query(
            StockMovement.item_id,
            StockMovement.warehouse_id,
            func.sum(StockMovement.quantity).label("current_stock")
        )
        .filter(StockMovement.tenant_id == tenant_id)  # Tenant Filter
        .group_by(StockMovement.item_id, StockMovement.warehouse_id)
        .all()
    )
    return [
        {"item_id": row.item_id, "warehouse_id": row.warehouse_id, "current_stock": float(row.current_stock or 0)}
        for row in summary
    ]


def get_audit_log(db: Session, tenant_id: int):
    return (
        db.query(StockMovement)
        .filter(StockMovement.tenant_id == tenant_id)  # Tenant Filter
        .order_by(StockMovement.created_at.desc())
        .all()
    )


def get_reorder_alerts(db: Session, tenant_id: int):
    summary = get_stock_summary(db, tenant_id)
    alerts = []

    for row in summary:
        # Ensure we only fetch items belonging to this tenant
        item = db.query(Item).filter(Item.id == row["item_id"], Item.tenant_id == tenant_id).first()
        
        if item and row["current_stock"] <= item.reorder_level:
            alerts.append({
                "item_id": row["item_id"],
                "warehouse_id": row["warehouse_id"],
                "current_stock": row["current_stock"],
                "reorder_level": item.reorder_level,
            })

    return alerts


# -----------------------------
# BATCH & SERIAL LOGIC (STEP 4.1.3 & 4.1.4)
# -----------------------------

def stock_in_batch(
    db: Session,
    *,
    tenant_id: int,
    item_id: int,
    warehouse_id: int,
    batch_number: str,
    quantity: float,
    mfg_date: date = None,
    exp_date: date = None,
    performed_by: int
):
    """
    Creates a batch record and increments stock.
    """
    batch = Batch(
        tenant_id=tenant_id,
        item_id=item_id,
        batch_number=batch_number,
        manufacturing_date=mfg_date,
        expiry_date=exp_date,
        quantity=quantity
    )
    db.add(batch)
    db.flush()

    movement = create_stock_movement(
        db,
        tenant_id=tenant_id,
        item_id=item_id,
        warehouse_id=warehouse_id,
        quantity=quantity,
        movement_type="IN",
        ref_type="PO",  # Defaulting to PO for stock in
        batch_id=batch.id,
        performed_by=performed_by,
        reference=f"BATCH_IN: {batch_number}"
    )
    
    db.commit()
    return movement


def stock_in_serial(
    db: Session,
    *,
    tenant_id: int,
    item_id: int,
    warehouse_id: int,
    serial_numbers: List[str],
    performed_by: int
):
    """
    Creates serial number records and handles stock movements one by one.
    """
    movements = []
    
    for sn in serial_numbers:
        # Check if already exists
        existing = db.query(SerialNumber).filter(
            SerialNumber.tenant_id == tenant_id,
            SerialNumber.item_id == item_id,
            SerialNumber.serial_number == sn
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail=f"Serial {sn} already exists for this item")

        serial = SerialNumber(
            tenant_id=tenant_id,
            item_id=item_id,
            serial_number=sn,
            status="IN_STOCK"
        )
        db.add(serial)
        db.flush()

        mvmt = create_stock_movement(
            db,
            tenant_id=tenant_id,
            item_id=item_id,
            warehouse_id=warehouse_id,
            quantity=1,
            movement_type="IN",
            ref_type="PO",  # Defaulting to PO for stock in
            serial_id=serial.id,
            performed_by=performed_by,
            reference=f"SERIAL_IN: {sn}"
        )
        
        serial.last_movement_id = mvmt.id
        movements.append(mvmt)

    db.commit()
    return movements

def update_item(db: Session, tenant_id: int, item_id: int, data: dict):
    item = db.query(Item).filter(Item.id == item_id, Item.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in data.items():
        if value is not None:
            setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    clear_inventory_cache()
    return item

def delete_item(db: Session, tenant_id: int, item_id: int):
    item = db.query(Item).filter(Item.id == item_id, Item.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Check if there are movements
    if db.query(StockMovement).filter(StockMovement.item_id == item_id).first():
        # Soft delete or block
        item.is_active = 0
        db.commit()
        clear_inventory_cache()
        return {"message": "Item deactivated due to existing transactions"}
    
    db.delete(item)
    db.commit()
    clear_inventory_cache()
    return {"message": "Item deleted"}

def create_warehouse(db: Session, tenant_id: int, name: str, parent_id: int = None):
    warehouse = Warehouse(tenant_id=tenant_id, name=name, parent_id=parent_id)
    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)
    return warehouse

def list_warehouses(db: Session, tenant_id: int):
    return db.query(Warehouse).filter(Warehouse.tenant_id == tenant_id).all()

def list_batches(db: Session, tenant_id: int):
    batches = db.query(Batch).filter(Batch.tenant_id == tenant_id).all()
    result = []
    for b in batches:
        result.append({
            "id": b.id,
            "batch_number": b.batch_number,
            "item_id": b.item_id,
            "item_name": b.item.name if b.item else "Unknown",
            "quantity": float(b.quantity or 0),
            "manufacturing_date": b.manufacturing_date.isoformat() if b.manufacturing_date else None,
            "expiry_date": b.expiry_date.isoformat() if b.expiry_date else None,
            "created_at": b.created_at.isoformat()
        })
    return result

def list_serials(db: Session, tenant_id: int):
    serials = db.query(SerialNumber).filter(SerialNumber.tenant_id == tenant_id).all()
    result = []
    for s in serials:
        # Get warehouse from last movement if possible
        warehouse_name = "Unknown"
        if s.last_movement_id:
            move = db.query(StockMovement).filter(StockMovement.id == s.last_movement_id).first()
            if move and move.warehouse:
                warehouse_name = move.warehouse.name

        result.append({
            "id": s.id,
            "serial_number": s.serial_number,
            "item_id": s.item_id,
            "item_name": s.item.name if s.item else "Unknown",
            "status": s.status,
            "warehouse": warehouse_name,
            "created_at": s.created_at.isoformat()
        })
    return result


# -----------------------------
# ASSEMBLY SERVICE (STEP 5.2)
# -----------------------------

def create_assembly(
    db: Session,
    tenant_id: int,
    name: str,
    finished_item_id: int,
    bom_items: list
):
    from app.inventory.models import Assembly, AssemblyBOM
    
    assembly = Assembly(
        tenant_id=tenant_id,
        name=name,
        finished_item_id=finished_item_id
    )
    db.add(assembly)
    db.flush()

    for item in bom_items:
        bom = AssemblyBOM(
            tenant_id=tenant_id,
            assembly_id=assembly.id,
            component_item_id=item.component_item_id,
            quantity=item.quantity
        )
        db.add(bom)
    
    db.commit()
    db.refresh(assembly)
    return assembly


def build_assembly(
    db: Session,
    tenant_id: int,
    assembly_id: int,
    quantity: float,
    warehouse_id: int,
    performed_by: int
):
    from app.inventory.models import Assembly
    
    assembly = db.query(Assembly).filter(
        Assembly.id == assembly_id, 
        Assembly.tenant_id == tenant_id
    ).first()
    
    if not assembly:
        raise HTTPException(status_code=404, detail="Assembly not found")

    try:
        # 1. Deduct Components
        for bom_item in assembly.bom_items:
            needed = float(bom_item.quantity) * float(quantity)
            create_stock_movement(
                db,
                tenant_id=tenant_id,
                item_id=bom_item.component_item_id,
                warehouse_id=warehouse_id,
                quantity=-needed,
                movement_type="OUT",
                ref_type="ASSEMBLY",
                ref_id=assembly.id,
                performed_by=performed_by,
                reference=f"Build Assembly: {assembly.name}"
            )

        # 2. Add Finished Good
        create_stock_movement(
            db,
            tenant_id=tenant_id,
            item_id=assembly.finished_item_id,
            warehouse_id=warehouse_id,
            quantity=quantity,
            movement_type="IN",
            ref_type="ASSEMBLY",
            ref_id=assembly.id,
            performed_by=performed_by,
            reference=f"Build Assembly: {assembly.name}"
        )

        db.commit()
        return {"message": "Assembly built successfully", "assembly_id": assembly.id}

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
