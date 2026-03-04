from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.hrm.models import Employee, Department
from app.core.tenant.models import Tenant

def test_onboard():
    db = SessionLocal()
    try:
        tenant = db.query(Tenant).first()
        if not tenant:
            tenant = Tenant(name="Default Tenant")
            db.add(tenant)
            db.commit()
            db.refresh(tenant)
        
        dept = db.query(Department).filter(Department.tenant_id == tenant.id).first()
        if not dept:
            dept = Department(name="Engineering", tenant_id=tenant.id)
            db.add(dept)
            db.commit()
            db.refresh(dept)
            
        new_emp = Employee(
            tenant_id=tenant.id,
            name="Test Employee",
            email="test@example.com",
            role="Developer",
            department=dept.name,
            department_id=dept.id,
            basic_salary=50000.00
        )
        db.add(new_emp)
        db.commit()
        db.refresh(new_emp)
        print(f"Employee onboarded: {new_emp.name}, ID: {new_emp.id}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_onboard()
