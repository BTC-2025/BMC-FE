import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": "admin123"})
    if resp.status_code != 200:
        raise Exception(f"Login failed: {resp.text}")
    return resp.json()["access_token"]

def run_step14_enhanced_test():
    print("STEP 14 ENHANCED - CRM Advanced Features")
    print("=" * 60)
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Create Qualified Lead
    print("\nTEST 1: Setup - Create Qualified Lead")
    resp = requests.post(f"{BASE_URL}/crm/leads", params={"name": "Enterprise Client"}, headers=headers)
    lead_id = resp.json()["id"]
    requests.post(f"{BASE_URL}/crm/leads/{lead_id}/status", params={"status": "QUALIFIED"}, headers=headers)
    print(f"[OK] Lead Created & Qualified: ID {lead_id}")

    # 2. Log Activity (Call)
    print("\nTEST 2: Log Activity (Call)")
    act_data = {
        "type": "CALL",
        "note": "Initial discovery call - promising",
        "lead_id": lead_id
    }
    resp = requests.post(f"{BASE_URL}/crm/activities", params=act_data, headers=headers)
    assert resp.status_code == 200, f"Activity log failed: {resp.text}"
    print(f"[OK] Activity Logged: {resp.json()['note']}")
    
    # 3. Convert to Deal
    print("\nTEST 3: Convert to Deal")
    resp = requests.post(f"{BASE_URL}/crm/leads/{lead_id}/convert", params={"title": "Enterprise Deal", "value": 100000}, headers=headers)
    deal_id = resp.json()["id"]
    print(f"[OK] Deal Created: ID {deal_id}, Value 100000")
    
    # 4. Move Deal Stage
    print("\nTEST 4: Move Deal Stage (Negotiation)")
    resp = requests.post(f"{BASE_URL}/crm/deals/{deal_id}/stage", params={"stage": "NEGOTIATION"}, headers=headers)
    assert resp.status_code == 200
    print(f"[OK] Deal Stage Updated: {resp.json()['stage']}")
    assert resp.json()["stage"] == "NEGOTIATION"
    
    # 5. Check Dashboard Stats
    print("\nTEST 5: Dashboard Analytics")
    resp = requests.get(f"{BASE_URL}/crm/stats", headers=headers)
    stats = resp.json()
    print(f"Pipeline Value: {stats['pipeline_value']}")
    print(f"Lead Conv Rate: {stats['lead_stats']['rate']:.1f}%")
    
    assert stats['pipeline_value'] >= 100000
    print("[OK] Stats reflect new deal")
    
    print("\n" + "=" * 60)
    print("CRM ADVANCED FEATURES VERIFIED")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_step14_enhanced_test()
    except AssertionError as e:
        print(f"\n[FAIL] ASSERTION: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] ERROR: {e}")
        sys.exit(1)
