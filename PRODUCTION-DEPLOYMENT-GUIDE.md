# Production Deployment Guide - ApexDeliver.com

**Last Updated**: 2025-10-26
**Status**: URGENT - Clerk Authentication Failing
**Issue**: Domain mismatch causing authentication errors on production site

---

## 🚨 Current Production Issues

### Critical Error
```
Clerk: Production Keys are only allowed for domain "100daysandbeyond.com"
API Error: The Request HTTP Origin header must be equal to or a subdomain of the requesting URL.
```

**Impact**: Users cannot sign in or sign up on https://apexdeliver.com

**Root Cause**: Clerk production keys are configured for `100daysandbeyond.com` but the site is deployed to `apexdeliver.com`

---

## 📋 Prerequisites

Before starting, ensure you have access to:

- [ ] Render Dashboard (https://dashboard.render.com)
- [ ] Clerk Dashboard (https://dashboard.clerk.com)
- [ ] Stripe Dashboard (https://dashboard.stripe.com) - for production keys
- [ ] OpenAI Platform (https://platform.openai.com) - for AI features

---

## 🔧 Step-by-Step Fix Guide

### STEP 1: Fix Clerk Domain Configuration (5 minutes)

**1.1 Access Clerk Dashboard**
1. Go to https://dashboard.clerk.com
2. Log in with your account
3. Select your application (should show `100daysandbeyond.com` currently)

**1.2 Add ApexDeliver Domain**
1. Navigate to **Settings** → **Domains**
2. Click **"Add Domain"** or **"Configure Domains"**
3. Add the following domains:
   - `apexdeliver.com` (primary)
   - `www.apexdeliver.com` (if using www)
4. Keep `100daysandbeyond.com` if you want both domains to work
5. Click **Save Changes**

**1.3 Verify Domain Addition**
- Wait 5-10 minutes for DNS propagation
- Check that both domains appear in the allowed domains list
- Ensure "Production" environment is selected (not Development)

**Expected Result**: Clerk should now accept authentication requests from apexdeliver.com

---

### STEP 2: Configure Render Environment Variables (15 minutes)

#### 2.1 Find Your Render Service Names

1. Go to https://dashboard.render.com
2. Navigate to your Dashboard
3. Locate your two services:
   - **Frontend Service** (Static Site or Web Service)
   - **Backend Service** (Web Service - FastAPI)

**Write down the service URLs**:
- Frontend: `https://__________________.onrender.com`
- Backend: `https://__________________.onrender.com`

#### 2.2 Configure Frontend Service

1. In Render Dashboard, click on your **Frontend Service**
2. Go to **Environment** tab
3. Add/update the following environment variables:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_[YOUR_CLERK_PUBLISHABLE_KEY_FROM_ENV_FILE]

# Backend API URL (REPLACE WITH YOUR BACKEND URL)
VITE_API_URL=https://[YOUR-BACKEND-SERVICE].onrender.com

# Stripe Publishable Key (REPLACE WITH PRODUCTION KEY)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[GET_FROM_STRIPE_DASHBOARD]

# Production Mode
NODE_ENV=production
```

**Action Required**:
- Replace `[YOUR-BACKEND-SERVICE]` with actual backend URL from Step 2.1
- Replace `[GET_FROM_STRIPE_DASHBOARD]` with your Stripe production publishable key

4. Click **Save Changes**
5. Render will automatically trigger a new deployment

#### 2.3 Configure Backend Service

1. In Render Dashboard, click on your **Backend Service**
2. Go to **Environment** tab
3. Add/update the following environment variables:

```bash
# Clerk Authentication
CLERK_SECRET_KEY=sk_live_[YOUR_CLERK_SECRET_KEY_FROM_ENV_FILE]
CLERK_WEBHOOK_SECRET=[GET_FROM_CLERK_DASHBOARD]

# Database (Use INTERNAL Render URL - already configured)
DATABASE_URL=[YOUR_DATABASE_URL_FROM_ENV_FILE]

# CORS Origins (Allow apexdeliver.com)
CORS_ORIGINS=https://apexdeliver.com,https://www.apexdeliver.com,https://100daysandbeyond.com

# Stripe (REPLACE WITH PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_[GET_FROM_STRIPE_DASHBOARD]
STRIPE_WEBHOOK_SECRET=whsec_[GET_FROM_STRIPE_DASHBOARD]

# OpenAI (REQUIRED for DEV-010 AI Narratives)
OPENAI_API_KEY=sk-proj-[GET_FROM_OPENAI_PLATFORM]

# Security Keys (GENERATE THESE - see instructions below)
JWT_SECRET=[GENERATE_RANDOM_32_CHARS]
SESSION_SECRET=[GENERATE_RANDOM_32_CHARS]
ENCRYPTION_KEY=[GENERATE_RANDOM_32_CHARS]

# Application Mode
PYTHON_ENV=production
DEBUG=false
LOG_SQL_QUERIES=false
SHOW_ERROR_DETAILS=false

# Redis (if you have Redis on Render)
# REDIS_URL=redis://[YOUR_REDIS_URL]:6379

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_DEAL_MATCHING=true
ENABLE_PODCAST_STUDIO=false
ENABLE_EVENT_MANAGEMENT=false
ENABLE_COMMUNITY_PLATFORM=false
```

**Action Required**:
- Get Clerk webhook secret from Clerk Dashboard → Webhooks
- Get Stripe production keys from https://dashboard.stripe.com/apikeys
- Get OpenAI API key from https://platform.openai.com/api-keys
- Generate secure random keys (see Step 3)

4. Click **Save Changes**
5. Render will automatically trigger a new deployment

---

### STEP 3: Generate Secure Random Keys (2 minutes)

**On Mac/Linux**:
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -base64 32
```

**On Windows (PowerShell)**:
```powershell
# Generate random 32-character strings
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Or use online tool** (secure):
https://generate-secret.vercel.app/32

Copy each generated string and paste into Render environment variables.

---

### STEP 4: Get Production API Keys

#### 4.1 Stripe Production Keys

1. Go to https://dashboard.stripe.com
2. Toggle from "Test mode" to "Live mode" (top right)
3. Navigate to **Developers** → **API Keys**
4. Copy:
   - **Publishable key**: Starts with `pk_live_`
   - **Secret key**: Click "Reveal" and copy (starts with `sk_live_`)
5. For webhook secret:
   - Go to **Developers** → **Webhooks**
   - Click on your webhook endpoint
   - Click "Reveal" on signing secret (starts with `whsec_`)

#### 4.2 OpenAI API Key

1. Go to https://platform.openai.com
2. Log in with your account
3. Navigate to **API Keys** (left sidebar)
4. Click **"Create new secret key"**
5. Name it "ApexDeliver Production"
6. Copy the key (starts with `sk-proj-` or `sk-`)
7. **IMPORTANT**: Save this key immediately - you can't view it again!

#### 4.3 Clerk Webhook Secret

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Webhooks** (left sidebar)
4. Click **"Add Endpoint"** or select existing endpoint
5. Enter your backend webhook URL:
   ```
   https://[YOUR-BACKEND-SERVICE].onrender.com/api/webhooks/clerk
   ```
6. Select events to listen for:
   - `user.created`
   - `user.updated`
   - `organization.created`
   - `organization.updated`
7. Copy the **Signing Secret** (starts with `whsec_`)

---

### STEP 5: Monitor Deployment (10-15 minutes)

#### 5.1 Watch Render Deployments

1. In Render Dashboard, go to your Frontend service
2. Click on the **Logs** tab
3. Watch for deployment progress
4. Look for:
   - ✅ `Build completed successfully`
   - ✅ `Deployment live`
5. Repeat for Backend service

#### 5.2 Check for Errors

**Common deployment errors**:
- ❌ `Missing required environment variable` → Add the missing variable
- ❌ `Database connection failed` → Check DATABASE_URL format
- ❌ `Port already in use` → Render will auto-assign port
- ❌ `Build failed` → Check build logs for TypeScript/Python errors

---

### STEP 6: Verify Production Site (5 minutes)

#### 6.1 Test Clerk Authentication

1. Open https://apexdeliver.com in **Incognito/Private** browser window
2. Open browser console (F12 → Console tab)
3. Click **"Sign In"** or **"Get Started"**
4. **Expected behavior**:
   - ✅ Clerk modal opens
   - ✅ No console errors
   - ✅ No "domain not allowed" errors
5. Try signing up with a test email
6. Verify email confirmation works

#### 6.2 Test Backend Connectivity

1. Still in browser console, go to **Network** tab
2. Filter by "Fetch/XHR"
3. Navigate through the site (e.g., click "Features", "Pricing")
4. **Expected behavior**:
   - ✅ API calls go to correct backend URL
   - ✅ Status codes are 200, 201, or 401 (not 500, 404)
   - ✅ No CORS errors in console

#### 6.3 Test Core Features

1. **Authentication Flow**:
   - [ ] Sign up works
   - [ ] Email verification works
   - [ ] Sign in works
   - [ ] Dashboard loads after sign in

2. **Billing Dashboard**:
   - [ ] Navigate to /dashboard/billing
   - [ ] Page loads without errors
   - [ ] Subscription tier displays correctly
   - [ ] "Change Tier" button works

3. **Deal Management** (if accessible):
   - [ ] Navigate to /dashboard/deals
   - [ ] Can create a new deal
   - [ ] Deal appears in list

---

## 🐛 Troubleshooting

### Issue: Clerk Still Shows "Domain Not Allowed"

**Solution**:
1. Double-check domain was added in Clerk Dashboard
2. Wait 15-20 minutes for DNS propagation
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in Incognito/Private window
5. Check that you're in "Production" mode in Clerk (not Development)

### Issue: "Failed to fetch" or CORS Errors

**Solution**:
1. Verify `VITE_API_URL` is set correctly in Frontend environment
2. Verify `CORS_ORIGINS` includes `apexdeliver.com` in Backend environment
3. Ensure both services have finished deploying
4. Check that backend is accessible: Visit `https://[backend-url]/docs`

### Issue: "Database connection failed"

**Solution**:
1. Use **INTERNAL** Render database URL for backend (without `.com`)
2. Format: `postgresql://user:pass@dpg-xxxxx-a/database_name`
3. NOT: `postgresql://user:pass@dpg-xxxxx-a.frankfurt-postgres.render.com/database_name`

### Issue: Stripe Webhook Errors

**Solution**:
1. Verify webhook URL in Stripe Dashboard matches backend URL
2. Ensure `STRIPE_WEBHOOK_SECRET` matches signing secret from Stripe
3. Check webhook endpoint is `/api/webhooks/stripe` (note the `/api` prefix)

### Issue: OpenAI API Errors (DEV-010)

**Solution**:
1. Verify `OPENAI_API_KEY` is set and valid
2. Check OpenAI billing: https://platform.openai.com/account/billing
3. Ensure you have credit/payment method on file
4. Test key works: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

---

## 📊 Post-Deployment Checklist

Once deployment is successful, complete this checklist:

### Production Readiness

- [ ] Clerk authentication works on apexdeliver.com
- [ ] Frontend connects to backend API without CORS errors
- [ ] Users can sign up and receive verification emails
- [ ] Users can sign in and access dashboard
- [ ] Billing dashboard loads and displays subscription
- [ ] Stripe integration works (test with Stripe test cards first)
- [ ] Database connections are stable (no timeout errors)
- [ ] AI features work (DEV-010 financial narratives)
- [ ] Error tracking is configured (Sentry/Datadog if using)
- [ ] SSL certificate is valid (https works)

### Security Checklist

- [ ] All production API keys are set (no `test_` or `your_key_here`)
- [ ] JWT_SECRET, SESSION_SECRET, ENCRYPTION_KEY are random 32+ chars
- [ ] `.env.production` is NOT committed to Git (check .gitignore)
- [ ] Database uses strong password (not default)
- [ ] Clerk webhooks use signing secret verification
- [ ] Stripe webhooks use signing secret verification
- [ ] DEBUG mode is disabled in production
- [ ] SQL query logging is disabled in production

### Performance Checklist

- [ ] Frontend build size is reasonable (<2MB initial bundle)
- [ ] Page load time <3 seconds on 3G connection
- [ ] Backend API response time <500ms for simple requests
- [ ] Database connection pool is configured
- [ ] Redis is connected (if using for caching)
- [ ] CDN is configured for static assets (Render handles this)

---

## 📝 Environment Variable Summary

### Required Environment Variables

**Frontend (Render Static Site)**:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_[YOUR_CLERK_KEY_FROM_ENV_FILE]
VITE_API_URL=https://[backend].onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[STRIPE_KEY]
NODE_ENV=production
```

**Backend (Render Web Service)**:
```bash
# Authentication
CLERK_SECRET_KEY=sk_live_[CLERK_KEY]
CLERK_WEBHOOK_SECRET=whsec_[CLERK_WEBHOOK]

# Database
DATABASE_URL=postgresql://[RENDER_INTERNAL_URL]

# CORS
CORS_ORIGINS=https://apexdeliver.com,https://www.apexdeliver.com

# Payments
STRIPE_SECRET_KEY=sk_live_[STRIPE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[STRIPE_WEBHOOK]

# AI Services
OPENAI_API_KEY=sk-proj-[OPENAI_KEY]

# Security
JWT_SECRET=[RANDOM_32_CHARS]
SESSION_SECRET=[RANDOM_32_CHARS]
ENCRYPTION_KEY=[RANDOM_32_CHARS]

# Application
PYTHON_ENV=production
DEBUG=false
```

---

## 🆘 Need Help?

If you encounter issues not covered in this guide:

1. **Check Render Logs**:
   - Dashboard → Service → Logs tab
   - Look for specific error messages

2. **Check Browser Console**:
   - F12 → Console tab
   - Look for JavaScript errors or failed network requests

3. **Test API Directly**:
   - Visit `https://[backend-url]/docs` for API documentation
   - Try making API calls with Postman or curl

4. **Common Resources**:
   - Render Docs: https://render.com/docs
   - Clerk Docs: https://clerk.com/docs
   - Stripe Docs: https://stripe.com/docs
   - FastAPI Docs: https://fastapi.tiangolo.com

---

## 📅 Deployment History

| Date | Version | Changes | Status |
|------|---------|---------|--------|
| 2025-10-26 | 2.0 | Fixed TypeScript build errors (37 errors) | ✅ Complete |
| 2025-10-26 | 2.0 | DEV-010 Backend complete (48 ratios, AI service) | ✅ Complete |
| 2025-10-26 | 2.0 | Clerk domain mismatch fix (apexdeliver.com) | 🔄 In Progress |

---

**Document Version**: 1.0
**Last Verified**: 2025-10-26
**Next Review**: After successful production deployment

