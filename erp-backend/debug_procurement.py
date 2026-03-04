from app.core.database import SessionLocal
from app.scm.models import Supplier, PurchaseOrder
from app.inventory.models import Item

db = SessionLocal()
try:
    suppliers = db.query(Supplier).all()
    print(f"Total Suppliers: {len(suppliers)}")
    for s in suppliers:
        print(f"ID: {s.id}, Name: {s.name}")
        
    pos = db.query(PurchaseOrder).all()
    print(f"Total POs: {len(pos)}")
    for p in pos:
        print(f"ID: {p.id}, Status: {p.status}, Vendor ID: {p.supplier_id}")
        
    items = db.query(Item).all()
    print(f"Total Items: {len(items)}")
finally:
    db.close()
