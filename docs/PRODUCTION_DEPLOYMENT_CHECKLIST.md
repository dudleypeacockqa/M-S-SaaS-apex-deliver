# Production Deployment Checklist - M&A Intelligence Platform

**Last Updated**: October 24, 2025
**Environment**: Production (Render)
**Project**: M&A Intelligence Platform (ApexDeliver)

---

## Database Migration

### PostgreSQL Database Setup

- [x] Production PostgreSQL database created on Render
- [x] Database credentials configured in environment variables
- [x] Alembic migration applied successfully (revision: `8dcb6880a52b`)
- [x] Users table created with indexes

**Database Connection**:

```text
Host: dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com
Database: ma_saas_platform
User: ma_saas_user
```

**Migration Status**:

```bash
Current Revision: 8dcb6880a52b (head)
Applied: October 24, 2025
Status: SUCCESS
```

---

## Clerk Authentication & Subscription Configuration

### Webhook Endpoint Setup

**Production Webhook URL**:

```text
https://ma-saas-backend.onrender.com/api/webhooks/clerk
```

**Supported Events**:

1. `user.created` - Sync new user to database
2. `user.updated` - Update user information
3. `user.deleted` - Soft delete user (set is_active = false)
4. `session.created` - Update last_login_at timestamp
5. `session.ended` - Track session end

### Configuration Steps (Clerk manages auth + subscription tier sync)

1. **Log into Clerk Dashboard**:
   - Navigate to: <https://dashboard.clerk.com>
   - Select project: "100 Days and Beyond"

2. **Configure Webhook**:
   - Go to: Webhooks → Add Endpoint
   - URL: `https://ma-saas-backend.onrender.com/api/webhooks/clerk`
   - Select Events:
     - [x] user.created
     - [x] user.updated
     - [x] user.deleted
     - [x] session.created
     - [x] session.ended

3. **Get Webhook Signing Secret**:
   - Copy the webhook signing secret (starts with `whsec_`)
   - Update environment variable: `CLERK_WEBHOOK_SECRET=whsec_...`
   - This keeps backend tier claims in sync with Clerk’s subscription source of truth

4. **Verify Webhook**:
   - Send test event from Clerk Dashboard
   - Check backend logs for successful processing
   - Verify user created in database

### Environment Variables (Production)

**Required Clerk Variables** (Clerk is the identity + subscription authority):

```bash
CLERK_PUBLISHABLE_KEY=pk_live_xxxx
CLERK_SECRET_KEY=sk_live_xxxx
CLERK_WEBHOOK_SECRET=whsec_xxxx
CLERK_JWT_ALGORITHM=RS256
```

**Note**:

- Actual values are stored in Render environment configuration
- Clerk production uses RS256 for JWT verification (not HS256 in tests)
- Refer to `.env` or ApexDeliver Environment Variables Master Reference
  for actual values

---

## Render Deployment Status

### Backend Service

- **Service Name**: ma-saas-backend
- **URL**:
  <https://ma-saas-backend.onrender.com>
- **Region**: Frankfurt
- **Status**: Healthy ✓
- **Last Deploy**: October 24, 2025

**Health Check**:

```bash
curl https://ma-saas-backend.onrender.com/health

{
  "status": "healthy",
  "timestamp": "2025-10-24T12:20:38.755511",
  "clerk_configured": true,
  "database_configured": true,
  "webhook_configured": true
}
```

### Frontend Service

- **Service Name**: ma-saas-platform
- **URL**: <https://ma-saas-platform.onrender.com>
- **Region**: Frankfurt
- **Status**: Healthy ✓
- **Last Deploy**: October 24, 2025

---

## Verification Checklist

### Database Verification

- [ ] Connect to production database
- [ ] Verify users table exists
- [ ] Check indexes are created
- [ ] Test user CRUD operations

### Authentication Verification

- [ ] Frontend authentication flow working
- [ ] Backend JWT verification working
- [ ] Webhook endpoint receiving events
- [ ] User sync from Clerk to database working
- [ ] Session tracking functional

### API Endpoints Verification

- [ ] `/health` endpoint returns healthy status
- [ ] `/api/webhooks/clerk` processes events successfully
- [ ] `/api/auth/me` returns authenticated user
- [ ] Protected endpoints require valid JWT

---

## Test Results (DEV-004)

### Backend Tests

```text
Tests: 20/20 passing (100% pass rate)
Coverage: 91% (exceeds 80% target)
Test File: backend/tests/test_clerk_auth_complete.py
```

**Test Categories**:

- Webhook event handling (10 tests)
- JWT authentication (5 tests)
- Edge case handling (5 tests)

### Frontend Tests

```text
Tests: 21/21 passing (100% pass rate)
Framework: Vitest
Coverage: Frontend auth flows verified
```

---

## Post-Deployment Tasks

### Immediate (Within 24 hours)

1. [ ] Configure Clerk webhook in production dashboard
2. [ ] Test user signup flow end-to-end
3. [ ] Verify user appears in database after signup
4. [ ] Monitor webhook logs for errors
5. [ ] Test protected API endpoints

### Short-term (Within 1 week)

1. [ ] Set up monitoring alerts (Sentry, Datadog)
2. [ ] Configure rate limiting for API endpoints
3. [ ] Implement database backup strategy
4. [ ] Document API endpoints in Swagger/OpenAPI
5. [ ] Create runbook for common issues

### Long-term (Within 1 month)

1. [ ] Set up CI/CD pipeline for automated testing
2. [ ] Configure staging environment for testing
3. [ ] Implement database migration rollback procedures
4. [ ] Create disaster recovery plan
5. [ ] Set up performance monitoring

---

## Rollback Procedures

### Database Rollback

```bash
# Connect to production database
cd backend
alembic downgrade -1

# Verify rollback
alembic current
```

### Deployment Rollback

1. Navigate to Render Dashboard
2. Select service (ma-saas-backend or ma-saas-platform)
3. Go to Events tab
4. Find previous successful deployment
5. Click "Rollback to this deploy"

---

## Contact Information

- **Email**: <mailto:dudley@qamarketing.co.uk>
- **GitHub**: <https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver>

**Support Resources**:

- Clerk Support: <https://clerk.com/support>
- Render Support: <https://render.com/support>
- GitHub Issues: <https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver/issues>

---

**Document Status**: Living document, updated with each deployment
**Next Review**: October 25, 2025
