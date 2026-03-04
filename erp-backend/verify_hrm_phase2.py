from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role, Permission
from app.core.security import create_access_token
from datetime import timedelta, date, datetime

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    # Ensure user has HR Manager role with approval permission
    role = db.query(Role).filter(Role.name == "HR Manager").first()
    if not role:
        role = Role(name="HR Manager", description="HR Manager Role")
        db.add(role)
        db.commit()
    
    # Assign permissions if missing
    p_codes = ["hrm.view", "hrm.manage_payroll", "hrm.approve_leaves"]
    for code in p_codes:
        perm = db.query(Permission).filter(Permission.code == code).first()
        if not perm:
            perm = Permission(code=code, description=code)
            db.add(perm)
            db.commit()
        if perm not in role.permissions:
            role.permissions.append(perm)
    
    if role not in user.roles:
        user.roles.append(role)
    db.commit()
        
    return create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))

token = get_token("admin")
headers = {"Authorization": f"Bearer {token}"}

print("--- Testing HRM Phase 2 APIs ---")

# 1. Create Employee
emp_data = {
    "name": "Bob Enterprise",
    "email": "bob@enterprise.com",
    "department": "Logistics",
    "basic_salary": 9000.0
}
res = client.post("/hrm/employees", json=emp_data, headers=headers)
print(f"Create Employee: {res.status_code}")
emp_id = res.json()["id"]

# 2. Create UNPAID Leave Request
leave_data = {
    "employee_id": emp_id,
    "leave_type": "UNPAID",
    "start_date": "2026-02-01",
    "end_date": "2026-02-03" # 3 days (1, 2, 3)
}
res = client.post("/hrm/leaves", json=leave_data, headers=headers)
print(f"Create Leave: {res.status_code}")
leave_id = res.json()["id"]

# 3. Approve Leave
res = client.post(f"/hrm/leaves/{leave_id}/approve", headers=headers)
print(f"Approve Leave: {res.status_code}")

# 4. Generate Payroll
# 3 days unpaid = (9000 / 30) * 3 = 900 deduction
res = client.post(f"/hrm/payroll/{emp_id}?month=2026-02", headers=headers)
payroll = res.json()
print(f"Generate Payroll: {res.status_code}, Net Salary: {payroll.get('net_salary')}, Deductions: {payroll.get('deductions')}")

if payroll.get("net_salary") == 8100.0 and payroll.get("deductions") == 900.0:
    print("✅ HRM Phase 2 Verification PASSED")
else:
    print(f"❌ HRM Phase 2 Verification FAILED")

db.close()
