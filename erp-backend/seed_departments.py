from app.core.database import SessionLocal, Base, engine
from app.core.tenant.models import Tenant
from app.hrm.models import Department

def seed_departments():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if tenant exists, use the first one or ID 1
        tenant = db.query(Tenant).first()
        if not tenant:
            print("No tenants found! Creating a default tenant...")
            tenant = Tenant(name="Default Tenant")
            db.add(tenant)
            db.commit()
            db.refresh(tenant)
        
        tenant_id = tenant.id
        print(f"Using Tenant ID: {tenant_id}")
        
        departments = [
            "Engineering",
            "Human Resources",
            "Sales",
            "Finance",
            "Marketing",
            "Operations"
        ]
        
        for dept_name in departments:
            exists = db.query(Department).filter(
                Department.name == dept_name, 
                Department.tenant_id == tenant_id
            ).first()
            
            if not exists:
                dept = Department(name=dept_name, tenant_id=tenant_id)
                db.add(dept)
                print(f"Adding department: {dept_name}")
        
        db.commit()
        print("Seeding complete.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_departments()
