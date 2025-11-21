# API Header & Tenant Reference (Master Admin QA)

Use these snippets to verify requests during manual testing.

```bash
# Replace <TOKEN> with Clerk JWT from the QA master_admin user
curl -X GET "https://ma-saas-backend.onrender.com/api/master-admin/prospects" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "X-Master-Tenant-Id: qa-dge-tenant"
```

Record additional tenants or scoped IDs below as they are created:

| Tenant Name | ID | Notes |
| --- | --- | --- |
| Digital Growth Equity QA | qa-dge-tenant | Default seed org |
|  |  |  |
