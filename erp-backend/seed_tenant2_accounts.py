"""Seed Chart of Accounts for all tenants"""
import sys
sys.path.insert(0, '.')
from sqlalchemy import text
from app.core.database import SessionLocal

db = SessionLocal()

try:
    # Get all tenants
    tenants = db.execute(text("SELECT id FROM tenants")).fetchall()
    print(f"Tenants: {[t[0] for t in tenants]}")
    
    accounts = [
        ("1000", "Cash", "ASSET"),
        ("1200", "Accounts Receivable", "ASSET"),
        ("2100", "Accounts Payable", "LIABILITY"),
        ("4000", "Sales Income", "INCOME"),
        ("5000", "Operating Expense", "EXPENSE"),
        ("5100", "Office Expense", "EXPENSE"),
    ]
    
    for tid in [t[0] for t in tenants]:
        print(f"\nTenant {tid}:")
        for code, name, acc_type in accounts:
            existing = db.execute(
                text("SELECT id FROM finance_accounts WHERE code=:c AND tenant_id=:t"),
                {"c": code, "t": tid}
            ).first()
            if not existing:
                db.execute(
                    text("INSERT INTO finance_accounts (tenant_id, name, code, type) VALUES (:t, :n, :c, :tp)"),
                    {"t": tid, "n": name, "c": code, "tp": acc_type}
                )
                print(f"  Created [{code}] {name}")
            else:
                print(f"  Exists  [{code}] {name}")
    
    db.commit()
    
    # Verify
    all_accs = db.execute(text("SELECT id, tenant_id, code, name FROM finance_accounts ORDER BY tenant_id, code")).fetchall()
    print(f"\nAll accounts ({len(all_accs)}):")
    for a in all_accs:
        print(f"  id={a[0]} tenant={a[1]} [{a[2]}] {a[3]}")
    
    print("\nDone!")
except Exception as e:
    db.rollback()
    print(f"ERROR: {e}")
finally:
    db.close()
