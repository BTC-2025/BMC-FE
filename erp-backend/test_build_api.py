import requests
import sys

BASE_URL = "http://localhost:8000"

def get_token():
    print("Logging in...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    # Standard OAuth2 form submission
    res = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if res.status_code == 200:
        return res.json()["access_token"]
    else:
        print(f"Login failed: {res.text}")
        return None

def test_build():
    print("--- TESTING ASSEMBLY BUILD ---")
    token = get_token()
    if not token:
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Get Assemblies
    res = requests.get(f"{BASE_URL}/inventory/assemblies", headers=headers)
    if res.status_code != 200:
        print(f"Failed to get assemblies: {res.status_code} {res.text}")
        return
        
    assemblies = res.json()
    print(f"DEBUG: Found {len(assemblies)} assemblies")
    
    if not assemblies:
        print("No assemblies to test.")
        return
        
    asm = assemblies[0]
    print(f"Testing Assembly: {asm.get('name')} (ID: {asm.get('id')})")
    
    # 2. Get Warehouses
    res = requests.get(f"{BASE_URL}/inventory/warehouses", headers=headers)
    if res.status_code != 200:
        print(f"Failed to get warehouses: {res.status_code} {res.text}")
        return
        
    warehouses = res.json()
    if not warehouses:
        print("No warehouses found.")
        return
        
    wh_id = warehouses[0]['id']
    print(f"Target Warehouse: {warehouses[0]['name']} (ID: {wh_id})")
    
    # 3. Try to build
    payload = {
        "assembly_id": asm['id'],
        "quantity": 1,
        "warehouse_id": wh_id
    }
    
    print(f"Attempting build {payload}...")
    res = requests.post(f"{BASE_URL}/inventory/assemblies/build", json=payload, headers=headers)
    
    print(f"Response Status: {res.status_code}")
    if res.status_code == 200:
        print("Build SUCCESSFUL!")
        print(res.json())
    else:
        print(f"Build Result: {res.json().get('detail', res.text)}")



if __name__ == "__main__":
    test_build()
