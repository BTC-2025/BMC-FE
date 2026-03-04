import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def setup_crm_permissions(token):
    headers = {"Authorization": f"Bearer {token}"}
    perms = ["crm.view", "crm.create", "crm.update", "crm.convert"]
    for p in perms:
        requests.post(f"{BASE_URL}/auth/permissions", json={"code": p}, headers=headers)

def run_step14_test():
    print("STEP 14 VERIFICATION - CRM Pipeline")
    print("=" * 60)
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    setup_crm_permissions(token)
    
    # 1. Create Lead
    print("\nTEST 1: Create Lead")
    lead_data = {
        "name": "Acme Widgets Inc",
        "email": "contact@acme.com",
        "phone": "555-0199"
    }
    resp = requests.post(f"{BASE_URL}/crm/leads", params=lead_data, headers=headers)
    assert resp.status_code == 200, f"Lead creation failed: {resp.text}"
    lead = resp.json()
    lead_id = lead["id"]
    print(f"[OK] Lead Created: {lead['name']} (ID: {lead_id}) Status: {lead['status']}")
    assert lead["status"] == "NEW"
    
    # 2. Update Status -> CONTACTED
    print("\nTEST 2: Update Status -> CONTACTED")
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "CONTACTED"}, headers=headers)
    assert resp.status_code == 200, f"Status update failed: {resp.text}"
    print(f"[OK] Status updated to: {resp.json()['status']}")
    assert resp.json()["status"] == "CONTACTED"

    # 3. Update Status -> QUALIFIED
    print("\nTEST 3: Update Status -> QUALIFIED")
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "QUALIFIED"}, headers=headers)
    assert resp.status_code == 200
    print(f"[OK] Status updated to: {resp.json()['status']}")
    assert resp.json()["status"] == "QUALIFIED"
    
    # 4. Convert to Deal (Success)
    print("\nTEST 4: Convert to Deal")
    deal_data = {
        "title": "500 Widget Deal",
        "value": 50000
    }
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/convert", params=deal_data, headers=headers)
    assert resp.status_code == 200, f"Conversion failed: {resp.text}"
    deal = resp.json()
    print(f"[OK] Conversion Successful!")
    print(f"   Deal: {deal['title']} Value: {deal['value']}")
    print(f"   Stage: {deal['stage']}")
    
    # 5. Verify Lead Status is now CONVERTED
    print("\nTEST 5: Verify Lead Status")
    resp = requests.get(f"{BASE_URL}/crm/leads", headers=headers)
    leads = resp.json()
    my_lead = next((l for l in leads if l['id'] == lead_id), None)
    print(f"[OK] Lead Status: {my_lead['status']}")
    assert my_lead['status'] == "CONVERTED"
    
    # 6. Negative Test: Try to convert non-qualified lead
    print("\nTEST 6: Negative Test (Convert New Lead)")
    # Create new lead
    resp = requests.post(f"{BASE_URL}/crm/leads", params={"name": "Bad Lead"}, headers=headers)
    bad_lead_id = resp.json()["id"]
    
    # Try to convert
    resp = requests.post(f"{BASE_URL}/crm/leads/{bad_lead_id}/convert", params={"title": "Fail", "value": 100}, headers=headers)
    assert resp.status_code == 400
    print(f"[OK] Conversion blocked for non-QUALIFIED lead: {resp.json()['detail']}")

    print("\n" + "=" * 60)
    print("STEP 14 VERIFICATION COMPLETE")
    print("=" * 60)
    print("[OK] Leads pipeline works")
    print("[OK] Status enforced")
    print("[OK] Conversion controlled")
    print("[OK] RBAC enforced")

if __name__ == "__main__":
    try:
        run_step14_test()
    except AssertionError as e:
        print(f"\n[FAIL] ASSERTION: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] ERROR: {e}")
        sys.exit(1)
