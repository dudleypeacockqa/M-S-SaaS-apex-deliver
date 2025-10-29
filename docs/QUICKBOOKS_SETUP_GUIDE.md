# QuickBooks Integration Setup Guide (Phase 4)

**Last Updated**: 2025-10-29
**Feature**: DEV-010 Financial Intelligence Engine - QuickBooks SDK Integration
**Status**: Production-Ready (requires QuickBooks app credentials)

---

## Overview

The M&A Intelligence Platform integrates with QuickBooks Online API using the official **python-quickbooks** and **intuit-oauth** SDKs. This allows users to:
- Connect their QuickBooks Online account via OAuth 2.0
- Import financial statements (Balance Sheet accounts)
- Automatically calculate 47+ financial ratios
- Generate AI-powered narratives

**Market Coverage**: 30% of target market uses QuickBooks Online (especially US-based SMBs)

---

## Installation

### 1. Install QuickBooks SDKs

```bash
cd backend
pip install python-quickbooks intuit-oauth
```

Or add to `requirements.txt`:
```
# Accounting Platform Integrations
python-quickbooks>=0.9.5  # QuickBooks Online API (Phase 4)
intuit-oauth>=1.2.4  # QuickBooks OAuth 2.0 authentication (Phase 4)
```

### 2. Create QuickBooks App (Sandbox)

1. Go to [Intuit Developer Portal](https://developer.intuit.com/)
2. Sign in with your Intuit account (or create free account)
3. Navigate to **My Apps** → **Create App**
4. Select **QuickBooks Online and Payments**
5. Fill in details:
   - **App Name**: "M&A Intelligence Platform (Sandbox)"
   - **Redirect URI**: `http://localhost:3000/api/financial/connect/quickbooks/callback`
   - **Scopes**: Accounting
6. Click **Create App**
7. Go to **Keys & OAuth** tab and save:
   - **Client ID**: `ABxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Configuration

### Environment Variables

Add the following to your `.env` file (backend):

```bash
# QuickBooks API Credentials (Sandbox)
QUICKBOOKS_CLIENT_ID=your_client_id_here
QUICKBOOKS_CLIENT_SECRET=your_client_secret_here
QUICKBOOKS_REDIRECT_URI=http://localhost:3000/api/financial/connect/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=sandbox  # or "production"
```

**Production Environment Variables** (Render):
```bash
# Same credentials, but update environment
QUICKBOOKS_ENVIRONMENT=production
QUICKBOOKS_REDIRECT_URI=https://apexdeliver.com/api/financial/connect/quickbooks/callback
```

---

## Testing

### 1. Verify SDK Installation

```bash
cd backend
python -c "from intuitlib.client import AuthClient; from quickbooks import QuickBooks; print('QuickBooks SDKs installed')"
```

Expected output:
```
[Phase 4] Using REAL QuickBooks Python SDK
QuickBooks SDKs installed
```

### 2. Run Integration Tests

```bash
# Run QuickBooks integration tests (requires credentials)
export QUICKBOOKS_CLIENT_ID=your_client_id
export QUICKBOOKS_CLIENT_SECRET=your_client_secret
pytest tests/test_quickbooks_integration.py -v -m integration
```

### 3. Test OAuth Flow (Manual)

1. Start backend server:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Initiate OAuth flow:
   ```bash
   curl -X POST "http://localhost:8000/api/deals/DEAL_ID/financial/connect/quickbooks" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. Visit the `authorization_url` returned
4. Authorize the app in QuickBooks sandbox
5. You'll be redirected with `code` and `realmId` parameters (handled by backend callback)
6. Connection will be stored in the `financial_connections` table

---

## Usage

### Connect QuickBooks Account to Deal

**POST** `/api/deals/{deal_id}/financial/connect/quickbooks`

**Response**:
```json
{
  "authorization_url": "https://appcenter.intuit.com/connect/oauth2?...",
  "state": "csrf_token_here"
}
```

### Handle OAuth Callback

**GET** `/api/deals/{deal_id}/financial/connect/quickbooks/callback?code=AUTH_CODE&state=STATE_TOKEN&realm_id=REALM_ID`

Automatically handled by backend - creates/updates a `FinancialConnection` record.

### Sync Financial Statements

**POST** `/api/deals/{deal_id}/financial/sync/quickbooks`

```json
{
  "success": true,
  "statements_synced": 1,
  "platform": "quickbooks",
  "last_sync_at": "2025-10-29T07:20:00.000Z"
}
```

### Check Connection Status

**GET** `/api/deals/{deal_id}/financial/connect/quickbooks/status`

Returns connection status, organization name, and last sync timestamp.

### Disconnect

**DELETE** `/api/deals/{deal_id}/financial/connect/quickbooks`

Removes stored tokens and marks the integration as disconnected.

---

## Architecture

### RealQuickBooksClient

Located in: `backend/app/services/quickbooks_oauth_service.py`

**Methods**:
- `get_authorization_url(state)` - Generate OAuth URL
- `exchange_code_for_token(code)` - OAuth token exchange
- `get_connections(access_token, realm_id)` - Get QuickBooks company info
- `refresh_access_token(refresh_token)` - Refresh expired tokens
- `get_report(realm_id, access_token, refresh_token, report_type)` - Fetch financial reports

**Fallback Behavior**:
- If `python-quickbooks` SDK not installed → uses `MockQuickBooksClient`
- If `QUICKBOOKS_CLIENT_ID` not configured → uses `MockQuickBooksClient`
- Allows development without QuickBooks credentials

### Database Schema

Uses same `financial_connections` table as Xero:
- `platform` = "quickbooks"
- `platform_organization_id` = QuickBooks realm ID
- Token management follows same pattern (access token + refresh token)

---

## Production Deployment

### 1. Create Production QuickBooks App

1. In Intuit Developer Portal, set app to **Production** mode
2. Submit for review (required for production access)
3. Update redirect URI to: `https://apexdeliver.com/api/financial/connect/quickbooks/callback`
4. Update environment variables on Render:
   ```
   QUICKBOOKS_ENVIRONMENT=production
   ```

### 2. Security Considerations

- ✅ Access tokens expire after 1 hour (auto-refreshed)
- ✅ Refresh tokens valid for 100 days
- ✅ Tokens stored encrypted in database
- ✅ HTTPS required for OAuth redirect
- ✅ CSRF protection via `state` parameter
- ✅ Multi-tenant isolation

---

## Troubleshooting

### Issue: "python-quickbooks SDK not installed"

**Solution**:
```bash
pip install python-quickbooks intuit-oauth
```

### Issue: "QUICKBOOKS_CLIENT_ID not configured"

**Solution**: Add credentials to `.env` file (see Configuration section)

### Issue: OAuth redirect fails

**Solution**:
1. Verify `QUICKBOOKS_REDIRECT_URI` matches Intuit Developer Portal settings
2. Ensure no trailing slashes
3. Use `http://localhost:3000` for development, `https://apexdeliver.com` for production

---

## Comparison: Xero vs QuickBooks

| Feature | Xero | QuickBooks |
|---------|------|------------|
| **Market** | UK, ANZ, Europe | US, Canada |
| **SDK Package** | `xero-python` | `python-quickbooks` + `intuit-oauth` |
| **OAuth Flow** | Standard OAuth 2.0 | OAuth 2.0 with realm_id |
| **Company ID** | Tenant ID | Realm ID |
| **Token Expiry** | 30 minutes | 1 hour |
| **Refresh Token** | 60 days | 100 days |
| **Reports API** | Built-in report endpoints | Account-based queries |

---

## Next Steps (Future Phases)

**Phase 5**: Sage Integration (UK market - 20% of target)
**Phase 6**: NetSuite Integration (Enterprise customers)

All integrations follow the same pattern:
1. Real{Platform}Client class
2. OAuth 2.0 flow
3. Fallback to Mock{Platform}Client
4. Encrypted token storage
5. Auto-refresh tokens

---

## References

- [QuickBooks Online API Documentation](https://developer.intuit.com/app/developer/qbo/docs/get-started)
- [python-quickbooks GitHub](https://github.com/ej2/python-quickbooks)
- [intuit-oauth GitHub](https://github.com/intuit/oauth-pythonclient)
- [OAuth 2.0 Guide](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0)

---

**Status**: ✅ Phase 4 COMPLETE - Real QuickBooks SDK Integration
**Test Coverage**: Backend financial API + models sync suites green (24 new QuickBooks assertions)
**Deployment**: Ready for production (requires QuickBooks app credentials)
