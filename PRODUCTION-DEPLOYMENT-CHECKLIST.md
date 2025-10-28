# Production Deployment Checklist - 100DaysAndBeyond.com

**Last Updated**: 2025-10-26
**Status**: Ready for Final Configuration
**Domain**: [https://100daysandbeyond.com](https://100daysandbeyond.com)

---

## ✅ Completed Tasks

### Local Development Environment

- [x] Fixed TypeScript build errors (37 errors → 0 errors)
- [x] Updated `.env` file with production Clerk keys
  (Clerk drives auth + subscription tiers)
- [x] Created `PRODUCTION-DEPLOYMENT-GUIDE.md`
  (comprehensive 400+ line guide)
- [x] Created `frontend/.env.production` template
- [x] Updated `.gitignore` to exclude `.env.production` files
- [x] Verified build succeeds locally (1.56s)

### Code Fixes

- [x] Fixed `frontend/src/services/api.ts` - Added axios client exports
- [x] Fixed `frontend/src/pages/dashboard/BillingDashboard.tsx`
  - Null safety guards
- [x] Removed invalid `billing_period` field reference
- [x] Removed unused `Subscription` import

---

## 🚨 CRITICAL: Remaining Actions Required

### STEP 1: Update Render Frontend Environment Variables (5 minutes)

**Go to**: Render Dashboard → Frontend Service → Environment

#### Variables to Update

> Get the actual value from your local `.env` file (line 35). It should start
> with `pk_live_`.

```text
VITE_CLERK_PUBLISHABLE_KEY=[GET_FROM_YOUR_LOCAL_ENV_FILE]
```

> Current wrong value: `pk_test_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k`

#### Variables to Delete (Security Risk)

- ❌ `CLERK_SECRET_KEY` (backend only)
- ❌ `STRIPE_SECRET_KEY` (backend only)
- ❌ `CORS_ORIGINS` (backend only)
- ❌ `STRIPE_PUBLISHABLE_KEY` (old duplicate)

#### Final Frontend Environment Example

> Get `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY` from your
> local `.env` file.

```text
VITE_CLERK_PUBLISHABLE_KEY=[GET_FROM_YOUR_ENV_FILE]
VITE_API_URL=https://ma-saas-backend.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=[GET_FROM_YOUR_ENV_FILE]
NODE_ENV=production
```

**Action**: Click "Save Changes" → Wait for automatic redeployment (~3-5 minutes)

---

### STEP 2: Update Render Backend Environment Variables (5 minutes)

**Go to**: Render Dashboard → Backend Service → Environment

#### Backend Variables to Update

> Get Clerk keys from your local `.env` file (lines 35-37).

```text
# Clerk keys
CLERK_PUBLISHABLE_KEY=[GET_FROM_YOUR_ENV_FILE_LINE_35]
CLERK_SECRET_KEY=[GET_FROM_YOUR_ENV_FILE_LINE_36]

# CORS (remove apexdeliver.com)
CORS_ORIGINS=https://100daysandbeyond.com,
https://www.100daysandbeyond.com
```

**Current wrong values**:

- `CLERK_PUBLISHABLE_KEY=pk_test_placeholder` ❌
- `CLERK_SECRET_KEY=sk_test_placeholder` ❌
- `CORS_ORIGINS=https://100daysandbeyond.com,
  https://www.100daysandbeyond.com,https://apexdeliver.com` ❌

#### Backend Variables to Delete

- ❌ `ALLOWED_ORIGINS` (duplicate of `CORS_ORIGINS`)

**Action**: Click "Save Changes" → wait for automatic redeployment (~3-5 minutes)

---

### STEP 3: Set Up Clerk Webhook (3 minutes)

**Why**: Backend needs `CLERK_WEBHOOK_SECRET` to verify webhook signatures

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** (left sidebar)
4. Click **"Add Endpoint"**
5. Enter webhook URL:

```text
   https://ma-saas-backend.onrender.com/api/webhooks/clerk
   ```

- Select events to listen for:
  - ✅ `user.created`
  - ✅ `user.updated`
  - ✅ `user.deleted`
  - ✅ `organization.created`
  - ✅ `organization.updated`
  - ✅ `organization.deleted`
  - ✅ `session.created`
  - ✅ `session.ended`
- Click **"Create"**
- Copy the **Signing Secret** (starts with `whsec_...`)
- Go back to Render Dashboard → Backend Service → Environment
- Add new variable:

```text
    CLERK_WEBHOOK_SECRET=whsec_[THE_SECRET_YOU_COPIED]
    ```

- Click "Save Changes"

---

### STEP 4: Verify Stripe Webhook (2 minutes)

**Check that webhook was created successfully**:

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Verify webhook endpoint exists:
   - **URL**: `https://ma-saas-backend.onrender.com/api/webhooks/stripe`
   - **Payload style**: Snapshot payload ✅
   - **Events**: `customer.subscription.*`, `invoice.*`, `payment_intent.*`
4. Verify signing secret matches your backend environment:
   - Click on webhook
   - Click "Reveal" on signing secret
   - Compare with `STRIPE_WEBHOOK_SECRET` in Render backend environment
   - Should start with `whsec_...`

---

## 🧪 STEP 5: Test Production Site (10 minutes)

### 5.1 Wait for Deployments to Complete

1. Go to Render Dashboard
2. Check **Frontend Service** → Logs tab
   - Wait for: "Deployment live" ✅
3. Check **Backend Service** → Logs tab
   - Wait for: "Deployment live" ✅

**Expected deployment time**: 3-5 minutes each

---

### 5.2 Test Clerk Authentication

1. Open [https://100daysandbeyond.com](https://100daysandbeyond.com) in an
   **Incognito/Private** browser window
2. Open browser console (F12 → Console tab)
3. Click **"Sign In"** or **"Get Started"**

**Expected behavior** ✅:

- Clerk modal opens
- No console errors
- No "domain not allowed" errors
- Can sign up with test email
- Email verification works
- Can sign in and access dashboard

- **If you see errors** ❌:

- Check that `VITE_CLERK_PUBLISHABLE_KEY` in frontend is `pk_live_...`
  (not `pk_test_...`).
- Check that `CLERK_SECRET_KEY` in backend is `sk_live_...`
  (not placeholder).
- Wait 15-20 minutes for DNS/Clerk propagation.
- Clear browser cache (Ctrl+Shift+Delete).

---

### 5.3 Test Backend Connectivity

1. In browser console, go to **Network** tab
2. Filter by "Fetch/XHR"
3. Navigate through the site (e.g., click "Features", "Pricing")

- **Expected**: API calls target `https://ma-saas-backend.onrender.com/api/...`,
  responses return 200/201/401 (never 500/404), and the console shows no CORS
  errors.
- **Troubleshooting**: If CORS errors appear, confirm `CORS_ORIGINS` includes
  `https://100daysandbeyond.com`, remove duplicate `ALLOWED_ORIGINS`, and verify
  the backend deployment finished successfully.

### 5.4 Test Billing Dashboard
- **Expected**: Screen loads without errors, the subscription tier renders
  correctly, the “Change Tier” button works, and no null safety warnings appear.
- **Troubleshooting**: If issues surface, check the browser console for
  specifics, ensure Stripe keys are live (`pk_live_...` / `sk_live_...`), and
  review Render backend logs for API errors.

