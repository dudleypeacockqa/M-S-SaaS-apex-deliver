import json, urllib.request, pathlib, subprocess, os
secret = None
for line in pathlib.Path('.env').read_text().splitlines():
    if line.startswith('CLERK_SECRET_KEY='):
        secret = line.split('=',1)[1].strip()
        break
if not secret:
    raise SystemExit('CLERK_SECRET_KEY missing')
headers = {
    'Authorization': f'Bearer {secret}',
    'Content-Type': 'application/json',
    'User-Agent': 'curl/8.0',
    'Accept': 'application/json'
}
data = json.dumps({'user_id': 'user_35gkQKcoVJ3hpFnp6GDx39e9h8E', 'expires_in_seconds': 600}).encode()
req = urllib.request.Request('https://api.clerk.com/v1/sign_in_tokens', data=data, headers=headers)
with urllib.request.urlopen(req) as resp:
    payload = json.load(resp)
print('created sign-in token')
env = os.environ.copy()
env['CLERK_SIGN_IN_TOKEN'] = payload['token']
env['MASTER_ADMIN_BASE_URL'] = 'https://ma-saas-platform.onrender.com'
env['API_BASE_URL'] = 'https://ma-saas-backend.onrender.com'
env['MASTER_ADMIN_TENANT_ID'] = 'qa-dge-tenant'
subprocess.run(['node', 'scripts/exercise-master-admin-crud.mjs'], env=env, check=True)
