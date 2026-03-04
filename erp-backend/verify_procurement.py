import requests
import json
import time

BASE_URL = "http://localhost:8000"
TENANT_ID = 1
USER_ID = 2

def get_headers():
    # Assuming a dev environment where we can pass tenant info or use a mock token
    # For now, we'll try to find a valid token or assume the server handles it for testing
    return {
        "X-Tenant-ID": str(TENANT_ID),
        "Authorization": "Bearer DEV_TOKEN" # This would need to be a real token in a secured env
    }

def test_flow():
    print("--- Starting Procurement Flow Verification ---")
    
    # 1. Create Supplier
    supplier_data = {
        "name": "Verify Vendor Inc",
        "email": "vendor@verify.com",
        "phone": "1234567890",
        "category": "Raw Materials"
    }
    print("Creating Supplier...")
    # NOTE: In our actual setup, headers might be needed but for local debug it might be simpler
    # Using a real session if we had one
    # For verification, I'll just check if endpoints respond correctly
    
    # Actually, I'll use the existing database session via a python script if I can't do HTTP easily
    # But let's try HTTP first
    
    try:
        # Check Suppliers
        res = requests.get(f"{BASE_URL}/scm/suppliers", params={"tenant_id": TENANT_ID})
        print(f"List Suppliers Status: {res.status_code}")
        
        # Check Items
        res = requests.get(f"{BASE_URL}/inventory/items")
        items = res.json()
        if not items:
            print("No items found. Cannot proceed with PO test.")
            return
        item_id = items[0]['id']
        print(f"Using Item ID: {item_id}")
        
        # Create PO
        po_data = {
            "supplier_id": 1, # Assuming 1 exists
            "items": [{"item_id": item_id, "quantity": 10}]
        }
        res = requests.post(f"{BASE_URL}/scm/purchase-orders", json=po_data)
        if res.status_code == 200:
            po = res.json()
            po_id = po['id']
            print(f"PO Created: {po_id}")
            
            # Approve PO
            res = requests.post(f"{BASE_URL}/scm/purchase-orders/{po_id}/approve")
            print(f"PO Approve Status: {res.status_code}")
            
            # Receive Goods
            receive_data = {
                "purchase_order_id": po_id,
                "warehouse_id": 1
            }
            res = requests.post(f"{BASE_URL}/scm/receive", json=receive_data)
            print(f"Receive Goods Status: {res.status_code}")
            if res.status_code == 200:
                print("Goods Received Successfully!")
                
                # Verify Stock
                res = requests.get(f"{BASE_URL}/inventory/items/{item_id}")
                item = res.json()
                print(f"Current Stock: {item.get('current_stock')}")
        else:
            print(f"PO Creation failed: {res.text}")

    except Exception as e:
        print(f"Error during verification: {e}")

if __name__ == "__main__":
    test_flow()
