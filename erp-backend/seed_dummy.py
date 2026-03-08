from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User
from app.core.tenant.models import Tenant, TenantStatus
from app.hrm.models import Employee, Department
from datetime import date

db = SessionLocal()

admin_user = db.query(User).filter(User.username == "admin").first()
if not admin_user:
    print("Admin user not found")
    exit(1)

# Ensure Tenant exists
tenant = db.query(Tenant).filter(Tenant.id == 1).first()
if not tenant:
    tenant = Tenant(id=1, name="Default Tenant", domain="default.com", status=TenantStatus.ACTIVE)
    db.add(tenant)
    db.commit()

dept = db.query(Department).first()
if not dept:
    dept = Department(name="IT Services", tenant_id=admin_user.tenant_id or 1)
    db.add(dept)
    db.commit()
    db.refresh(dept)

emp = db.query(Employee).filter(Employee.email == admin_user.email).first()
if not emp:
    emp = Employee(
        name="Master Admin",
        email="admin@default.com",  # Email matching seed_admin.py which creates admin@default.com
        department="IT Services",
        department_id=dept.id,
        role="System Admin",
        basic_salary=150000.00,
        tenant_id=tenant.id
    )
    db.add(emp)
    db.commit()
    print("Admin employee created.")
else:
    print("Admin employee already exists.")
