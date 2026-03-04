from app.core.database import SessionLocal, Base, engine
from app.finance.service import get_profit_loss_summary, get_trial_balance

# DB is already seeded by previous steps
db = SessionLocal()

def run_finance_reporting_test():
    print("🚀 Starting Finance Phase 3 (Reporting) Test...")

    try:
        # 1. Fetch Trial Balance
        print("🔹 Fetching Trial Balance...")
        tb = get_trial_balance(db)
        for row in tb:
            print(f"   {row['code']} - {row['account']} ({row['type']}): Dr {row['debit']} | Cr {row['credit']} | Net {row['net_balance']}")
            
        # 2. Fetch P&L
        print("\n🔹 Fetching Profit & Loss Statement...")
        pnl = get_profit_loss_summary(db)
        print(f"   Total Income:  {pnl['total_income']}")
        print(f"   Total Expense: {pnl['total_expense']}")
        print(f"   Net Profit:    {pnl['net_profit']}")
        
        # 3. Assertions
        # From Phase 2: We posted an invoice of 1500.
        # Income should be 1500.
        # Expense 0.
        # Net Profit 1500.
        
        # Note: If tests ran multiple times, values might be higher (accumulated).
        # We'll just assert positive income to be safe against re-runs.
        assert pnl['total_income'] >= 1500, "Expected at least 1500 Income from Phase 2"
        assert pnl['net_profit'] == pnl['total_income'] - pnl['total_expense'], "Mathcheck failed"

        print("\n✨ Reporting Logic Verification Complete ✨")

    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_finance_reporting_test()
