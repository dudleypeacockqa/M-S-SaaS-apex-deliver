# Render Environment Variables Checklist

**Purpose**: Verify all required environment variables are set in Render for production deployment

**Last Verified**: 2025-10-28
**Services**: Backend (ma-saas-backend), Frontend (ma-saas-platform)

---

## Critical Variables (MUST BE SET) - 12 Required

### Database & Cache
- [ ] `DATABASE_URL` - PostgreSQL connection (Render auto-populated)
- [ ] `REDIS_URL` - Redis connection (Render auto-populated)

### Authentication (Clerk)
- [ ] `CLERK_SECRET_KEY` - Backend auth secret (sk_live_...)
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` - Frontend auth public key (pk_live_...)
- [ ] `CLERK_WEBHOOK_SECRET` - Webhook signature verification (whsec_...)

### Payments (Stripe)
- [ ] `STRIPE_SECRET_KEY` - Backend payment secret (sk_live_...)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Frontend payment public key (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook verification (whsec_...)

### AI Services
- [ ] `OPENAI_API_KEY` - OpenAI GPT-4 for narratives (sk-...)

### Security
- [ ] `JWT_SECRET` - Internal JWT signing (32+ chars)
- [ ] `SESSION_SECRET` - Session encryption (32+ chars)
- [ ] `CORS_ORIGINS` - Allowed origins (https://100daysandbeyond.com,https://apexdeliver.com)

---

## High Priority (Should be set) - 8 Variables

- [ ] `NODE_ENV=production` (Frontend)
- [ ] `PYTHON_ENV=production` (Backend)
- [ ] `VITE_API_URL=https://ma-saas-backend.onrender.com` (Frontend)
- [ ] `SENTRY_DSN` - Error tracking
- [ ] `SENTRY_ENVIRONMENT=production`
- [ ] `SENDGRID_API_KEY` - Email notifications
- [ ] `SENDGRID_FROM_EMAIL=noreply@apexdeliver.com`
- [ ] `ENCRYPTION_KEY` - Data encryption (32 chars)

---

## Medium Priority (Recommended) - 10 Variables

- [ ] `ANTHROPIC_API_KEY` - Claude 3 for deal matching (sk-ant-...)
- [ ] `DATADOG_API_KEY` - Metrics monitoring
- [ ] `DATADOG_APP_KEY` - Datadog application key
- [ ] `GOHIGHLEVEL_API_KEY` - CRM integration
- [ ] `GOHIGHLEVEL_LOCATION_ID`
- [ ] `ENABLE_AI_FEATURES=true`
- [ ] `ENABLE_DEAL_MATCHING=true`
- [ ] `ENABLE_PODCAST_STUDIO=false`
- [ ] `RATE_LIMIT_PER_MINUTE=60`
- [ ] `RATE_LIMIT_PER_HOUR=1000`

---

## Verification Workflow

### Backend Service (Render Dashboard)
1. Navigate to ma-saas-backend service
2. Click "Environment" tab
3. Verify each critical variable exists
4. Check values are not placeholders

### Frontend Service (Render Dashboard)
1. Navigate to ma-saas-platform service
2. Click "Environment" tab
3. Verify frontend variables:
   - VITE_CLERK_PUBLISHABLE_KEY
   - VITE_STRIPE_PUBLISHABLE_KEY
   - VITE_API_URL
   - NODE_ENV=production

### Test Configuration
```bash
# 1. Health check (verifies DB, Clerk, Redis):
curl https://ma-saas-backend.onrender.com/health

# 2. Check CORS:
curl -H "Origin: https://100daysandbeyond.com" \
     -I https://ma-saas-backend.onrender.com/api/health
```

---

## Common Issues

- **Database connection failed**: Check `DATABASE_URL` matches Render PostgreSQL
- **CORS error**: Verify `CORS_ORIGINS` includes exact frontend URL
- **Unauthorized on all API calls**: Check `CLERK_SECRET_KEY` is correct
- **Webhook verification failed**: Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard

---

**Minimum to Launch**: 12 critical + 8 high priority = **20 variables**

**Verification Completed**: [ ] Yes / [ ] No
**Date**: ___________
**Issues Found**: ___________
