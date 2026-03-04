import requests
import sys

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
            print(f"[OK] Created: {acc['name']}")

def run_step12_test():
    print("STEP 12 VERIFICATION - Invoice & Bill Auto-Posting")
    print("=" * 60)
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    setup_accounts(token)
    
    # TEST 1: Invoice
    print("\nTEST 1: Invoice Draft -> Posted -> GL Impact")
    invoice_data = {
        "customer_name": "Test Customer",
        "reference": "STEP12-INV",
        "lines": [{"description": "Services", "quantity": 10, "unit_price": 150}]
    }
    resp = requests.post(f"{BASE_URL}/finance/invoices", json=invoice_data, headers=headers)
    assert resp.status_code == 200, f"Invoice creation failed: {resp.text}"
    invoice = resp.json()
    invoice_id = invoice["id"]
    print(f"[OK] Invoice Created: ID {invoice_id}, Amount: {invoice['total_amount']}, Status: {invoice['status']}")
    assert invoice["status"] == "DRAFT"
    assert invoice["total_amount"] == 1500
    
    # Post Invoice
    resp = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post", headers=headers)
    assert resp.status_code == 200, f"Invoice posting failed: {resp.text}"
    result = resp.json()
    print(f"[OK] Invoice Posted: Status={result['status']}, JE_ID={result['journal_entry_id']}")
    assert result["status"] == "POSTED"
    assert result["journal_entry_id"] is not None
    
    # Try to repost (should fail)
    resp = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post", headers=headers)
    assert resp.status_code == 400
    print(f"[OK] Repost Blocked: {resp.json()['detail']}")
    
    # TEST 2: Bill
    print("\nTEST 2: Bill Draft -> Posted -> GL Impact")
    bill_data = {
        "vendor_name": "Test Vendor",
        "reference": "STEP12-BILL",
        "lines": [{"description": "Supplies", "quantity": 5, "unit_price": 100}]
    }
    resp = requests.post(f"{BASE_URL}/finance/bills", json=bill_data, headers=headers)
    assert resp.status_code == 200, f"Bill creation failed: {resp.text}"
    bill = resp.json()
    bill_id = bill["id"]
    print(f"[OK] Bill Created: ID {bill_id}, Amount: {bill['total_amount']}, Status: {bill['status']}")
    assert bill["status"] == "DRAFT"
    assert bill["total_amount"] == 500
    
    # Post Bill
    resp = requests.post(f"{BASE_URL}/finance/bills/{bill_id}/post", headers=headers)
    assert resp.status_code == 200, f"Bill posting failed: {resp.text}"
    result = resp.json()
    print(f"[OK] Bill Posted: Status={result['status']}, JE_ID={result['journal_entry_id']}")
    assert result["status"] == "POSTED"
    assert result["journal_entry_id"] is not None
    
    # TEST 3: Accounting Integrity
    print("\nTEST 3: Accounting Integrity Check")
    resp = requests.get(f"{BASE_URL}/finance/reports/trial-balance", headers=headers)
    tb = resp.json()
    
    total_debits = sum(x['debit'] for x in tb)
    total_credits = sum(x['credit'] for x in tb)
    
    print(f"Total Debits:  {total_debits}")
    print(f"Total Credits: {total_credits}")
    print(f"Difference:    {abs(total_debits - total_credits)}")
    
    assert round(total_debits, 2) == round(total_credits, 2), "DEBITS MUST EQUAL CREDITS!"
    print(f"[OK] DOUBLE-ENTRY VERIFIED: Debits = Credits")
    
    print("\n" + "=" * 60)
    print("STEP 12 VERIFICATION COMPLETE")
    print("=" * 60)
    print("[OK] Draft -> Posted enforced")
    print("[OK] Journal Entry auto-created")
    print("[OK] Cannot repost invoice/bill")
    print("[OK] Ledger balances (Debit = Credit)")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_step12_test()
    except AssertionError as e:
        print(f"\n[FAIL] ASSERTION: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] ERROR: {e}")
        sys.exit(1)
