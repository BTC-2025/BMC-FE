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

print("--- Testing HRM Performance APIs ---")

# 1. Create Employee
emp_data = {
    "name": "Performance Tester",
    "email": "perf.test@example.com",
    "department": "QA",
    "basic_salary": 7500.0
}
res = client.post("/hrm/employees", json=emp_data, headers=headers)
print(f"Create Employee: {res.status_code}")
emp_id = res.json()["id"]

# 2. Create Appraisal
appraisal_data = {
    "employee_id": emp_id,
    "review_period": "Q1-2026",
    "review_type": "MANAGER",
    "communication_score": 4.5,
    "technical_score": 5.0,
    "teamwork_score": 4.0,
    "leadership_score": 4.5,
    "feedback": "Excellent performance",
    "status": "COMPLETED"
}
res = client.post("/hrm/performance", json=appraisal_data, headers=headers)
print(f"Create Appraisal: {res.status_code}")
appraisal = res.json()
print(f"Computed Score: {appraisal.get('score')}")

# 3. Create another Appraisal for Top Performers check
appraisal_data_2 = {
    "employee_id": emp_id,
    "review_period": "Q2-2026",
    "review_type": "MANAGER",
    "communication_score": 3.0,
    "technical_score": 3.0,
    "teamwork_score": 3.0,
    "leadership_score": 3.0,
    "feedback": "Average",
    "status": "COMPLETED"
}
res = client.post("/hrm/performance", json=appraisal_data_2, headers=headers)
print(f"Create Appraisal 2: {res.status_code}")

# 4. Get Performance Summary
res = client.get("/hrm/performance/summary", headers=headers)
print(f"Performance Summary: {res.status_code}")
summary = res.json()
print(f"Total Reviews: {summary.get('total_reviews')}")
print(f"Average Score: {summary.get('average_score')}")
print(f"Top Performers: {len(summary.get('top_performers'))}")

if res.status_code == 200 and summary.get('average_score') > 0:
    print("✅ HRM Performance Verification PASSED")
else:
    print(f"❌ HRM Performance Verification FAILED: {res.text}")

db.close()
