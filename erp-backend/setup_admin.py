from app.core.database import SessionLocal, Base, engine
from app.auth.models import User
from app.core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if admin exists
admin = db.query(User).filter(User.username == "admin").first()

if not admin:
    admin = User(
        username="admin",
        email="admin@btc-enterprise.com",
        hashed_password=get_password_hash("admin123"),
        is_admin=True
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created")
else:
    print("⚠️ Admin user already exists")

# --- CRM PERMISSIONS & ROLES SETUP ---
from app.auth.models import Permission, Role

# 1. Define Permissions
crm_permissions = [
    {"code": "crm.view", "description": "View CRM Leads and Deals"},
    {"code": "crm.create_lead", "description": "Create new Leads"},
    {"code": "crm.update_status", "description": "Update Lead Status"},
    {"code": "crm.convert", "description": "Convert Lead to Deal"},
    {"code": "crm.manage_deals", "description": "Manage Deal Stages"},
    {"code": "crm.log_activity", "description": "Log Activities"},
    {"code": "crm.view_stats", "description": "View CRM Analytics and Stats"},
]

created_perms = {}
for p_data in crm_permissions:
    perm = db.query(Permission).filter(Permission.code == p_data["code"]).first()
    if not perm:
        perm = Permission(code=p_data["code"], description=p_data["description"])
        db.add(perm)
        db.commit()
        db.refresh(perm)
        print(f"✅ Permission created: {perm.code}")
    created_perms[perm.code] = perm

# 2. Define Roles & Assign Permissions
roles_setup = {
    "Sales Exec": ["crm.view", "crm.create_lead", "crm.update_status", "crm.log_activity", "crm.view_stats"],
    "Sales Manager": ["crm.view", "crm.create_lead", "crm.update_status", "crm.convert", "crm.manage_deals", "crm.log_activity", "crm.view_stats"],
}

for role_name, perm_codes in roles_setup.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name, description=f"{role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)
        print(f"✅ Role created: {role.name}")
    
    # Associate Permissions
    current_perms = {p.code for p in role.permissions}
    for code in perm_codes:
        if code not in current_perms and code in created_perms:
            role.permissions.append(created_perms[code])
            print(f"   ➕ Added {code} to {role_name}")
    
    db.commit()

# --- SCM PERMISSIONS & ROLES SETUP ---
# 1. Define Permissions
scm_permissions = [
    {"code": "scm.view", "description": "View Suppliers and POs"},
    {"code": "scm.create_po", "description": "Create Purchase Orders"},
    {"code": "scm.approve_po", "description": "Approve Purchase Orders"},
    {"code": "scm.receive_goods", "description": "Process Goods Receipt (GRN)"},
]

for p_data in scm_permissions:
    perm = db.query(Permission).filter(Permission.code == p_data["code"]).first()
    if not perm:
        perm = Permission(code=p_data["code"], description=p_data["description"])
        db.add(perm)
        db.commit()
        db.refresh(perm)
        print(f"✅ Permission created: {perm.code}")
    created_perms[perm.code] = perm

# 2. Define Roles & Assign Permissions
scm_roles_setup = {
    "Lite User": ["scm.view", "scm.create_po", "scm.receive_goods"],
    "Enterprise Manager": ["scm.view", "scm.create_po", "scm.approve_po", "scm.receive_goods"],
}

for role_name, perm_codes in scm_roles_setup.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name, description=f"{role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)
        print(f"✅ Role created: {role.name}")
    
    # Associate Permissions
    current_perms = {p.code for p in role.permissions}
    for code in perm_codes:
        if code not in current_perms and code in created_perms:
            role.permissions.append(created_perms[code])
            print(f"   ➕ Added {code} to {role_name}")
    
    db.commit()

# --- HRM PERMISSIONS & ROLES SETUP ---
hrm_permissions = [
    {"code": "hrm.view", "description": "View employee profiles and attendance"},
    {"code": "hrm.manage", "description": "Onboard and manage employee data"},
    {"code": "hrm.manage_payroll", "description": "Process and manage payroll records"},
]

for p_data in hrm_permissions:
    perm = db.query(Permission).filter(Permission.code == p_data["code"]).first()
    if not perm:
        perm = Permission(code=p_data["code"], description=p_data["description"])
        db.add(perm)
        db.commit()
        db.refresh(perm)
        print(f"✅ Permission created: {perm.code}")
    created_perms[perm.code] = perm

hrm_roles_setup = {
    "HR Associate": ["hrm.view"],
    "HR Manager": ["hrm.view", "hrm.manage", "hrm.manage_payroll"],
}

for role_name, perm_codes in hrm_roles_setup.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name, description=f"{role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)
        print(f"✅ Role created: {role.name}")
    
    current_perms = {p.code for p in role.permissions}
    for code in perm_codes:
        if code not in current_perms and code in created_perms:
            role.permissions.append(created_perms[code])
            print(f"   ➕ Added {code} to {role_name}")
    
    db.commit()

# --- MANUFACTURING PERMISSIONS & ROLES SETUP ---
mfg_permissions = [
    {"code": "mfg.view", "description": "View BOMs and Work Orders"},
    {"code": "mfg.manage_bom", "description": "Create and manage Bill of Materials"},
    {"code": "mfg.produce", "description": "Trigger production and stock movement"},
]

for p_data in mfg_permissions:
    perm = db.query(Permission).filter(Permission.code == p_data["code"]).first()
    if not perm:
        perm = Permission(code=p_data["code"], description=p_data["description"])
        db.add(perm)
        db.commit()
        db.refresh(perm)
    created_perms[perm.code] = perm

mfg_roles_setup = {
    "Production Associate": ["mfg.view", "mfg.produce"],
    "Production Manager": ["mfg.view", "mfg.manage_bom", "mfg.produce"],
}

for role_name, perm_codes in mfg_roles_setup.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name, description=f"{role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)
    
    current_perms = {p.code for p in role.permissions}
    for code in perm_codes:
        if code not in current_perms and code in created_perms:
            role.permissions.append(created_perms[code])
    db.commit()

# --- PROJECT MANAGEMENT PERMISSIONS & ROLES SETUP ---
prj_permissions = [
    {"code": "projects.view", "description": "View projects and tasks"},
    {"code": "projects.manage", "description": "Manage tasks and milestones"},
    {"code": "projects.admin", "description": "Full project administration and budget"},
]

for p_data in prj_permissions:
    perm = db.query(Permission).filter(Permission.code == p_data["code"]).first()
    if not perm:
        perm = Permission(code=p_data["code"], description=p_data["description"])
        db.add(perm)
        db.commit()
        db.refresh(perm)
        print(f"✅ Permission created: {perm.code}")
    created_perms[perm.code] = perm

prj_roles_setup = {
    "Project Member": ["projects.view"],
    "Project Manager": ["projects.view", "projects.manage", "projects.admin"],
}

for role_name, perm_codes in prj_roles_setup.items():
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name, description=f"{role_name} Role")
        db.add(role)
        db.commit()
        db.refresh(role)
        print(f"✅ Role created: {role.name}")
    
    current_perms = {p.code for p in role.permissions}
    for code in perm_codes:
        if code not in current_perms and code in created_perms:
            role.permissions.append(created_perms[code])
            print(f"   ➕ Added {code} to {role_name}")
    
    db.commit()

# --- BI PERMISSIONS & ROLES SETUP ---
bi_permission = {"code": "bi.view_stats", "description": "View BI Dashboards and Analytics"}

perm = db.query(Permission).filter(Permission.code == bi_permission["code"]).first()
if not perm:
    perm = Permission(code=bi_permission["code"], description=bi_permission["description"])
    db.add(perm)
    db.commit()
    db.refresh(perm)
    print(f"✅ Permission created: {perm.code}")
created_perms[perm.code] = perm

role = db.query(Role).filter(Role.name == "BI Analyst").first()
if not role:
    role = Role(name="BI Analyst", description="BI Analyst Role")
    db.add(role)
    db.commit()
    db.refresh(role)
    print(f"✅ Role created: {role.name}")

if bi_permission["code"] not in {p.code for p in role.permissions}:
    role.permissions.append(created_perms[bi_permission["code"]])
    print(f"   ➕ Added {bi_permission['code']} to BI Analyst")
db.commit()

db.close()
