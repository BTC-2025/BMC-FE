from app.core.database import SessionLocal
from app.inventory.models import Item, StockMovement, Warehouse

def check_inventory():
    db = SessionLocal()
    try:
        items = db.query(Item).all()
        print(f"Total Items: {len(items)}")
        for i in items:
            print(f"ID: {i.id}, Name: {i.name}, SKU: {i.sku}, Active: {i.is_active}")
            
        warehouses = db.query(Warehouse).all()
        print(f"\nTotal Warehouses: {len(warehouses)}")
        for w in warehouses:
            print(f"ID: {w.id}, Name: {w.name}")
            
        movements = db.query(StockMovement).all()
        print(f"\nTotal Movements: {len(movements)}")
        for m in movements:
            print(f"ID: {m.id}, Item ID: {m.item_id}, Warehouse ID: {m.warehouse_id}, Qty: {m.quantity}, Type: {m.movement_type}")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_inventory()
