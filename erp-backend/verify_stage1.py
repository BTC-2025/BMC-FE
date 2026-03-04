import requests
import sys

def test_stage1():
    base_url = "http://127.0.0.1:8000"
    
    endpoints = {
        "/health": {"status": "ok"},
        "/version": {"version": "v1.0.0", "status": "stable"},
        "/integrity": {"node_stability": 100.0}
    }
    
    for endpoint, expected in endpoints.items():
        print(f"Testing {endpoint}...")
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                print(f"SUCCESS: {endpoint} returned 200")
                for key, val in expected.items():
                    if key in data and (data[key] == val or val in str(data[key])):
                        print(f"  MATCH: {key} == {val}")
                    else:
                        print(f"  FAILED: {key} expected {val}, got {data.get(key)}")
            else:
                print(f"FAILED: {endpoint} returned status {response.status_code}")
        except Exception as e:
            print(f"ERROR: Could not connect to {endpoint}: {e}")

    # Check root for new title logic indirectly or just confirm it's running
    try:
        root_resp = requests.get(base_url)
        print(f"Root status: {root_resp.json()}")
    except Exception as e:
        print(f"Root error: {e}")

if __name__ == "__main__":
    test_stage1()
