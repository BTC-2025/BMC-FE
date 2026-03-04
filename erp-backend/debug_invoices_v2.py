from app.core.database import SessionLocal
from app.finance.models import Invoice

def debug_invoices():
    db = SessionLocal()
    try:
        invoices = db.query(Invoice).all()
        print(f"--- INVOICE DEBUG ---")
        print(f"Total Invoices: {len(invoices)}")
        for i in invoices:
            print(f"ID={i.id} | Status={i.status} | Tenant={i.tenant_id} | Total={i.total_amount}")
        print(f"--- END DEBUG ---")
    finally:
        db.close()

if __name__ == "__main__":
    debug_invoices()
