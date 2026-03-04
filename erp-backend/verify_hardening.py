from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.core.audit.models import AuditLog
from app.auth.models import User, Role, Permission
from app.core.security import create_access_token
from datetime import timedelta
import time

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    return create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))

token = get_token("admin")
headers = {"Authorization": f"Bearer {token}"}

print("--- Testing System Hardening (Step 25) ---")

# 1. Audit Check (Stock adjustment should trigger audit)
print("\nTesting Audit Logging...")
adj_data = {"item_id": 1, "warehouse_id": 1, "quantity": 10, "reference": "AUDIT_TEST"}
# Ensure item 1 exists
from app.inventory.models import Item, Warehouse
if not db.query(Item).get(1):
    db.add(Item(name="Test", sku="T-001", unit="pcs"))
    db.commit()
if not db.query(Warehouse).get(1):
    db.add(Warehouse(name="W1"))
    db.commit()

res = client.post("/inventory/adjust", json=adj_data, headers=headers)
print(f"Stock Adjust Status: {res.status_code}")

audit = db.query(AuditLog).filter(AuditLog.module == "INVENTORY").order_by(AuditLog.id.desc()).first()
if audit and "STOCK_IN" in audit.action:
    print(f"✅ Audit Log found: Module={audit.module}, Action={audit.action}")
else:
    print("❌ Audit Log NOT found or incorrect")

# 2. Rate Limit Check (Hit login rapidly)
print("\nTesting Rate Limiting (Login)...")
# Note: slowapi uses remote_address. In TestClient this might be 'testclient'.
for i in range(10):
    res = client.post("/auth/login", data={"username": "admin", "password": "wrong_password"})
    if res.status_code == 429:
        print(f"✅ Rate Limit Triggered at attempt {i+1}")
        break
else:
    print("⚠️ Rate Limit NOT triggered (might be TestClient limitation or limit too high)")

# 3. Pagination Check
print("\nTesting Pagination (Inventory)...")
res = client.get("/inventory/items?limit=1", headers=headers)
if res.status_code == 200 and len(res.json()) <= 1:
    print(f"✅ Pagination works: limit=1, returned={len(res.json())}")
else:
    print(f"❌ Pagination failed: status={res.status_code}, count={len(res.json())}")

db.close()
