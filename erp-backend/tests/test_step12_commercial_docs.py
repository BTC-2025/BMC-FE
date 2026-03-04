import requests

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def setup_accounts(token):
    """Ensure required accounts exist for testing"""
    headers = {"Authorization": f"Bearer {token}"}
    
    accounts = [
        {"name": "Accounts Receivable", "code": "1200", "type": "ASSET"},
        {"name": "Sales Income", "code": "4000", "type": "INCOME"},
        {"name": "Operating Expense", "code": "5000", "type": "EXPENSE"},
        {"name": "Accounts Payable", "code": "2100", "type": "LIABILITY"}
    ]
    
    for acc in accounts:
        resp = requests.post(f"{BASE_URL}/finance/accounts", json=acc, headers=headers)
        if resp.status_code == 200:
            print(f"   ✅ Created: {acc['name']}")
        elif resp.status_code == 500:
            print(f"   ⚠️ Exists: {acc['name']}")

def run_step12_test():
    print("🚀 Starting STEP 12 Verification (Invoice & Bill Auto-Posting)...")
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Setup
    setup_accounts(token)
    
    # TEST 1: Invoice Lifecycle
    print("\n📋 TEST 1: Invoice Draft → Posted → GL Impact")
    print("=" * 60)
    
    # 1a. Create Draft Invoice
    print("🔹 Creating Draft Invoice...")
    invoice_data = {
        "customer_name": "Step 12 Test Customer",
        "reference": "STEP12-INV",
        "lines": [
            {"description": "Consulting Services", "quantity": 10, "unit_price": 150}
        ]
    }
    resp = requests.post(f"{BASE_URL}/finance/invoices", json=invoice_data, headers=headers)
    assert resp.status_code == 200, f"Invoice creation failed: {resp.text}"
    invoice = resp.json()
    invoice_id = invoice["id"]
    print(f"   ✅ Invoice Created: ID {invoice_id}, Amount: {invoice['total_amount']}, Status: {invoice['status']}")
    assert invoice["status"] == "DRAFT", "Invoice should be DRAFT"
    assert invoice["total_amount"] == 1500, "Total should be 1500"
    
    # 1b. Post Invoice (Auto-GL)
    print(f"\n🔹 Posting Invoice {invoice_id} (Auto-GL)...")
    resp = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post", headers=headers)
    assert resp.status_code == 200, f"Invoice posting failed: {resp.text}"
    result = resp.json()
    print(f"   ✅ Invoice Posted: {result}")
    assert result["status"] == "POSTED", "Invoice should be POSTED"
    assert result["journal_entry_id"] is not None, "Should have journal_entry_id"
    
    # 1c. Verify Cannot Repost
    print(f"\n🔹 Attempting to Repost Invoice {invoice_id} (Should Fail)...")
    resp = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post", headers=headers)
    assert resp.status_code == 400, "Should reject reposting"
    print(f"   ✅ Repost Blocked: {resp.json()['detail']}")
    
    # 1d. Verify GL Entry
    print(f"\n🔹 Verifying Journal Entry {result['journal_entry_id']}...")
    resp = requests.get(f"{BASE_URL}/finance/reports/trial-balance", headers=headers)
    assert resp.status_code == 200
    tb = resp.json()
    ar_balance = next((x for x in tb if x['code'] == '1200'), None)
    income_balance = next((x for x in tb if x['code'] == '4000'), None)
    
    if ar_balance and income_balance:
        print(f"   ✅ GL Impact Verified:")
        print(f"      AR (1200): Dr {ar_balance['debit']} | Cr {ar_balance['credit']} | Net {ar_balance['net_balance']}")
        print(f"      Income (4000): Dr {income_balance['debit']} | Cr {income_balance['credit']} | Net {income_balance['net_balance']}")
        # AR should have positive net (Debit > Credit)
        # Income should have negative net (Credit > Debit)
        assert ar_balance['net_balance'] >= 1500, "AR should increase"
        assert income_balance['net_balance'] <= -1500, "Income should increase (negative net)"
    
    # TEST 2: Bill Lifecycle
    print("\n\n📋 TEST 2: Bill Draft → Posted → GL Impact")
    print("=" * 60)
    
    # 2a. Create Draft Bill
    print("🔹 Creating Draft Bill...")
    bill_data = {
        "vendor_name": "Step 12 Test Vendor",
        "reference": "STEP12-BILL",
        "lines": [
            {"description": "Office Supplies", "quantity": 5, "unit_price": 100}
        ]
    }
    resp = requests.post(f"{BASE_URL}/finance/bills", json=bill_data, headers=headers)
    assert resp.status_code == 200, f"Bill creation failed: {resp.text}"
    bill = resp.json()
    bill_id = bill["id"]
    print(f"   ✅ Bill Created: ID {bill_id}, Amount: {bill['total_amount']}, Status: {bill['status']}")
    assert bill["status"] == "DRAFT", "Bill should be DRAFT"
    assert bill["total_amount"] == 500, "Total should be 500"
    
    # 2b. Post Bill (Auto-GL)
    print(f"\n🔹 Posting Bill {bill_id} (Auto-GL)...")
    resp = requests.post(f"{BASE_URL}/finance/bills/{bill_id}/post", headers=headers)
    assert resp.status_code == 200, f"Bill posting failed: {resp.text}"
    result = resp.json()
    print(f"   ✅ Bill Posted: {result}")
    assert result["status"] == "POSTED", "Bill should be POSTED"
    assert result["journal_entry_id"] is not None, "Should have journal_entry_id"
    
    # 2c. Verify GL Entry
    print(f"\n🔹 Verifying Journal Entry {result['journal_entry_id']}...")
    resp = requests.get(f"{BASE_URL}/finance/reports/trial-balance", headers=headers)
    assert resp.status_code == 200
    tb = resp.json()
    expense_balance = next((x for x in tb if x['code'] == '5000'), None)
    ap_balance = next((x for x in tb if x['code'] == '2100'), None)
    
    if expense_balance and ap_balance:
        print(f"   ✅ GL Impact Verified:")
        print(f"      Expense (5000): Dr {expense_balance['debit']} | Cr {expense_balance['credit']} | Net {expense_balance['net_balance']}")
        print(f"      AP (2100): Dr {ap_balance['debit']} | Cr {ap_balance['credit']} | Net {ap_balance['net_balance']}")
        # Expense should have positive net (Debit > Credit)
        # AP should have negative net (Credit > Debit)
        assert expense_balance['net_balance'] >= 500, "Expense should increase"
        assert ap_balance['net_balance'] <= -500, "AP should increase (negative net)"
    
    # TEST 3: Accounting Integrity
    print("\n\n📋 TEST 3: Accounting Integrity Check")
    print("=" * 60)
    resp = requests.get(f"{BASE_URL}/finance/reports/trial-balance", headers=headers)
    tb = resp.json()
    
    total_debits = sum(x['debit'] for x in tb)
    total_credits = sum(x['credit'] for x in tb)
    
    print(f"   Total Debits:  {total_debits}")
    print(f"   Total Credits: {total_credits}")
    print(f"   Difference:    {abs(total_debits - total_credits)}")
    
    assert round(total_debits, 2) == round(total_credits, 2), "DEBITS MUST EQUAL CREDITS!"
    print(f"   ✅ DOUBLE-ENTRY VERIFIED: Debits = Credits")
    
    print("\n" + "=" * 60)
    print("✨ STEP 12 VERIFICATION COMPLETE ✨")
    print("=" * 60)
    print("✅ Draft → Posted enforced")
    print("✅ Journal Entry auto-created")
    print("✅ Cannot repost invoice/bill")
    print("✅ Ledger balances (Debit = Credit)")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_step12_test()
    except AssertionError as e:
        print(f"\n❌ ASSERTION FAILED: {e}")
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
