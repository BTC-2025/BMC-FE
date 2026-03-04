from app.core.database import SessionLocal, Base, engine
from app.finance.models import Account, Invoice, JournalEntry, InvoiceStatus
from app.finance.service import create_invoice, post_invoice
from app.auth.models import User

# Ensure tables exist (including new Invoice ones)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def run_invoice_test():
    print("🚀 Starting Finance Phase 2 (Invoice -> GL) Test...")

    try:
        # 1. Setup Accounts (Mock COA for Lite Mode)
        ar = db.query(Account).filter(Account.code == "1200").first()
        if not ar:
            ar = Account(name="Accounts Receivable", code="1200", type="ASSET")
            db.add(ar)
        
        inc = db.query(Account).filter(Account.code == "4000").first()
        if not inc:
            inc = Account(name="Sales Income", code="4000", type="INCOME")
            db.add(inc)
            
        # Ensure Admin exists
        admin = db.query(User).filter(User.username == "admin").first()
        user_id = admin.id if admin else 1
            
        db.commit()
        print("✅ Accounts 1200 & 4000 Ready")

        # 2. Create Draft Invoice
        print("🔹 Creating Draft Invoice...")
        lines = [
            {"description": "Consulting Services", "quantity": 10, "unit_price": 100}, # 1000
            {"description": "Software License", "quantity": 1, "unit_price": 500}      # 500
        ]
        invoice = create_invoice(
            db,
            customer_name="Acme Corp",
            created_by=user_id,
            lines=lines,
            reference="PO-999"
        )
        print(f"✅ Draft Invoice Created: ID {invoice.id}, Total: {invoice.total_amount}")
        assert invoice.total_amount == 1500

        # 3. Post Invoice (Trigger GL)
        print("🔹 Posting Invoice...")
        posted_inv = post_invoice(db, invoice.id, user_id)
        
        print(f"✅ Invoice Posted. Status: {posted_inv.status}")
        assert posted_inv.status == InvoiceStatus.POSTED
        
        # 4. Verify Journal Entry
        # The service description is formatted as: f"Invoice #{invoice.id} - {invoice.customer_name}"
        expected_desc = f"Invoice #{invoice.id} - {invoice.customer_name}"
        je = db.query(JournalEntry).filter(JournalEntry.description == expected_desc).first()
        
        if je:
            print(f"✅ GL Impact Verified: Journal Entry #{je.id} Found")
            # Verify Debits/Credits
            for item in je.items:
                print(f"   - Account {item.account_id}: Dr {item.debit} | Cr {item.credit}")
        else:
            print("❌ FAILED: No Associated Journal Entry Found!")

        print("\n✨ Commercial Document Logic Verification Complete ✨")

    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_invoice_test()
