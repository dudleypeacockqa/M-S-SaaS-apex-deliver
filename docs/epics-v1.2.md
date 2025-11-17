# M&A Intelligence Platform v1.2 - Epic Breakdown
## Enhancement Release - Quality & Integration Focus

**Author:** Claude Code (PM Agent)
**Date:** 2025-11-17
**Project Level:** Enhancement Release (v1.2)
**Target Scale:** 60-80 hours development

---

## Overview

This document provides the complete epic and story breakdown for v1.2, decomposing the requirements from [PRD-v1.2.md](./PRD-v1.2.md) into implementable bite-sized stories following TDD principles.

### Epic Summary

The v1.2 release is organized into **6 focused epics** that build on the proven success of v1.1 (99.8% test pass rate, all 13 core features operational):

1. **EPIC-ENHANCE-001: Backend Test Coverage Enhancement** (6 stories, ~20-25 hours)
   - Increase backend test coverage from 84% → 90%
   - Fix 5 non-critical test failures
   - Achieve 100% test pass rate

2. **EPIC-PERF-001: Performance Optimization Suite** (8 stories, ~15-20 hours)
   - Frontend bundle optimization (20-30% reduction)
   - Backend API response time improvements
   - Lighthouse score targets (Performance 90%+, Accessibility 95%+)
   - Database connection pooling tuning

3. **EPIC-INT-001: QuickBooks OAuth Integration** (8 stories, ~8 hours)
   - OAuth 2.0 flow implementation
   - API client and data sync service
   - Webhook handler for real-time updates

4. **EPIC-INT-002: Sage OAuth Integration** (8 stories, ~8 hours)
   - OAuth 2.0 flow for UK market
   - API client for Sage Accounting
   - Data sync for UK accounting standards

5. **EPIC-INT-003: NetSuite OAuth Integration** (10 stories, ~10 hours)
   - Enterprise ERP integration
   - Multi-entity support
   - Advanced mapping and consolidations

6. **EPIC-MARK-001: Marketing Content Library** (18 stories, ~10-15 hours)
   - 10 SEO-optimized blog posts
   - 3 customer case studies
   - 3 competitive comparison pages
   - 5 product demo video scripts

**Total Stories:** 58 stories
**Total Effort:** 71-86 hours

---

## Epic 1: Backend Test Coverage Enhancement

**Goal:** Increase backend test coverage from 84% to 90% and achieve 100% test pass rate by fixing non-critical failures and adding comprehensive edge case testing.

**Business Value:** Enhanced reliability, reduced bugs in production, improved developer confidence, and faster debugging.

**Success Criteria:**
- Backend coverage ≥ 90% (`pytest --cov=app`)
- All 3,000 tests passing (100% pass rate)
- Zero flaky tests
- Test suite runs in < 200 seconds

---

### Story 1.1: Fix Master Admin Dashboard Stats Test

**As a** backend developer,
**I want** the `test_scores_and_dashboard_stats` test to pass reliably,
**So that** the master admin dashboard stats calculations are properly validated.

**Acceptance Criteria:**

**Given** test data is seeded with known entities
**When** the test runs
**Then** `test_master_admin_api.py::test_scores_and_dashboard_stats` passes without assertion errors

**And** the test is deterministic (passes every time)
**And** test execution time remains < 2 seconds

**Prerequisites:** None (foundational fix)

**Technical Notes:**
- Current issue: Timing-dependent assertion (`assert weekly_activities >= 2` returns 1)
- Fix approach: Ensure test data includes sufficient activity entities with correct timestamps
- Affected file: `backend/tests/test_master_admin_api.py`
- Verify test isolation (no dependency on other test execution order)

---

### Story 1.2: Fix Valuation Export Service PDF Tests

**As a** backend developer,
**I want** all 4 valuation export PDF tests to pass,
**So that** PDF export functionality is properly validated.

**Acceptance Criteria:**

**Given** WeasyPrint dependency is properly configured
**When** PDF export tests run
**Then** all 4 tests in `test_valuation_export_service.py` pass

**And** PDFs are generated successfully in test environment
**And** Alternative export methods (browser print) remain functional

**Prerequisites:** Story 1.1 complete

**Technical Notes:**
- Current issue: WeasyPrint dependency not resolving correctly
- Failed tests: 4 tests in `backend/tests/test_valuation_export_service.py`
- Fix approach: Install/configure WeasyPrint or mock PDF generation in tests
- Consider: If WeasyPrint issues persist, document browser-based export as primary method
- Affected module: `app/services/valuation_export_service.py`

---

### Story 1.3: Add Edge Case Tests for Valuation Service

**As a** backend developer,
**I want** comprehensive edge case tests for valuation calculations,
**So that** edge conditions and error paths are properly handled.

**Acceptance Criteria:**

**Given** valuation service with DCF, comps, and multiples methods
**When** edge case tests are added
**Then** coverage for `app/services/valuation_service.py` increases by ≥5%

**And** tests cover:
- Division by zero scenarios
- Null/missing financial data
- Invalid date ranges
- Extreme values (negative revenue, zero EBITDA)
- Currency conversion edge cases

**And** all new tests follow TDD (RED-GREEN-REFACTOR)

**Prerequisites:** Story 1.2 complete

**Technical Notes:**
- Current coverage: ~78% (estimate from overall 84%)
- Target: ≥85% coverage for this module
- Focus: Error handling paths, boundary conditions
- Test patterns: Parametrized tests for multiple scenarios
- Use pytest fixtures for test data consistency

---

### Story 1.4: Enhance Document Generation Module Tests

**As a** backend developer,
**I want** increased test coverage for document generation,
**So that** AI-powered document generation is thoroughly validated.

**Acceptance Criteria:**

**Given** document generation module with templates and AI integration
**When** new tests are added
**Then** coverage for `app/services/document_generation_service.py` increases by ≥5%

**And** tests cover:
- Template rendering edge cases
- AI prompt injection protection
- Document versioning scenarios
- Multi-tenant isolation validation
- Export queue handling

**And** AI calls are properly mocked (no live API calls in tests)

**Prerequisites:** Story 1.3 complete

**Technical Notes:**
- Current coverage: ~80% (estimate)
- Target: ≥88% coverage
- Mock OpenAI/Anthropic API calls
- Test async job queue handling
- Validate watermarking and access controls

---

### Story 1.5: Add Multi-Tenancy Integration Tests

**As a** backend developer,
**I want** comprehensive multi-tenancy integration tests,
**So that** tenant isolation is guaranteed across all modules.

**Acceptance Criteria:**

**Given** multi-tenant architecture with organization-based isolation
**When** integration tests run
**Then** cross-tenant data access is prevented in all scenarios

**And** tests verify:
- Deals cannot be accessed across organizations
- Documents are org-scoped
- Users cannot join wrong organizations
- Billing is tenant-isolated
- Admin actions respect tenant boundaries

**And** tests use realistic multi-org scenarios (3+ orgs)

**Prerequisites:** Story 1.4 complete

**Technical Notes:**
- Test scope: Integration tests (not unit tests)
- Focus areas: Deals, Documents, Users, Billing
- Use pytest fixtures for multi-org setup
- Test negative cases (attempted cross-org access)
- Validate RBAC enforcement at org level

---

### Story 1.6: Add Missing Error Handling Path Tests

**As a** backend developer,
**I want** tests for all error handling code paths,
**So that** exceptions and failures are properly managed.

**Acceptance Criteria:**

**Given** backend codebase with try/except blocks and error handlers
**When** error path tests are added
**Then** overall backend coverage reaches ≥90%

**And** tests cover:
- Database connection failures
- External API timeouts (Stripe, Clerk, accounting integrations)
- Invalid user inputs
- Rate limit scenarios
- Authentication/authorization failures

**And** error responses follow consistent format
**And** test suite completes in < 200 seconds

**Prerequisites:** Story 1.5 complete

**Technical Notes:**
- Review uncovered lines in coverage report
- Use mocking to simulate failures
- Test error message clarity and user-friendliness
- Validate logging for all error paths
- Check Sentry integration captures exceptions

---

## Epic 2: Performance Optimization Suite

**Goal:** Optimize frontend and backend performance to achieve Lighthouse Performance score ≥90%, reduce API response times, and improve user experience through faster page loads.

**Business Value:** Increased conversion rates, better SEO rankings, reduced bounce rates, improved user satisfaction, and scalability for growth.

**Success Criteria:**
- Lighthouse Performance ≥90%, Accessibility ≥95%, Best Practices ≥90%, SEO ≥90%
- Frontend bundle size reduced by ≥20%
- Backend p95 response time <500ms
- Zero performance regressions

---

### Story 2.1: Implement Code Splitting for React Routes

**As a** frontend developer,
**I want** code splitting for all major routes,
**So that** users only download JavaScript for the page they're viewing.

**Acceptance Criteria:**

**Given** React Router v6 with multiple routes
**When** lazy loading is implemented
**Then** each major route loads in a separate bundle

**And** bundle analysis shows:
- Main bundle < 500KB (gzipped)
- Route bundles < 200KB each
- Total reduction ≥15% from current size

**And** loading states display during chunk loading
**And** no breaking changes to user experience

**Prerequisites:** None (foundational optimization)

**Technical Notes:**
- Use `React.lazy()` and `<Suspense>` for route-level splitting
- Split points: `/deals`, `/documents`, `/valuations`, `/admin`, `/marketing`
- Add loading spinners for chunk loads
- Test on slow 3G network simulation
- Update Vite config for optimal chunking
- File: `frontend/src/App.tsx`, route components

---

### Story 2.2: Tree-Shake Unused Dependencies

**As a** frontend developer,
**I want** unused code eliminated from bundles,
**So that** bundle sizes are minimized.

**Acceptance Criteria:**

**Given** frontend dependencies with unused exports
**When** tree-shaking is optimized
**Then** bundle size reduces by ≥5%

**And** unused imports are removed:
- Lodash (use individual functions)
- Moment.js (replaced with date-fns if still present)
- Unused UI library components

**And** `npm run build` shows reduced bundle sizes
**And** all functionality remains intact (verified via tests)

**Prerequisites:** Story 2.1 complete

**Technical Notes:**
- Analyze bundle with `vite-bundle-visualizer`
- Replace full library imports with tree-shakeable alternatives
- Update imports: `import { debounce } from 'lodash'` → `import debounce from 'lodash/debounce'`
- Remove unused dependencies from package.json
- Verify Vite config enables tree-shaking

---

### Story 2.3: Optimize Images and Media Assets

**As a** frontend developer,
**I want** images optimized and lazy-loaded,
**So that** page load times are faster.

**Acceptance Criteria:**

**Given** images and media assets in frontend
**When** optimization is applied
**Then** all images are:
- Converted to WebP format (with fallback)
- Properly sized (no oversized images)
- Lazy-loaded below the fold
- Compressed with optimal quality

**And** Lighthouse flags zero image optimization warnings
**And** LCP (Largest Contentful Paint) improves by ≥20%

**Prerequisites:** Story 2.2 complete

**Technical Notes:**
- Use `<picture>` element for WebP with fallbacks
- Implement `loading="lazy"` attribute
- Add `srcset` for responsive images
- Compress with tools like imagemin
- Prioritize above-the-fold images (preload)
- Affect marketing pages and dashboard

---

### Story 2.4: Add Database Indexes for Slow Queries

**As a** backend developer,
**I want** missing database indexes added,
**So that** query performance is optimized.

**Acceptance Criteria:**

**Given** database queries analyzed with `EXPLAIN ANALYZE`
**When** missing indexes are added
**Then** slow query execution time reduces by ≥50%

**And** indexes added for:
- `deals.organization_id`, `deals.stage`, `deals.created_at`
- `documents.deal_id`, `documents.organization_id`
- `valuations.deal_id`, `valuations.created_at`
- `tasks.assigned_to`, `tasks.due_date`

**And** migration creates indexes without blocking
**And** no negative impact on write performance (verified via load testing)

**Prerequisites:** Story 2.3 complete

**Technical Notes:**
- Use PostgreSQL `CREATE INDEX CONCURRENTLY` for zero downtime
- Analyze slow query log from production (if available)
- Test index performance with realistic data volume
- Create Alembic migration: `alembic revision -m "add performance indexes"`
- Monitor index usage with `pg_stat_user_indexes`

---

### Story 2.5: Implement Redis Caching for Frequently Accessed Data

**As a** backend developer,
**I want** Redis caching for hot data,
**So that** database load is reduced and API response times improve.

**Acceptance Criteria:**

**Given** frequently accessed data (user profiles, org settings, deal counts)
**When** Redis caching is implemented
**Then** cache hit rate ≥80% for cached endpoints

**And** caching applied to:
- User session data (TTL: 5 min)
- Organization settings (TTL: 10 min)
- Deal pipeline counts (TTL: 1 min)
- Static reference data (TTL: 1 hour)

**And** cache invalidation works correctly on data updates
**And** p95 response time for cached endpoints <100ms

**Prerequisites:** Story 2.4 complete

**Technical Notes:**
- Use existing Redis instance (already configured for Celery)
- Implement decorator for cache-aside pattern
- Cache keys include organization_id for multi-tenancy
- Set appropriate TTLs per data type
- Invalidate cache on write operations
- Monitor cache hit/miss rates

---

### Story 2.6: Optimize N+1 Query Patterns with Eager Loading

**As a** backend developer,
**I want** N+1 queries eliminated,
**So that** API endpoints perform efficiently.

**Acceptance Criteria:**

**Given** API endpoints with N+1 query patterns
**When** eager loading is implemented
**Then** N+1 queries are eliminated for all major endpoints

**And** optimized endpoints:
- `GET /api/deals` (load organization, users, documents in one query)
- `GET /api/documents` (load deal, versions, access logs)
- `GET /api/valuations` (load deal, financial data, scenarios)

**And** query count reduces by ≥60% for affected endpoints
**And** response time improves by ≥40%

**Prerequisites:** Story 2.5 complete

**Technical Notes:**
- Use SQLAlchemy `joinedload()` and `selectinload()`
- Example: `db.query(Deal).options(joinedload(Deal.documents), joinedload(Deal.organization)).all()`
- Profile queries with SQL logging enabled
- Test with realistic data volumes (100+ deals per org)
- Avoid over-eager loading (selective based on endpoint needs)

---

### Story 2.7: Implement Performance Best Practices (Preload, Prefetch)

**As a** frontend developer,
**I want** browser resource hints implemented,
**So that** critical resources load faster.

**Acceptance Criteria:**

**Given** critical CSS, fonts, and API calls
**When** resource hints are added
**Then** Time to Interactive (TTI) improves by ≥15%

**And** implemented hints:
- `<link rel="preload">` for critical CSS and fonts
- `<link rel="prefetch">` for likely next routes
- DNS prefetch for external APIs (Clerk, Stripe)
- Preconnect to CDN/API domains

**And** Lighthouse flags zero preload/prefetch opportunities
**And** FCP (First Contentful Paint) <1.5s

**Prerequisites:** Story 2.6 complete

**Technical Notes:**
- Add to `index.html` and route components
- Preload: Roboto font, critical CSS
- Prefetch: /deals route from landing page
- Preconnect: clerk.com, stripe.com, render.com
- Test with throttled network

---

### Story 2.8: Tune SQLAlchemy Connection Pool Settings

**As a** backend developer,
**I want** optimized connection pool settings,
**So that** database connections are efficiently managed under load.

**Acceptance Criteria:**

**Given** SQLAlchemy connection pool with default settings
**When** pool is tuned for production load
**Then** zero connection pool exhaustion errors occur

**And** pool settings configured:
- Pool size: 10-20 connections (based on load testing)
- Max overflow: 10
- Pool timeout: 30 seconds
- Pool recycle: 3600 seconds

**And** connection health checks enabled
**And** monitoring added for pool metrics (active, idle, overflow)

**Prerequisites:** Story 2.7 complete

**Technical Notes:**
- Update `backend/app/core/database.py`
- Test with load simulation (500 concurrent requests)
- Monitor with Render metrics or Datadog
- Add logging for pool events
- Consider read replicas if needed (future enhancement)

---

## Epic 3: QuickBooks OAuth Integration

**Goal:** Enable users to connect their QuickBooks Online accounts via OAuth 2.0 to automatically sync financial data (accounts, transactions, statements) for use in deal analysis and valuation calculations.

**Business Value:** Unlock US market (QuickBooks has 80% market share for SMB accounting), reduce manual data entry, improve valuation accuracy, and increase platform stickiness.

**Success Criteria:**
- OAuth flow completes successfully
- Financial data syncs without errors
- Webhook handler processes updates within 30 seconds
- Test coverage ≥85%
- Secrets stored securely (environment variables only)

---

### Story 3.1: Create QuickBooks OAuth Data Models

**As a** backend developer,
**I want** database models for QuickBooks integration,
**So that** connection state and sync status can be persisted.

**Acceptance Criteria:**

**Given** need to store QuickBooks connection data
**When** models are created
**Then** database has tables:
- `quickbooks_integrations` (connection metadata)
- `quickbooks_sync_logs` (sync history)

**And** `QuickBooksIntegration` model includes:
- id (UUID), organization_id (FK), access_token (encrypted), refresh_token (encrypted)
- realm_id, connected_at, last_sync_at, sync_status, error_message

**And** encryption uses Fernet or similar (secrets never in plaintext)
**And** migration creates tables: `alembic revision -m "add quickbooks integration tables"`

**Prerequisites:** None (foundational)

**Technical Notes:**
- File: `backend/app/models/quickbooks_integration.py`
- Use SQLAlchemy EncryptedType for tokens
- Multi-tenant: organization_id foreign key required
- Indexes: organization_id, sync_status
- Test: Create model instances, verify encryption

---

### Story 3.2: Implement QuickBooks OAuth Authorization Flow

**As a** user,
**I want** to authorize QuickBooks access via OAuth,
**So that** the platform can sync my financial data.

**Acceptance Criteria:**

**Given** user initiates QuickBooks connection
**When** OAuth flow executes
**Then** user is redirected to QuickBooks authorization page

**And** endpoints implemented:
- `POST /api/integrations/quickbooks/authorize` - Initiates OAuth (returns authorization URL)
- `GET /api/integrations/quickbooks/callback` - Handles callback with authorization code

**And** authorization URL includes required scopes: `com.intuit.quickbooks.accounting`
**And** state parameter prevents CSRF attacks
**And** successful callback stores access/refresh tokens (encrypted)

**Prerequisites:** Story 3.1 complete

**Technical Notes:**
- Use `intuit-oauth` library or `authlib`
- OAuth endpoint: https://appcenter.intuit.com/connect/oauth2
- Callback URL must be whitelisted in QuickBooks app settings
- File: `backend/app/api/integrations/quickbooks.py`
- Test: Mock OAuth flow, verify token storage

---

### Story 3.3: Implement QuickBooks Token Refresh Logic

**As a** backend system,
**I want** automatic token refresh,
**So that** QuickBooks connections remain active without user re-authorization.

**Acceptance Criteria:**

**Given** access token expires (1 hour lifespan)
**When** token refresh logic runs
**Then** refresh token exchanges for new access/refresh tokens

**And** refresh happens:
- Automatically before token expiration
- On 401 Unauthorized responses
- Via background job (Celery task every 30 minutes)

**And** failed refreshes mark connection as `disconnected` with error message
**And** user receives notification if refresh fails

**Prerequisites:** Story 3.2 complete

**Technical Notes:**
- Refresh token valid for 100 days
- Use QuickBooks `/oauth2/v1/tokens/refresh` endpoint
- Update `last_sync_at` and `sync_status` after refresh
- Background task: `app/tasks/quickbooks_refresh_tokens.py`
- Handle edge cases: revoked tokens, deleted QuickBooks company

---

### Story 3.4: Build QuickBooks API Client Service

**As a** backend developer,
**I want** a reusable QuickBooks API client,
**So that** API calls are consistent and error-handled.

**Acceptance Criteria:**

**Given** QuickBooks integration with valid tokens
**When** API client is used
**Then** client provides methods for:
- `get_accounts()` - Fetch chart of accounts
- `get_transactions()` - Fetch transactions (invoices, bills, payments)
- `get_balance_sheet()` - Fetch balance sheet
- `get_profit_loss()` - Fetch P&L statement

**And** client handles:
- Rate limiting (500 req/min for QuickBooks)
- Exponential backoff on errors
- Token refresh on 401
- Request/response logging

**And** all methods return typed Pydantic models

**Prerequisites:** Story 3.3 complete

**Technical Notes:**
- File: `backend/app/services/quickbooks_api_client.py`
- Use `httpx.AsyncClient` for async requests
- Base URL: `https://quickbooks.api.intuit.com/v3/company/{realmId}/`
- Parse QuickBooks XML or JSON responses
- Test: Mock API responses, verify error handling

---

### Story 3.5: Implement QuickBooks Data Sync Service

**As a** user,
**I want** my QuickBooks financial data synced automatically,
**So that** valuations use latest financials without manual upload.

**Acceptance Criteria:**

**Given** active QuickBooks connection
**When** sync service runs
**Then** data is pulled and stored:
- Chart of accounts → `financial_accounts` table
- Transactions → `financial_transactions` table
- Balance sheet → `financial_statements` table
- P&L → `financial_statements` table

**And** sync triggered:
- Manually via `POST /api/integrations/quickbooks/sync`
- Automatically every 24 hours (background job)
- On webhook notifications (real-time)

**And** sync logs created with status (success/failure, records synced, errors)
**And** multi-tenant isolation enforced (organization_id)

**Prerequisites:** Story 3.4 complete

**Technical Notes:**
- File: `backend/app/services/quickbooks_sync_service.py`
- Use Celery task for async sync: `@celery_app.task`
- Map QuickBooks data to platform models
- Handle incremental sync (sync only new/updated records)
- Test: Mock sync, verify data integrity

---

### Story 3.6: Add QuickBooks Webhook Handler

**As a** backend system,
**I want** real-time webhook notifications from QuickBooks,
**So that** data stays in sync without polling.

**Acceptance Criteria:**

**Given** QuickBooks webhook configured
**When** entity changes in QuickBooks (transaction created/updated)
**Then** webhook payload received at `POST /api/webhooks/quickbooks`

**And** webhook handler:
- Verifies webhook signature (HMAC validation)
- Parses payload and identifies changed entities
- Triggers targeted sync for changed entities only
- Processes webhooks within 30 seconds
- Returns 200 OK to acknowledge receipt

**And** webhook failures logged with retry logic

**Prerequisites:** Story 3.5 complete

**Technical Notes:**
- Webhook URL must be configured in QuickBooks app settings
- Signature verification uses `intuit-signature` header
- Payload format: `{"eventNotifications": [...]}`
- Background processing via Celery for non-blocking response
- File: `backend/app/api/webhooks/quickbooks.py`
- Test: Mock webhook payloads, verify processing

---

### Story 3.7: Create QuickBooks Status and Management Endpoints

**As a** user,
**I want** to view QuickBooks connection status and manage the integration,
**So that** I can troubleshoot issues and disconnect if needed.

**Acceptance Criteria:**

**Given** QuickBooks integration exists
**When** status endpoints are called
**Then** endpoints return:
- `GET /api/integrations/quickbooks/status` - Connection status, last sync time, sync history
- `DELETE /api/integrations/quickbooks/disconnect` - Revokes access and deletes tokens

**And** status includes:
- Connected (true/false)
- Company name from QuickBooks
- Last successful sync timestamp
- Recent sync logs (last 10)
- Error messages if any

**And** disconnect revokes tokens via QuickBooks API
**And** RBAC enforced (only org Admins/Owners can disconnect)

**Prerequisites:** Story 3.6 complete

**Technical Notes:**
- File: `backend/app/api/integrations/quickbooks.py`
- Revoke endpoint: `https://developer.api.intuit.com/v2/oauth2/tokens/revoke`
- Mark integration as `disconnected` in database
- Return user-friendly error messages
- Test: Verify RBAC, revocation flow

---

### Story 3.8: Add QuickBooks Integration Tests and Documentation

**As a** backend developer,
**I want** comprehensive tests and documentation for QuickBooks integration,
**So that** functionality is validated and maintainable.

**Acceptance Criteria:**

**Given** QuickBooks integration implementation complete
**When** tests and docs are added
**Then** test coverage for integration code ≥85%

**And** tests include:
- OAuth flow (authorization, callback, token storage)
- Token refresh (success, failure, expiration)
- API client (all methods, error handling, rate limiting)
- Sync service (full sync, incremental, multi-tenant)
- Webhook handler (signature validation, entity processing)

**And** documentation added to `docs/MAINTENANCE-HANDOFF.md`:
- Setup instructions (QuickBooks app configuration)
- Environment variables required
- Troubleshooting guide
- API rate limits and quotas

**Prerequisites:** Story 3.7 complete

**Technical Notes:**
- File: `backend/tests/test_quickbooks_integration.py`
- Use pytest fixtures for mock QuickBooks responses
- Mock external API calls (no live QuickBooks calls in tests)
- Test async functions with `pytest-asyncio`
- Document sandbox/production differences

---

## Epic 4: Sage OAuth Integration

**Goal:** Enable users to connect Sage Business Cloud Accounting via OAuth 2.0 to sync financial data for UK market, mirroring QuickBooks integration architecture.

**Business Value:** Unlock UK market (Sage is dominant accounting platform in UK with 30% market share), support UK accounting standards (Companies House, HMRC), and increase addressable market by 30%.

**Success Criteria:**
- OAuth flow completes successfully
- UK financial data syncs (chart of accounts, journals, balance sheet)
- Test coverage ≥85%
- Same endpoint pattern as QuickBooks for consistency

---

### Story 4.1: Create Sage OAuth Data Models

**As a** backend developer,
**I want** database models for Sage integration,
**So that** connection state mirrors QuickBooks structure for consistency.

**Acceptance Criteria:**

**Given** need to store Sage connection data
**When** models are created
**Then** database has tables:
- `sage_integrations` (connection metadata)
- `sage_sync_logs` (sync history)

**And** `SageIntegration` model matches QuickBooks pattern:
- id, organization_id, access_token (encrypted), refresh_token (encrypted)
- company_id, connected_at, last_sync_at, sync_status, error_message

**And** migration: `alembic revision -m "add sage integration tables"`

**Prerequisites:** Epic 3 complete (learn from QuickBooks patterns)

**Technical Notes:**
- File: `backend/app/models/sage_integration.py`
- Reuse encryption approach from QuickBooks
- Indexes: organization_id, sync_status
- UK-specific: May need VAT number, Companies House number fields

---

### Story 4.2: Implement Sage OAuth Authorization Flow

**As a** user,
**I want** to authorize Sage access via OAuth,
**So that** the platform can sync my UK accounting data.

**Acceptance Criteria:**

**Given** user initiates Sage connection
**When** OAuth flow executes
**Then** user redirected to Sage authorization page

**And** endpoints implemented (same pattern as QuickBooks):
- `POST /api/integrations/sage/authorize` - Returns authorization URL
- `GET /api/integrations/sage/callback` - Handles OAuth callback

**And** authorization URL includes scopes: `full_access` or `readonly`
**And** successful callback stores tokens (encrypted)

**Prerequisites:** Story 4.1 complete

**Technical Notes:**
- OAuth endpoint: https://www.sageone.com/oauth2/auth
- Use `authlib` or custom implementation
- Callback URL whitelisted in Sage developer portal
- File: `backend/app/api/integrations/sage.py`
- Test: Mock OAuth flow

---

### Story 4.3: Implement Sage Token Refresh Logic

**As a** backend system,
**I want** automatic token refresh for Sage,
**So that** connections remain active.

**Acceptance Criteria:**

**Given** Sage access token expires (1 hour)
**When** refresh logic runs
**Then** new access/refresh tokens obtained

**And** refresh via background job (Celery every 30 minutes)
**And** failed refresh marks connection `disconnected`

**Prerequisites:** Story 4.2 complete

**Technical Notes:**
- Refresh endpoint: `https://oauth.accounting.sage.com/token`
- Refresh token valid for 90 days
- Reuse QuickBooks refresh pattern
- File: `backend/app/tasks/sage_refresh_tokens.py`

---

### Story 4.4: Build Sage API Client Service

**As a** backend developer,
**I want** a Sage API client,
**So that** API calls are consistent.

**Acceptance Criteria:**

**Given** Sage integration with valid tokens
**When** API client used
**Then** client provides methods:
- `get_accounts()` - Chart of accounts
- `get_journals()` - Journal entries
- `get_balance_sheet()` - Balance sheet
- `get_profit_loss()` - P&L

**And** handles rate limiting, errors, token refresh

**Prerequisites:** Story 4.3 complete

**Technical Notes:**
- File: `backend/app/services/sage_api_client.py`
- Base URL: `https://api.accounting.sage.com/v3.1/`
- Rate limit: 5,000 req/day
- Response format: JSON
- Test: Mock API responses

---

### Story 4.5: Implement Sage Data Sync Service

**As a** user,
**I want** Sage financial data synced automatically,
**So that** UK accounting data populates valuations.

**Acceptance Criteria:**

**Given** active Sage connection
**When** sync runs
**Then** data pulled and stored:
- Accounts, journals, balance sheet, P&L

**And** sync triggered manually, daily, or via webhook
**And** sync logs created

**Prerequisites:** Story 4.4 complete

**Technical Notes:**
- File: `backend/app/services/sage_sync_service.py`
- Map Sage data to platform models
- Handle UK VAT, Companies House data
- Celery task for async sync

---

### Story 4.6: Add Sage Webhook Handler

**As a** backend system,
**I want** Sage webhook notifications,
**So that** data syncs in real-time.

**Acceptance Criteria:**

**Given** Sage webhook configured
**When** entity changes
**Then** webhook at `POST /api/webhooks/sage` processes update

**And** signature verification
**And** processes within 30 seconds

**Prerequisites:** Story 4.5 complete

**Technical Notes:**
- Webhook URL configured in Sage portal
- Signature validation (HMAC or similar)
- File: `backend/app/api/webhooks/sage.py`

---

### Story 4.7: Create Sage Status and Management Endpoints

**As a** user,
**I want** to view Sage connection status,
**So that** I can manage UK accounting integration.

**Acceptance Criteria:**

**Given** Sage integration exists
**When** endpoints called
**Then** endpoints return:
- `GET /api/integrations/sage/status`
- `DELETE /api/integrations/sage/disconnect`

**And** status shows connection, company name, sync history

**Prerequisites:** Story 4.6 complete

**Technical Notes:**
- File: `backend/app/api/integrations/sage.py`
- Revoke tokens on disconnect
- RBAC enforced

---

### Story 4.8: Add Sage Integration Tests and Documentation

**As a** backend developer,
**I want** comprehensive tests for Sage integration,
**So that** UK market functionality is validated.

**Acceptance Criteria:**

**Given** Sage implementation complete
**When** tests added
**Then** coverage ≥85%

**And** tests cover OAuth, refresh, API client, sync, webhooks
**And** documentation in `MAINTENANCE-HANDOFF.md`

**Prerequisites:** Story 4.7 complete

**Technical Notes:**
- File: `backend/tests/test_sage_integration.py`
- Mock Sage API responses
- Document UK-specific setup (VAT, Companies House)

---

## Epic 5: NetSuite OAuth Integration

**Goal:** Enable enterprise users to connect NetSuite ERP via OAuth 2.0 for multi-entity financial consolidation, unlocking enterprise market (40% of large M&A deals use NetSuite).

**Business Value:** Unlock enterprise market, support complex multi-subsidiary structures, enable private equity portfolio company consolidations, and differentiate from competitors.

**Success Criteria:**
- OAuth flow with NetSuite SuiteCloud completed
- Multi-entity data sync operational
- Advanced mapping for subsidiaries and consolidations
- Test coverage ≥85%

---

### Story 5.1: Create NetSuite OAuth Data Models

**As a** backend developer,
**I want** database models for NetSuite integration,
**So that** complex multi-entity structures are supported.

**Acceptance Criteria:**

**Given** need to store NetSuite connection data
**When** models created
**Then** database has tables:
- `netsuite_integrations` (connection metadata)
- `netsuite_subsidiaries` (subsidiary mapping)
- `netsuite_sync_logs` (sync history)

**And** `NetSuiteIntegration` model includes:
- id, organization_id, access_token, refresh_token (encrypted)
- account_id, connected_at, last_sync_at, sync_status

**And** `NetSuiteSubsidiary` model:
- id, integration_id, subsidiary_id, subsidiary_name, currency, is_elimination

**Prerequisites:** Epic 4 complete

**Technical Notes:**
- File: `backend/app/models/netsuite_integration.py`
- Support multi-subsidiary mapping (1 integration → many subsidiaries)
- Migration: `alembic revision -m "add netsuite integration tables"`

---

### Story 5.2: Implement NetSuite OAuth Authorization Flow

**As a** enterprise user,
**I want** to authorize NetSuite access via OAuth,
**So that** multi-entity ERP data syncs.

**Acceptance Criteria:**

**Given** user initiates NetSuite connection
**When** OAuth flow executes
**Then** user redirected to NetSuite authorization

**And** endpoints:
- `POST /api/integrations/netsuite/authorize`
- `GET /api/integrations/netsuite/callback`

**And** OAuth uses TBA (Token-Based Authentication) or OAuth 2.0

**Prerequisites:** Story 5.1 complete

**Technical Notes:**
- NetSuite OAuth: https://system.netsuite.com/app/login/oauth2/authorize.nl
- Requires NetSuite account ID, consumer key/secret
- File: `backend/app/api/integrations/netsuite.py`

---

### Story 5.3: Implement NetSuite Token Refresh Logic

**As a** backend system,
**I want** NetSuite token refresh,
**So that** enterprise connections remain active.

**Acceptance Criteria:**

**Given** NetSuite token expires
**When** refresh runs
**Then** new tokens obtained

**And** refresh via background job

**Prerequisites:** Story 5.2 complete

**Technical Notes:**
- Token endpoint: https://system.netsuite.com/app/login/oauth2/token.nl
- TBA tokens may not expire (verify NetSuite docs)

---

### Story 5.4: Build NetSuite API Client Service

**As a** backend developer,
**I want** NetSuite API client,
**So that** SOAP/REST calls are abstracted.

**Acceptance Criteria:**

**Given** NetSuite integration
**When** API client used
**Then** client provides methods:
- `get_subsidiaries()` - List all subsidiaries
- `get_accounts()` - Chart of accounts per subsidiary
- `get_transactions()` - Inter-company transactions
- `get_consolidated_financials()` - Consolidated statements

**And** supports both REST and SOAP (NetSuite uses both)

**Prerequisites:** Story 5.3 complete

**Technical Notes:**
- File: `backend/app/services/netsuite_api_client.py`
- REST: `https://{account}.suitetalk.api.netsuite.com/services/rest/`
- SOAP: Use `zeep` library for SOAP client
- Rate limit: Varies by NetSuite tier

---

### Story 5.5: Implement NetSuite Multi-Entity Data Sync

**As a** enterprise user,
**I want** multi-subsidiary financial data synced,
**So that** consolidated valuations are accurate.

**Acceptance Criteria:**

**Given** NetSuite with multiple subsidiaries
**When** sync runs
**Then** data pulled for each subsidiary:
- Subsidiary-level financials
- Inter-company eliminations
- Consolidated statements
- Currency conversions

**And** sync handles complex structures (parent/child subsidiaries)

**Prerequisites:** Story 5.4 complete

**Technical Notes:**
- File: `backend/app/services/netsuite_sync_service.py`
- Map subsidiaries to platform deals or portfolios
- Handle consolidation logic
- Store subsidiary-level and consolidated data

---

### Story 5.6: Add NetSuite Advanced Mapping UI (Future - Document Only)

**As a** enterprise user,
**I want** to map NetSuite subsidiaries to deals,
**So that** multi-entity data is organized correctly.

**Acceptance Criteria:**

**Given** NetSuite subsidiaries synced
**When** mapping UI is available (future story)
**Then** user can:
- View all subsidiaries
- Map subsidiaries to deals
- Mark elimination entities
- Configure consolidation rules

**Note:** This story is documented for v1.2 but deferred to v1.3 (UI complexity). For v1.2, use default mapping (1:1 subsidiary to deal).

**Prerequisites:** Story 5.5 complete

**Technical Notes:**
- Future file: `frontend/src/pages/integrations/NetSuiteMapping.tsx`
- For v1.2: Auto-map subsidiaries to separate deals
- Document mapping requirements for future implementation

---

### Story 5.7: Add NetSuite Webhook Handler (If Available)

**As a** backend system,
**I want** NetSuite webhook notifications (if supported),
**So that** real-time sync is possible.

**Acceptance Criteria:**

**Given** NetSuite webhook support (verify availability)
**When** entity changes
**Then** webhook processes update

**Note:** NetSuite webhooks may be limited or unavailable. If unavailable, use polling (daily sync).

**Prerequisites:** Story 5.6 documented

**Technical Notes:**
- Research NetSuite webhook capabilities
- If unavailable: Skip webhook, use scheduled sync only
- File: `backend/app/api/webhooks/netsuite.py` (if applicable)

---

### Story 5.8: Create NetSuite Status Endpoints

**As a** enterprise user,
**I want** NetSuite connection status,
**So that** I can manage ERP integration.

**Acceptance Criteria:**

**Given** NetSuite integration
**When** endpoints called
**Then** endpoints return:
- `GET /api/integrations/netsuite/status`
- `GET /api/integrations/netsuite/subsidiaries`
- `DELETE /api/integrations/netsuite/disconnect`

**And** status shows subsidiaries, sync history

**Prerequisites:** Story 5.7 complete/skipped

**Technical Notes:**
- File: `backend/app/api/integrations/netsuite.py`
- Return subsidiary list with mapping status

---

### Story 5.9: Add NetSuite Integration Tests and Documentation

**As a** backend developer,
**I want** comprehensive NetSuite tests,
**So that** enterprise integration is validated.

**Acceptance Criteria:**

**Given** NetSuite implementation complete
**When** tests added
**Then** coverage ≥85%

**And** tests cover OAuth, API client, multi-entity sync
**And** documentation in `MAINTENANCE-HANDOFF.md`:
- NetSuite account setup (TBA configuration)
- Subsidiary mapping guide
- Troubleshooting multi-entity issues

**Prerequisites:** Story 5.8 complete

**Technical Notes:**
- File: `backend/tests/test_netsuite_integration.py`
- Mock NetSuite SOAP/REST responses
- Test multi-subsidiary scenarios

---

### Story 5.10: NetSuite Production Validation and Load Testing

**As a** backend developer,
**I want** NetSuite integration validated under load,
**So that** enterprise-scale usage is supported.

**Acceptance Criteria:**

**Given** NetSuite integration complete
**When** load testing performed
**Then** integration handles:
- 50+ subsidiaries per account
- 10,000+ transactions per sync
- Concurrent syncs for 10+ organizations

**And** sync completes in <10 minutes for typical enterprise account
**And** no memory leaks or connection pool exhaustion

**Prerequisites:** Story 5.9 complete

**Technical Notes:**
- Use realistic NetSuite sandbox data
- Test with `locust` or similar load testing tool
- Monitor memory usage, connection pools
- Validate async job queue handles load

---

## Epic 6: Marketing Content Library

**Goal:** Create comprehensive marketing content (blog posts, case studies, competitive comparisons, video scripts) to drive organic traffic, improve SEO, educate prospects, and establish thought leadership in M&A technology.

**Business Value:** Increase organic traffic by 200%, improve SEO rankings for target keywords, generate inbound leads, reduce customer acquisition cost, and support sales team with educational content.

**Success Criteria:**
- 10 blog posts published (1,500-2,000 words each, SEO-optimized)
- 3 customer case studies with metrics
- 3 competitive comparison pages
- 5 product demo video scripts
- All content in Markdown format under `docs/marketing/`

---

### Story 6.1: Blog Post - "Complete Guide to M&A Valuations"

**As a** content marketer,
**I want** comprehensive guide to M&A valuation methods,
**So that** prospects learn valuation fundamentals and discover our platform.

**Acceptance Criteria:**

**Given** target keyword: "M&A valuation methods"
**When** blog post created
**Then** post includes:
- 1,500-2,000 words
- Sections: DCF, Comparables, Precedent Transactions, Multiples
- 3 custom diagrams (valuation formulas, comparison charts)
- Internal links to platform valuation features
- CTA: "Try our AI-powered valuation tool"
- Meta description, H1/H2 tags optimized
- Published: `docs/marketing/blog/ma-valuation-complete-guide.md`

**And** SEO score (via Yoast or similar) ≥80/100

**Prerequisites:** None

**Technical Notes:**
- Research top-ranking content for keyword
- Include real-world examples
- Link to `/valuations` page
- Add to blog index

---

### Story 6.2: Blog Post - "How AI is Transforming Deal Flow Management"

**As a** content marketer,
**I want** article on AI in M&A,
**So that** prospects understand AI benefits and platform differentiation.

**Acceptance Criteria:**

**Given** target keyword: "AI deal flow management"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: AI use cases, automation benefits, ROI analysis
- Case study snippet (anonymized)
- CTA: "See AI deal copilots in action"
- Published: `docs/marketing/blog/ai-transforming-deal-flow.md`

**Prerequisites:** Story 6.1 complete

**Technical Notes:**
- Highlight AI narrative generation, deal matching
- Include statistics (time saved, accuracy improvement)

---

### Story 6.3: Blog Post - "Secure Data Rooms Best Practices"

**As a** content marketer,
**I want** guide to data room security,
**So that** prospects trust our platform's security features.

**Acceptance Criteria:**

**Given** target keyword: "secure data room M&A"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Watermarking, access controls, audit logs, compliance
- Security checklist (downloadable)
- CTA: "Start secure data room free trial"
- Published: `docs/marketing/blog/secure-data-rooms-best-practices.md`

**Prerequisites:** Story 6.2 complete

**Technical Notes:**
- Address SOC2, GDPR compliance
- Link to `/documents` and `/data-rooms` pages

---

### Story 6.4: Blog Post - "47 Financial Ratios Every Dealmaker Must Know"

**As a** content marketer,
**I want** comprehensive ratio guide,
**So that** prospects find evergreen SEO content and discover our analytics.

**Acceptance Criteria:**

**Given** target keyword: "financial ratios M&A"
**When** post created
**Then** post includes:
- 2,000 words (longer form for comprehensive coverage)
- All 47 ratios organized by category (liquidity, profitability, leverage, efficiency)
- Formula for each ratio
- CTA: "Automate ratio calculations with our platform"
- Published: `docs/marketing/blog/47-financial-ratios-dealmakers.md`

**Prerequisites:** Story 6.3 complete

**Technical Notes:**
- Highly searchable (long-tail keyword potential)
- Link to `/financial-intelligence` page

---

### Story 6.5: Blog Post - "Multi-Tenant SaaS Security for M&A"

**As a** content marketer,
**I want** technical article on multi-tenancy,
**So that** IT buyers understand platform security architecture.

**Acceptance Criteria:**

**Given** target keyword: "multi-tenant SaaS security"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Tenant isolation, RBAC, encryption, compliance
- Technical diagrams (architecture overview)
- CTA: "Request security whitepaper"
- Published: `docs/marketing/blog/multi-tenant-saas-security.md`

**Prerequisites:** Story 6.4 complete

**Technical Notes:**
- Address enterprise IT buyer concerns
- Mention SOC2, GDPR, data residency

---

### Story 6.6: Blog Post - "Task Automation in M&A: Save 20 Hours Per Deal"

**As a** content marketer,
**I want** ROI-focused automation article,
**So that** prospects see time-saving value proposition.

**Acceptance Criteria:**

**Given** target keyword: "M&A task automation"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Time savings breakdown (due diligence, document prep, follow-ups)
- ROI calculator (hours saved → cost savings)
- CTA: "Start automating deal tasks"
- Published: `docs/marketing/blog/task-automation-ma-save-time.md`

**Prerequisites:** Story 6.5 complete

**Technical Notes:**
- Include real task examples (NDA sending, diligence checklists)
- Link to `/automation` and `/tasks` pages

---

### Story 6.7: Blog Post - "Building Professional M&A Networks"

**As a** content marketer,
**I want** networking article,
**So that** community features are highlighted.

**Acceptance Criteria:**

**Given** target keyword: "M&A professional network"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Networking strategies, community benefits, event planning
- CTA: "Join M&A professional community"
- Published: `docs/marketing/blog/building-ma-professional-networks.md`

**Prerequisites:** Story 6.6 complete

**Technical Notes:**
- Highlight community platform features
- Link to `/community` and `/events` pages

---

### Story 6.8: Blog Post - "Event Management for M&A Conferences"

**As a** content marketer,
**I want** event management guide,
**So that** event hub features are promoted.

**Acceptance Criteria:**

**Given** target keyword: "M&A event management"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Event planning, ticketing, attendee management
- Event checklist
- CTA: "Host your M&A event on our platform"
- Published: `docs/marketing/blog/event-management-ma-conferences.md`

**Prerequisites:** Story 6.7 complete

**Technical Notes:**
- Highlight event ticketing, registration features
- Link to `/events` page

---

### Story 6.9: Blog Post - "Podcast Production for Dealmakers"

**As a** content marketer,
**I want** podcast production guide,
**So that** podcast studio features are promoted.

**Acceptance Criteria:**

**Given** target keyword: "M&A podcast production"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Content strategy, recording, distribution, monetization
- Podcast launch checklist
- CTA: "Launch your M&A podcast"
- Published: `docs/marketing/blog/podcast-production-dealmakers.md`

**Prerequisites:** Story 6.8 complete

**Technical Notes:**
- Highlight podcast platform integration
- Link to `/podcasts` page

---

### Story 6.10: Blog Post - "Subscription Billing for M&A SaaS: Lessons Learned"

**As a** content marketer,
**I want** thought leadership on SaaS business model,
**So that** platform credibility is established.

**Acceptance Criteria:**

**Given** target keyword: "SaaS subscription billing M&A"
**When** post created
**Then** post includes:
- 1,500-2,000 words
- Sections: Pricing tiers, billing strategies, churn reduction
- Lessons from building this platform
- CTA: "Explore subscription plans"
- Published: `docs/marketing/blog/subscription-billing-ma-saas.md`

**Prerequisites:** Story 6.9 complete

**Technical Notes:**
- Share insights from platform development
- Link to `/pricing` page

---

### Story 6.11: Case Study - "Boutique Bank Deal Velocity Success"

**As a** content marketer,
**I want** case study showcasing deal velocity improvement,
**So that** prospects see proven ROI.

**Acceptance Criteria:**

**Given** customer success story (anonymized if needed)
**When** case study created
**Then** case study includes:
- Customer profile (boutique investment bank, 10-person team)
- Problem: Manual deal tracking, scattered documents, slow valuations
- Solution: Platform deployment in 2 weeks
- Results: 50% faster deal velocity, 30% more deals closed
- Testimonial quote
- Published: `docs/marketing/case-studies/boutique-bank-deal-velocity.md`

**Prerequisites:** Story 6.10 complete

**Technical Notes:**
- Use real metrics (anonymize if needed)
- Include before/after comparison

---

### Story 6.12: Case Study - "Private Equity Portfolio Management"

**As a** content marketer,
**I want** PE portfolio case study,
**So that** enterprise prospects see scalability.

**Acceptance Criteria:**

**Given** PE firm success story
**When** case study created
**Then** case study includes:
- Customer: Small PE firm managing 15 portfolio companies
- Problem: Fragmented financial data, manual consolidation
- Solution: NetSuite integration + multi-deal management
- Results: 80% time savings on portfolio reporting
- Published: `docs/marketing/case-studies/pe-portfolio-management.md`

**Prerequisites:** Story 6.11 complete

**Technical Notes:**
- Highlight NetSuite integration (when available)
- Address enterprise pain points

---

### Story 6.13: Case Study - "Corporate Development Team Efficiency"

**As a** content marketer,
**I want** corporate dev case study,
**So that** enterprise market sees M&A team value.

**Acceptance Criteria:**

**Given** corporate dev team success story
**When** case study created
**Then** case study includes:
- Customer: Fortune 500 corporate development team
- Problem: Siloed tools, compliance burden, manual processes
- Solution: Unified platform with compliance features
- Results: 3x more deals evaluated per quarter
- Published: `docs/marketing/case-studies/corporate-dev-efficiency.md`

**Prerequisites:** Story 6.12 complete

**Technical Notes:**
- Address compliance and security concerns
- Include team collaboration benefits

---

### Story 6.14: Competitive Comparison - "vs. Spreadsheets"

**As a** content marketer,
**I want** spreadsheet comparison page,
**So that** prospects see platform advantages.

**Acceptance Criteria:**

**Given** common competitor (Excel/Google Sheets)
**When** comparison created
**Then** page includes:
- Feature comparison table (automation, collaboration, security)
- ROI analysis (time saved, error reduction)
- Use cases where platform wins
- CTA: "Upgrade from spreadsheets"
- Published: `docs/marketing/comparisons/vs-spreadsheets.md`

**Prerequisites:** Story 6.13 complete

**Technical Notes:**
- Address manual process pain points
- Quantify error rates and time waste

---

### Story 6.15: Competitive Comparison - "vs. DealRoom"

**As a** content marketer,
**I want** DealRoom comparison page,
**So that** prospects see differentiation from direct competitor.

**Acceptance Criteria:**

**Given** direct competitor DealRoom
**When** comparison created
**Then** page includes:
- Feature comparison (AI valuations, integrations, pricing)
- Pricing transparency
- Unique platform advantages
- CTA: "See why teams switch to us"
- Published: `docs/marketing/comparisons/vs-dealroom.md`

**Prerequisites:** Story 6.14 complete

**Technical Notes:**
- Fact-check competitor features (public info only)
- Highlight AI copilots, integrations (QuickBooks, Sage, NetSuite)

---

### Story 6.16: Competitive Comparison - "vs. Intralinks"

**As a** content marketer,
**I want** Intralinks comparison page,
**So that** enterprise prospects see modern alternative.

**Acceptance Criteria:**

**Given** legacy competitor Intralinks
**When** comparison created
**Then** page includes:
- Feature comparison (modern UX, pricing, integrations)
- Cost comparison (Intralinks high pricing vs. accessible tiers)
- Migration path from Intralinks
- CTA: "Modern M&A platform for less"
- Published: `docs/marketing/comparisons/vs-intralinks.md`

**Prerequisites:** Story 6.15 complete

**Technical Notes:**
- Position as modern, affordable alternative
- Highlight ease of use and AI features

---

### Story 6.17: Video Script - "Platform Overview (3 min)"

**As a** content marketer,
**I want** short platform overview script,
**So that** prospects get quick introduction.

**Acceptance Criteria:**

**Given** need for elevator pitch video
**When** script created
**Then** script includes:
- 3-minute duration
- Sections: Problem, Solution, Key Features (30 sec each), CTA
- Shot list for screen recordings
- Voiceover narration
- Published: `docs/marketing/video-scripts/platform-overview-3min.md`

**Prerequisites:** Story 6.16 complete

**Technical Notes:**
- Focus on top 3 value propositions
- Include demo of main dashboard

---

### Story 6.18: Video Scripts - Feature Deep Dives (4 scripts)

**As a** content marketer,
**I want** 4 feature demo scripts,
**So that** prospects learn key platform capabilities.

**Acceptance Criteria:**

**Given** 4 key features to showcase
**When** scripts created
**Then** scripts delivered for:
1. Deal Pipeline Management (5 min)
2. AI-Powered Valuations (4 min)
3. Secure Data Rooms (4 min)
4. Financial Intelligence Engine (5 min)

**And** each script includes:
- Duration target
- Step-by-step walkthrough
- Screen recording shot list
- Voiceover narration
- Key talking points

**And** published to:
- `docs/marketing/video-scripts/deal-pipeline-demo.md`
- `docs/marketing/video-scripts/ai-valuations-demo.md`
- `docs/marketing/video-scripts/data-rooms-demo.md`
- `docs/marketing/video-scripts/financial-intelligence-demo.md`

**Prerequisites:** Story 6.17 complete

**Technical Notes:**
- Use realistic demo data (not lorem ipsum)
- Show end-to-end workflows
- Include power user tips

---

## Epic Breakdown Summary

### Implementation Roadmap

**Phase 1: Quality Foundation (Weeks 1-2)**
- Epic 1: Backend Test Coverage Enhancement (6 stories)
- Fix all 5 non-critical test failures
- Achieve 90% backend coverage
- Achieve 100% test pass rate

**Phase 2: Performance Optimization (Week 2)**
- Epic 2: Performance Suite (8 stories)
- Frontend bundle optimization
- Backend caching and query optimization
- Lighthouse score improvements

**Phase 3: OAuth Integrations (Weeks 2-3)**
- Epic 3: QuickBooks (8 stories)
- Epic 4: Sage (8 stories)
- Epic 5: NetSuite (10 stories)
- Parallel development where possible

**Phase 4: Marketing Content (Week 3)**
- Epic 6: Marketing Library (18 stories)
- Can be parallelized with development
- Content creation by marketing team or AI-assisted

**Phase 5: Verification & Release (Week 3)**
- Full test suite validation (all 3,000 tests passing)
- Performance benchmarking
- Update MAINTENANCE-HANDOFF.md
- Create V1.2-COMPLETION-REPORT.md
- Tag v1.2.0-stable release

### Dependency Map

```
Epic 1 (Test Coverage) → Must complete first (foundation)
  ↓
Epic 2 (Performance) → Requires stable test suite
  ↓
Epic 3, 4, 5 (Integrations) → Can run in parallel
  ↓
Epic 6 (Marketing) → Can run in parallel with any epic
```

### Velocity Estimate

Assuming dedicated development (1 developer, full-time):
- **Sprints:** 3 sprints (1 week each)
- **Story Points:** ~58 stories (average 1-2 hours each)
- **Total Hours:** 71-86 hours
- **Timeline:** 2-3 weeks

### Success Metrics

**Quality Gates:**
- ✅ All 3,000 tests passing (100%)
- ✅ Backend coverage ≥90%
- ✅ Frontend coverage ≥85%
- ✅ Lighthouse scores meet targets

**Integration Gates:**
- ✅ All 3 OAuth integrations operational
- ✅ Test coverage ≥85% per integration
- ✅ Sandbox testing completed

**Marketing Gates:**
- ✅ All 10 blog posts published
- ✅ All 3 case studies published
- ✅ All 3 comparison pages published
- ✅ All 5 video scripts delivered

---

**For implementation:** Use the `/bmad:bmm:workflows:dev-story` workflow to implement individual stories from this epic breakdown, following strict TDD (RED-GREEN-REFACTOR) methodology.

**Created:** 2025-11-17
**Status:** Ready for Sprint Planning
**Next Step:** `/bmad:bmm:workflows:sprint-planning` to organize stories into sprints
