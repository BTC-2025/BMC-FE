from app.core.database import SessionLocal
from app.finance.service import create_invoice, post_invoice, record_payment
from app.finance.models import Invoice, InvoiceStatus, Payment
from decimal import Decimal

def test_service_flow():
    db = SessionLocal()
    tenant_id = 1
    user_id = 1
    
    try:
        print("--- TESTING SERVICE-LEVEL FLOW ---")
        
        # 1. Create Invoice
        lines = [{"description": "Service Test", "quantity": 1, "unit_price": 1000.0}]
        invoice = create_invoice(
            db,
            customer_name="Service Test Customer",
            tenant_id=tenant_id,
            created_by=user_id,
            lines=lines,
            reference="SERV-TEST-001"
        )
        print(f"SUCCESS: Created Invoice #{invoice.id} (Status: {invoice.status})")
        
        # 2. Post Invoice
        invoice = post_invoice(db, invoice.id, user_id, tenant_id=tenant_id)
        print(f"SUCCESS: Posted Invoice #{invoice.id} (Status: {invoice.status})")
        
        # 3. Record Payment
        payment = record_payment(
            db=db,
            tenant_id=tenant_id,
            invoice_id=invoice.id,
            amount=1000.0,
            payment_date="2026-02-18",
            payment_method="Bank Transfer",
            reference="SERV-PAY-001",
            user_id=user_id
        )
        print(f"SUCCESS: Recorded Payment #{payment.id} for Invoice #{invoice.id}")
        
        # 4. Final Verify
        db.refresh(invoice)
        print(f"VERIFY: Invoice #{invoice.id} Final Status: {invoice.status} (Expected PAID)")
        
        if invoice.status == InvoiceStatus.PAID:
            print("--- ALL SERVICE-LEVEL TESTS PASSED ---")
        else:
            print("--- TESTS FAILED: Status mismatch ---")

    except Exception as e:
        print(f"ERROR during test: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_service_flow()
