import requests

BACKEND_URL = "http://127.0.0.1:8000"

def test_register_and_login():
    # 1. Register
    reg_data = {
        "username": "testuser_debug_1",
        "email": "debug1@example.com",
        "password": "password123",
        "full_name": "Debug User",
        "company_name": "Debug Corp"
    }
    
    print(f"Testing Registration for {reg_data['username']}...")
    try:
        r = requests.post(f"{BACKEND_URL}/auth/register", json=reg_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Registration Error: {e}")
        return

    # 2. Login
    login_data = {
        "username": reg_data["username"],
        "password": reg_data["password"]
    }
    print(f"\nTesting Login for {login_data['username']}...")
    try:
        # FastAPI OAuth2 expects form data
        r = requests.post(f"{BACKEND_URL}/auth/login", data=login_data)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
        token = r.json().get("access_token")
    except Exception as e:
        print(f"Login Error: {e}")
        return

    if token:
        # 3. Get Me
        print("\nTesting /auth/me...")
        headers = {"Authorization": f"Bearer {token}"}
        r = requests.get(f"{BACKEND_URL}/auth/me", headers=headers)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")

if __name__ == "__main__":
    test_register_and_login()
