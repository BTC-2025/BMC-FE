import requests
import json

url = "http://localhost:8000/auth/register"
data = {
    "username": "testuser123",
    "email": "test@example.com",
    "password": "TestPass123",
    "full_name": "Test User",
    "company_name": "Test Company"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'response'):
        print(f"Response text: {e.response.text}")
