# Security Credential Rotation Required - URGENT

**Date**: 2025-11-13
**Severity**: HIGH
**Status**: ⚠️ CREDENTIALS EXPOSED IN CONVERSATION HISTORY

---

## Exposed Credentials Requiring Immediate Rotation

### 1. Render API Key (CRITICAL)
**Exposed Value**: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
**Scope**: Full access to Render account, can trigger deployments, access services
**Risk Level**: HIGH
**Action Required**:
1. Go to Render Dashboard → Account Settings → API Keys
2. Revoke key: `rnd_oMIm1MFTqRNH8SE4fgiIiXTsNAqM`
3. Generate new API key
4. Update documentation (if stored anywhere)
5. Store new key securely (1Password, env vars, secrets manager)

### 2. Production Database Password (CRITICAL)
**Exposed Value**: `[REDACTED - was shown in conversation as "REDACTED-ROTATED-2025-11-11"]`
**Connection String**: `postgresql://ma_saas_user:<PASSWORD>@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com:5432/ma_saas_platform`
**Database**: ma_saas_platform (production)
**User**: ma_saas_user
**Host**: dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com
**Risk Level**: CRITICAL
**Action Required**:
1. Go to Render Dashboard → Database → Settings
2. Reset database password
3. Update Render backend service environment variable: `DATABASE_URL`
4. Update local `.env` files (do NOT commit to git)
5. Test connection before deployment

### 3. Test Database Password (MEDIUM PRIORITY)
**Exposed Value**: `CSgcCKzGdnh5PKok489sgcqaMH3eNsEH`
**Connection String**: `postgresql://ma_saas_user:CSgcCKzGdnh5PKok489sgcqaMH3eNsEH@dpg-d3ii7jjipnbc73e7chfg-a.frankfurt-postgres.render.com:5432/ma_saas_test`
**Database**: ma_saas_test
**Risk Level**: MEDIUM (test data, but could be used to probe schema)
**Action Required**:
1. Reset test database password (same process as production)
2. Update test environment configuration
3. Update CI/CD secrets if applicable

---

## Additional Security Concerns

### 4. GitHub Repository Access
**Status**: Public or private?
**Risk**: If public, DATABASE_URL in .env might be exposed
**Action Required**:
1. Verify `.env` is in `.gitignore`
2. Check git history for accidentally committed secrets: `git log --all --full-history -- .env`
3. If found: Rotate ALL credentials, consider repo as compromised

### 5. Clerk API Keys
**Status**: Not exposed in conversation
**Action Required**: Verify these are secure:
- `CLERK_SECRET_KEY` (backend)
- `VITE_CLERK_PUBLISHABLE_KEY` (frontend - public, safe)

### 6. Stripe API Keys
**Status**: Not exposed in conversation
**Action Required**: Verify these are secure:
- `STRIPE_SECRET_KEY` (backend)
- `STRIPE_WEBHOOK_SECRET` (backend)
- `VITE_STRIPE_PUBLISHABLE_KEY` (frontend - public, safe)

### 7. OpenAI API Key
**Status**: Not exposed in conversation
**Action Required**: Verify secure

### 8. Anthropic API Key
**Status**: Not exposed in conversation
**Action Required**: Verify secure

---

## Rotation Checklist

### Immediate (Before Database Work)
- [ ] Render API key revoked and regenerated
- [ ] Production DB password reset
- [ ] Test DB password reset
- [ ] Render backend service `DATABASE_URL` updated
- [ ] Local `.env` files updated
- [ ] Connection tested: `psql $DATABASE_URL -c "SELECT 1"`

### Post-Rotation Verification
- [ ] Backend service restarts successfully on Render
- [ ] Health check passes: `curl https://ma-saas-platform-backend.onrender.com/health`
- [ ] Local development works: `cd backend && python -m pytest tests/test_health.py`
- [ ] Documentation updated to remove any old credential references

### Security Hygiene Going Forward
- [ ] Add pre-commit hook to scan for secrets
- [ ] Use environment variable validation in CI/CD
- [ ] Implement secrets rotation policy (90 days)
- [ ] Document credential storage procedures (1Password, AWS Secrets Manager, etc.)

---

## Timeline

**Urgency**: IMMEDIATE
**Estimated Time**: 30-60 minutes
**Must Complete Before**: Database conversion work (Phase 2)

**Reason**: Cannot safely execute database conversion or deployments with compromised credentials. Attacker with these credentials could:
- Trigger malicious deployments
- Access production database
- Corrupt or exfiltrate data
- Disrupt service availability

---

## After Rotation

Update this file with:
```
## Rotation Completed

**Date**: YYYY-MM-DD HH:MM UTC
**Completed By**: [Name]
**Credentials Rotated**:
- [x] Render API key
- [x] Production DB password
- [x] Test DB password
- [x] Render service env vars updated
- [x] Local .env files updated
- [x] Connection verified

**New Credential Storage**:
- Render API key: [Location, e.g., 1Password vault]
- DB passwords: [Location, e.g., Render dashboard only]
```

---

**END OF SECURITY ALERT**
