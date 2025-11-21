from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
res = client.put('/api/blog/test-slug', json={'title':'x'})
print(res.status_code, res.text)
