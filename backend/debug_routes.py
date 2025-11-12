from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

# List all routes
print("All registered routes:")
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        methods = ', '.join(route.methods) if route.methods else 'N/A'
        print(f"  {methods:10} {route.path}")

# Test the specific endpoint
print("\nTesting /api/master-admin/scores/today:")
response = client.get('/api/master-admin/scores/today', headers={'Authorization': 'Bearer mock_admin_token'})
print(f"Status: {response.status_code}")
if response.status_code == 404:
    print(f"Not Found: {response.text}")
else:
    print(f"Response: {response.json()}")
