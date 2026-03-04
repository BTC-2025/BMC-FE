from app.core.database import SessionLocal
from app.finance.models import Payment, Invoice

def check_payments():
    db = SessionLocal()
    try:
        payments = db.query(Payment).all()
        print(f"Total Payments: {len(payments)}")
        for p in payments:
            print(f"ID: {p.id}, Invoice ID: {p.invoice_id}, Amount: {p.amount}, Date: {p.payment_date}")
            
        invoices = db.query(Invoice).all()
        print(f"\nTotal Invoices: {len(invoices)}")
        for i in invoices:
            print(f"ID: {i.id}, Customer: {i.customer_name}, Status: {i.status}, Paid: {i.amount_paid} / {i.total_amount_base}")
    finally:
        db.close()

if __name__ == "__main__":
    check_payments()
