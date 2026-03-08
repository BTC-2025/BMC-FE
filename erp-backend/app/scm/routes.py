from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.auth.dependencies import get_current_user, get_current_tenant_id
from app.auth.permissions import require_permission
from app.scm.models import Supplier, PurchaseOrder, PurchaseOrderItem, Shipment, SalesOrder, SalesOrderItem
from app.scm.schemas import (
    SupplierCreate,
    SupplierUpdate,
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderResponse,
    ReceiveGoodsRequest,
    ShipmentCreate,
    ShipmentUpdate,
    ShipmentResponse,
    SalesOrderCreate, SalesOrderUpdate, SalesOrderResponse
)
from app.scm.service import receive_goods, initialize_shipment
from app.inventory.service import create_stock_movement

router = APIRouter(prefix="/scm", tags=["Supply Chain"])

# 🟩 SUPPLIER APIs
@router.post(
    "/suppliers",
    dependencies=[Depends(require_permission("scm.view"))],
)
def create_supplier(
    data: SupplierCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    supplier = Supplier(**data.dict(), tenant_id=tenant_id)
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get(
    "/suppliers",
    dependencies=[Depends(require_permission("scm.view"))],
)
def list_suppliers(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    return db.query(Supplier).filter(Supplier.tenant_id == tenant_id).offset(skip).limit(limit).all()

@router.patch("/suppliers/{supplier_id}", dependencies=[Depends(require_permission("scm.view"))])
def update_supplier(
    supplier_id: int,
    data: SupplierUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.tenant_id == tenant_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    if data.name is not None: supplier.name = data.name
    if data.email is not None: supplier.email = data.email
    if data.phone is not None: supplier.phone = data.phone
    
    db.commit()
    db.refresh(supplier)
    return supplier

@router.delete("/suppliers/{supplier_id}", dependencies=[Depends(require_permission("scm.view"))])
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id, Supplier.tenant_id == tenant_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted"}

# 🟦 PURCHASE ORDER APIs
@router.post(
    "/purchase-orders",
    response_model=PurchaseOrderResponse,
    dependencies=[Depends(require_permission("scm.create_po"))],
)
def create_po(
    data: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    po = PurchaseOrder(
        supplier_id=data.supplier_id,
        tenant_id=tenant_id,
        status="DRAFT",
    )
    db.add(po)
    db.flush()

    for item in data.items:
        po_item = PurchaseOrderItem(
            purchase_order_id=po.id,
            tenant_id=tenant_id,
            item_id=item.item_id,
            quantity_ordered=item.quantity,
        )
        db.add(po_item)

    db.commit()
    # Refresh with items
    return db.query(PurchaseOrder)\
        .options(joinedload(PurchaseOrder.items))\
        .filter(PurchaseOrder.id == po.id)\
        .first()

@router.get(
    "/purchase-orders",
    response_model=List[PurchaseOrderResponse],
    dependencies=[Depends(require_permission("scm.view"))],
)
def list_pos(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    return db.query(PurchaseOrder)\
        .options(joinedload(PurchaseOrder.items))\
        .filter(PurchaseOrder.tenant_id == tenant_id)\
        .offset(skip).limit(limit).all()

@router.post(
    "/purchase-orders/{po_id}/approve",
    dependencies=[Depends(require_permission("scm.approve_po"))],
)
def approve_po(
    po_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id, PurchaseOrder.tenant_id == tenant_id).first()
    if not po or po.status != "DRAFT":
        raise HTTPException(status_code=400, detail="Invalid PO")

    po.status = "APPROVED"
    po.approved_by = user.id
    db.commit()
    return {"message": "PO approved"}

@router.patch("/purchase-orders/{po_id}", dependencies=[Depends(require_permission("scm.view"))])
def update_po(
    po_id: int,
    data: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id, PurchaseOrder.tenant_id == tenant_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")
    
    if data.status is not None:
        po.status = data.status
        
    db.commit()
    db.refresh(po)
    return po

@router.delete("/purchase-orders/{po_id}", dependencies=[Depends(require_permission("scm.view"))])
def delete_po(
    po_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id, PurchaseOrder.tenant_id == tenant_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")
    
    db.delete(po)
    db.commit()
    return {"message": "PO deleted"}

# 🟥 GOODS RECEIPT API (ATOMIC)
@router.post(
    "/receive",
    dependencies=[Depends(require_permission("scm.receive_goods"))],
)
def receive(
    data: ReceiveGoodsRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return receive_goods(
        db,
        tenant_id=tenant_id,
        purchase_order_id=data.purchase_order_id,
        warehouse_id=data.warehouse_id,
        performed_by=user.id,
    )


# 🚛 SHIPMENT APIs
@router.post(
    "/shipments",
    response_model=ShipmentResponse,
    dependencies=[Depends(require_permission("scm.view"))],
)
def create_shipment(
    data: ShipmentCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    return initialize_shipment(
        db,
        tenant_id=tenant_id,
        origin_code=data.origin_code,
        carrier=data.carrier,
        status=data.status,
        performed_by=user.id,
    )

@router.get(
    "/shipments",
    dependencies=[Depends(require_permission("scm.view"))],
)
def list_shipments(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    return db.query(Shipment).filter(Shipment.tenant_id == tenant_id).order_by(Shipment.created_at.desc()).offset(skip).limit(limit).all()

@router.patch("/shipments/{shipment_id}", dependencies=[Depends(require_permission("scm.view"))])
def update_shipment(
    shipment_id: int,
    data: ShipmentUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id, Shipment.tenant_id == tenant_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    if data.origin_code is not None: shipment.origin_code = data.origin_code
    if data.carrier is not None: shipment.carrier = data.carrier
    if data.status is not None: shipment.status = data.status
    
    db.commit()
    db.refresh(shipment)
    return shipment

@router.delete("/shipments/{shipment_id}", dependencies=[Depends(require_permission("scm.view"))])
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id, Shipment.tenant_id == tenant_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    db.delete(shipment)
    db.commit()
    return {"message": "Shipment deleted"}


# 🚚 FLEET APIs
@router.get(
    "/fleet",
    dependencies=[Depends(require_permission("scm.view"))],
)
def get_fleet(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    # Dynamic simulation based on the number of shipments
    base_forklifts = 4
    base_pallet_jacks = 12
    
    active_shipments = db.query(Shipment).filter(
        Shipment.status.in_(["PACKED", "IN_TRANSIT"]), 
        Shipment.tenant_id == tenant_id
    ).count()
    
    # Simple dynamic logic: more active shipments might mean fewer available jacks
    available_jacks = max(2, base_pallet_jacks - (active_shipments // 2))
    available_forklifts = max(1, base_forklifts - (active_shipments // 4))

    return {
        "forklifts": available_forklifts,
        "palletJacks": available_jacks,
        "total_active_shipments": active_shipments
    }

# -----------------------------
# SALES ORDERS (STEP 6.1)
# -----------------------------
from app.scm.models import SalesOrder, SalesOrderItem
from app.scm.schemas import SalesOrderCreate, SalesOrderResponse, SalesOrderUpdate
from sqlalchemy.orm import joinedload

@router.post("/sales-orders", dependencies=[Depends(require_permission("scm.view"))])
def create_sales_order(
    data: SalesOrderCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    so = SalesOrder(
        customer_name=data.customer_name,
        tenant_id=tenant_id,
        status="PENDING",
        total_amount=sum(i.quantity * i.unit_price for i in data.items)
    )
    db.add(so)
    db.flush()

    for item in data.items:
        so_item = SalesOrderItem(
            sales_order_id=so.id,
            tenant_id=tenant_id,
            item_id=item.item_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(so_item)

    db.commit()
    db.refresh(so)
    return so

@router.get("/sales-orders", response_model=List[SalesOrderResponse], dependencies=[Depends(require_permission("scm.view"))])
def list_sales_orders(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id),
    skip: int = 0,
    limit: int = 50
):
    return db.query(SalesOrder).filter(
        SalesOrder.tenant_id == tenant_id
    ).options(joinedload(SalesOrder.items)).offset(skip).limit(limit).all()

@router.patch("/sales-orders/{so_id}", dependencies=[Depends(require_permission("scm.view"))])
def update_sales_order(
    so_id: int,
    data: SalesOrderUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant_id)
):
    so = db.query(SalesOrder).filter(SalesOrder.id == so_id, SalesOrder.tenant_id == tenant_id).first()
    if not so:
        raise HTTPException(status_code=404, detail="SO not found")
    
    if data.customer_name is not None:
        so.customer_name = data.customer_name
    if data.status is not None:
        so.status = data.status
        
    db.commit()
    db.refresh(so)
    return so

@router.post("/sales-orders/{so_id}/fulfill", dependencies=[Depends(require_permission("scm.view"))])
def fulfill_sales_order(
    so_id: int,
    warehouse_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
    tenant_id: int = Depends(get_current_tenant_id)
):
    so = db.query(SalesOrder).filter(SalesOrder.id == so_id, SalesOrder.tenant_id == tenant_id).first()
    if not so or so.status == "FULFILLED":
        raise HTTPException(status_code=400, detail="Invalid SO or already fulfilled")

    try:
        for item in so.items:
            create_stock_movement(
                db,
                tenant_id=tenant_id,
                item_id=item.item_id,
                warehouse_id=warehouse_id,
                quantity=-float(item.quantity),
                movement_type="OUT",
                ref_type="SO",
                ref_id=so.id,
                performed_by=user.id,
                reference=f"SO Fulfillment: {so.id}"
            )
        
        so.status = "FULFILLED"
        db.commit()
        return {"message": "SO fulfilled"}
    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
