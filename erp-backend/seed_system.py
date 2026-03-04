from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.tenant.models import Tenant, TenantStatus
from app.auth.models import User, Role, Permission
from app.core.security import get_password_hash
from datetime import datetime, timedelta
from app.finance.models import Account, Currency
from app.inventory.models import Warehouse, Item, StockMovement
from app.notifications.seed import seed_email_templates

# Import all models to register them with Base.metadata
from app.core.tenant import models as _tenant_models
from app.auth import models as _auth_models
from app.inventory import models as _inventory_models
from app.finance import models as _finance_models
from app.crm import models as _crm_models
from app.scm import models as _scm_models
from app.hrm import models as _hrm_models
from app.projects import models as _prj_models
from app.mfg import models as _mfg_models
from app.core.audit import models as _audit_models
from app.notifications import models as _notification_models
from app.documents import models as _document_models
from app.reports import models as _report_models

def seed_everything():
    print("Seeding system data...")
    db = SessionLocal()
    
    # 0. Ensure tables exist (Reset for clean testing)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # 1. Create Tenant
    tenant = db.query(Tenant).filter(Tenant.name == "Default Tenant").first()
    if not tenant:
        tenant = Tenant(name="Default Tenant", domain="default.com", status=TenantStatus.ACTIVE)
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        print(f"✓ Created Tenant: {tenant.name} (ID: {tenant.id})")
    else:
        print("- Tenant already exists")

    # 2. Create Admin Role & Permissions
    admin_perm = db.query(Permission).filter(Permission.code == "admin").first()
    if not admin_perm:
        admin_perm = Permission(code="admin", description="Full Admin Access")
        db.add(admin_perm)
        db.commit()
        db.refresh(admin_perm)

    admin_role = db.query(Role).filter(Role.name == "System Admin").first()
    if not admin_role:
        admin_role = Role(name="System Admin", description="Full Access Role")
        admin_role.permissions.append(admin_perm)
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)

    # 3. Create Admin User
    user = db.query(User).filter(User.username == "admin").first()
    if not user:
        user = User(
            username="admin",
            email="admin@default.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            is_active=True,
            tenant_id=tenant.id
        )
        user.roles.append(admin_role)
        db.add(user)
        db.commit()
        print("✓ Created Admin User (admin/admin123)")
    else:
        print("- Admin user already exists")

    # 3.1 Create Demo Users
    demo_users = [
        {"username": "hr", "email": "hr@default.com", "full_name": "HR Manager"},
        {"username": "sales", "email": "sales@default.com", "full_name": "Sales Rep"},
        {"username": "finance", "email": "finance@default.com", "full_name": "Finance Head"},
        {"username": "ops", "email": "ops@default.com", "full_name": "Operations Lead"},
    ]
    for u_data in demo_users:
        exists = db.query(User).filter(User.username == u_data["username"]).first()
        if not exists:
            new_u = User(
                username=u_data["username"],
                email=u_data["email"],
                full_name=u_data["full_name"],
                hashed_password=get_password_hash("password"),
                is_admin=False,
                is_active=True,
                tenant_id=tenant.id
            )
            db.add(new_u)
            print(f"✓ Created Demo User: {u_data['username']}")
    db.commit()

    # 4. Create Master Data (Finance Accounts)
    accounts = [
        {"code": "1000", "name": "Cash", "type": "ASSET"},
        {"code": "1200", "name": "Accounts Receivable", "type": "ASSET"},
        {"code": "2100", "name": "Accounts Payable", "type": "LIABILITY"},
        {"code": "4000", "name": "Sales Income", "type": "INCOME"},
        {"code": "5000", "name": "Operating Expense", "type": "EXPENSE"},
    ]
    for acc_data in accounts:
        exists = db.query(Account).filter(Account.code == acc_data["code"], Account.tenant_id == tenant.id).first()
        if not exists:
            acc = Account(**acc_data, tenant_id=tenant.id)
            db.add(acc)
            print(f"✓ Created Account: {acc.name}")
    
    # 5. Create Base Currency
    base_curr = db.query(Currency).filter(Currency.is_base == True, Currency.tenant_id == tenant.id).first()
    if not base_curr:
        curr = Currency(code="INR", name="Indian Rupee", symbol="₹", is_base=True, tenant_id=tenant.id)
        db.add(curr)
        print("✓ Created Base Currency: INR")

    # 6. Create Default Warehouse
    wh = db.query(Warehouse).filter(Warehouse.tenant_id == tenant.id).first()
    if not wh:
        wh = Warehouse(name="Main Warehouse", tenant_id=tenant.id)
        db.add(wh)
        print("✓ Created Main Warehouse")

    db.commit()
    
    # 7. Create Default Report Template
    from app.reports.models import ReportTemplate
    report = db.query(ReportTemplate).filter(ReportTemplate.name == "Financial Summary").first()
    if not report:
        report = ReportTemplate(
            tenant_id=tenant.id,
            name="Financial Summary",
            module="finance",
            query_template="SELECT description, reference, created_at FROM finance_journal_entries WHERE tenant_id = :tenant_id",
            columns=[
                {"field": "description", "label": "Description"},
                {"field": "reference", "label": "Reference"},
                {"field": "created_at", "label": "Date"}
            ],
            created_by=user.id
        )
        db.add(report)
        print("✓ Created Financial Summary Report Template")

    db.commit()
    
    # 8. Create Billing Plan & Subscription
    from app.billing.models import Plan, Subscription, SubscriptionStatus
    enterprise_plan = db.query(Plan).filter(Plan.name == "ENTERPRISE").first()
    if not enterprise_plan:
        enterprise_plan = Plan(
            name="ENTERPRISE",
            price=9900, # $99.00
            max_users=100,
            modules="inventory,finance,crm,scm,hrm,projects,bi,notifications,documents,reports"
        )
        db.add(enterprise_plan)
        db.commit()
        db.refresh(enterprise_plan)
        print("✓ Created Enterprise Plan")

    sub = db.query(Subscription).filter(Subscription.tenant_id == tenant.id).first()
    if not sub:
        sub = Subscription(
            tenant_id=tenant.id,
            plan_id=enterprise_plan.id,
            status=SubscriptionStatus.ACTIVE.value,
            expires_at=datetime.utcnow() + timedelta(days=365)
        )
        db.add(sub)
        print("✓ Created Subscription for Tenant")

    db.commit()
    
    # 9. Seed Email Templates
    seed_email_templates()
    
    db.close()
    print("\n✅ Seeding Complete!")

if __name__ == "__main__":
    seed_everything()
