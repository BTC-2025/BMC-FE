from app.billing.models import Plan
from app.core.tenant.models import Tenant
from app.core.database import SessionLocal, engine, Base

def seed_plans():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Define Standard Plans
        plans_data = [
            {
                "name": "FREE",
                "price": 0,
                "max_users": 3,
                "modules": "inventory,crm",  # Basic modules
            },
            {
                "name": "STARTER",
                "price": 2900,  # $29.00
                "max_users": 10,
                "modules": "inventory,crm,scm,projects",
            },
            {
                "name": "ENTERPRISE",
                "price": 9900,  # $99.00
                "max_users": 1000,
                "modules": "inventory,crm,scm,projects,finance,hrm,mfg,bi",  # All incl BI
            }
        ]

        print("--- Seeding Plans ---")
        for p_data in plans_data:
            existing = db.query(Plan).filter(Plan.name == p_data["name"]).first()
            if not existing:
                plan = Plan(**p_data)
                db.add(plan)
                print(f"Created Plan: {p_data['name']}")
            else:
                print(f"Plan {p_data['name']} exists.")
        
        db.commit()
        print("--- Plans Seeded Successfully ---")
    
    except Exception as e:
        print(f"Error seeding plans: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_plans()
