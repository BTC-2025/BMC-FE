from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role
from app.core.security import create_access_token
from datetime import timedelta, date, datetime

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    # Ensure user has HR Manager role for full testing
    role = db.query(Role).filter(Role.name == "HR Manager").first()
    if role and role not in user.roles:
        user.roles.append(role)
        db.commit()
        
    return create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))

token = get_token("admin")
headers = {"Authorization": f"Bearer {token}"}

print("--- Testing HRM APIs ---")

# 1. Onboard Employee
emp_data = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "9998887776",
    "department": "Engineering",
    "designation": "Senior Dev",
    "basic_salary": 5000.0
}
res = client.post("/hrm/employees", json=emp_data, headers=headers)
print(f"Onboard Employee: {res.status_code}")
emp_id = res.json()["id"]

# 2. List Employees
res = client.get("/hrm/employees", headers=headers)
print(f"List Employees: {res.status_code}, Count: {len(res.json())}")

# 3. Punch In
punch_data = {"employee_id": emp_id, "punch_type": "IN"}
res = client.post("/hrm/punch", json=punch_data, headers=headers)
print(f"Punch In: {res.status_code}, Status: {res.json().get('status')}")

# 4. Request Leave
leave_data = {
    "employee_id": emp_id,
    "leave_type": "SICK",
    "start_date": str(date.today()),
    "end_date": str(date.today()),
    "reason": "Fever"
}
res = client.post("/hrm/leaves", json=leave_data, headers=headers)
print(f"Request Leave: {res.status_code}")

# 5. Generate Payroll
payroll_data = {
    "employee_id": emp_id,
    "month": datetime.now().month,
    "year": datetime.now().year
}
res = client.post("/hrm/payroll/generate", json=payroll_data, headers=headers)
print(f"Generate Payroll: {res.status_code}, Net Salary: {res.json().get('net_salary')}")

if res.status_code == 200:
    print("✅ HRM API Verification PASSED")
else:
    print(f"❌ HRM API Verification FAILED: {res.text}")

db.close()
