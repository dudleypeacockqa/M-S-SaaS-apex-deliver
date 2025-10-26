# Render Backend Environment Variable Updates

**Action Required**: Copy these exact values to your Render Backend Service Environment

**Go to**: Render Dashboard → Backend Service → Environment Tab

---

## 🔑 Critical Updates Required

### Add These Variables to Render Backend:

```bash
# ============================================================================
# CLERK AUTHENTICATION (Updated with Production Keys)
# ============================================================================
# NOTE: Get these values from your local .env file (lines 35-37)
CLERK_PUBLISHABLE_KEY=pk_live_[GET_FROM_YOUR_LOCAL_ENV_FILE]
CLERK_SECRET_KEY=sk_live_[GET_FROM_YOUR_LOCAL_ENV_FILE]
CLERK_WEBHOOK_SECRET=[GET_FROM_YOUR_LOCAL_ENV_FILE]

# ============================================================================
# AI SERVICES (OpenAI for Financial Narratives - DEV-010)
# ============================================================================
# NOTE: Get these values from your local .env file (lines 51-52)
OPENAI_API_KEY=sk-proj-[GET_FROM_YOUR_LOCAL_ENV_FILE]
ANTHROPIC_API_KEY=sk-ant-[GET_FROM_YOUR_LOCAL_ENV_FILE]

# ============================================================================
# CORS ORIGINS (Updated - Removed apexdeliver.com)
# ============================================================================
CORS_ORIGINS=https://100daysandbeyond.com,https://www.100daysandbeyond.com
```

---

## ❌ Variables to DELETE from Render Backend:

```bash
ALLOWED_ORIGINS   # Duplicate of CORS_ORIGINS - delete this
```

---

## ✅ Variables Already Correct (No Changes Needed):

```bash
# Database
DATABASE_URL=postgresql://ma_saas_user:iJtvWyv5q5CcIUlBZD7IaYyHAvGk5M1t@dpg-d3ii7jjipnbc73e7chfg-a/ma_saas_platform

# Stripe (from your .env file lines 45-46)
STRIPE_SECRET_KEY=[GET_FROM_YOUR_ENV_FILE_LINE_45]
STRIPE_WEBHOOK_SECRET=[GET_FROM_YOUR_ENV_FILE_LINE_46]

# Stripe Product IDs (from your Stripe dashboard)
STRIPE_STARTER_PRODUCT_ID=prod_RmqJQaXzkfAkKC
STRIPE_PROFESSIONAL_PRODUCT_ID=prod_RmqL4BCCYMQDlV
STRIPE_ENTERPRISE_PRODUCT_ID=prod_RmqMlWtlBN0dFo
STRIPE_COMMUNITY_PRODUCT_ID=prod_RmqNMlscACdDZl

# R2 Storage
R2_ACCESS_KEY_ID=fc23212e9240e3fdb61f90bde1c3844f
R2_SECRET_ACCESS_KEY=c0ccf727fd530d84c56f82a9433fb619f56099897b9eb73760dae9ddcd05872c
R2_ENDPOINT_URL=https://8424f73b33106452fa180d53b6cc128b.r2.cloudflarestorage.com
R2_BUCKET_NAME=ma-saas-documents
R2_REGION=auto

# Application Settings
PYTHON_ENV=production
DEBUG=false
LOG_SQL_QUERIES=false
SHOW_ERROR_DETAILS=false

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_DEAL_MATCHING=true
```

---

## 📋 Step-by-Step Instructions:

### Step 1: Update Clerk Keys (CRITICAL)
**Get the actual values from your local .env file (lines 35-37)**

1. Find `CLERK_PUBLISHABLE_KEY` in Render Backend environment
2. Change from `pk_test_placeholder` to the value in your .env file (starts with `pk_live_`)
3. Find `CLERK_SECRET_KEY` in Render Backend environment
4. Change from `sk_test_placeholder` to the value in your .env file (starts with `sk_live_`)
5. Find `CLERK_WEBHOOK_SECRET` in Render Backend environment
6. Change from `whsec_placeholder` to the value in your .env file

### Step 2: Add AI API Keys (Required for DEV-010 & Future Features)
**Get the actual values from your local .env file (lines 51-52)**

1. Scroll to AI SERVICES section or create new variables
2. Add `OPENAI_API_KEY` - Copy from your .env file (line 51, starts with `sk-proj-`)
3. Add `ANTHROPIC_API_KEY` - Copy from your .env file (line 52, starts with `sk-ant-`)

### Step 3: Fix CORS Origins
1. Find `CORS_ORIGINS` in Render Backend environment
2. Change to (remove apexdeliver.com):
   ```
   https://100daysandbeyond.com,https://www.100daysandbeyond.com
   ```

### Step 4: Delete Duplicate Variable
1. Find `ALLOWED_ORIGINS` in Render Backend environment
2. Click the trash icon to delete it

### Step 5: Save and Deploy
1. Click **"Save Changes"** at the bottom
2. Wait for automatic redeployment (3-5 minutes)
3. Monitor deployment in **Logs** tab

---

## 🔍 Verification After Deployment:

### Check Backend Logs:
```
✅ Expected: "Application startup complete"
✅ Expected: "Uvicorn running on http://0.0.0.0:10000"
❌ Error: "CLERK_SECRET_KEY not found" → Verify you saved changes
❌ Error: "Invalid Clerk key format" → Double-check key format
```

### Test API Endpoint:
Visit: `https://ma-saas-backend.onrender.com/api/docs`

**Expected**: API documentation loads successfully

### Test Clerk Webhook:
1. Make a test change in Clerk Dashboard (e.g., update a user profile)
2. Check Render backend logs for webhook event
3. Should see: "Received Clerk webhook: user.updated"

---

## 🚨 What These Changes Fix:

### Before (BROKEN):
- ❌ Clerk authentication completely broken (placeholder keys)
- ❌ Users cannot sign up or sign in
- ❌ AI financial narratives not working (no OpenAI key)
- ❌ CORS errors from apexdeliver.com domain

### After (WORKING):
- ✅ Clerk authentication fully functional
- ✅ Users can sign up and sign in
- ✅ AI financial narratives work (DEV-010 feature)
- ✅ Only 100daysandbeyond.com domain allowed (correct)

---

## 📊 Environment Variables Summary:

| Category | Total Variables | Status |
|----------|----------------|--------|
| Clerk Auth | 3 | 🔄 Need Update |
| AI Services | 2 | 🔄 Need to Add |
| CORS | 1 | 🔄 Need Update |
| Stripe | 7 | ✅ Already Correct |
| Database | 1 | ✅ Already Correct |
| R2 Storage | 5 | ✅ Already Correct |
| App Settings | 4 | ✅ Already Correct |
| Feature Flags | 2 | ✅ Already Correct |

**Total changes needed**: 7 updates/additions + 1 deletion

---

## ⏱️ Estimated Time:

- **Update variables**: 5 minutes
- **Deployment**: 3-5 minutes
- **Verification**: 2 minutes
- **Total**: ~10-12 minutes

---

## 🆘 Troubleshooting:

### Issue: Backend deployment fails after saving
**Solution**: Check Logs tab for specific error messages

### Issue: "Invalid Clerk key" error in logs
**Solution**: Verify keys were copied exactly (no extra spaces/newlines)

### Issue: CORS errors still occurring
**Solution**: Verify `ALLOWED_ORIGINS` was deleted and `CORS_ORIGINS` only has 100daysandbeyond.com

### Issue: OpenAI API errors
**Solution**:
1. Verify key was copied exactly
2. Check OpenAI billing: https://platform.openai.com/account/billing
3. Ensure you have credit/payment method on file

---

**Document Version**: 1.0
**Last Updated**: 2025-10-26
**Next Step**: Update Render Frontend environment (see PRODUCTION-DEPLOYMENT-CHECKLIST.md)
