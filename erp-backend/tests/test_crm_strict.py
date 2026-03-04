import requests
import sys
import time

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    for _ in range(5):
        try:
            resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
            if resp.status_code == 200:
                return resp.json()["access_token"]
        except:
            pass
        time.sleep(1)
    
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def setup_permissions(token):
    headers = {"Authorization": f"Bearer {token}"}
    for p in ["crm.view", "crm.create", "crm.update", "crm.convert"]:
        requests.post(f"{BASE_URL}/auth/permissions", json={"code": p}, headers=headers)

def run_test():
    print("STRICT CRM RULES VERIFICATION")
    print("="*60)
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    setup_permissions(token)
    
    # 1. Status Jump Test
    print("\n[TEST 1] Lead Status Jump (NEW -> QUALIFIED)")
    resp = requests.post(f"{BASE_URL}/crm/leads", params={"name": "Jumping Jack"}, headers=headers)
    lead_id = resp.json()["id"]
    
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "QUALIFIED"}, headers=headers)
    if resp.status_code == 400 and "Invalid transition" in resp.text:
        print("[PASS] Jump Blocked")
    else:
        print(f"[FAIL] Unexpected response: {resp.text}")
        sys.exit(1)
        
    # 2. Valid Transition
    print("\n[TEST 2] Valid Transition (NEW -> CONTACTED)")
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "CONTACTED"}, headers=headers)
    if resp.status_code == 200:
        print("[PASS] Transition Allowed")
    else:
        print(f"[FAIL] Unexpected response: {resp.text}")
        sys.exit(1)
        
    # 3. Invalid Deal Stage
    print("\n[TEST 3] Invalid Deal Stage")
    requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "QUALIFIED"}, headers=headers)
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/convert", params={"title": "Deal", "value": 100}, headers=headers)
    deal_id = resp.json()["id"]
    
    resp = requests.post(f"{BASE_URL}/crm/deals/{deal_id}/stage", params={"stage": "SUPER_WON"}, headers=headers)
    if resp.status_code == 400 and "Invalid stage" in resp.text:
        print("[PASS] Invalid Stage Blocked")
    else:
        print(f"[FAIL] Unexpected response: {resp.text}")
        sys.exit(1)
        
    print("\n" + "="*60)
    print("STRICT RULES VERIFIED")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
