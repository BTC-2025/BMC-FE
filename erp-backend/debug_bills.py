from app.core.database import SessionLocal
from app.finance.models import Bill

db = SessionLocal()
try:
    bills = db.query(Bill).all()
    print(f"Total Bills in DB: {len(bills)}")
    for b in bills:
        print(f"ID: {b.id}, Vendor: {b.vendor_name}, Total: {b.total_amount}, Tenant: {b.tenant_id}")
finally:
    db.close()
