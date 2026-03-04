from app.core.database import SessionLocal
from app.finance.models import Invoice

def debug_invoices():
    db = SessionLocal()
    try:
        invoices = db.query(Invoice).all()
        print(f"DEBUG: Found {len(invoices)} invoices in DB")
        for i in invoices:
            print(f"ID: {i.id}, Status: {i.status}, Total: {i.total_amount}, Tenant: {i.tenant_id}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_invoices()
