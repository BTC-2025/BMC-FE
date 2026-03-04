from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.auth.permissions import (
    require_permission,
)
from app.inventory.models import Item, Warehouse, Category, ItemGroup, PriceList, PriceListItem, StockMovement, Assembly, AssemblyBOM
from app.auth.dependencies import get_current_user
from app.inventory.schemas import (
    ItemCreate, ItemUpdate, StockAdjust, StockTransfer, StockAuditRow, 
    WarehouseCreate, WarehouseResponse, CategoryCreate, CategoryResponse,
    ItemGroupCreate, ItemGroupResponse, PriceListCreate, PriceListResponse,
    PriceListItemCreate, PriceListItemResponse, AssemblyResponse
)
from app.inventory.service import (
    create_stock_movement,
    transfer_stock,
    get_stock_summary,
    get_audit_log,
    get_reorder_alerts,
    stock_in_batch,
    stock_in_serial,
    update_item as service_update_item,
    delete_item as service_delete_item,
    create_warehouse as service_create_warehouse,
    list_warehouses as service_list_warehouses,
)

from app.core.tenant.context import get_current_tenant_id  # NEW
from app.inventory.barcode_service import generate_barcode

router = APIRouter(prefix="/inventory", tags=["Inventory"])

# 🟩 CREATE ITEM
@router.post("/items", dependencies=[Depends(require_permission("inventory.create"))])
def create_item(
    data: ItemCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.inventory.cache import clear_inventory_cache
    # Explicitly pull category_id from data
    item = Item(**data.dict(), tenant_id=tenant_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    clear_inventory_cache()
    return item

# 🟦 LIST ITEMS (CACHED VIA SERVICE)
@router.get("/items", dependencies=[Depends(require_permission("inventory.view"))])
def list_items_route(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    from app.inventory.service import list_items
    return list_items(db, tenant_id=tenant_id, skip=skip, limit=limit)

# 🟨 STOCK IN / OUT (LITE + ENTERPRISE)
@router.post("/adjust", dependencies=[Depends(require_permission("inventory.adjust"))])
def adjust_stock(
    data: StockAdjust,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    movement = create_stock_movement(
        db,
        tenant_id=tenant_id,
        item_id=data.item_id,
        warehouse_id=data.warehouse_id,
        bin_id=data.bin_id,
        quantity=data.quantity,
        movement_type="IN" if data.quantity > 0 else "OUT",
        ref_type="ADJUST",
        performed_by=user.id,
        reference=data.reference,
    )
    db.commit()

    from app.core.audit.service import log_action
    log_action(
        db,
        tenant_id=tenant_id,
        user_id=user.id,
        action="inventory.stock_adjusted",
        module="inventory",
        entity_type="StockMovement",
        entity_id=movement.id,
        after={"qty": float(data.quantity), "reference": data.reference},
    )

    return {"message": "Stock updated", "movement_id": movement.id}

# 🟥 ENTERPRISE TRANSFER (ATOMIC)
@router.post(
    "/transfer",
    dependencies=[Depends(require_permission("inventory.transfer"))],
)
def transfer(
    data: StockTransfer,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    transfer_stock(
        db,
        tenant_id=tenant_id,
        item_id=data.item_id,
        from_warehouse=data.from_warehouse,
        to_warehouse=data.to_warehouse,
        from_bin=data.from_bin,
        to_bin=data.to_bin,
        quantity=data.quantity,
        performed_by=user.id,
    )
    return {"message": "Stock transferred successfully"}

# 🟦 STOCK SUMMARY (DASHBOARD)
@router.get(
    "/stock-summary",
    dependencies=[Depends(require_permission("inventory.view"))]
)
def stock_summary(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return get_stock_summary(db, tenant_id=tenant_id)

# 🟧 AUDIT LOG (COMPLIANCE)
@router.get(
    "/audit",
    response_model=List[StockAuditRow],
    dependencies=[Depends(require_permission("inventory.audit"))]
)
def audit_log(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return get_audit_log(db, tenant_id=tenant_id)

# 🟥 REORDER ALERTS
@router.get(
    "/alerts",
    dependencies=[Depends(require_permission("inventory.view"))]
)
def reorder_alerts(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return get_reorder_alerts(db, tenant_id=tenant_id)


# -----------------------------
# BATCH & SERIAL LOGIC (STEP 4.1.6)
# -----------------------------

@router.post(
    "/stock-in/batch",
    dependencies=[Depends(require_permission("inventory.manage"))],
)
def batch_in_endpoint(
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    """
    Submits a batch-tracked stock-in.
    """
    # Convert dates from payload if they exist
    from datetime import datetime
    mfg_date = datetime.strptime(payload["mfg_date"], "%Y-%m-%d").date() if payload.get("mfg_date") else None
    exp_date = datetime.strptime(payload["exp_date"], "%Y-%m-%d").date() if payload.get("exp_date") else None

    return stock_in_batch(
        db=db,
        tenant_id=tenant_id,
        item_id=payload["item_id"],
        warehouse_id=payload["warehouse_id"],
        batch_number=payload["batch_number"],
        quantity=payload["quantity"],
        mfg_date=mfg_date,
        exp_date=exp_date,
        performed_by=user.id
    )

@router.post(
    "/stock-in/serial",
    dependencies=[Depends(require_permission("inventory.manage"))],
)
def serial_in_endpoint(
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    """
    Submits a serialized stock-in.
    """
    return stock_in_serial(
        db=db,
        tenant_id=tenant_id,
        item_id=payload["item_id"],
        warehouse_id=payload["warehouse_id"],
        serial_numbers=payload["serial_numbers"],
        performed_by=user.id
    )

# 🟦 BARCODE (STEP 4.2.3)
@router.get(
    "/barcode/{sku}",
    dependencies=[Depends(require_permission("inventory.view"))],
)
def get_barcode_endpoint(
    sku: str,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    """
    Generates and returns a barcode image for the given SKU.
    """
    # Verify SKU ownership
    item = db.query(Item).filter(Item.sku == sku, Item.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    image_bytes = generate_barcode(sku)
    from io import BytesIO
    return StreamingResponse(
        BytesIO(image_bytes),
        media_type="image/png"
    )

# 🟨 UPDATE ITEM
@router.put("/items/{item_id}", dependencies=[Depends(require_permission("inventory.manage"))])
def update_item_endpoint(
    item_id: int,
    data: ItemUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return service_update_item(db, tenant_id, item_id, data.dict(exclude_unset=True))

# 🟥 DELETE ITEM
@router.delete("/items/{item_id}", dependencies=[Depends(require_permission("inventory.manage"))])
def delete_item_endpoint(
    item_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return service_delete_item(db, tenant_id, item_id)

# 🟩 CREATE WAREHOUSE
@router.post("/warehouses", response_model=WarehouseResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def create_warehouse_endpoint(
    data: WarehouseCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return service_create_warehouse(db, tenant_id, data.name, data.parent_id)

# 🟦 LIST WAREHOUSES
@router.get("/warehouses", response_model=List[WarehouseResponse], dependencies=[Depends(require_permission("inventory.view"))])
def list_warehouses_endpoint(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return service_list_warehouses(db, tenant_id)

# 🟩 CREATE CATEGORY
@router.post("/categories", response_model=CategoryResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def create_category_endpoint(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    new_cat = Category(name=data.name, description=data.description, tenant_id=tenant_id)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

# 🟦 LIST CATEGORIES
@router.get("/categories", response_model=List[CategoryResponse], dependencies=[Depends(require_permission("inventory.view"))])
def list_categories_endpoint(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Category).filter(Category.tenant_id == tenant_id).all()

# 🟥 DELETE CATEGORY
@router.delete("/categories/{cat_id}", dependencies=[Depends(require_permission("inventory.manage"))])
def delete_category_endpoint(
    cat_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    cat = db.query(Category).filter(Category.id == cat_id, Category.tenant_id == tenant_id).first()
    if cat:
        db.delete(cat)
        db.commit()
    return {"message": "Category deleted"}

# 🟨 ALIAS FOR ADJUST (As requested in STEP 3.2 naming convention)
@router.post("/movements", dependencies=[Depends(require_permission("inventory.adjust"))])
def movements_endpoint(
    data: StockAdjust,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id),
):
    return adjust_stock(data, db, user, tenant_id)


# 🟩 ITEM GROUPS - CREATE
@router.post("/item-groups", response_model=ItemGroupResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def create_item_group(
    data: ItemGroupCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    group = ItemGroup(**data.dict(), tenant_id=tenant_id)
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


# 🟦 ITEM GROUPS - LIST
@router.get("/item-groups", response_model=List[ItemGroupResponse], dependencies=[Depends(require_permission("inventory.view"))])
def list_item_groups(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(ItemGroup).filter(ItemGroup.tenant_id == tenant_id).all()


# 🟨 ITEM GROUPS - UPDATE
@router.put("/item-groups/{group_id}", response_model=ItemGroupResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def update_item_group(
    group_id: int,
    data: ItemGroupCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    group = db.query(ItemGroup).filter(ItemGroup.id == group_id, ItemGroup.tenant_id == tenant_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Item Group not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(group, key, value)
    
    db.commit()
    db.refresh(group)
    return group


# 🟥 ITEM GROUPS - DELETE
@router.delete("/item-groups/{group_id}", dependencies=[Depends(require_permission("inventory.manage"))])
def delete_item_group(
    group_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    group = db.query(ItemGroup).filter(ItemGroup.id == group_id, ItemGroup.tenant_id == tenant_id).first()
    if group:
        db.delete(group)
        db.commit()
    return {"message": "Item Group deleted"}


# 🟩 PRICE LISTS - CREATE
@router.post("/price-lists", response_model=PriceListResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def create_price_list(
    data: PriceListCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    price_list = PriceList(**data.dict(), tenant_id=tenant_id)
    db.add(price_list)
    db.commit()
    db.refresh(price_list)
    return price_list


# 🟦 PRICE LISTS - LIST
@router.get("/price-lists", response_model=List[PriceListResponse], dependencies=[Depends(require_permission("inventory.view"))])
def list_price_lists(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(PriceList).filter(PriceList.tenant_id == tenant_id).all()


# 🟨 PRICE LISTS - UPDATE
@router.put("/price-lists/{list_id}", response_model=PriceListResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def update_price_list(
    list_id: int,
    data: PriceListCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    price_list = db.query(PriceList).filter(PriceList.id == list_id, PriceList.tenant_id == tenant_id).first()
    if not price_list:
        raise HTTPException(status_code=404, detail="Price List not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(price_list, key, value)
    
    db.commit()
    db.refresh(price_list)
    return price_list


# 🟥 PRICE LISTS - DELETE
@router.delete("/price-lists/{list_id}", dependencies=[Depends(require_permission("inventory.manage"))])
def delete_price_list(
    list_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    price_list = db.query(PriceList).filter(PriceList.id == list_id, PriceList.tenant_id == tenant_id).first()
    if price_list:
        db.delete(price_list)
        db.commit()
    return {"message": "Price List deleted"}


# 🟩 PRICE LIST ITEMS - ADD ITEM TO PRICE LIST
@router.post("/price-lists/{list_id}/items", response_model=PriceListItemResponse, dependencies=[Depends(require_permission("inventory.manage"))])
def add_price_list_item(
    list_id: int,
    data: PriceListItemCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # Verify price list exists and belongs to tenant
    price_list = db.query(PriceList).filter(PriceList.id == list_id, PriceList.tenant_id == tenant_id).first()
    if not price_list:
        raise HTTPException(status_code=404, detail="Price List not found")
    
    # Verify item exists and belongs to tenant
    item = db.query(Item).filter(Item.id == data.item_id, Item.tenant_id == tenant_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    price_item = PriceListItem(
        price_list_id=list_id,
        item_id=data.item_id,
        price=data.price,
        tenant_id=tenant_id
    )
    db.add(price_item)
    db.commit()
    db.refresh(price_item)
    return price_item


# 🟦 PRICE LIST ITEMS - GET ITEMS IN PRICE LIST
@router.get("/price-lists/{list_id}/items", response_model=List[PriceListItemResponse], dependencies=[Depends(require_permission("inventory.view"))])
def get_price_list_items(
    list_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(PriceListItem).filter(
        PriceListItem.price_list_id == list_id,
        PriceListItem.tenant_id == tenant_id
    ).all()

# 🟦 BATCHES - LIST ALL BATCHES
@router.get("/batches", dependencies=[Depends(require_permission("inventory.view"))])
def list_batches_endpoint(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.inventory.service import list_batches
    return list_batches(db, tenant_id)

# 🟦 SERIALS - LIST ALL SERIAL NUMBERS
@router.get("/serials", dependencies=[Depends(require_permission("inventory.view"))])
def list_serials_endpoint(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.inventory.service import list_serials
    return list_serials(db, tenant_id)


# 🟩 BIN MANAGEMENT
class BinCreate(BaseModel):
    code: str

@router.post("/warehouses/{warehouse_id}/bins", dependencies=[Depends(require_permission("inventory.create"))])
def create_bin(
    warehouse_id: int,
    data: BinCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.inventory.models import Bin
    bin_obj = Bin(tenant_id=tenant_id, warehouse_id=warehouse_id, code=data.code)
    db.add(bin_obj)
    db.commit()
    db.refresh(bin_obj)
    return bin_obj
@router.get("/warehouses/{warehouse_id}/bins", dependencies=[Depends(require_permission("inventory.view"))])
def list_bins(
    warehouse_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    from app.inventory.models import Bin
    return db.query(Bin).filter(Bin.tenant_id == tenant_id, Bin.warehouse_id == warehouse_id).all()


# -----------------------------
# ASSEMBLIES (STEP 5.3)
# -----------------------------
from app.inventory.schemas import AssemblyCreate, AssemblyBuildRequest
from app.inventory.service import create_assembly, build_assembly

@router.post("/assemblies", dependencies=[Depends(require_permission("inventory.manage"))])
def create_assembly_route(
    data: AssemblyCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return create_assembly(db, tenant_id, data.name, data.finished_item_id, data.items)

@router.get("/assemblies", response_model=list[AssemblyResponse], dependencies=[Depends(require_permission("inventory.view"))])
def list_assemblies(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return db.query(Assembly).filter(Assembly.tenant_id == tenant_id).options(
        joinedload(Assembly.finished_item),
        joinedload(Assembly.bom_items).joinedload(AssemblyBOM.component_item)
    ).all()

@router.post("/assemblies/build", dependencies=[Depends(require_permission("inventory.adjust"))])
def build_assembly_route(
    data: AssemblyBuildRequest,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return build_assembly(
        db, 
        tenant_id, 
        data.assembly_id, 
        data.quantity, 
        data.warehouse_id, 
        user.id
    )
