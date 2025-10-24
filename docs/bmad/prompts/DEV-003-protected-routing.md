# DEV-003: Expand Protected Routing & Feature Areas

**Story ID**: DEV-003  
**Priority**: High  
**Estimated Duration**: 3-4 hours  
**Dependencies**: DEV-002 (Frontend Authentication)

---

## Story Overview

Extend the authentication foundation from DEV-002 to cover all core feature areas of the M&A Intelligence Platform. Implement protected routes for Deal Pipeline, Admin Portal, and User Dashboard with proper navigation, loading states, and error handling.

---

## Acceptance Criteria

- [ ] Protected routes created for `/deals/*` (Deal Pipeline)
- [ ] Protected routes created for `/admin/*` (Admin Portal)
- [ ] Protected routes created for `/dashboard/*` (User Dashboard)
- [ ] Navigation menu with role-based visibility
- [ ] Breadcrumb navigation for all protected areas
- [ ] Loading states while auth is being verified
- [ ] Error boundaries for authentication failures
- [ ] All routes tested with Vitest
- [ ] Documentation updated

---

## CODEX Prompt

```
Extend the Clerk authentication implementation from DEV-002 to cover all core feature areas of the M&A Intelligence Platform.

CONTEXT:
- Project: M&A Intelligence Platform (full production)
- Completed: DEV-002 (Frontend Authentication with Clerk)
- Current state: Basic authentication working with sign-in/sign-up
- Framework: React 18 + TypeScript + Vite + React Router
- Authentication: Clerk (already integrated)

OBJECTIVES:
1. Create protected route structure for three main feature areas:
   - Deal Pipeline (/deals/*)
   - Admin Portal (/admin/*)
   - User Dashboard (/dashboard/*)

2. Implement comprehensive navigation system:
   - Main navigation menu with role-based visibility
   - Breadcrumb navigation for all protected areas
   - Active route highlighting
   - Mobile-responsive navigation

3. Add proper loading and error states:
   - Loading spinner while auth is being verified
   - Error boundaries for authentication failures
   - Graceful fallbacks for network issues
   - Redirect to sign-in for unauthenticated users

4. Follow TDD principles:
   - Write tests first for all new routes
   - Test navigation behavior
   - Test loading states
   - Test error scenarios

REQUIREMENTS:

Route Structure:
/deals
  /deals/pipeline - Main deal pipeline view
  /deals/new - Create new deal
  /deals/:id - Deal details
  /deals/:id/edit - Edit deal

/admin
  /admin/dashboard - Admin overview
  /admin/users - User management
  /admin/organizations - Organization management
  /admin/settings - Platform settings

/dashboard
  /dashboard/overview - User dashboard home
  /dashboard/profile - User profile
  /dashboard/subscription - Subscription management
  /dashboard/settings - User settings

Navigation Components:
1. MainNav.tsx - Top navigation bar with:
   - Logo
   - Main menu items (Deals, Dashboard, Admin if admin)
   - User profile dropdown
   - Sign out button

2. Breadcrumbs.tsx - Breadcrumb navigation showing:
   - Current location in app hierarchy
   - Clickable parent routes
   - Current page (non-clickable)

3. ProtectedLayout.tsx - Layout wrapper with:
   - MainNav component
   - Breadcrumbs component
   - Main content area
   - Loading state
   - Error boundary

Loading & Error Handling:
1. AuthLoadingSpinner.tsx - Shown while verifying auth
2. AuthErrorBoundary.tsx - Catches and displays auth errors
3. NotFoundPage.tsx - 404 page for invalid routes
4. UnauthorizedPage.tsx - 403 page for insufficient permissions

Testing Requirements:
1. Test all routes render correctly when authenticated
2. Test unauthenticated users are redirected to sign-in
3. Test navigation menu shows correct items based on role
4. Test breadcrumbs display correct hierarchy
5. Test loading states appear during auth verification
6. Test error boundaries catch and display errors
7. Test 404 page for invalid routes

Code Organization:
frontend/src/
  layouts/
    ProtectedLayout.tsx
    PublicLayout.tsx
  components/
    navigation/
      MainNav.tsx
      Breadcrumbs.tsx
      NavItem.tsx
    auth/
      AuthLoadingSpinner.tsx
      AuthErrorBoundary.tsx
  pages/
    deals/
      DealsPage.tsx
      DealPipelinePage.tsx
      NewDealPage.tsx
      DealDetailsPage.tsx
      EditDealPage.tsx
    admin/
      AdminDashboardPage.tsx
      UsersPage.tsx
      OrganizationsPage.tsx
      AdminSettingsPage.tsx
    dashboard/
      DashboardOverviewPage.tsx
      ProfilePage.tsx
      SubscriptionPage.tsx
      UserSettingsPage.tsx
    errors/
      NotFoundPage.tsx
      UnauthorizedPage.tsx

DELIVERABLES:
1. All route components created with placeholder content
2. Navigation system fully functional
3. Loading and error states working
4. Comprehensive test suite passing
5. Updated App.tsx with new routes
6. Documentation in DEV-003 story file

REFERENCE:
- CLAUDE.md for coding standards
- DEV-002 story for authentication patterns
- FULL_PRODUCTION_PRD.md for feature requirements

Follow TDD: Write tests first, then implement features.
Use TypeScript strictly: No 'any' types.
Ensure accessibility: ARIA labels, keyboard navigation.
Make it responsive: Mobile-first design.
```

---

## Test Plan

### Unit Tests

1. **Route Protection Tests**:
   ```typescript
   describe('Protected Routes', () => {
     it('redirects unauthenticated users to sign-in', () => {})
     it('allows authenticated users to access /deals', () => {})
     it('allows authenticated users to access /dashboard', () => {})
     it('allows only admins to access /admin', () => {})
   })
   ```

2. **Navigation Tests**:
   ```typescript
   describe('MainNav', () => {
     it('renders logo and main menu items', () => {})
     it('shows admin link only for admin users', () => {})
     it('highlights active route', () => {})
     it('displays user profile dropdown', () => {})
   })
   ```

3. **Breadcrumb Tests**:
   ```typescript
   describe('Breadcrumbs', () => {
     it('displays correct hierarchy for /deals/pipeline', () => {})
     it('makes parent routes clickable', () => {})
     it('makes current page non-clickable', () => {})
   })
   ```

4. **Loading State Tests**:
   ```typescript
   describe('AuthLoadingSpinner', () => {
     it('displays while auth is being verified', () => {})
     it('hides after auth is confirmed', () => {})
   })
   ```

5. **Error Handling Tests**:
   ```typescript
   describe('AuthErrorBoundary', () => {
     it('catches authentication errors', () => {})
     it('displays error message to user', () => {})
     it('provides retry button', () => {})
   })
   ```

---

## Definition of Done

- [ ] All routes created and rendering
- [ ] Navigation menu functional
- [ ] Breadcrumbs working on all pages
- [ ] Loading states implemented
- [ ] Error boundaries catching errors
- [ ] All tests passing (`npm test`)
- [ ] Code reviewed and follows standards
- [ ] Documentation updated
- [ ] Deployed to Render and verified
- [ ] Story marked as complete in BMAD tracker

---

## Estimated Effort

- Route creation: 1 hour
- Navigation components: 1 hour
- Loading & error states: 0.5 hours
- Testing: 1 hour
- Documentation: 0.5 hours

**Total**: 3-4 hours

---

## Next Story

After completing DEV-003, proceed to:
- **DEV-004**: Backend Clerk Session Synchronization

This will enable server-side authentication verification and user context in the FastAPI backend.

