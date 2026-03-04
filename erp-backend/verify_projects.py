from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role, Permission
from app.core.security import create_access_token
from datetime import timedelta

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    # Ensure user has Project Manager role
    role = db.query(Role).filter(Role.name == "Project Manager").first()
    if not role:
        role = Role(name="Project Manager", description="Project Manager Role")
        db.add(role)
        db.commit()
    
    p_codes = ["projects.view", "projects.manage", "projects.admin"]
    for code in p_codes:
        perm = db.query(Permission).filter(Permission.code == code).first()
        if not perm or perm not in role.permissions:
            # Assume perm created by setup_admin, just ensure link
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

print("--- Testing Project Management APIs ---")

# 1. Create Project
proj_data = {
    "name": "ERP Phase 2 Deployment",
    "description": "Deploying HRM and SCM modules",
    "start_date": "2026-02-01",
    "end_date": "2026-03-31",
    "total_budget": 50000.0
}
res = client.post("/projects/", json=proj_data, headers=headers)
print(f"Create Project: {res.status_code}")
proj_id = res.json()["id"]

# 2. Add Tasks
task1_data = {"title": "Configure HRM", "progress": 100} # Completed task
task2_data = {"title": "Verify SCM", "progress": 0}       # Pending task

client.post(f"/projects/{proj_id}/tasks", json=task1_data, headers=headers)
res = client.post(f"/projects/{proj_id}/tasks", json=task2_data, headers=headers)
print(f"Add Tasks: {res.status_code}")

# update task1 progress (it was 0 initially if passed via create? No, schema doesn't have progress in create)
# Wait, my add_task route uses TaskCreate which doesn't have progress.
# So I should update progress separately.

res = client.patch("/projects/tasks/1", json={"progress": 100}, headers=headers)
print(f"Update Task Progress: {res.status_code}")

# 3. Check Summary
res = client.get(f"/projects/{proj_id}/summary", headers=headers)
summary = res.json()
print(f"Project Summary: {summary}")

if summary.get("overall_progress") == 50.0:
    print("✅ Project Management Verification PASSED")
else:
    print(f"❌ Project Management Verification FAILED: {summary.get('overall_progress')}")

db.close()
