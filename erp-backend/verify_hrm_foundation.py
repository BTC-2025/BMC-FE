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
    # Ensure user has HR Manager roles
    role = db.query(Role).filter(Role.name == "HR Manager").first()
    if not role:
        role = Role(name="HR Manager", description="HR Manager Role")
        db.add(role)
        db.commit()
    
    # Assign permissions if missing
    p_codes = ["hrm.view", "hrm.manage_payroll"]
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

print("--- Testing HRM Foundation APIs ---")

# 1. Create Employee
emp_data = {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "department": "HR",
    "basic_salary": 6000.0
}
res = client.post("/hrm/employees", json=emp_data, headers=headers)
print(f"Create Employee: {res.status_code}")
emp_id = res.json()["id"]

# 2. Punch In
punch_in = {"employee_id": emp_id, "action": "IN"}
res = client.post("/hrm/attendance", json=punch_in, headers=headers)
print(f"Punch IN: {res.status_code}, Msg: {res.json().get('message')}")

# 3. Punch OUT
punch_out = {"employee_id": emp_id, "action": "OUT"}
res = client.post("/hrm/attendance", json=punch_out, headers=headers)
print(f"Punch OUT: {res.status_code}, Msg: {res.json().get('message')}")

# 4. Create Leave
leave_data = {
    "employee_id": emp_id,
    "leave_type": "SICK",
    "start_date": "2026-02-10",
    "end_date": "2026-02-12"
}
res = client.post("/hrm/leaves", json=leave_data, headers=headers)
print(f"Create Leave: {res.status_code}")

# 5. Generate Payroll
res = client.post(f"/hrm/payroll/{emp_id}?month=2026-02", headers=headers)
print(f"Generate Payroll: {res.status_code}, Net Salary: {res.json().get('net_salary')}")

if res.status_code == 200:
    print("✅ HRM Foundation Verification PASSED")
else:
    print(f"❌ HRM Foundation Verification FAILED: {res.text}")

db.close()
