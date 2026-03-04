from datetime import datetime
import random
import string
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.scm.models import PurchaseOrder, GoodsReceipt, Shipment
from app.inventory.service import create_stock_movement
from app.crm.models import Activity


def generate_tracking_number():
    """Generates a tracking number like PKG-7721"""
    num = random.randint(1000, 9999)
    return f"PKG-{num}"


def receive_goods(
    db: Session,
    *,
    tenant_id: int,
    purchase_order_id: int,
    warehouse_id: int,
    performed_by: int,
):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == purchase_order_id, PurchaseOrder.tenant_id == tenant_id).first()
    if not po or po.status not in ["APPROVED", "PARTIALLY_RECEIVED"]:
        raise HTTPException(status_code=400, detail="Invalid PO state")

    try:
        all_received = True

        for item in po.items:
            remaining = item.quantity_ordered - item.quantity_received
            if remaining > 0:
                # Stock IN
                create_stock_movement(
                    db,
                    tenant_id=tenant_id,
                    item_id=item.item_id,
                    warehouse_id=warehouse_id,
                    quantity=remaining,
                    movement_type="IN",
                    performed_by=performed_by,
                    reference=f"GRN-PO-{po.id}",
                )
                item.quantity_received += remaining
            if item.quantity_received < item.quantity_ordered:
                all_received = False

        po.status = "CLOSED" if all_received else "PARTIALLY_RECEIVED"

        grn = GoodsReceipt(
            purchase_order_id=po.id,
            tenant_id=tenant_id,
            received_by=performed_by,
        )

        activity = Activity(
            type="GOODS_RECEIVED",
            tenant_id=tenant_id,
            note=f"Goods received for PO {po.id}",
            performed_by=performed_by,
        )

        db.add(grn)
        db.add(activity)
        db.commit()

        from app.core.audit.service import log_audit
        log_audit(
            db,
            tenant_id=tenant_id,
            module="SCM",
            action="RECEIVE_GOODS",
            reference_id=str(grn.id),
            user_id=performed_by
        )

        return grn

    except Exception:
        db.rollback()
        raise


def initialize_shipment(
    db: Session,
    *,
    tenant_id: int,
    origin_code: str,
    carrier: str,
    status: str,
    performed_by: int,
):
    try:
        tracking_number = generate_tracking_number()
        
        shipment = Shipment(
            tenant_id=tenant_id,
            tracking_number=tracking_number,
            origin_code=origin_code,
            carrier=carrier,
            status=status,
            initialized_by=performed_by,
            shipping_date=datetime.utcnow() if status == "SHIPPED" else None
        )
        
        db.add(shipment)
        
        activity = Activity(
            type="SHIPMENT_INITIALIZED",
            tenant_id=tenant_id,
            note=f"Shipment {tracking_number} initialized for {origin_code}",
            performed_by=performed_by,
        )
        db.add(activity)
        
        db.commit()
        db.refresh(shipment)
        
        return shipment
    except Exception:
        db.rollback()
        raise
