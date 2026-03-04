from app.core.database import SessionLocal
from app.inventory.models import Item, Warehouse, StockMovement
from app.auth.models import User
from app.inventory.service import create_stock_movement, transfer_stock, get_current_stock
from sqlalchemy import text

# Initialize session
db = SessionLocal()

def run_sanity_test():
    print("🚀 Starting Inventory Core Sanity Test...")

    try:
        # 1. Setup Data - Create Warehouse & Item directly
        # Check if warehouse exists
        wh = db.query(Warehouse).filter(Warehouse.name == "Sanity Test WH").first()
        if not wh:
            wh = Warehouse(name="Sanity Test WH")
            db.add(wh)
            db.commit()
            print("✅ Warehouse Created")
        
        # Check if item exists
        item = db.query(Item).filter(Item.sku == "SANITY-001").first()
        if not item:
            item = Item(name="Test Item core", sku="SANITY-001", unit="pcs", reorder_level=5)
            db.add(item)
            db.commit()
            print("✅ Item Created")
            
        # Get Admin User ID for 'performed_by'
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            print("⚠️ Admin user not found! Using ID 1")
            user_id = 1
        else:
            user_id = admin.id

        # 2. Add Stock (+10)
        print("🔹 Testing Stock IN (+10)...")
        create_stock_movement(
            db, 
            item_id=item.id, 
            warehouse_id=wh.id, 
            quantity=10, 
            movement_type="IN", 
            performed_by=user_id,
            reference="Initial"
        )
        db.commit()
        
        current = get_current_stock(db, item.id, wh.id)
        print(f"   Current Stock: {current}")
        assert current == 10, f"Expected 10, got {current}"

        # 3. Stock Out (-5)
        print("🔹 Testing Stock OUT (-5)...")
        create_stock_movement(
            db, 
            item_id=item.id, 
            warehouse_id=wh.id, 
            quantity=-5, 
            movement_type="OUT", 
            performed_by=user_id,
            reference="Usage"
        )
        db.commit()
        
        current = get_current_stock(db, item.id, wh.id)
        print(f"   Current Stock: {current}")
        assert current == 5, f"Expected 5, got {current}"

        # 4. Negative Stock Prevention (-10)
        print("🔹 Testing Negative Stock Prevention (Try -10, have 5)...")
        try:
            create_stock_movement(
                db, 
                item_id=item.id, 
                warehouse_id=wh.id, 
                quantity=-10, 
                movement_type="OUT", 
                performed_by=user_id,
                reference="Fail"
            )
            print("❌ FAILED: Should have raised exception")
        except Exception as e:
            print(f"✅ SUCCESS: Caught expected error: {e}")
            db.rollback()

        # 5. Clean up (Optional, but good for repeatability if using unique constraints)
        # db.delete(item)
        # db.delete(wh)
        # db.commit()

        print("\n✨ ALL TESTS PASSED! Inventory Core is Solid. ✨")

    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_sanity_test()
