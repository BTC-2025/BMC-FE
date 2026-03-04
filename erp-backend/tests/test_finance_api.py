import requests

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def setup_finance_permissions(token):
    headers = {"Authorization": f"Bearer {token}"}
    perms = ["finance.view", "finance.admin", "finance.post", "finance.invoice"]
    for p in perms:
        requests.post(f"{BASE_URL}/auth/permissions", json={"code": p}, headers=headers)

def run_finance_api_test():
    print("🚀 Starting Finance API & RBAC Test...")
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    setup_finance_permissions(token)

    # 1. Create Accounts (if not exist)
    print("🔹 Creating Accounts...")
    accounts_to_create = [
        {"name": "Accounts Receivable", "code": "1200", "type": "ASSET"},
        {"name": "Sales Income", "code": "4000", "type": "INCOME"},
        {"name": "Office Expense", "code": "5100", "type": "EXPENSE"}
    ]
    
    for acc in accounts_to_create:
        resp = requests.post(f"{BASE_URL}/finance/accounts", json=acc, headers=headers)
        if resp.status_code == 200:
            print(f"   ✅ Created: {acc['name']}")
        elif resp.status_code == 500:
            print(f"   ⚠️ Likely exists: {acc['name']}")

    # 2. List Accounts
    print("\n🔹 Listing Accounts...")
    resp = requests.get(f"{BASE_URL}/finance/accounts", headers=headers)
    if resp.status_code == 200:
        accounts = resp.json()
        print(f"   ✅ Found {len(accounts)} accounts")

    # 3. Create Invoice via API
    print("\n🔹 Creating Invoice via API...")
    invoice_data = {
        "customer_name": "API Test Customer",
        "reference": "API-INV-001",
        "lines": [
            {"description": "Consulting", "quantity": 5, "unit_price": 200}
        ]
    }
    resp = requests.post(f"{BASE_URL}/finance/invoices", json=invoice_data, headers=headers)
    if resp.status_code == 200:
        invoice = resp.json()
        invoice_id = invoice["id"]
        print(f"   ✅ Invoice Created: ID {invoice_id}, Total: {invoice['total_amount']}")
        
        # 4. Post Invoice
        print(f"\n🔹 Posting Invoice {invoice_id}...")
        resp = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post", headers=headers)
        if resp.status_code == 200:
            print(f"   ✅ Invoice Posted: {resp.json()}")
        else:
            print(f"   ❌ Post Failed: {resp.text}")
    else:
        print(f"   ❌ Invoice Creation Failed: {resp.text}")

    # 5. Check Reports
    print("\n🔹 Fetching Trial Balance...")
    resp = requests.get(f"{BASE_URL}/finance/reports/trial-balance", headers=headers)
    if resp.status_code == 200:
        tb_data = resp.json()
        accounts = tb_data["accounts"]
        print(f"   ✅ Trial Balance: {len(accounts)} accounts")
        for row in accounts[:3]:  # Show first 3
            print(f"      {row['code']} - {row['account']}: Net {row['balance']}")

    print("\n🔹 Fetching P&L...")
    resp = requests.get(f"{BASE_URL}/finance/reports/pnl", headers=headers)
    if resp.status_code == 200:
        pnl = resp.json()
        print(f"   ✅ P&L Summary:")
        print(f"      Income:  {pnl['total_income']}")
        print(f"      Expense: {pnl['total_expense']}")
        print(f"      Profit:  {pnl['net_profit']}")

    print("\n✨ Finance API Test Complete ✨")

if __name__ == "__main__":
    try:
        run_finance_api_test()
    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
