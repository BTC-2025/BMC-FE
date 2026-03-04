from app.core.database import SessionLocal
from app.inventory.models import Item
from app.inventory.schemas import ItemCreate

def test_direct_create():
    db = SessionLocal()
    try:
        data = ItemCreate(name="Manual Test", sku="MT-999", unit="pcs")
        item = Item(**data.dict(), tenant_id=1)
        db.add(item)
        db.commit()
        db.refresh(item)
        print(f"Success! Item ID: {item.id}")
    except Exception:
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_direct_create()
