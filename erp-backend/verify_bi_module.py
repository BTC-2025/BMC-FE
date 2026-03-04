from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role, Permission
from app.crm.models import Lead, Deal
from app.inventory.models import Item, Warehouse
from app.inventory.service import create_stock_movement
from app.auth.models import User
from app.core.security import create_access_token
from datetime import timedelta

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    # Ensure user has BI Analyst role
    role = db.query(Role).filter(Role.name == "BI Analyst").first()
    if not role:
        # Should be created by setup_admin but ensure for test
        role = Role(name="BI Analyst", description="BI Analyst Role")
        db.add(role)
        db.commit()
    
    perm = db.query(Permission).filter(Permission.code == "bi.view_stats").first()
    if not perm:
        perm = Permission(code="bi.view_stats", description="BI stats")
        db.add(perm)
        db.commit()
    
    if perm not in role.permissions:
        role.permissions.append(perm)
        db.commit()
    
    if role not in user.roles:
        user.roles.append(role)
        db.commit()
        
    return create_access_token(data={"sub": user.username}, expires_delta=timedelta(hours=1))

token = get_token("admin")
headers = {"Authorization": f"Bearer {token}"}
admin_user = db.query(User).filter(User.username == "admin").first()

print("--- Testing BI Module Aggregation ---")

# 1. Seed CRM Data (Revenue)
deal = Deal(title="Big Sale", value=5000.0, stage="WON")
db.add(deal)
db.commit()

# 2. Seed Inventory Data (Low Stock)
wh = db.query(Warehouse).first() or Warehouse(name="BI Warehouse")
if not wh.id: db.add(wh); db.commit()
item = Item(name="Alert Item", sku="ALERT-001", unit="pcs", reorder_level=10)
db.add(item)
db.commit()
# Stock = 5 ( < 10)
create_stock_movement(db, item_id=item.id, warehouse_id=wh.id, quantity=5, movement_type="IN", performed_by=admin_user.id, reference="INIT")
db.commit()

# 3. Call BI Dashboard
res = client.get("/bi/dashboard", headers=headers)
data = res.json()
print(f"BI Dashboard Status: {res.status_code}")
print(f"Data: {data}")

# Verify 5000 revenue and at least 1 low stock item
if data.get("total_revenue") >= 5000.0 and data.get("low_stock_items") >= 1:
    print("✅ BI Aggregation Verification PASSED")
else:
    print(f"❌ BI Aggregation Verification FAILED: {data}")

# 4. Call Revenue Trend
res = client.get("/bi/revenue-trend", headers=headers)
print(f"Revenue Trend: {res.status_code}, Points: {len(res.json())}")

db.close()
