import requests
import sys
import time

BASE_URL = "http://127.0.0.1:8000"

def get_admin_token():
    # Retry logic for server startup
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

def cleanup_db():
    # Helper to clean up data if needed? 
    # Actually we just create new records.
    pass

def run_test():
    print("STEP 15 VALIDATION: CRM BUSINESS RULES")
    print("="*60)
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Test Lead Flow (Strict)
    print("\n[TEST 1] Lead Flow Enforcement")
    # Create Lead (Backdoor for now via Routes? Wait, routes call service. 
    # Current routes in app/crm/routes.py might need update to use new service signatures?)
    # Yes, routes need to pass 'performed_by'. But we haven't updated routes yet.
    # The PROMPT says "No routes yet".
    # But to TEST service, we need to call it.
    # Since we can't call service functions directly from external test script.
    # We must assume the user wants us to Verify Logic via Unit Test (internal) or 
    # wait for Step 16 to test via API.
    # HOWEVER, the Prompt says "Controllers are thin. Services enforce ALL rules."
    # And "Test these scenarios... If blocked -> correct."
    # To test WITHOUT routes, we need a python script that imports the service func.
    
    pass

if __name__ == "__main__":
    print("This test requires routes or internal execution.")
