import requests
import requests
import json
import threading

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def setup_permissions(token):
    headers = {"Authorization": f"Bearer {token}"}
    perms = ["inventory.audit"]
    for p in perms:
        requests.post(f"{BASE_URL}/auth/permissions", json={"code": p}, headers=headers)

def run_step10_verification():
    print("🚀 Starting Step 10 Verification (Audit, Alerts, Summary)...")
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    setup_permissions(token) # Ensure audit perm exists

    # 1. Check Stock Summary
    print("🔹 Fetching Stock Summary...")
    resp = requests.get(f"{BASE_URL}/inventory/stock-summary", headers=headers)
    if resp.status_code == 200:
        summary = resp.json()
        print(f"✅ Summary Data: {summary}")
    else:
        print(f"❌ Summary Failed: {resp.text}")

    # 2. Check Audit Log
    print("🔹 Fetching Audit Log...")
    resp = requests.get(f"{BASE_URL}/inventory/audit", headers=headers)
    if resp.status_code == 200:
        audit = resp.json()
        print(f"✅ Audit Entries: {len(audit)}")
        if len(audit) > 0:
            print(f"   Latest: {audit[0]}")
    else:
        print(f"❌ Audit Failed: {resp.text}")

    # 3. Check Alerts (Reorder)
    # We created an item "API Test Item" with reorder_level=10 and added 50 stock in Step 9.
    # So it shouldn't trigger yet. Let's create a LOW STOCK item.
    print("🔹 Creating Low Stock Item for Alert Test...")
    sku = f"LOW-STOCK-TEST"
    # Try to create, if fails assume it exists and fetch ID
    try:
        item_resp = requests.post(f"{BASE_URL}/inventory/items", json={
            "name": "Low Stock Widget",
            "sku": sku,
            "unit": "pcs",
            "reorder_level": 100
        }, headers=headers)
        
        if item_resp.status_code == 200:
            item_id = item_resp.json()["id"]
            # Only adjust if created new, or just adjust anyway
            requests.post(f"{BASE_URL}/inventory/adjust", json={
                "item_id": item_id,
                "warehouse_id": 1, 
                "quantity": 10,
                "reference": "ALERT-TEST"
            }, headers=headers)
        elif item_resp.status_code == 500: # Integrity Error likely
            print("   Item likely exists (500 Error)")
            # In a real scenario we'd query by SKU, but we don't have that endpoint yet.
            # We'll rely on previous run data or just proceed to check alerts.
    except Exception as e:
        print(f"   Item creation skipped/failed: {e}")
    
    print("🔹 Checking Alerts...")
    resp = requests.get(f"{BASE_URL}/inventory/alerts", headers=headers)
    if resp.status_code == 200:
        alerts = resp.json()
        print(f"✅ Active Alerts: {len(alerts)}")
        print(f"   Alert Data: {alerts}")
        has_low_stock = any(a['reorder_level'] == 100 for a in alerts)
        if has_low_stock:
            print("✅ Alert Triggered correctly")
        else:
             print("⚠️ Warning: Low Stock Alert missing (Check logic/data)")
    else:
        print(f"❌ Alerts Failed: {resp.text}")

    print("\n✨ Step 10 Verification Complete ✨")

if __name__ == "__main__":
    try:
        run_step10_verification()
    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
