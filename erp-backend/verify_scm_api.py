from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role
from app.core.security import create_access_token
from datetime import timedelta

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        # Create a test user if not exists
        from app.core.security import get_password_hash
        user = User(username=username, email=f"{username}@example.com", hashed_password=get_password_hash("password"))
        db.add(user)
        db.commit()
    
    # Ensure user has Enterprise Manager role for full testing
    role = db.query(Role).filter(Role.name == "Enterprise Manager").first()
    if role and role not in user.roles:
        user.roles.append(role)
        db.commit()
        
    return create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))

token = get_token("admin") # Using admin setup from previous steps
headers = {"Authorization": f"Bearer {token}"}

print("--- Testing SCM APIs ---")

# 1. Create Supplier
supplier_data = {"name": "Test Supplier", "email": "test@supplier.com", "phone": "1234567890"}
res = client.post("/scm/suppliers", json=supplier_data, headers=headers)
print(f"Create Supplier: {res.status_code}")
print(f"Response Body: {res.json()}")
supplier_id = res.json()["id"]

# 2. List Suppliers
res = client.get("/scm/suppliers", headers=headers)
print(f"List Suppliers: {res.status_code}, Count: {len(res.json())}")

# 3. Create PO
# Ensure we have an item to link to
from app.inventory.models import Item
item = db.query(Item).first()
if not item:
    print("❌ No item found in inventory, skipping PO creation test")
else:
    po_data = {
        "supplier_id": supplier_id,
        "items": [{"item_id": item.id, "quantity": 50}]
    }
    res = client.post("/scm/purchase-orders", json=po_data, headers=headers)
    print(f"Create PO: {res.status_code}")
    po_id = res.json()["id"]

    # 4. Approve PO
    res = client.post(f"/scm/purchase-orders/{po_id}/approve", headers=headers)
    print(f"Approve PO: {res.status_code}, Msg: {res.json().get('message')}")

    # 5. Receive Goods
    # Ensure we have a warehouse
    from app.inventory.models import Warehouse
    wh = db.query(Warehouse).first()
    receive_data = {
        "purchase_order_id": po_id,
        "warehouse_id": wh.id
    }
    res = client.post("/scm/receive", json=receive_data, headers=headers)
    print(f"Receive Goods (Atomic): {res.status_code}")

    # 6. Verify PO Status
    res = client.get("/scm/purchase-orders", headers=headers)
    pos = res.json()
    my_po = next((p for p in pos if p["id"] == po_id), None)
    if my_po and my_po["status"] == "CLOSED":
        print("✅ API Verification PASSED: PO is CLOSED")
    else:
        print(f"❌ API Verification FAILED: PO status is {my_po['status'] if my_po else 'Not Found'}")

db.close()
