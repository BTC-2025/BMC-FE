import requests
import threading
import time
import json

BASE_URL = "http://127.0.0.1:8000"
ADMIN_AUTH = ("admin", "admin123")

def get_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code}")
        print(resp.text)
        raise Exception("Login failed")
    return resp.json()["access_token"]

def setup_test_data(token):
    headers = {"Authorization": f"Bearer {token}"}
    sku = f"STRESS-{int(time.time())}"
    
    # 1. Create Warehouse
    requests.post(f"{BASE_URL}/auth/permissions", json={"code": "inventory.admin"}, headers=headers)
    requests.post(f"{BASE_URL}/inventory/warehouses", json={"name": "Main Warehouse", "type": "LOCAL"}, headers=headers)
    
    # 2. Create Item with unique SKU
    item_resp = requests.post(f"{BASE_URL}/inventory/items", json={
        "name": "Stress Test Widget",
        "sku": sku,
        "unit": "pcs",
        "reorder_level": 5.0
    }, headers=headers)
    
    if item_resp.status_code != 200:
        print(f"Item creation failed: {item_resp.text}")
        raise Exception("Item creation failed")
        
    item_id = item_resp.json()["id"]
    
    # 3. Add initial stock (10 units)
    adjust_resp = requests.post(f"{BASE_URL}/inventory/adjust", json={
        "item_id": item_id,
        "quantity": 10.0,
        "reference_id": "INIT"
    }, headers=headers)
    
    if adjust_resp.status_code != 200:
        print(f"Initial adjustment failed: {adjust_resp.text}")
        raise Exception("Initial adjustment failed")
    
    return item_id

def perform_stock_out(token, item_id, results):
    headers = {"Authorization": f"Bearer {token}"}
    # Try to take 2 units (If 10 concurrent requests, total 20 units requested, only 5 should succeed)
    try:
        resp = requests.post(f"{BASE_URL}/inventory/adjust", json={
            "item_id": item_id,
            "quantity": -2.0,
            "reference_id": "STRESS-TEST"
        }, headers=headers)
        results.append(resp.status_code)
    except Exception as e:
        results.append(str(e))

def run_stress_test():
    print("Starting Inventory Concurrency Test...")
    token = get_token()
    item_id = setup_test_data(token)
    
    results = []
    threads = []
    
    # Simulate 10 simultaneous stock-out requests
    for i in range(10):
        t = threading.Thread(target=perform_stock_out, args=(token, item_id, results))
        threads.append(t)
    
    print(f"Launching 10 threads requesting 2 units each (Initial Stock: 10)...")
    for t in threads:
        t.start()
    
    for t in threads:
        t.join()
    
    print("Results Summary:")
    success = results.count(200)
    conflict = results.count(409)
    print(f"Successes (200 OK): {success}")
    print(f"Conflicts (409 Insufficient Stock): {conflict}")
    
    # Verify final stock
    headers = {"Authorization": f"Bearer {token}"}
    items_resp = requests.get(f"{BASE_URL}/inventory/items", headers=headers)
    for item in items_resp.json():
        if item["id"] == item_id:
            print(f"Final Stock Balance: {item['current_stock']}")
            assert item["current_stock"] >= 0, "ERROR: Stock went negative!"
            print("CONCURRENCY CHECK PASSED: Stock remains >= 0")

if __name__ == "__main__":
    try:
        run_stress_test()
    except Exception as e:
        print(f"❌ Test Failed: {e}")
