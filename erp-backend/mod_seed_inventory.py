from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.database import Base
from app.auth.models import Permission, Role, User
from app.inventory.models import Category, Warehouse, ItemGroup, PriceList
from app.core.tenant.models import Tenant

# Setup DB connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_inventory():
    print("🌱 Starting Inventory Seeding...")

    # 1. Ensure Tenant Exists
    tenant = db.query(Tenant).first()
    if not tenant:
        print("Creating default tenant...")
        tenant = Tenant(name="Default Tenant")
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
    
    tenant_id = tenant.id
    print(f"Using Tenant ID: {tenant_id}")

    # 2. Permissions
    permissions = [
        "inventory.view", "inventory.manage", "inventory.create", 
        "inventory.adjust", "inventory.transfer", "inventory.audit"
    ]
    
    print("Seeding permissions...")
    for code in permissions:
        if not db.query(Permission).filter_by(code=code).first():
            db.add(Permission(code=code, description=f"Access to {code}"))
    db.commit()

    # 3. Roles & Assignments
    admin_role = db.query(Role).filter_by(name="Admin").first()
    if not admin_role:
        admin_role = Role(name="Admin", description="Full Access")
        db.add(admin_role)
        db.commit()
    
    # Assign all permissions to Admin
    all_perms = db.query(Permission).all()
    for p in all_perms:
        if p not in admin_role.permissions:
            admin_role.permissions.append(p)
    db.commit()

    # 4. Asset Categories
    categories = [
        "IT Hardware", "Furniture", "Machinery", "Vehicles", "Electronics", "Office Supplies"
    ]
    
    print("Seeding categories...")
    for name in categories:
        if not db.query(Category).filter_by(name=name, tenant_id=tenant_id).first():
            db.add(Category(name=name, tenant_id=tenant_id))
    db.commit()

    # 5. Warehouses
    warehouses = ["Main Warehouse", "Staging Area", "Returns"]
    
    print("Seeding warehouses...")
    for name in warehouses:
        if not db.query(Warehouse).filter_by(name=name, tenant_id=tenant_id).first():
            db.add(Warehouse(name=name, tenant_id=tenant_id))
    db.commit()

    # 6. Ensure Users have Admin Role (Fixing permissions issue)
    users = db.query(User).filter_by(tenant_id=tenant_id).all()
    for user in users:
        if user.is_admin:
            print(f"Ensuring admin role for {user.username}...")
            if admin_role not in user.roles:
                user.roles.append(admin_role)
    db.commit()

    # 7. Item Groups
    item_groups = [
        {"name": "Electronics", "description": "All electronic gadgets and accessories"},
        {"name": "Furniture", "description": "Office and home furniture"},
        {"name": "Office Supplies", "description": "Stationery and general office items"},
        {"name": "Raw Materials", "description": "Unprocessed materials for manufacturing"},
    ]
    
    print("Seeding item groups...")
    for group_data in item_groups:
        if not db.query(ItemGroup).filter_by(name=group_data["name"], tenant_id=tenant_id).first():
            db.add(ItemGroup(**group_data, tenant_id=tenant_id))
    db.commit()

    # 8. Price Lists
    price_lists = [
        {"name": "Standard Selling Price", "type": "SALES", "currency": "USD"},
        {"name": "Wholesale Rate", "type": "SALES", "currency": "USD"},
        {"name": "Internal Transfer Price", "type": "INTERNAL", "currency": "USD"},
        {"name": "Standard Buying Price", "type": "PURCHASE", "currency": "USD"},
    ]
    
    print("Seeding price lists...")
    for pl_data in price_lists:
        if not db.query(PriceList).filter_by(name=pl_data["name"], tenant_id=tenant_id).first():
            db.add(PriceList(**pl_data, tenant_id=tenant_id))
    db.commit()

    print("✅ Seeding Complete!")

if __name__ == "__main__":
    try:
        seed_inventory()
    except Exception as e:
        print(f"❌ Error seeding DB: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
