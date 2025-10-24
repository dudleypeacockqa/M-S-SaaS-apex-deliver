# DEV-004: Backend Clerk Session Synchronization

**Story ID**: DEV-004  
**Priority**: High  
**Estimated Duration**: 4-5 hours  
**Dependencies**: DEV-002 (Frontend Authentication)

---

## Story Overview

Synchronize Clerk session data with the FastAPI backend, enabling server-side authentication verification, user context in API handlers, and webhook-based user lifecycle management.

---

## Acceptance Criteria

- [ ] Clerk webhook endpoints implemented in FastAPI
- [ ] User model synchronized with Clerk user data
- [ ] JWT verification middleware for protected API routes
- [ ] Session validation on all protected endpoints
- [ ] User context available in all API request handlers
- [ ] Webhook signature verification implemented
- [ ] Comprehensive test coverage (pytest)
- [ ] Documentation for backend auth flow

---

## CODEX Prompt

```
Implement Clerk session synchronization with the FastAPI backend to enable server-side authentication verification and user lifecycle management.

CONTEXT:
- Project: M&A Intelligence Platform (full production)
- Completed: DEV-002 (Frontend Authentication with Clerk)
- Current state: Frontend auth working, backend has no auth
- Framework: Python 3.11 + FastAPI + SQLAlchemy + PostgreSQL
- Authentication: Clerk (frontend integrated, backend needs sync)

OBJECTIVES:
1. Implement Clerk webhook endpoints to sync user lifecycle events
2. Create JWT verification middleware for protected API routes
3. Build user model and database schema for Clerk user data
4. Provide user context in all authenticated API handlers
5. Verify webhook signatures for security
6. Follow TDD principles with pytest

REQUIREMENTS:

Database Schema:
Create a User model with fields:
- id (UUID, primary key)
- clerk_user_id (String, unique, indexed)
- email (String, unique)
- first_name (String, nullable)
- last_name (String, nullable)
- profile_image_url (String, nullable)
- created_at (DateTime)
- updated_at (DateTime)
- last_login_at (DateTime, nullable)
- is_active (Boolean, default True)
- role (Enum: solo, growth, enterprise, admin)
- organization_id (UUID, foreign key, nullable)

Clerk Webhook Endpoints:
POST /api/webhooks/clerk
- Handle user.created event
- Handle user.updated event
- Handle user.deleted event
- Handle session.created event
- Handle session.ended event
- Verify webhook signature using Clerk webhook secret
- Return 200 OK for successful processing
- Return 400 Bad Request for invalid signatures

JWT Verification Middleware:
Create a dependency that:
- Extracts JWT from Authorization header
- Verifies JWT signature using Clerk public key
- Extracts user_id from JWT claims
- Loads user from database
- Injects user into request context
- Returns 401 Unauthorized for invalid/missing tokens

Protected Route Example:
@router.get("/api/deals")
async def get_deals(current_user: User = Depends(get_current_user)):
    # current_user is automatically injected
    # Access user.id, user.email, user.role, etc.
    deals = await deal_service.get_user_deals(current_user.id)
    return deals

User Service:
Create backend/app/services/user_service.py with:
- create_user_from_clerk(clerk_data) -> User
- update_user_from_clerk(clerk_user_id, clerk_data) -> User
- delete_user(clerk_user_id) -> None
- get_user_by_clerk_id(clerk_user_id) -> User | None
- get_user_by_email(email) -> User | None
- update_last_login(clerk_user_id) -> User

Environment Variables:
Add to .env:
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

Code Organization:
backend/app/
  models/
    user.py - User model
  schemas/
    user.py - Pydantic schemas for User
  services/
    user_service.py - User business logic
  api/
    webhooks/
      clerk.py - Clerk webhook endpoints
    dependencies/
      auth.py - JWT verification middleware
  core/
    security.py - JWT utilities, signature verification

Testing Requirements:
1. Test webhook signature verification (valid/invalid)
2. Test user.created webhook creates user in database
3. Test user.updated webhook updates user in database
4. Test user.deleted webhook soft-deletes user
5. Test JWT verification with valid token
6. Test JWT verification with invalid token
7. Test JWT verification with expired token
8. Test protected route with authenticated user
9. Test protected route with unauthenticated user
10. Test user context injection in API handlers

Security Considerations:
1. Always verify webhook signatures
2. Use environment variables for secrets
3. Validate all webhook payloads
4. Implement rate limiting on webhook endpoint
5. Log all webhook events for audit trail
6. Use HTTPS only for webhook endpoints
7. Rotate webhook secrets periodically

DELIVERABLES:
1. User model and database migration
2. Clerk webhook endpoints
3. JWT verification middleware
4. User service with CRUD operations
5. Protected route examples
6. Comprehensive pytest test suite
7. Updated API documentation
8. Story completion notes in DEV-004 file

REFERENCE:
- CLAUDE.md for coding standards
- Clerk documentation: https://clerk.com/docs/backend-requests/handling/python
- FastAPI security: https://fastapi.tiangolo.com/tutorial/security/
- FULL_PRODUCTION_PRD.md for user roles and permissions

Follow TDD: Write tests first, then implement features.
Use type hints: Strict typing throughout.
Handle errors gracefully: Proper exception handling.
Log everything: Comprehensive logging for debugging.
```

---

## Test Plan

### Unit Tests (pytest)

1. **Webhook Signature Verification**:
   ```python
   def test_valid_webhook_signature():
       # Test with valid signature
       pass
   
   def test_invalid_webhook_signature():
       # Test with invalid signature, expect 400
       pass
   ```

2. **User Lifecycle Webhooks**:
   ```python
   def test_user_created_webhook():
       # Test user.created creates user in DB
       pass
   
   def test_user_updated_webhook():
       # Test user.updated updates user in DB
       pass
   
   def test_user_deleted_webhook():
       # Test user.deleted soft-deletes user
       pass
   ```

3. **JWT Verification**:
   ```python
   def test_jwt_verification_valid_token():
       # Test with valid JWT, expect user context
       pass
   
   def test_jwt_verification_invalid_token():
       # Test with invalid JWT, expect 401
       pass
   
   def test_jwt_verification_expired_token():
       # Test with expired JWT, expect 401
       pass
   ```

4. **Protected Routes**:
   ```python
   def test_protected_route_authenticated():
       # Test with valid auth, expect 200
       pass
   
   def test_protected_route_unauthenticated():
       # Test without auth, expect 401
       pass
   ```

5. **User Service**:
   ```python
   def test_create_user_from_clerk():
       # Test user creation from Clerk data
       pass
   
   def test_get_user_by_clerk_id():
       # Test user retrieval by Clerk ID
       pass
   ```

---

## Database Migration

```python
"""Add User model for Clerk integration

Revision ID: 001_add_user_model
Revises: 
Create Date: 2025-10-24
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clerk_user_id', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('first_name', sa.String(), nullable=True),
        sa.Column('last_name', sa.String(), nullable=True),
        sa.Column('profile_image_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('role', sa.Enum('solo', 'growth', 'enterprise', 'admin', name='user_role'), nullable=False),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=True),
    )

def downgrade():
    op.drop_table('users')
```

---

## Definition of Done

- [ ] User model created and migrated to database
- [ ] Clerk webhook endpoints implemented
- [ ] JWT verification middleware working
- [ ] User context available in API handlers
- [ ] Webhook signature verification implemented
- [ ] All pytest tests passing
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployed to Render and verified
- [ ] Story marked as complete in BMAD tracker

---

## Estimated Effort

- User model & migration: 1 hour
- Webhook endpoints: 1.5 hours
- JWT middleware: 1 hour
- User service: 1 hour
- Testing: 1.5 hours
- Documentation: 0.5 hours

**Total**: 4-5 hours

---

## Next Story

After completing DEV-004, proceed to:
- **DEV-005**: Role-Based Access Control (RBAC) with Clerk Claims

This will enable different user experiences based on roles (Solo, Growth, Enterprise, Admin).

