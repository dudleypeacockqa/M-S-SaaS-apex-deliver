# User & Access Permissions Analysis

## Identity Sources & User Inventory
- **Primary identity provider – Clerk**: Backend relies on Clerk-issued JWTs and metadata to hydrate the local `users` table. `get_current_user` decodes the token, verifies the Clerk user exists in Postgres, and enforces claim integrity (org/role sync plus RBAC audit logging on mismatches). [`backend/app/api/dependencies/auth.py:92-185`](../backend/app/api/dependencies/auth.py#L92-L185)
- **User model & roles**: `UserRole` enumerates `solo`, `growth`, `enterprise`, `admin`, `master_admin`, persisted with optional `organization_id` to support master-admin users that operate outside a tenant. [`backend/app/models/user.py:14-83`](../backend/app/models/user.py#L14-L83)
- **Clerk & subscription metadata**: Organizations are mirrored locally with a normalized `subscription_tier` that feeds feature decisions. [`backend/app/services/organization_service.py:8-101`](../backend/app/services/organization_service.py#L8-L101)
- **Documentation-driven role setup**: Admin runbooks instruct operators to set Clerk public metadata (`{"role":"admin"}`) to unlock `/admin` and `/master-admin`. [`docs/ADMIN-SETUP.md:10-140`](docs/ADMIN-SETUP.md#L10-L140)
- **Bootstrap scripts**: `backend/scripts/setup_master_admin.py` promotes hard-coded emails to `master_admin` / `admin` roles for seeding the Digital Growth Equity tenant, ensuring at least one privileged actor exists per environment. [`backend/scripts/setup_master_admin.py:1-140`](../backend/scripts/setup_master_admin.py#L1-L140)
- **Environment reference**: `ApexDeliver Environment Variables - Master Reference.md` stores the live Clerk keys, webhook secrets, and other auth-related values that power production sign-in. (`CLERK_*` block at [`ApexDeliver Environment Variables - Master Reference.md:72-105`](../ApexDeliver%20Environment%20Variables%20-%20Master%20Reference.md#L72-L105))

## Role & Tier Model
| Role | Intended audience | Default navigation & tier expectations |
| --- | --- | --- |
| `solo` | Starter tier individual operator | Minimal navigation (Dashboard, Deals, Tasks, Documents, Billing). [`frontend/src/const.ts:55-165`](../frontend/src/const.ts#L55-L165) |
| `growth` | Professional tier | Adds Events, Community, Podcast Studio, FP&A/PMI modules (subject to feature gating). [`frontend/src/const.ts:100-157`](../frontend/src/const.ts#L100-L157) |
| `enterprise` | Enterprise-tier orgs | Same surfaces as growth but entitled to enterprise-only features via entitlements. |
| `admin` | Org-level administrator | Gains `/admin` navigation and (per docs) visibility into master-admin tooling. [`docs/ADMIN-SETUP.md:47-140`](docs/ADMIN-SETUP.md#L47-L140) |
| `master_admin` | Platform operators | Platform-wide scope plus master admin portal relationships (scores, nudges, campaigns, etc.) persisted on the `User` model. [`backend/app/models/user.py:69-82`](../backend/app/models/user.py#L69-L82) |

Subscription tiers (`starter`, `professional`, `premium`, `enterprise`) are managed through Clerk organization metadata and cached in `get_organization_tier`. [`backend/app/core/subscription.py:15-126`](../backend/app/core/subscription.py#L15-L126)

## Backend Enforcement Surfaces
### Authentication & Claim Validation
- `decode_clerk_jwt` verifies JWT signatures and raises `AuthError` if secrets are missing or tokens invalid. [`backend/app/core/security.py:1-42`](../backend/app/core/security.py#L1-L42)
- `_enforce_claim_integrity` compares JWT `org_id`/`org_role` with database values and logs mismatches through `rbac_audit_service`. [`backend/app/api/dependencies/auth.py:43-90`](../backend/app/api/dependencies/auth.py#L43-L90), [`backend/app/services/rbac_audit_service.py:8-78`](../backend/app/services/rbac_audit_service.py#L8-L78)
- RBAC audit entries capture actor/target ids, action, and sanitized claim snapshots for investigations. [`backend/app/models/rbac_audit_log.py:14-53`](../backend/app/models/rbac_audit_log.py#L14-L53)

### Tenant Scoping & Role Dependencies
- `require_role` / `require_min_role` provide hierarchical authorization (admins bypass, role levels sourced from `get_role_level`). [`backend/app/api/dependencies/auth.py:187-254`](../backend/app/api/dependencies/auth.py#L187-L254)
- `AccessScope` + `require_scoped_organization_id` let master admins impersonate tenants via `X-Master-Tenant-Id` headers while forbidding overrides for regular users. [`backend/app/api/dependencies/tenant_scope.py:1-115`](../backend/app/api/dependencies/tenant_scope.py#L1-L115)
- Critical routers (tasks, valuations, community moderation, subscriptions) compose these dependencies to maintain per-organization isolation while still permitting master-admin overrides. Example: task APIs demand `require_min_role(UserRole.growth)` and inject scoped org ids before hitting services. [`backend/app/api/routes/tasks.py:5-147`](../backend/app/api/routes/tasks.py#L5-L147)

### Feature Entitlements & Tier Gates
- `entitlement_service` centralizes the feature→tier matrix (podcast audio/video, deal matching, PMI, FP&A, etc.) and upgrade messaging. [`backend/app/services/entitlement_service.py:20-200`](../backend/app/services/entitlement_service.py#L20-L200)
- `require_feature(feature)` enforces entitlements server-side, denying access with upgrade metadata and auto-bypassing for `master_admin`. [`backend/app/api/dependencies/auth.py:257-343`](../backend/app/api/dependencies/auth.py#L257-L343)
- Feature-aware routes (podcasts, quota, YouTube publishing) wire these dependencies so only organizations with sufficient tiers can mutate assets. [`backend/app/api/routes/podcasts.py:249-344`](../backend/app/api/routes/podcasts.py#L249-L344)

### Operational Utilities
- `setup_master_admin.py` and related seed scripts ensure privileged accounts exist for escalation/test tenants. [`backend/scripts/setup_master_admin.py:1-140`](../backend/scripts/setup_master_admin.py#L1-L140)
- Documentation provides explicit instructions for mapping Clerk metadata to product roles and highlights troubleshooting patterns. [`docs/ADMIN-SETUP.md:10-200`](docs/ADMIN-SETUP.md#L10-L200)

## Frontend Enforcement Surfaces
- **Route guard**: `ProtectedRoute` relies on Clerk `publicMetadata.role` to gate client routes and redirects unauthorized users to `/unauthorized`. [`frontend/src/components/auth/ProtectedRoute.tsx:1-75`](../frontend/src/components/auth/ProtectedRoute.tsx#L1-L75)
- **Navigation filtering**: `WORKSPACE_NAV_ITEMS` enumerates every workspace section and the roles allowed to see it; master admins bypass filtering entirely in `SidebarNavigation`. [`frontend/src/const.ts:55-223`](../frontend/src/const.ts#L55-L223)
- **Master Admin wrapper**: `MasterAdminRoute` (embedded in `App.tsx`) applies the `VITE_ENABLE_MASTER_ADMIN` flag and hard-requires `user.role === 'master_admin'` before rendering the portal. [`frontend/src/App.tsx:123-157`](../frontend/src/App.tsx#L123-L157)
- **FeatureGate experience**: React components wrap FP&A/PMI/podcast routes with `<FeatureGate>` which calls `/api/podcasts/features/{feature}` to retrieve entitlement status and show upgrade CTAs if access is denied. [`frontend/src/components/subscription/FeatureGate.tsx:1-139`](../frontend/src/components/subscription/FeatureGate.tsx#L1-L139)

## Gap Analysis
### 1. Master Admin API lacks server-side role enforcement
- Every `/master-admin` endpoint only depends on `get_current_user`, so any authenticated tenant (even `solo`) can read/write master-admin data if they call the API directly, bypassing the UI guard. [`backend/app/api/routes/master_admin.py:88-149`](../backend/app/api/routes/master_admin.py#L88-L149)
- **Impact**: Platform-wide productivity analytics, nudges, campaigns, and collateral can be modified by unauthorized users.
- **Fix**: Wrap the router (or each route) with `Depends(get_current_master_admin_user)` or at least `require_min_role(UserRole.admin)` plus additional scope checks, and add regression tests to `backend/tests`.

### 2. Deal matching endpoints ignore tier-based feature gating
- The live `deal_matching.py` imports `require_feature` but never applies it; every endpoint runs with `get_current_user` only. [`backend/app/api/routes/deal_matching.py:37-78`](../backend/app/api/routes/deal_matching.py#L37-L78)
- A future version (`deal_matching.py.future`) shows the intended dependency injection, but the shipped router allows starter-tier users to consume Professional+ functionality.
- **Fix**: Replace `current_user: User = Depends(get_current_user)` with `Depends(require_feature("deal_matching"))` (and optionally `require_min_role(UserRole.growth)`), mirroring the `.future` file, then backfill tests.

### 3. Master Admin availability should be limited to master_admin role only
- Navigation currently exposes the “Master Admin” pill to both `admin` and `master_admin` roles via `WORKSPACE_NAV_ITEMS`, but product guidance is that tenant admins must *not* see or touch platform-level tooling. [`frontend/src/const.ts:194-214`](../frontend/src/const.ts#L194-L214)
- `MasterAdminRoute` already enforces `user.role === 'master_admin'`, so tenant admins hit a “Not Available” screen whenever they click the menu.
- **Impact**: Confusing UX for tenant admins plus unnecessary disclosure of platform-level capabilities.
- **Fix**: Update `WORKSPACE_NAV_ITEMS` (and related documentation) so only `master_admin` role receives the navigation item, keeping `/master-admin` entirely hidden from tenant admins. This aligns with the security model without changing backend dependencies.

### 4. Feature entitlement endpoint fails for master admins without tenant context
- `/api/podcasts/features/{feature}` always calls `subscription.get_organization_tier(organization_id)` without guarding against `None`. [`backend/app/api/routes/podcasts.py:223-236`](../backend/app/api/routes/podcasts.py#L223-L236)
- Master admins typically have no associated `organization_id`, so calling this endpoint (triggered by `<FeatureGate>`) returns a 500 instead of defaulting to “access granted” or at least a deterministic deny.
- **Fix**: Short-circuit the tier lookup when `current_user.organization_id` is absent (mirror the logic already present in `require_feature`) by either returning full access for master admins or responding with a structured denial.

### 5. Master admin bootstrap script hard-codes PII and bypasses normal workflows
- `setup_master_admin.py` promotes two specific email addresses and assigns one to a newly created organization with `subscription_tier="enterprise"`. [`backend/scripts/setup_master_admin.py:35-100`](../backend/scripts/setup_master_admin.py#L35-L100)
- **Impact**: Running this script in shared environments overwrites role assignments and may expose personal accounts to unintended data. It also sidesteps audit logging because role changes happen directly in the database.
- **Fix**: Parameterize the script (accept emails/org IDs as arguments), store configuration outside source control, and call `log_role_change` so promotions are auditable.

## Recommended Next Steps
1. Lock down `/master-admin` and deal matching routes with the existing dependency helpers, add regression tests, and rerun `pytest --cov=backend/app`.
2. Decide the intended population for master-admin UI, align documentation/UI/backend gating, and update `VITE_ENABLE_MASTER_ADMIN` usage accordingly.
3. Harden entitlement endpoints for org-less actors and rotate/relocate the exposed Clerk secrets before the next deploy.

## Enterprise-Grade Access Control Upgrade Plan
To elevate the platform’s access controls to an enterprise-ready posture, execute the following multi-phase roadmap. Each phase builds on prior work and should culminate in regression suites (pytest + Vitest) plus deployment runbooks to ensure auditable change management.

### Phase 0 – Foundations & Governance
- **Define role taxonomy**: Finalize the canonical list of roles (solo/growth/enterprise/admin/master_admin/support/billing/etc.) and document their privileges, inheritance rules, and separation of duties in `docs/security/role-matrix.md`.
- **Ownership & process**: Designate a security owner, require threat modeling for role changes, and integrate access-review checkpoints into release planning.
- **Secrets & identity inventory**: Catalog every identity provider (Clerk, Stripe, internal service accounts) and align them with secrets-management policies (Vault/Render secret store). While key rotation will occur later, document procedures now.

### Phase 1 – Backend Enforcement Hardening
1. **Master Admin API lockdown**
   - Introduce router-level dependency (`Depends(get_current_master_admin_user)`) for `/master-admin` endpoints.
   - Add defensive logging + audit events when non-master users attempt access.
   - Tests: add FastAPI integration tests that assert 403 for tenant admins vs 200 for master admins.
2. **Deal Matching entitlement enforcement**
   - Apply `require_feature("deal_matching")` and `require_min_role(UserRole.growth)` where appropriate.
   - Expand entitlement matrix tests to cover new feature gates.
3. **Cross-service RBAC middleware**
   - ✅ Introduce a centralized permission registry (`app/core/permissions.py`) plus `require_permission(...)` dependency; billing endpoints now consume `Permission.BILLING_VIEW` / `Permission.BILLING_MANAGE`.
   - ✅ Permission denials now emit RBAC audit entries (`permission_denied`) so SOC teams can trace unauthorized attempts.
   - Provide convenience decorators for “organization owner”, “resource collaborator”, etc., and expand the registry to additional modules.
4. **Tenant scoping upgrades**
   - ✅ Log every impersonation header usage in `rbac_audit_logs` (actions `impersonation`, `permission_denied`) so SOC operations can trace cross-tenant access and blocked attempts.
   - Require explicit tenant headers for master admin impersonation and build throttling/alerting for suspicious usage.

### Phase 2 – Data & Audit Enhancements
1. **Comprehensive audit trail**
   - Extend `RBACAuditLog` to cover CRUD operations on deals, documents, and entitlements (not just role changes).
   - Emit structured logs to centralized storage (e.g., Datadog/SIEM) with correlation IDs.
2. **Automated entitlement reconciliation**
   - Nightly job that compares Clerk metadata, local DB roles, and subscription tiers; mismatches create audit events/tasks.
   - Build alerts for organizations with expired subscriptions but elevated permissions.
3. **Policy-based access tokens**
   - Consider short-lived signed tokens containing scope claims (feature list, resource ids) so downstream services can verify access without re-querying the DB.
   - Add revocation lists for compromised sessions.

### Phase 3 – Frontend & UX Alignment
1. **Navigation gating overhaul**
   - Generate navigation dynamically from backend policy responses (e.g., `/api/auth/permissions`) to avoid hard-coded role arrays.
   - Hide master-admin navigation unless the policy explicitly grants it, preventing tenant admins from even seeing the option.
2. **FeatureGate resilience**
   - Cache entitlement responses per session with expiring storage and handle org-less actors gracefully.
   - Display support contact links and error codes for denied access to aid customer success teams.
3. **Admin tooling segregation**
   - Create separate `master-admin` shell (URL + theme) to reinforce separation from tenant workspaces.
   - Introduce warning banners when impersonating tenants, including “return to master view” controls.

### Phase 4 – Enterprise Controls & Compliance
1. **Periodic access reviews**
   - Implement quarterly automated reports showing all users, roles, and last-login dates; require manual attestation for `admin`/`master_admin`.
2. **Just-in-time elevation**
   - Replace permanent master-admin assignments with approval workflows (ticketing integration + expiration times).
3. **Compliance integrations**
   - Map controls to SOC 2 / ISO 27001 requirements, document evidence in `docs/security/compliance.md`, and automate log exports for auditors.
4. **SAML & SCIM readiness**
   - Prepare for enterprise SSO by ensuring role assignments can be driven via SCIM provisioning and SAML attribute mappings.

### Phase 5 – Verification & Operationalization
1. **Penetration testing**
   - Engage third-party testers to focus on horizontal privilege escalation, impersonation, and feature-gate bypasses.
2. **Chaos & failover drills**
   - Simulate Clerk outages and ensure cached roles/tiers fall back to least-privilege behavior.
3. **Monitoring & alerting**
   - Instrument dashboards for failed auth attempts, impersonation usage, feature-gate denials, and audit-log volume spikes.
4. **Documentation & training**
   - Update developer guides, runbooks, and onboarding materials so every engineer understands the policy engine and how to request new permissions.

Executing this plan will align backend, frontend, and operational processes with enterprise expectations, providing clear traceability, least-privilege enforcement, and rapid incident response capabilities ahead of the next release phase.
