from app.core.database import SessionLocal
from app.finance.models import Account, Invoice, InvoiceStatus

def verify():
    db = SessionLocal()
    try:
        print("=== Checking Accounts ===")
        required_codes = ["1000", "1200", "4000", "2100", "5000"]
        accounts = db.query(Account).filter(Account.code.in_(required_codes)).all()
        found_codes = [a.code for a in accounts]
        for code in required_codes:
            if code in found_codes:
                print(f"[OK] Account {code} exists")
            else:
                print(f"[MISSING] Account {code}")

        print("\n=== Checking Invoices ===")
        invoices = db.query(Invoice).all()
        if not invoices:
            print("No invoices found.")
        for inv in invoices:
            print(f"ID: {inv.id}, Customer: {inv.customer_name}, Status: {inv.status}, Amount: {inv.total_amount}")

    finally:
        db.close()

if __name__ == "__main__":
    verify()
