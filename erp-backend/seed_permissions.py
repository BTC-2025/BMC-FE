from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.auth.models import Permission

def seed_permissions():
    db = SessionLocal()
    permissions = [
        # Inventory
        ("inventory.view", "View inventory items and warehouses"),
        ("inventory.edit", "Add or modify inventory items"),
        ("inventory.delete", "Remove inventory items"),
        
        # Finance
        ("finance.view", "View ledger and invoices"),
        ("finance.post_invoice", "Create and post new invoices"),
        ("finance.settle", "Settle outstanding payments"),
        
        # CRM
        ("crm.view", "View customers and leads"),
        ("crm.edit", "Modify CRM records"),
        
        # HRM
        ("hrm.view_employee", "View employee profiles"),
        ("hrm.manage_attendance", "Modify attendance logs"),
        ("hrm.approve_leave", "Approve leave requests"),
        
        # Manufacturing
        ("mfg.view", "View work orders and BOMs"),
        ("mfg.manage", "Production management"),
        
        # Projects
        ("project.view", "View project boards"),
        ("project.manage", "Create and assign project tasks"),
        
        # SCM
        ("scm.view", "View supply chain status"),
        ("scm.order", "Create purchase orders"),
        
        # BI
        ("bi.view_dashboard", "Access analytics and reporting"),
        
        # Admin / System
        ("system.admin", "Full access to governance and RBAC"),
        ("audit.view", "Access to system-wide audit logs and compliance ledger"),
    ]
    
    for code, desc in permissions:
        exists = db.query(Permission).filter(Permission.code == code).first()
        if not exists:
            perm = Permission(code=code, description=desc)
            db.add(perm)
            print(f"✓ Seeded permission: {code}")
    
    db.commit()
    db.close()
    print("Permission seeding complete.")

if __name__ == "__main__":
    seed_permissions()
