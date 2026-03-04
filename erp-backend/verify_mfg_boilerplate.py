from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.auth.models import User, Role, Permission
from app.inventory.models import Item, Warehouse
from app.inventory.service import create_stock_movement, get_current_stock
from app.core.security import create_access_token
from datetime import timedelta

client = TestClient(app)
db = SessionLocal()

def get_token(username):
    user = db.query(User).filter(User.username == username).first()
    # Ensure user has mfg permissions
    role = db.query(Role).filter(Role.name == "Production Manager").first()
    if not role:
        role = Role(name="Production Manager", description="Production Manager Role")
        db.add(role)
        db.commit()
    
    p_codes = ["mfg.view", "mfg.manage_bom", "mfg.produce"]
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
admin_user = db.query(User).filter(User.username == "admin").first()

print("--- Testing Manufacturing Boilerplate (Bicycle Example) ---")

# 0. Setup Inventory
wh = db.query(Warehouse).first()
if not wh:
    wh = Warehouse(name="Factory Floor")
    db.add(wh)
    db.commit()

# Create Items
wheel = Item(name="Pro-Wheel", sku="WHEEL-Y", unit="pcs")
frame = Item(name="Carbon-Frame", sku="FRAME-Y", unit="pcs")
bike = Item(name="Elite-Bike", sku="BIKE-PRO-Y", unit="pcs")
db.add_all([wheel, frame, bike])
db.commit()

# Add Initial Stock
create_stock_movement(db, item_id=wheel.id, warehouse_id=wh.id, quantity=10, movement_type="IN", performed_by=admin_user.id, reference="INIT")
create_stock_movement(db, item_id=frame.id, warehouse_id=wh.id, quantity=5, movement_type="IN", performed_by=admin_user.id, reference="INIT")
db.commit()

# 1. Create BOM
bom_data = {
    "name": "Bicycle BOM",
    "finished_item_id": bike.id,
    "items": [
        {"raw_item_id": wheel.id, "quantity_required": 2.0},
        {"raw_item_id": frame.id, "quantity_required": 1.0}
    ]
}
res = client.post("/mfg/boms", json=bom_data, headers=headers)
print(f"Create BOM: {res.status_code}")
bom_id = res.json()["id"]

# 2. Create Work Order (Produce 1 Bike)
wo_data = {
    "bom_id": bom_id,
    "quantity_to_produce": 1
}
res = client.post("/mfg/work-orders", json=wo_data, headers=headers)
print(f"Create Work Order: {res.status_code}")
wo_id = res.json()["id"]

# 3. Execute Production
res = client.post(f"/mfg/work-orders/{wo_id}/produce?warehouse_id={wh.id}", headers=headers)
print(f"Execute Production: {res.status_code}, Status: {res.json().get('status')}")

# 4. Verify Stock
s_wheel = get_current_stock(db, wheel.id, wh.id)
s_frame = get_current_stock(db, frame.id, wh.id)
s_bike = get_current_stock(db, bike.id, wh.id)
print(f"Stock Check - Wheel: {s_wheel} (Exp: 8), Frame: {s_frame} (Exp: 4), Bike: {s_bike} (Exp: 1)")

if s_bike == 1 and s_wheel == 8 and s_frame == 4:
    print("✅ Manufacturing Module Verification PASSED")
else:
    print(f"❌ Manufacturing Module Verification FAILED")

db.close()
