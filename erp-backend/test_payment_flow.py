import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_payment_flow():
    print("--- TESTING FULL PAYMENT FLOW ---")
    
    # 1. Create Draft Invoice
    payload = {
        "customer_name": "Test Payment Corp",
        "lines": [{"description": "Audit Service", "quantity": 1, "unit_price": 500.0}],
        "reference": f"TEST-PAY-{int(time.time())}"
    }
    res = requests.post(f"{BASE_URL}/finance/invoices", json=payload)
    if res.status_code != 200:
        print(f"FAILED to create invoice: {res.status_code} {res.text}")
        return
    invoice = res.json()
    invoice_id = invoice['id']
    print(f"SUCCESS: Created Draft Invoice #{invoice_id} (Status: {invoice['status']})")
    
    # 2. Attempt Payment on Draft (Should FAIL)
    pay_payload = {
        "amount": 500.0,
        "date": "2026-02-18",
        "method": "Bank Transfer",
        "reference": "TEST-PAY-REF"
    }
    res = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/pay", json=pay_payload)
    print(f"RESULT: Payment on Draft attempt: {res.status_code} (Expected 400)")
    
    # 3. Post Invoice
    res = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/post")
    if res.status_code != 200:
        print(f"FAILED to post invoice: {res.status_code} {res.text}")
        return
    print(f"SUCCESS: Posted Invoice #{invoice_id}")
    
    # 4. Record Payment
    res = requests.post(f"{BASE_URL}/finance/invoices/{invoice_id}/pay", json=pay_payload)
    if res.status_code != 200:
        print(f"FAILED to record payment: {res.status_code} {res.text}")
        return
    print(f"SUCCESS: Recorded Payment for Invoice #{invoice_id}")
    
    # 5. Verify Invoices List
    res = requests.get(f"{BASE_URL}/finance/invoices")
    invoices = res.json()
    my_inv = next((i for i in invoices if i['id'] == invoice_id), None)
    print(f"VERIFY: Invoice #{invoice_id} Status in list: {my_inv['status']} (Expected PAID)")
    
    # 6. Verify Payments List
    res = requests.get(f"{BASE_URL}/finance/payments")
    payments = res.json()
    my_pay = next((p for p in payments if p['invoice_id'] == invoice_id), None)
    if my_pay:
        print(f"VERIFY: Payment record found for Invoice #{invoice_id} with amount {my_pay['amount']}")
    else:
        print(f"FAILED: Payment record not found in /finance/payments")

if __name__ == "__main__":
    test_payment_flow()
