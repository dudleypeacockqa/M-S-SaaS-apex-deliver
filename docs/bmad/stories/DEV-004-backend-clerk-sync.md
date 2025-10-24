# Story: Backend Clerk Session Synchronization

**Story ID**: DEV-004  
**Status**: In Progress  
**Related PRD Sections**: 3.1 User & Organization Management, 6.1 Architecture & Stack, 6.2 Security  
**Related Technical Spec Sections**: 2.2 Backend Services, 4.3 Authentication & Authorization, 5.2 Security Controls

## Problem Statement
Frontend authentication is operational via Clerk, but the FastAPI backend lacks awareness of Clerk users, sessions, and tokens. Without server-side validation, API endpoints cannot enforce access control, making integration with future frontend features and backend services impossible.

## Objectives
- Register Clerk webhook endpoints to ingest user and session lifecycle events.
- Persist Clerk user data in the platform database for downstream use.
- Provide JWT verification middleware so protected API routes can authorize requests.
- Supply request handlers with the authenticated user context.
- Guarantee webhook signatures are verified and logged for auditability.

## Acceptance Criteria
1. `/api/webhooks/clerk` endpoint processes `user.created`, `user.updated`, `user.deleted`, `session.created`, and `session.ended` events with signature verification.
2. `User` SQLAlchemy model and migration capture Clerk metadata (role, profile, timestamps).
3. Auth dependency validates Clerk JWTs (including caching Clerk JWKS/public keys) and injects the corresponding `User` into the request context.
4. Protected sample route demonstrates enforced authentication and returns 401 for missing/invalid tokens.
5. Pytest suite covers webhook flows (valid/invalid signatures), user persistence, JWT validation scenarios, and protected route behavior.
6. Documentation updates clarify environment variables, webhook handling, and backend auth flow.

## Implementation Notes
- Use `python-jose` or similar to verify Clerk-issued tokens against JWKS.
- Cache Clerk JWKS using an in-memory TTL to avoid repeated network calls (mocked during tests).
- Soft delete users on `user.deleted` events to preserve referential integrity.
- Expose service layer (`user_service.py`) to encapsulate persistence logic and keep routes thin.
- Store Clerk secrets in environment variables (`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `CLERK_PUBLISHABLE_KEY`).
- Ensure tests mock external calls (Clerk JWKS fetch, webhook payloads) to remain deterministic offline.

## Deliverables
- [x] Dependency alignment for Clerk SDK (pydantic 2.8.2, httpx 0.27.0, requests 2.32.3).
- SQLAlchemy model, Pydantic schemas, and Alembic migration for `User`.
- Webhook router (`backend/app/api/webhooks/clerk.py`) with signature verification.
- Auth dependency (`backend/app/api/dependencies/auth.py`) plus supporting utilities in `backend/app/core/security.py`.
- User service providing create, update, delete, and lookup helpers.
- Pytest coverage for webhook + auth middleware.
- Updates to `.env.example`, BMAD tracker, and technical specifications reflecting backend auth.

## Risks & Mitigations
- **Risk**: External JWKS calls fail during runtime.  
  **Mitigation**: Implement caching and graceful fallbacks with descriptive errors.
- **Risk**: Signature verification bugs expose the webhook endpoint.  
  **Mitigation**: Enforce strict verification with unit tests covering tampered signatures.
- **Risk**: User schema diverges from Clerk data.  
  **Mitigation**: Centralize Clerk-to-model mapping in the service layer with explicit field handling.

## Next Steps After Completion
- DEV-005: Implement RBAC and feature flag enforcement using stored user roles.
- DEV-006: Wire protected backend endpoints for deal pipeline data leveraging the auth layer.

## Current Progress
- [x] Verified backend requirements install after resolving version conflicts.
- [ ] Implement webhook route, auth dependency, and persistence logic.
- [ ] Add backend pytest coverage; current suite collects 0 tests (needs scaffolding).
