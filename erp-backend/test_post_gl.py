"""Test Post to GL with fresh engine (no cached metadata)"""
import sys
sys.path.insert(0, '.')

# Create a completely fresh engine to avoid cached metadata
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///./erp.db", connect_args={"check_same_thread": False})

# Check actual schema in DB
print("=== CURRENT SCHEMAS ===")
tables = engine.execute(text("SELECT name, sql FROM sqlite_master WHERE type='table' AND name LIKE 'finance_%' ORDER BY name")) if hasattr(engine, 'execute') else None

with engine.connect() as conn:
    tables = conn.execute(text("SELECT name, sql FROM sqlite_master WHERE type='table' AND name LIKE 'finance_%' ORDER BY name")).fetchall()
    for t in tables:
        print(f"\n{t[0]}:")
        print(f"  {t[1][:200]}")
    
    # Check for any references to _old tables
    all_sql = conn.execute(text("SELECT name, sql FROM sqlite_master WHERE sql LIKE '%_old%'")).fetchall()
    print(f"\n=== TABLES WITH _old REFERENCES ===")
    for t in all_sql:
        print(f"  {t[0]}: {t[1][:200]}")
    
    # Check accounts
    accs = conn.execute(text("SELECT id, tenant_id, code, name FROM finance_accounts")).fetchall()
    print(f"\n=== ACCOUNTS ({len(accs)}) ===")
    for a in accs:
        print(f"  id={a[0]} tenant={a[1]} [{a[2]}] {a[3]}")
    
    # Try a simple insert + journal entry manually
    print("\n=== MANUAL TEST ===")
    try:
        # Create a journal entry
        conn.execute(text("INSERT INTO finance_journal_entries (tenant_id, description, posted_by) VALUES (2, 'Test Entry', 1)"))
        je_id = conn.execute(text("SELECT last_insert_rowid()")).scalar()
        print(f"  Created JE id={je_id}")
        
        # Get AR account for tenant 2
        ar = conn.execute(text("SELECT id FROM finance_accounts WHERE code='1200' AND tenant_id=2")).first()
        income = conn.execute(text("SELECT id FROM finance_accounts WHERE code='4000' AND tenant_id=2")).first()
        print(f"  AR account id={ar[0]}, Income account id={income[0]}")
        
        # Create journal items
        conn.execute(text("INSERT INTO finance_journal_items (tenant_id, entry_id, account_id, debit, credit) VALUES (2, :je, :ar, 500, 0)"), {"je": je_id, "ar": ar[0]})
        conn.execute(text("INSERT INTO finance_journal_items (tenant_id, entry_id, account_id, debit, credit) VALUES (2, :je, :inc, 0, 500)"), {"je": je_id, "inc": income[0]})
        print("  Created journal items (Dr AR 500, Cr Income 500)")
        
        conn.commit()
        print("  COMMITTED! GL posting works at DB level.")
        
        # Now test via SQLAlchemy ORM
        print("\n=== ORM TEST ===")
        # Clear all SQLAlchemy metadata
        from app.core.database import Base
        Base.metadata.clear()
        
        # Re-import models to rebuild metadata
        import importlib
        import app.finance.models
        importlib.reload(app.finance.models)
        
        Session = sessionmaker(bind=engine)
        db = Session()
        
        from app.finance.service import create_invoice, post_invoice
        
        invoice = create_invoice(
            db,
            customer_name="Test Corp",
            tenant_id=2,
            created_by=1,
            lines=[{"description": "Service", "quantity": 1, "unit_price": 1000}],
            reference="GL-TEST-001"
        )
        print(f"  Created invoice id={invoice.id} status={invoice.status}")
        
        result = post_invoice(db, invoice_id=invoice.id, user_id=1, tenant_id=2)
        print(f"  POSTED! status={result.status} je_id={result.journal_entry_id}")
        print("\n  POST TO GL IS WORKING!")
        
        db.close()
        
    except Exception as e:
        print(f"  ERROR: {e}")
        import traceback
        traceback.print_exc()

