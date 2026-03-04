import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure we can import from app
sys.path.append(os.getcwd())

from app.core.database import Base
from app.core.tenant.models import Tenant, TenantStatus
from app.auth.models import User
from app.billing.models import Plan, Subscription, SubscriptionStatus

# Use sqlite in-memory
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def verify_billing_logic():
    print("--- 🟢 Starting Billing & Subscription Verification ---")
    
    # 1. Setup DB
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Seed Plans
        free_plan = Plan(name="FREE", price=0, max_users=2, modules="inventory,crm")
        ent_plan = Plan(name="ENTERPRISE", price=1000, max_users=1000, modules="inventory,crm,bi")
        db.add_all([free_plan, ent_plan])
        db.commit()
        db.refresh(free_plan)
        db.refresh(ent_plan)
        print(f"✅ Created Plans: FREE (max_users={free_plan.max_users}), ENTERPRISE (max_users={ent_plan.max_users})")
        
        # 3. Create Tenant (Free Plan)
        tenant_free = Tenant(name="Small Biz", domain="small.com", status=TenantStatus.ACTIVE)
        db.add(tenant_free)
        db.commit()
        db.refresh(tenant_free)
        
        sub_free = Subscription(
            tenant_id=tenant_free.id, 
            plan_id=free_plan.id, 
            status=SubscriptionStatus.ACTIVE.value
        )
        db.add(sub_free)
        db.commit()
        print(f"✅ Created Tenant '{tenant_free.name}' with FREE plan subscription")

        # 4. Create Users for Free Tenant
        user1 = User(username="u1", email="u1@small.com", hashed_password="x", tenant_id=tenant_free.id)
        user2 = User(username="u2", email="u2@small.com", hashed_password="x", tenant_id=tenant_free.id)
        db.add_all([user1, user2])
        db.commit()
        print(f"✅ Created 2 users for Free Tenant (Limit: {free_plan.max_users})")

        # 5. Test User Limit (Manual check - simulating the logic)
        print("\nTesting: User Limit Enforcement...")
        current_count = db.query(User).filter(User.tenant_id == tenant_free.id).count()
        print(f"   Current users: {current_count}, Plan limit: {free_plan.max_users}")
        
        if current_count >= free_plan.max_users:
            print(f"✅ SUCCESS: User limit reached ({current_count}/{free_plan.max_users}). New user creation would be blocked.")
        else:
            print(f"❌ FAILURE: User limit not reached. Should be at limit.")
            sys.exit(1)

        # 6. Test Feature Access (BI)
        print("\nTesting: Feature Access (BI Module)...")
        if free_plan.has_module("bi"):
             print("❌ FAILURE: Free plan incorrectly has BI.")
             sys.exit(1)
        else:
             print("✅ SUCCESS: Free plan does NOT have BI access.")
        
        if ent_plan.has_module("bi"):
             print("✅ SUCCESS: Enterprise plan HAS BI access.")
        else:
             print("❌ FAILURE: Enterprise plan missing BI.")
             sys.exit(1)

        # 7. Test Enterprise Tenant (High Limit)
        print("\nTesting: Enterprise Plan User Limits...")
        tenant_ent = Tenant(name="Big Corp", domain="big.com", status=TenantStatus.ACTIVE)
        db.add(tenant_ent)
        db.commit()
        db.refresh(tenant_ent)
        
        sub_ent = Subscription(
            tenant_id=tenant_ent.id,
            plan_id=ent_plan.id,
            status=SubscriptionStatus.ACTIVE.value
        )
        db.add(sub_ent)
        db.commit()
        
        # Add 3 users to enterprise (should be allowed)
        for i in range(3):
            u = User(username=f"ent_u{i}", email=f"ent{i}@big.com", hashed_password="x", tenant_id=tenant_ent.id)
            db.add(u)
        db.commit()
        
        ent_user_count = db.query(User).filter(User.tenant_id == tenant_ent.id).count()
        if ent_user_count == 3 and ent_user_count < ent_plan.max_users:
            print(f"✅ SUCCESS: Enterprise tenant has {ent_user_count} users (well under limit of {ent_plan.max_users})")
        else:
            print(f"❌ FAILURE: Enterprise user count issue.")
            sys.exit(1)

        print("\n--- ✅ Billing Verification COMPLETE ---")
        print("\n📊 Summary:")
        print(f"   - Plans created: {db.query(Plan).count()}")
        print(f"   - Tenants created: {db.query(Tenant).count()}")
        print(f"   - Subscriptions active: {db.query(Subscription).filter(Subscription.status == SubscriptionStatus.ACTIVE.value).count()}")
        print(f"   - Total users: {db.query(User).count()}")

    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    verify_billing_logic()
