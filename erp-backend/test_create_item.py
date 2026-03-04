from app.core.database import SessionLocal
from app.inventory.models import Item
from app.inventory.schemas import ItemCreate

import time
def test_create_item():
    db = SessionLocal()
    tenant_id = 1
    try:
        data = {
            "name": "Test Valuation Item",
            "sku": f"VAL-TEST-{int(time.time())}",
            "unit": "pcs",
            "reorder_level": 5,
            "valuation_rate": 250.75
        }
        # Simulate route logic
        item_create = ItemCreate(**data)
        item = Item(**item_create.dict(), tenant_id=tenant_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        print(f"SUCCESS: Created item {item.name} with valuation_rate {item.valuation_rate}")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_create_item()
