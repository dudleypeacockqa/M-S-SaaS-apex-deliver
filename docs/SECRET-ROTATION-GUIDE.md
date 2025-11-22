# Secret Rotation Guide

**Date**: 2025-11-22  
**Status**: ⚠️ CRITICAL - Immediate Action Required  
**Priority**: P0 - Security Critical

---

## Overview

All exposed secrets have been removed from git history via BFG Repo-Cleaner. However, **all exposed secrets MUST be rotated immediately** as they were visible in git history and may have been compromised.

## Exposed Secrets

The following secrets were exposed in git history and must be rotated:

1. **Clerk Secret Key**: `sk_live_[REDACTED - Check git history or Render Dashboard]`
2. **Stripe Restricted Key**: `rk_live_[REDACTED - Check git history or Render Dashboard]`
3. **OpenAI API Key**: `sk-proj-[REDACTED - Check git history or Render Dashboard]`
4. **Anthropic API Key**: `sk-ant-api03-[REDACTED - Check git history or Render Dashboard]`
5. **SendGrid API Key**: `SG.[REDACTED - Check git history or Render Dashboard]`

**Note**: The actual secret values can be found in:
- Render Dashboard environment variables (current values)
- Git history before BFG cleanup (if needed for reference)
- Original commit messages (if accessible)

---

## Rotation Steps

### 1. Clerk Secret Key Rotation

**Service**: Clerk Authentication  
**Dashboard**: https://dashboard.clerk.com/

1. Log into Clerk Dashboard
2. Navigate to **API Keys** section
3. Find the secret key (starts with `sk_live_` - check Render Dashboard for current value)
4. Click **Revoke** or **Regenerate**
5. Copy the new secret key
6. Update the following:
   - Render Dashboard → `ma-saas-backend` → Environment → `CLERK_SECRET_KEY`
   - Local `.env-backend.md` (gitignored)
   - `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

**⚠️ Important**: After rotation, the old key will stop working immediately. Ensure Render dashboard is updated before revoking.

---

### 2. Stripe Secret Keys Rotation

**Service**: Stripe Payment Processing  
**Dashboard**: https://dashboard.stripe.com/

#### 2.1. Stripe Restricted Key

1. Log into Stripe Dashboard
2. Navigate to **Developers** → **API keys**
3. Find the restricted key (starts with `rk_live_` - check Render Dashboard for current value)
4. Click **Revoke** or create a new restricted key with same permissions
5. Copy the new restricted key
6. Update Render Dashboard → `ma-saas-backend` → Environment → `STRIPE_RESTRICTED_KEY` (if used)

#### 2.2. Stripe Secret Key

1. In Stripe Dashboard → **Developers** → **API keys**
2. Find the secret key (starts with `sk_live_`)
3. Click **Reveal test key** or **Create new key**
4. Copy the new secret key
5. Update:
   - Render Dashboard → `ma-saas-backend` → Environment → `STRIPE_SECRET_KEY`
   - Local `.env-backend.md` (gitignored)
   - `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

**⚠️ Important**: Stripe webhooks may need to be updated if webhook signing secret changes.

---

### 3. OpenAI API Key Rotation

**Service**: OpenAI  
**Dashboard**: https://platform.openai.com/api-keys

1. Log into OpenAI Platform
2. Navigate to **API keys** section
3. Find the API key (starts with `sk-proj-` - check Render Dashboard for current value)
4. Click **Revoke** or **Delete**
5. Click **Create new secret key**
6. Copy the new API key
7. Update:
   - Render Dashboard → `ma-saas-backend` → Environment → `OPENAI_API_KEY`
   - Local `.env-backend.md` (gitignored)
   - `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

---

### 4. Anthropic API Key Rotation

**Service**: Anthropic Claude  
**Dashboard**: https://console.anthropic.com/settings/keys

1. Log into Anthropic Console
2. Navigate to **API Keys** section
3. Find the API key (starts with `sk-ant-api03-` - check Render Dashboard for current value)
4. Click **Delete** or **Revoke**
5. Click **Create Key**
6. Copy the new API key
7. Update:
   - Render Dashboard → `ma-saas-backend` → Environment → `ANTHROPIC_API_KEY`
   - Local `.env-backend.md` (gitignored)
   - `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

---

### 5. SendGrid API Key Rotation

**Service**: SendGrid Email  
**Dashboard**: https://app.sendgrid.com/settings/api_keys

1. Log into SendGrid Dashboard
2. Navigate to **Settings** → **API Keys**
3. Find the API key (starts with `SG.` - check Render Dashboard for current value)
4. Click **Delete** or **Revoke**
5. Click **Create API Key**
6. Select appropriate permissions (Full Access or Restricted Access)
7. Copy the new API key
8. Update:
   - Render Dashboard → `ma-saas-backend` → Environment → `SENDGRID_API_KEY`
   - Local `.env-backend.md` (gitignored)
   - `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)

---

## Post-Rotation Checklist

After rotating all secrets, verify:

- [ ] All new keys are saved in Render Dashboard
- [ ] All new keys are saved in local `.env-backend.md` (gitignored)
- [ ] All new keys are saved in `docs/secrets/FinanceFlo Environment Variables - Master Reference.md` (gitignored)
- [ ] Backend service restarted on Render (if needed)
- [ ] Test authentication (Clerk)
- [ ] Test payment processing (Stripe)
- [ ] Test AI features (OpenAI, Anthropic)
- [ ] Test email sending (SendGrid)
- [ ] Old keys are revoked/deleted in all services
- [ ] Team members notified of key rotation

---

## Render Dashboard Update

**Service**: `ma-saas-backend`  
**URL**: https://dashboard.render.com/

1. Navigate to **ma-saas-backend** service
2. Go to **Environment** tab
3. Update the following environment variables:
   - `CLERK_SECRET_KEY` → New Clerk secret key
   - `STRIPE_SECRET_KEY` → New Stripe secret key
   - `STRIPE_RESTRICTED_KEY` → New Stripe restricted key (if used)
   - `OPENAI_API_KEY` → New OpenAI API key
   - `ANTHROPIC_API_KEY` → New Anthropic API key
   - `SENDGRID_API_KEY` → New SendGrid API key
4. Click **Save Changes**
5. Service will automatically restart with new keys

---

## Verification Steps

After rotation, verify each service:

### Clerk Verification
```bash
# Test Clerk authentication
curl -X GET "https://api.clerk.com/v1/users" \
  -H "Authorization: Bearer <NEW_CLERK_SECRET_KEY>"
```

### Stripe Verification
```bash
# Test Stripe API
curl https://api.stripe.com/v1/charges \
  -u <NEW_STRIPE_SECRET_KEY>:
```

### OpenAI Verification
```bash
# Test OpenAI API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer <NEW_OPENAI_API_KEY>"
```

### Anthropic Verification
```bash
# Test Anthropic API
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: <NEW_ANTHROPIC_API_KEY>" \
  -H "anthropic-version: 2023-06-01"
```

### SendGrid Verification
```bash
# Test SendGrid API
curl -X GET "https://api.sendgrid.com/v3/user/profile" \
  -H "Authorization: Bearer <NEW_SENDGRID_API_KEY>"
```

---

## Timeline

**Recommended Rotation Order**:
1. **Immediate** (within 1 hour): Clerk, Stripe (critical for production)
2. **Within 24 hours**: OpenAI, Anthropic (AI features)
3. **Within 48 hours**: SendGrid (email delivery)

**Total Estimated Time**: 30-60 minutes

---

## Important Notes

- ⚠️ **Do NOT revoke old keys until new keys are deployed** to avoid service interruption
- ⚠️ **Test each service** after rotation to ensure functionality
- ⚠️ **Coordinate with team** if multiple people need access
- ⚠️ **Keep old keys** in secure storage until verification is complete
- ⚠️ **Update all environments** (production, staging, development)

---

## Support Contacts

If you encounter issues during rotation:

- **Clerk Support**: https://clerk.com/support
- **Stripe Support**: https://support.stripe.com/
- **OpenAI Support**: https://help.openai.com/
- **Anthropic Support**: https://support.anthropic.com/
- **SendGrid Support**: https://support.sendgrid.com/

---

**Last Updated**: 2025-11-22  
**Status**: Ready for execution  
**Next Action**: Begin secret rotation process

