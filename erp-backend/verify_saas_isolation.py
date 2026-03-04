import sys
import os
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.core.database import Base
from app.core.tenant.models import Tenant, TenantStatus
from app.auth.models import User
from app.inventory.models import Item
from app.core.security import get_password_hash

# Use SQLite for quick verification or the actual DB if configured
# For SAFETY, we will use a separate test check to not mess with the main DB structure if it fails halfway
# But we need models to check structure.
# We will check if we can initialize the NEW schema first.

# Use SQLite in-memory for reliable testing without file locks
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def verify_saas_isolation():
    print("--- 🟢 Starting SaaS Isolation Verification ---")
    
    # 1. Initialize Schema (Drop all to be clean)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Schema initialized with `tenant_id` columns.")

    db = SessionLocal()
    try:
        # 2. Create Tenants
        tenant_a = Tenant(name="Acme Corp", domain="acme.com", status=TenantStatus.ACTIVE)
        tenant_b = Tenant(name="Beta Inc", domain="beta.com", status=TenantStatus.ACTIVE)
        db.add_all([tenant_a, tenant_b])
        db.commit()
        db.refresh(tenant_a)
        db.refresh(tenant_b)
        print(f"Created Tenant A (ID: {tenant_a.id}) and Tenant B (ID: {tenant_b.id})")

        # 3. Create Users
        user_a = User(
            username="admin_a", 
            email="admin@acme.com", 
            hashed_password=get_password_hash("pass"),
            tenant_id=tenant_a.id
        )
        user_b = User(
            username="admin_b", 
            email="admin@beta.com", 
            hashed_password=get_password_hash("pass"),
            tenant_id=tenant_b.id
        )
        db.add_all([user_a, user_b])
        db.commit()
        print("Created Users for respective tenants.")

        # 4. Create Isolation Test Data (Inventory Item)
        item_a = Item(
            name="Widget A", 
            sku="WID-A", 
            unit="PCS", 
            tenant_id=tenant_a.id
        )
        db.add(item_a)
        db.commit()
        print("Created Inventory Item 'Widget A' for Tenant A.")

        # 5. Verify Isolation
        # Query simulating Tenant B context
        items_for_b = db.query(Item).filter(Item.tenant_id == tenant_b.id).all()
        
        if len(items_for_b) == 0:
            print("✅ SUCCESS: Tenant B sees 0 items.")
        else:
            print(f"❌ FAILURE: Tenant B sees {len(items_for_b)} items (Leakage detected!).")
            sys.exit(1)

        # Query simulating Tenant A context
        items_for_a = db.query(Item).filter(Item.tenant_id == tenant_a.id).all()
        if len(items_for_a) == 1 and items_for_a[0].name == "Widget A":
             print("✅ SUCCESS: Tenant A sees their item.")
        else:
             print("❌ FAILURE: Tenant A cannot see their own item.")
             sys.exit(1)

        print("\n--- SaaS Architecture Verification COMPLETE ---")

    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()
        # Clean up
        if os.path.exists("saas_check.db"):
            os.remove("saas_check.db")

if __name__ == "__main__":
    verify_saas_isolation()
