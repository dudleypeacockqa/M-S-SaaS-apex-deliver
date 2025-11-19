# Admin Setup Guide - M&A Intelligence Platform

**Purpose**: Configure admin role access for Master Admin Portal and platform administration features.

**Last Updated**: 2025-11-12
**Estimated Time**: 5 minutes

---

## Quick Setup (5 minutes)

### Step 1: Access Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your M&A Intelligence Platform application
3. Navigate to **Users** in the left sidebar

### Step 2: Find Your User Account

1. Search for your email address or username
2. Click on your user profile to open details

### Step 3: Set Admin Role

1. Scroll to **Public metadata** section
2. Click **Edit**
3. Add the following JSON:

```json
{
  "role": "admin"
}
```

4. Click **Save**

### Step 4: Verify Access

1. Log out of the M&A Platform (https://100daysandbeyond.com)
2. Log back in
3. Check navigation menu - you should now see:
   - ✅ **Admin** menu item (organization admin features)
   - ✅ **Master Admin** menu item (platform-wide admin features)

---

## Admin Role Features

### Organization Admin (`/admin/*`)

**Access Requirements**: `role: admin` in Clerk metadata

**Features**:
- User management within your organization
- Organization settings
- Team member invitations
- Role assignments

**Routes**:
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/organizations` - Organization settings

### Master Admin (`/master-admin/*`)

**Access Requirements**:
- `role: admin` in Clerk metadata
- `VITE_ENABLE_MASTER_ADMIN=true` environment variable (now enabled)

**Features**:
- Platform-wide user management
- Cross-organization oversight
- System configuration
- Platform analytics

**Routes**:
- `/master-admin` - Master admin dashboard
- `/master-admin/users` - All platform users
- `/master-admin/organizations` - All organizations
- `/master-admin/system` - System configuration

---

## Role Types & Permissions

The platform supports 4 subscription-based roles:

### 1. Solo (`role: solo`) - Starter Tier (£279/month)
**Navigation Access**:
- ✅ Dashboard
- ✅ Deals
- ✅ Billing

**Features**:
- Basic deal management
- Document storage (5GB)
- Valuation tools

### 2. Growth (`role: growth`) - Professional Tier (£598/month)
**Navigation Access**:
- ✅ Dashboard
- ✅ Deals
- ✅ Billing
- ✅ Podcast Studio

**Features**:
- Everything in Solo
- Podcast creation (10 episodes/month)
- Advanced financial analysis
- Document storage (50GB)

### 3. Enterprise (`role: enterprise`) - Enterprise Tier (£1,598/month)
**Navigation Access**:
- ✅ Dashboard
- ✅ Deals
- ✅ Billing
- ✅ Podcast Studio (unlimited)

**Features**:
- Everything in Growth
- Live streaming
- Unlimited podcast episodes
- White-label options
- Document storage (500GB)

### 4. Admin (`role: admin`) - Platform Administrator
**Navigation Access**:
- ✅ Dashboard
- ✅ Deals
- ✅ Billing
- ✅ Podcast Studio
- ✅ **Admin** (organization admin)
- ✅ **Master Admin** (platform admin)

**Features**:
- Everything in Enterprise
- Platform-wide administration
- User management across all organizations
- System configuration

---

## Troubleshooting

### Issue: "Admin" or "Master Admin" menu items not visible

**Possible Causes**:
1. Role not set in Clerk metadata
2. Need to log out/in after role change
3. Browser cache needs clearing

**Fix**:
1. Verify role is set to `"admin"` in Clerk Dashboard → Users → [Your User] → Public metadata
2. Log out completely from platform
3. Clear browser cache (Ctrl+Shift+Delete)
4. Log back in
5. Check navigation menu

### Issue: Master Admin Portal shows "Feature Not Available"

**Cause**: `VITE_ENABLE_MASTER_ADMIN` environment variable is disabled

**Status**: ✅ **FIXED** as of commit e16b4c1 (2025-11-12)

**Verification**:
1. Check [render.yaml:42](../render.yaml#L42) - should be `value: true`
2. Wait for Render auto-deploy to complete (~5 minutes)
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Role changes not taking effect

**Cause**: Clerk JWT tokens are cached

**Fix**:
1. Log out completely
2. Wait 30 seconds (for token expiry)
3. Log back in
4. Role should now be applied

---

## Security Best Practices

### Admin Role Assignment

**⚠️ Important**: Only assign `admin` role to trusted platform administrators.

**Recommended Approach**:
1. Start with `solo`, `growth`, or `enterprise` role based on subscription
2. Only promote to `admin` for platform management needs
3. Use separate accounts for admin vs regular user workflows

### Public Metadata vs Private Metadata

**Public Metadata** (user-visible):
```json
{
  "role": "admin",
  "subscription_tier": "enterprise"
}
```

**Private Metadata** (backend-only, more secure):
```json
{
  "internal_notes": "Platform founder",
  "created_via": "manual_setup"
}
```

For sensitive admin flags, consider using **Private metadata** instead.

---

## Digital Growth Equity Tenant (Seed Script)

Use the dedicated seed helper to provision Dudley’s Digital Growth Equity tenant in any environment:

1. Set `DATABASE_URL` for the target environment (Render, local Postgres, etc.).
2. Optionally override `DIGITAL_GROWTH_EQUITY_*` env vars (org name, tier, admin email) if defaults don’t apply.
3. Run the script from repo root:

   ```bash
   cd backend
   python scripts/seed_digital_growth_equity.py
   ```

The script invokes `TenantSeedConfig`/`ensure_tenant_admin`, so it’s idempotent—rerunning updates the org + admin in-place (tier, metadata, etc.). Once seeded, log in as `dudley.peacock@icloud.com` via Clerk to validate `/admin` against the Digital Growth Equity tenant.

---

## Role Configuration Examples

### Example 1: Solo User
```json
{
  "role": "solo",
  "subscription_tier": "starter"
}
```

### Example 2: Growth User
```json
{
  "role": "growth",
  "subscription_tier": "professional"
}
```

### Example 3: Enterprise User
```json
{
  "role": "enterprise",
  "subscription_tier": "enterprise"
}
```

### Example 4: Platform Admin
```json
{
  "role": "admin",
  "subscription_tier": "enterprise",
  "admin_level": "master"
}
```

---

## Next Steps After Setup

1. ✅ Verify admin access via navigation menu
2. ✅ Explore Admin Portal (`/admin`)
3. ✅ Explore Master Admin Portal (`/master-admin`)
4. ✅ Create your first deal to unlock FP&A tools
5. 📖 Read [User Quick Start Guide](./USER-QUICK-START.md) for feature walkthrough

---

## Support

**Issue**: Still can't access admin features after following this guide?

**Contact**:
- Email: support@ma-platform.com
- Check deployment status: [DEPLOYMENT_HEALTH.md](./DEPLOYMENT_HEALTH.md)
- Review production logs via Render Dashboard

---

**End of Admin Setup Guide**
