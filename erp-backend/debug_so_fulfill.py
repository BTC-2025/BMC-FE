from app.core.database import SessionLocal
from app.scm.models import SalesOrder, SalesOrderItem
from app.inventory.service import get_current_stock
from app.inventory.models import Item, Warehouse

def debug_so_fulfillment(so_id, warehouse_id):
    db = SessionLocal()
    tenant_id = 2
    try:
        so = db.query(SalesOrder).filter(SalesOrder.id == so_id, SalesOrder.tenant_id == tenant_id).first()
        if not so:
            print(f"Sales Order {so_id} not found")
            return
        
        print(f"SO ID: {so.id}, Status: {so.status}, Customer: {so.customer_name}")
        
        wh = db.query(Warehouse).filter(Warehouse.id == warehouse_id, Warehouse.tenant_id == tenant_id).first()
        if not wh:
            print(f"Warehouse {warehouse_id} not found")
            return
        print(f"Fulfilling from Warehouse: {wh.name}")

        for item in so.items:
            stock = get_current_stock(db, tenant_id, item.item_id, warehouse_id)
            itm = db.query(Item).get(item.item_id)
            print(f"Item: {itm.name if itm else 'Unknown'} (ID: {item.item_id}), Quantity Needed: {item.quantity}, Current Stock in Wh {warehouse_id}: {stock}")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_so_fulfillment(8, 2)
