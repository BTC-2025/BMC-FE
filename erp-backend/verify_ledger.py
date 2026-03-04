import requests
import sys

BASE_URL = "http://localhost:8000"

def get_token():
    login_url = f"{BASE_URL}/auth/login"
    payload = {"username": "admin", "password": "admin123"}
    response = requests.post(login_url, data=payload)
    return response.json().get("access_token")

def test_ledger_logic():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n--- Testing Stock Ledger Logic ---")
    
    # 1. Create a test item with unique SKU
    import time
    unique_id = int(time.time())
    item_data = {
        "name": f"Ledger Test Item {unique_id}",
        "sku": f"LT-{unique_id}",
        "unit": "kg",
        "reorder_level": 5
    }
    item_res = requests.post(f"{BASE_URL}/inventory/items", json=item_data, headers=headers)
    if item_res.status_code != 200:
        print(f"Failed to create item: {item_res.text}")
        return
    item_id = item_res.json()["id"]
    print(f"Created Test Item ID: {item_id}")

    # 2. Get current warehouses
    wh_res = requests.get(f"{BASE_URL}/inventory/warehouses", headers=headers)
    warehouses = wh_res.json()
    if len(warehouses) < 2:
        print("Need at least 2 warehouses for transfer test.")
        return
    wh1_id = warehouses[0]["id"]
    wh2_id = warehouses[1]["id"]
    print(f"Using Warehouses: {wh1_id} and {wh2_id}")

    # 3. Perform Stock Adjustment (Stock In)
    adjust_data = {
        "item_id": item_id,
        "warehouse_id": wh1_id,
        "quantity": 100,
        "reference": "Initial Stock In"
    }
    adj_res = requests.post(f"{BASE_URL}/inventory/adjust", json=adjust_data, headers=headers)
    if adj_res.status_code != 200:
        print(f"FAILED ADJUST: {adj_res.status_code} - {adj_res.text}")
        return
    print("Adjusted Stock: +100 in WH1")

    # 4. Perform Transfer
    transfer_data = {
        "item_id": item_id,
        "from_warehouse": wh1_id,
        "to_warehouse": wh2_id,
        "quantity": 40
    }
    trans_res = requests.post(f"{BASE_URL}/inventory/transfer", json=transfer_data, headers=headers)
    if trans_res.status_code != 200:
        print(f"FAILED TRANSFER: {trans_res.status_code} - {trans_res.text}")
        return
    print("Transferred Stock: 40 from WH1 to WH2")

    # 5. Verify Audit Log Entries
    audit_res = requests.get(f"{BASE_URL}/inventory/audit", headers=headers)
    movements = [m for m in audit_res.json() if m["item_id"] == item_id]
    print(f"\nAudit Log for {item_id}:")
    for m in movements:
        print(f" - {m['movement_type']} | Qty: {m['quantity']} | WH: {m['warehouse_id']} | Ref: {m['reference']} | RefType: {m.get('ref_type')}")

    # 6. Verify Summary Calculation
    summary_res = requests.get(f"{BASE_URL}/inventory/stock-summary", headers=headers)
    summary = [s for s in summary_res.json() if s["item_id"] == item_id]
    
    wh1_stock = next((s["current_stock"] for s in summary if s["warehouse_id"] == wh1_id), 0)
    wh2_stock = next((s["current_stock"] for s in summary if s["warehouse_id"] == wh2_id), 0)
    
    print(f"\nStock Summary:")
    print(f" - WH1 Stock: {wh1_stock} (Expected 60)")
    print(f" - WH2 Stock: {wh2_stock} (Expected 40)")

    if wh1_stock == 60 and wh2_stock == 40:
        print("\n✅ Ledger Logic Verification PASSED!")
    else:
        print("\n❌ Ledger Logic Verification FAILED!")

if __name__ == "__main__":
    try:
        test_ledger_logic()
    except Exception as e:
        print(f"An error occurred: {e}")
