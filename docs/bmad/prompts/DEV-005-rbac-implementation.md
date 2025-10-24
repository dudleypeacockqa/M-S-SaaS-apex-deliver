# DEV-005: Role-Based Access Control (RBAC) with Clerk Claims

**Story ID**: DEV-005  
**Priority**: Medium  
**Estimated Duration**: 3-4 hours  
**Dependencies**: DEV-002 (Frontend Auth), DEV-004 (Backend Clerk Sync)

---

## Story Overview

Implement comprehensive role-based access control using Clerk custom claims, enabling different user experiences and permissions for Solo Dealmakers, Growth Firm Users, Enterprise Users, and Platform Admins.

---

## Acceptance Criteria

- [ ] Clerk custom claims configured for user roles
- [ ] Four role types defined (Solo, Growth, Enterprise, Admin)
- [ ] Frontend components show/hide based on user role
- [ ] Backend endpoints protected by role permissions
- [ ] Permission checking utilities created
- [ ] Role assignment workflow implemented
- [ ] Comprehensive test coverage for all roles
- [ ] Documentation for RBAC system

---

## CODEX Prompt

```
Implement a comprehensive Role-Based Access Control (RBAC) system using Clerk custom claims to enable different user experiences and permissions across the M&A Intelligence Platform.

CONTEXT:
- Project: M&A Intelligence Platform (full production)
- Completed: DEV-002 (Frontend Auth), DEV-004 (Backend Clerk Sync)
- Current state: Auth working, but no role-based permissions
- Framework: React + TypeScript (frontend), Python + FastAPI (backend)
- Authentication: Clerk with custom claims

OBJECTIVES:
1. Define four user roles with distinct permissions
2. Configure Clerk custom claims for role management
3. Implement frontend role-based component visibility
4. Protect backend endpoints with role permissions
5. Create permission checking utilities
6. Build role assignment workflow for admins
7. Follow TDD principles with comprehensive testing

USER ROLES & PERMISSIONS:

1. SOLO DEALMAKER (solo)
   - Access to personal deal pipeline (max 10 deals)
   - Basic financial analysis tools
   - Document storage (5GB limit)
   - Community access (read-only)
   - No team collaboration features
   - Subscription: £279/month

2. GROWTH FIRM USER (growth)
   - Access to team deal pipeline (max 50 deals)
   - Advanced financial analysis tools
   - Document storage (50GB limit)
   - Community access (read + post)
   - Team collaboration features
   - Multi-user support (up to 5 users)
   - Subscription: £598/month

3. ENTERPRISE USER (enterprise)
   - Unlimited deal pipeline
   - Full financial intelligence suite
   - Document storage (500GB limit)
   - Community access (full permissions)
   - Advanced team collaboration
   - Multi-user support (unlimited)
   - Custom integrations
   - Dedicated support
   - Subscription: £1,598/month

4. PLATFORM ADMIN (admin)
   - Full platform access
   - User management
   - Organization management
   - Platform settings
   - Analytics dashboard
   - Billing management
   - Content moderation
   - System configuration

FRONTEND IMPLEMENTATION:

1. Role Hook (useUserRole.ts):
```typescript
export function useUserRole() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as UserRole;
  
  return {
    role,
    isSolo: role === 'solo',
    isGrowth: role === 'growth',
    isEnterprise: role === 'enterprise',
    isAdmin: role === 'admin',
    hasPermission: (permission: Permission) => checkPermission(role, permission)
  };
}
```

2. Permission Checking Component:
```typescript
<RequirePermission permission="deals.create">
  <CreateDealButton />
</RequirePermission>

<RequireRole roles={['admin', 'enterprise']}>
  <AdvancedAnalyticsPanel />
</RequireRole>
```

3. Feature Limits Component:
```typescript
<FeatureLimit 
  feature="deals" 
  current={userDeals.length} 
  limit={getRoleLimit(role, 'deals')}
>
  <DealsList deals={userDeals} />
</FeatureLimit>
```

BACKEND IMPLEMENTATION:

1. Permission Decorator:
```python
@router.post("/api/deals")
@require_permission("deals.create")
async def create_deal(
    deal_data: DealCreate,
    current_user: User = Depends(get_current_user)
):
    # Check feature limits
    if not await check_feature_limit(current_user, "deals"):
        raise HTTPException(403, "Deal limit reached for your plan")
    
    deal = await deal_service.create_deal(current_user.id, deal_data)
    return deal
```

2. Role Decorator:
```python
@router.get("/api/admin/users")
@require_role("admin")
async def get_all_users(current_user: User = Depends(get_current_user)):
    users = await user_service.get_all_users()
    return users
```

PERMISSION DEFINITIONS:

Create a permissions matrix:

| Permission | Solo | Growth | Enterprise | Admin |
|------------|------|--------|------------|-------|
| deals.create | ✓ | ✓ | ✓ | ✓ |
| deals.view_own | ✓ | ✓ | ✓ | ✓ |
| deals.view_team | ✗ | ✓ | ✓ | ✓ |
| deals.view_all | ✗ | ✗ | ✗ | ✓ |
| deals.delete | ✓ | ✓ | ✓ | ✓ |
| financial.basic | ✓ | ✓ | ✓ | ✓ |
| financial.advanced | ✗ | ✓ | ✓ | ✓ |
| financial.full_suite | ✗ | ✗ | ✓ | ✓ |
| documents.upload | ✓ | ✓ | ✓ | ✓ |
| documents.share | ✗ | ✓ | ✓ | ✓ |
| community.read | ✓ | ✓ | ✓ | ✓ |
| community.post | ✗ | ✓ | ✓ | ✓ |
| community.moderate | ✗ | ✗ | ✗ | ✓ |
| team.invite | ✗ | ✓ | ✓ | ✓ |
| team.manage | ✗ | ✓ | ✓ | ✓ |
| admin.users | ✗ | ✗ | ✗ | ✓ |
| admin.settings | ✗ | ✗ | ✗ | ✓ |

FEATURE LIMITS:

Define limits per role:

| Feature | Solo | Growth | Enterprise | Admin |
|---------|------|--------|------------|-------|
| Max Deals | 10 | 50 | Unlimited | Unlimited |
| Storage (GB) | 5 | 50 | 500 | Unlimited |
| Team Members | 1 | 5 | Unlimited | Unlimited |
| API Calls/Day | 1000 | 10000 | 100000 | Unlimited |
| Export Frequency | Weekly | Daily | Hourly | Unlimited |

CLERK CONFIGURATION:

1. Set up custom claims in Clerk Dashboard:
   - Go to Clerk Dashboard → Users → Metadata
   - Add public metadata field: `role` (string)
   - Add public metadata field: `organization_id` (string)
   - Add private metadata field: `subscription_tier` (string)

2. Update user metadata via Clerk API:
```typescript
await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    role: 'growth',
    organization_id: 'org_123'
  },
  privateMetadata: {
    subscription_tier: 'growth_monthly'
  }
});
```

CODE ORGANIZATION:

Frontend:
frontend/src/
  hooks/
    useUserRole.ts
    usePermissions.ts
    useFeatureLimits.ts
  components/
    rbac/
      RequirePermission.tsx
      RequireRole.tsx
      FeatureLimit.tsx
      UpgradePrompt.tsx
  utils/
    permissions.ts
    role-limits.ts

Backend:
backend/app/
  core/
    permissions.py - Permission definitions
    rbac.py - RBAC utilities
  api/
    dependencies/
      permissions.py - Permission decorators
  services/
    role_service.py - Role management

TESTING REQUIREMENTS:

Frontend Tests:
1. Test useUserRole hook returns correct role
2. Test RequirePermission shows/hides content correctly
3. Test RequireRole shows/hides content correctly
4. Test FeatureLimit enforces limits
5. Test UpgradePrompt appears when limit reached

Backend Tests:
1. Test @require_permission decorator allows/denies access
2. Test @require_role decorator allows/denies access
3. Test feature limit checking
4. Test permission matrix for all roles
5. Test role assignment workflow

DELIVERABLES:
1. Role and permission utilities (frontend + backend)
2. RBAC components and decorators
3. Feature limit enforcement
4. Role assignment workflow for admins
5. Comprehensive test suite
6. Documentation for RBAC system
7. Migration guide for existing users
8. Story completion notes in DEV-005 file

REFERENCE:
- CLAUDE.md for coding standards
- FULL_PRODUCTION_PRD.md for user personas and pricing
- Clerk RBAC docs: https://clerk.com/docs/organizations/roles-permissions

Follow TDD: Write tests first, then implement features.
Use TypeScript strictly: No 'any' types.
Handle edge cases: What if user has no role? Default to 'solo'.
Graceful degradation: Show upgrade prompts, not hard errors.
```

---

## Test Plan

### Frontend Tests (Vitest)

```typescript
describe('useUserRole', () => {
  it('returns correct role for solo user', () => {})
  it('returns correct role for growth user', () => {})
  it('returns correct role for enterprise user', () => {})
  it('returns correct role for admin user', () => {})
  it('defaults to solo if no role set', () => {})
})

describe('RequirePermission', () => {
  it('shows content when user has permission', () => {})
  it('hides content when user lacks permission', () => {})
  it('shows upgrade prompt when appropriate', () => {})
})

describe('FeatureLimit', () => {
  it('allows action when under limit', () => {})
  it('blocks action when at limit', () => {})
  it('shows upgrade prompt when limit reached', () => {})
})
```

### Backend Tests (pytest)

```python
def test_require_permission_allows_access():
    # Test user with permission can access endpoint
    pass

def test_require_permission_denies_access():
    # Test user without permission gets 403
    pass

def test_require_role_allows_access():
    # Test user with role can access endpoint
    pass

def test_require_role_denies_access():
    # Test user without role gets 403
    pass

def test_feature_limit_enforcement():
    # Test feature limit is enforced correctly
    pass

def test_permission_matrix():
    # Test all permissions for all roles
    pass
```

---

## Definition of Done

- [ ] Clerk custom claims configured
- [ ] Four roles defined with permissions
- [ ] Frontend RBAC components working
- [ ] Backend RBAC decorators working
- [ ] Permission checking utilities created
- [ ] Feature limits enforced
- [ ] Role assignment workflow implemented
- [ ] All tests passing (frontend + backend)
- [ ] Documentation complete
- [ ] Deployed and verified
- [ ] Story marked as complete

---

## Estimated Effort

- Clerk configuration: 0.5 hours
- Frontend RBAC utilities: 1 hour
- Backend RBAC utilities: 1 hour
- Feature limit enforcement: 0.5 hours
- Testing: 1.5 hours
- Documentation: 0.5 hours

**Total**: 3-4 hours

---

## Next Story

After completing DEV-005, proceed to core feature development:
- **DEV-006**: Deal Pipeline Implementation
- **DEV-007**: Financial Intelligence Engine
- **DEV-008**: Document Room with Version Control

The RBAC foundation will enable role-specific features in all future stories.

