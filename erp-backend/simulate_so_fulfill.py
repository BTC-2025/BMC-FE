from app.core.database import SessionLocal
from app.scm.models import SalesOrder
from app.inventory.service import create_stock_movement
from fastapi import HTTPException
import sys

def test_fulfillment(so_id, warehouse_id):
    db = SessionLocal()
    tenant_id = 2  # Based on our DB check
    user_id = 1    # Dummy user id
    try:
        so = db.query(SalesOrder).filter(SalesOrder.id == so_id, SalesOrder.tenant_id == tenant_id).first()
        if not so:
            print("SO not found")
            return

        print(f"Fulfilling SO {so_id} with {len(so.items)} items")
        for item in so.items:
            print(f"Item ID: {item.item_id}, Qty: {item.quantity}")
            create_stock_movement(
                db,
                tenant_id=tenant_id,
                item_id=item.item_id,
                warehouse_id=warehouse_id,
                quantity=-float(item.quantity),
                movement_type="OUT",
                ref_type="SO",
                ref_id=so.id,
                performed_by=user_id,
                reference=f"SO Fulfillment: {so.id}"
            )
        
        so.status = "FULFILLED"
        db.commit()
        print("Success")
    except HTTPException as he:
        print(f"HTTPException: {he.status_code} - {he.detail}")
        db.rollback()
    except Exception as e:
        print(f"General Exception: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_fulfillment(8, 2)
