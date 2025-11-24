# Master Admin Headers (2025-11-21) - CRUD Evidence

## Sanitized API Headers

```http
Authorization: Bearer <JWT_TOKEN_REDACTED>
X-Master-Tenant-Id: qa-dge-tenant
Accept: application/json
Content-Type: application/json
```

## CRUD Operations Evidence

All CRUD operations were executed on 2025-11-24T14:12:06.362Z.

See `crud-evidence/crud-operations.json` for full request/response details.

### Summary
- ✅ Activity CREATE/UPDATE/DELETE
- ✅ Campaign recipient LIST/CREATE
- ✅ Content script CREATE/UPDATE/DELETE
- ✅ Content piece CREATE/UPDATE/DELETE
- ⚠️ Collateral upload/download (requires manual file verification)

## curl Examples

```bash
# Create Activity
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/activities" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Activity","type":"call","status":"completed","amount":1}'

# Update Activity
curl -X PUT "https://ma-saas-backend.onrender.com/api/master-admin/activities/<ACTIVITY_ID>" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Activity","amount":2}'

# Create Content Script
curl -X POST "https://ma-saas-backend.onrender.com/api/master-admin/content/scripts" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Script","content":"Test content","category":"email"}'
```
