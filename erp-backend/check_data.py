from app.core.database import SessionLocal
from app.inventory.models import Warehouse, Item, StockMovement, Assembly, AssemblyBOM
from sqlalchemy import func

def check():
    db = SessionLocal()
    try:
        print("--- WAREHOUSES ---")
        warehouses = db.query(Warehouse).all()
        for wh in warehouses:
            print(f"ID: {wh.id}, Name: {wh.name}, Tenant: {wh.tenant_id}")
        
        print("\n--- ITEMS & STOCK ---")
        items = db.query(Item).all()
        for item in items:
            stock = db.query(func.sum(StockMovement.quantity)).filter(StockMovement.item_id == item.id).scalar() or 0
            print(f"ID: {item.id}, Name: {item.name}, SKU: {item.sku}, Stock: {stock}")
            
            # Per warehouse stock
            wh_stocks = db.query(StockMovement.warehouse_id, func.sum(StockMovement.quantity)).filter(StockMovement.item_id == item.id).group_by(StockMovement.warehouse_id).all()
            for wh_id, qty in wh_stocks:
                print(f"  - Warehouse {wh_id}: {qty}")

        print("\n--- ASSEMBLIES ---")
        assemblies = db.query(Assembly).all()
        for asm in assemblies:
            print(f"ID: {asm.id}, Name: {asm.name}, Finished Item: {asm.finished_item_id}")
            for bom in asm.bom_items:
                print(f"  - Component: {bom.component_item_id}, Qty: {bom.quantity}")
                
    finally:
        db.close()

if __name__ == "__main__":
    check()
