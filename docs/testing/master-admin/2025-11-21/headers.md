# Master Admin Headers (2025-11-21)

Use these templates to capture sanitized headers/curl snippets before executing each checklist step. Replace `<token>` placeholders with the actual Clerk JWT captured during the run and keep the signed values in 1Password, not the repo.

```http
GET /api/master-admin/dashboard HTTP/1.1
Host: localhost:8000
Authorization: Bearer <MASTER_ADMIN_JWT>
X-Master-Tenant-Id: qa-dge-tenant
```

```bash
curl -X POST "$BACKEND_URL/api/master-admin/activities" \
  -H "Authorization: Bearer <MASTER_ADMIN_JWT>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{"title":"QA Activity","type":"call","status":"completed"}'
```

Record the captured JWT identifier + tenant header in this file once the QA session begins:

| Field | Value | Notes |
| --- | --- | --- |
| Clerk user_id | `user_35gkQKcoVJ3hpFnp6GDx39e9h8E` | Retrieved via Clerk API (`console/clerk-users.log`) |
| JWT fingerprint | _Pending – need to store masked `Authorization: Bearer <JWT>` once API logs are captured_ | Use Clerk `jwt.create` endpoint (todo) |
| Tenant header | `qa-dge-tenant` | Matches seed data |
| Environment | `https://ma-saas-platform.onrender.com` (2025-11-22) | Accessed via `__clerk_ticket` sign-in token |
| Checklist link | docs/testing/2025-11-19-MASTER-ADMIN-VALIDATION-CHECKLIST.md | Reference for auditors |

### Clerk API Notes (2025-11-22)
- **User discovery**: `GET https://api.clerk.com/v1/users?limit=10` with headers `Authorization: Bearer [REDACTED]`, `User-Agent: curl/8.0`, `Accept: application/json`.
- **Sign-in token**: `POST https://api.clerk.com/v1/sign_in_tokens` with `{"user_id":"user_35gkQKcoVJ3hpFnp6GDx39e9h8E"}` returns `token` + `url`. Log stored in `console/clerk-sign-in-token.log`.
- **UI login**: Launch https://ma-saas-platform.onrender.com/?__clerk_ticket=<token> (valid for ~5 minutes) and immediately hit the master admin routes. Screenshots captured via `node scripts/capture-master-admin-evidence.mjs`.
- **CRUD Operations**: See CRUD examples below. Execute via `scripts/exercise-master-admin-crud.mjs` with `CLERK_SIGN_IN_TOKEN` env var.

---

## CRUD Operations - Sanitized curl Examples

### Activity CRUD Operations

#### Create Activity
```bash
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/activities" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QA Test Activity - CRUD Evidence",
    "type": "call",
    "status": "completed",
    "amount": 1
  }'
```

#### Update Activity
```bash
curl -X PUT "https://ma-saas-backend.onrender.com/api/master-admin/activities/<ACTIVITY_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QA Test Activity - Updated",
    "status": "completed",
    "amount": 2
  }'
```

#### Delete Activity
```bash
curl -X DELETE "https://ma-saas-backend.onrender.com/api/master-admin/activities/<ACTIVITY_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

### Campaign Recipient Operations

#### List Campaigns
```bash
curl -X GET "https://ma-saas-backend.onrender.com/api/master-admin/campaigns?page=1&per_page=10" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

#### List Campaign Recipients
```bash
curl -X GET "https://ma-saas-backend.onrender.com/api/master-admin/campaigns/<CAMPAIGN_ID>/recipients" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

#### Create Campaign Recipient
```bash
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/campaigns/<CAMPAIGN_ID>/recipients" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "<CAMPAIGN_ID>",
    "email": "qa-test@example.com",
    "name": "QA Test Recipient"
  }'
```

### Content CRUD Operations

#### Create Content Script
```bash
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/content/scripts" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QA Test Script - CRUD Evidence",
    "content": "This is a test script for CRUD evidence collection.",
    "category": "email"
  }'
```

#### Update Content Script
```bash
curl -X PUT "https://ma-saas-backend.onrender.com/api/master-admin/content/scripts/<SCRIPT_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QA Test Script - Updated",
    "content": "Updated content for CRUD evidence."
  }'
```

#### Create Content Piece
```bash
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/content/pieces" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "script_id": "<SCRIPT_ID>",
    "title": "QA Test Content Piece",
    "published_at": "2025-11-22T00:00:00Z"
  }'
```

#### Update Content Piece
```bash
curl -X PUT "https://ma-saas-backend.onrender.com/api/master-admin/content/pieces/<PIECE_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "QA Test Content Piece - Updated"
  }'
```

#### Delete Content Piece
```bash
curl -X DELETE "https://ma-saas-backend.onrender.com/api/master-admin/content/pieces/<PIECE_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

#### Delete Content Script
```bash
curl -X DELETE "https://ma-saas-backend.onrender.com/api/master-admin/content/scripts/<SCRIPT_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

### Collateral Operations

#### List Collateral
```bash
curl -X GET "https://ma-saas-backend.onrender.com/api/master-admin/collateral?page=1&per_page=10" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

**Note**: Upload/download operations require file handling and manual verification.

---

## Execution Status

- ✅ CRUD examples documented (2025-11-22)
- ⏳ Script execution pending Clerk sign-in token generation
- ⏳ Evidence collection pending script execution
- ⏳ Final curl examples will be updated with actual JWT fingerprints after execution

**See**: `crud-evidence/EXECUTION_GUIDE.md` for detailed execution instructions.


