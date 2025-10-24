# Database Security Guide - Pre-Production Checklist

**Important**: You mentioned you're not live yet and will do a full security sweep before production. This guide provides the framework for that sweep.

---

## Current Security Status

### ⚠️ Current Issues

| Issue | Severity | Status | Impact |
|-------|----------|--------|--------|
| Database open to 0.0.0.0/0 | **HIGH** | 🔴 Open | Anyone can attempt to connect |
| API keys in documentation | **MEDIUM** | 🟡 Documented | Keys visible in attachments |
| No IP restrictions | **HIGH** | 🔴 Open | No network-level protection |
| Using development keys in docs | **LOW** | 🟢 Acceptable | Pre-production phase |

### ✅ Good Security Practices Already in Place

- ✅ Strong database password (32 characters, alphanumeric)
- ✅ PostgreSQL 17 (latest version)
- ✅ SSL/TLS enabled by default on Render
- ✅ Separate database user (not root/postgres)
- ✅ Custom domains with SSL certificates
- ✅ Environment variables (not hardcoded)

---

## Two Options to Secure Database Now

### Option 1: CODEX-Guided Manual Configuration

**When to use**: You want to understand and learn the process

**Steps**:
1. Open `docs/CODEX_DATABASE_SECURITY_PROMPT.md`
2. Copy the prompt into Cursor
3. Run it with CODEX
4. Follow the generated instructions
5. Manually configure in Render dashboard

**Time**: ~15 minutes  
**Skill level**: Beginner-friendly  
**Documentation**: Excellent (CODEX explains everything)

---

### Option 2: Automated Python Script (Recommended)

**When to use**: You want fast, automated configuration

**Steps**:

1. **Install requirements** (if not already installed):
   ```bash
   pip install requests
   ```

2. **Run the script**:
   ```bash
   cd C:\Projects\ma-saas-platform
   python scripts/secure_render_database.py
   ```

3. **What it does**:
   - Detects your current public IP
   - Configures IP restrictions via Render API
   - Adds your IP + Render internal network
   - Provides verification steps

4. **Review and confirm**:
   - Script shows what it will change
   - Asks for confirmation before applying
   - Provides rollback instructions

**Time**: ~5 minutes  
**Skill level**: Intermediate  
**Automation**: Full

---

## What Happens When You Secure the Database

### Before (Current State)

```
Internet (0.0.0.0/0)
    ↓
[ma-saas-db]
    ↑
Anyone can attempt connection
(protected only by password)
```

### After (Secured State)

```
Your IP (xxx.xxx.xxx.xxx/32) ────→ [ma-saas-db] ←──── Render Internal Network
                                        ↑
                              Only allowed IPs can connect
                              (network + password protection)
```

---

## Pre-Production Security Checklist

Use this checklist before going live:

### Database Security

- [ ] Remove 0.0.0.0/0 IP rule
- [ ] Add specific IP allowlist (office, VPN, etc.)
- [ ] Enable Render private networking for backend
- [ ] Rotate database password
- [ ] Enable automated backups
- [ ] Test backup restoration
- [ ] Set up monitoring/alerts
- [ ] Document all IP addresses in allowlist

### API Keys & Secrets

- [ ] Rotate all API keys before launch
- [ ] Remove API keys from documentation
- [ ] Use environment variables only
- [ ] Enable secret scanning in GitHub
- [ ] Set up key rotation schedule
- [ ] Document which keys are in use where

### Authentication (Clerk)

- [ ] Move from test keys to production keys
- [ ] Configure webhook endpoints
- [ ] Set up webhook signature verification
- [ ] Enable MFA for admin accounts
- [ ] Configure session timeouts
- [ ] Set up user role permissions

### Payment Processing (Stripe)

- [ ] Move from test keys to live keys
- [ ] Configure webhook endpoints
- [ ] Enable webhook signature verification
- [ ] Set up fraud detection
- [ ] Configure payment failure handling
- [ ] Test refund workflows

### Application Security

- [ ] Enable CORS with specific origins only
- [ ] Set secure HTTP headers (CSP, HSTS, etc.)
- [ ] Enable rate limiting
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Configure input validation
- [ ] Enable SQL injection protection
- [ ] Set up XSS protection

### Infrastructure

- [ ] Enable auto-scaling if needed
- [ ] Set up health checks
- [ ] Configure log aggregation
- [ ] Enable error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure alerting (PagerDuty, email)
- [ ] Document disaster recovery plan

### Compliance & Legal

- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Configure GDPR compliance (if EU users)
- [ ] Set up data retention policies
- [ ] Configure data export functionality
- [ ] Add cookie consent (if needed)

---

## Recommended Security Timeline

### Now (Pre-Production)

Focus on:
1. ✅ Secure database IP restrictions (this guide)
2. ✅ Use development/test API keys (you're doing this)
3. ✅ Test all security features
4. ✅ Document security architecture

**Don't worry about**:
- Rotating keys (do this right before launch)
- Production monitoring (set up at launch)
- Advanced DDoS protection (add when traffic grows)

### 1 Week Before Launch

1. Rotate all API keys to production keys
2. Remove all keys from documentation
3. Enable production monitoring
4. Set up alerting
5. Test disaster recovery
6. Review security checklist

### At Launch

1. Enable all security features
2. Monitor closely for 48 hours
3. Have rollback plan ready
4. Keep emergency contacts available

### Post-Launch (Ongoing)

1. Weekly security reviews
2. Monthly key rotation
3. Quarterly penetration testing
4. Annual security audit

---

## Your Current Decision

You said:
> "I will not change any API keys yet so please do not for the roll into new APIs and secrets - we are not live yet and we will do a full security sweep before we go live on production"

**This is the correct approach!** ✅

For now, focus on:
1. Securing database IP restrictions (use Option 2 script)
2. Testing all features with development keys
3. Building out the application
4. Documenting security requirements

Before launch:
1. Run the full pre-production checklist
2. Rotate all keys to production
3. Remove keys from documentation
4. Enable all security features

---

## Immediate Action: Secure Database

**Recommended**: Run the Python script (Option 2)

```bash
cd C:\Projects\ma-saas-platform
python scripts/secure_render_database.py
```

This will:
- ✅ Detect your IP automatically
- ✅ Configure secure IP restrictions
- ✅ Keep backend access working
- ✅ Provide verification steps
- ✅ Take ~5 minutes

**Alternative**: Use CODEX prompt (Option 1) if you prefer manual configuration

---

## Questions?

### "Will securing the database break my backend?"

No. The script adds Render's internal network to the allowlist, so your backend service can still connect.

### "What if my IP changes?"

You'll need to update the IP allowlist. Options:
1. Use a VPN with static IP
2. Use Render private networking (recommended for production)
3. Manually update IP when it changes

### "Can I test this safely?"

Yes! The script:
- Shows what it will change before applying
- Asks for confirmation
- Provides rollback instructions
- Doesn't affect your application code

### "What if I lock myself out?"

You can always access the Render dashboard to fix IP rules, even if you're locked out of the database itself.

---

**Ready to secure your database? Run the script now!** 🔒

