from app.core.database import SessionLocal, Base, engine
from app.finance.models import Account
from app.finance.service import post_journal_entry
from app.auth.models import User

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def run_finance_test():
    print("🚀 Starting Finance General Ledger Test...")

    try:
        # 1. Setup Accounts (Mock COA)
        # Check if exists
        acc1 = db.query(Account).filter(Account.code == "1001").first()
        if not acc1:
            acc1 = Account(name="Cash", code="1001", type="ASSET")
            db.add(acc1)
        
        acc2 = db.query(Account).filter(Account.code == "4001").first()
        if not acc2:
            acc2 = Account(name="Sales Income", code="4001", type="INCOME")
            db.add(acc2)
            
        db.commit()
        
        # Get Admin User ID
        admin = db.query(User).filter(User.username == "admin").first()
        user_id = admin.id if admin else 1

        # 2. Test Balanced Entry (Success)
        print("🔹 Testing Balanced Entry (Dr Cash 1000, Cr Sales 1000)...")
        entry = post_journal_entry(
            db,
            description="Test Sale",
            reference="INV-001",
            posted_by=user_id,
            items=[
                {"account_id": acc1.id, "debit": 1000, "credit": 0},
                {"account_id": acc2.id, "debit": 0, "credit": 1000},
            ]
        )
        print(f"✅ Success! Entry Posted ID: {entry.id}")

        # 3. Test Unbalanced Entry (Fail)
        print("🔹 Testing Unbalanced Entry (Dr Cash 1000, Cr Sales 900)...")
        try:
            post_journal_entry(
                db,
                description="Bad Entry",
                reference="FAIL",
                posted_by=user_id,
                items=[
                    {"account_id": acc1.id, "debit": 1000, "credit": 0},
                    {"account_id": acc2.id, "debit": 0, "credit": 900},
                ]
            )
            print("❌ FAILED: Should have rejected unbalanced entry")
        except Exception as e:
            print(f"✅ SUCCESS: Caught expected error: {e}")
            db.rollback()

        print("\n✨ Finance Logic Verification Complete ✨")

    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_finance_test()
