from app.core.database import SessionLocal
from app.inventory.models import Assembly, AssemblyBOM, Item

def check_db():
    db = SessionLocal()
    try:
        assemblies = db.query(Assembly).all()
        print(f"Total Assemblies: {len(assemblies)}")
        for asm in assemblies:
            print(f"ID: {asm.id}, Name: {asm.name}, Tenant: {asm.tenant_id}")
            for bom in asm.bom_items:
                print(f"  - Component: {bom.component_item_id}, Qty: {bom.quantity}")
        
        items = db.query(Item).all()
        print(f"Total Items: {len(items)}")
        for i in items:
            print(f"ID: {i.id}, SKU: {i.sku}, Name: {i.name}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
