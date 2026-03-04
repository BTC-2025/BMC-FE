from app.core.database import SessionLocal
from app.auth.models import Permission, Role

db = SessionLocal()

print("--- Verifying CRM Permissions ---")
permissions = [
    "crm.view", "crm.create_lead", "crm.update_status", 
    "crm.convert", "crm.manage_deals", "crm.log_activity"
]

all_exist = True
for code in permissions:
    perm = db.query(Permission).filter(Permission.code == code).first()
    if perm:
        print(f"✅ Found permission: {code}")
    else:
        print(f"❌ Missing permission: {code}")
        all_exist = False

print("\n--- Verifying Roles ---")
roles = {
    "Sales Exec": ["crm.view", "crm.create_lead", "crm.update_status", "crm.log_activity"],
    "Sales Manager": ["crm.view", "crm.create_lead", "crm.update_status", "crm.convert", "crm.manage_deals", "crm.log_activity"]
}

for role_name, expected_perms in roles.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        print(f"❌ Missing role: {role_name}")
        all_exist = False
        continue
    
    print(f"Role: {role_name}")
    role_perms = {p.code for p in role.permissions}
    for p in expected_perms:
        if p in role_perms:
            print(f"   ✅ Has {p}")
        else:
            print(f"   ❌ Missing {p}")
            all_exist = False

db.close()

if all_exist:
    print("\n🎉 CRM Permissions Verification PASSED")
else:
    print("\n⚠️ CRM Permissions Verification FAILED")
