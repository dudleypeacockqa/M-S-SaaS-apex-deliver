# DEV-011: Subscription & Billing System

**Story ID**: DEV-011
**Sprint**: Sprint 3
**Priority**: HIGH (Phase 1 - Revenue Engine)
**Estimated Effort**: 12-17 hours
**Status**: 🔄 IN PROGRESS
**Started**: October 24, 2025

---

## 📖 User Story

**As a** M&A platform user
**I want to** subscribe to a paid plan via Stripe
**So that** I can access premium features based on my tier

**As a** platform owner
**I want** automated subscription and billing management
**So that** revenue is tracked reliably and users are managed automatically

---

## 🎯 Business Context

### Why This Matters
This is the **revenue engine** for the entire platform. Without subscriptions:
- No way to monetize users
- No user onboarding flow
- Cannot validate product-market fit
- Cannot fund further development

### Business Goals
- Enable £1.4M ARR target (Year 1)
- Support 4 pricing tiers (£279 - £2,997/month)
- Automate billing to reduce manual overhead
- Provide self-service subscription management

### User Value
- Clear pricing options for different user types
- Self-service subscription changes
- Transparent billing through Stripe
- Feature access matches subscription tier

---

## ✅ Acceptance Criteria

### AC-11.1: Subscription Tiers Configured
**Given** I am implementing the billing system
**When** I configure Stripe products
**Then** I should create 4 tiers with correct pricing:
- Starter: £279/month
- Professional: £598/month
- Enterprise: £1,598/month
- Community: £2,997/month

**And** each tier should have defined feature limits

### AC-11.2: User Can Subscribe
**Given** I am a new user without a subscription
**When** I navigate to the pricing page
**Then** I should see all 4 tiers with features and pricing

**When** I click "Subscribe" on a tier
**Then** I should be redirected to Stripe Checkout

**When** I complete payment successfully
**Then** my organization should have an active subscription
**And** I should be redirected to a success page
**And** I should have access to tier-appropriate features

### AC-11.3: Stripe Webhooks Processed
**Given** a user completes Stripe Checkout
**When** Stripe sends `customer.subscription.created` webhook
**Then** the system should create a subscription record in the database
**And** associate it with the user's organization

**When** Stripe sends `customer.subscription.updated` webhook
**Then** the system should update the subscription status

**When** Stripe sends `customer.subscription.deleted` webhook
**Then** the system should mark the subscription as canceled

**When** Stripe sends `invoice.payment_failed` webhook
**Then** the system should update subscription status to `past_due`

**And** all webhook calls must verify Stripe signature

### AC-11.4: User Can Access Billing Portal
**Given** I have an active subscription
**When** I click "Manage Billing" in settings
**Then** I should be redirected to Stripe Customer Portal
**And** I should be able to:
- Update payment method
- View billing history
- Download invoices
- Cancel subscription

### AC-11.5: Feature Access Controlled
**Given** I have a Starter subscription
**When** I try to add a 2nd user
**Then** I should see an upgrade prompt (Starter allows 1 user)

**Given** I have a Professional subscription
**When** I access financial analysis features
**Then** I should have access (included in Professional+)

**Given** I have an expired subscription
**When** I access any premium feature
**Then** I should see a resubscribe prompt

### AC-11.6: Subscription Upgrades/Downgrades
**Given** I have a Starter subscription
**When** I upgrade to Professional
**Then** Stripe should prorate the charge
**And** my features should update immediately
**And** my subscription record should reflect the new tier

### AC-11.7: Testing Complete
**Given** the implementation is complete
**When** I run the test suite
**Then** all backend tests should pass (100%)
**And** all frontend tests should pass (100%)
**And** all webhook events should be tested
**And** all API endpoints should be tested

---

## 🏗️ Technical Specifications

### Database Schema

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise', 'community')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### API Endpoints

```python
# Subscription Management
POST   /api/subscriptions/checkout          # Create Stripe Checkout session
GET    /api/subscriptions/current           # Get current subscription
POST   /api/subscriptions/portal            # Create billing portal session
POST   /api/subscriptions/upgrade           # Upgrade subscription
POST   /api/subscriptions/cancel            # Cancel subscription

# Webhooks
POST   /api/webhooks/stripe                 # Stripe webhook handler
```

### Pydantic Schemas

```python
class SubscriptionTier(str, Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    COMMUNITY = "community"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    INCOMPLETE = "incomplete"
    TRIALING = "trialing"

class SubscriptionCreate(BaseModel):
    tier: SubscriptionTier
    success_url: str
    cancel_url: str

class SubscriptionResponse(BaseModel):
    id: UUID
    organization_id: UUID
    tier: SubscriptionTier
    status: SubscriptionStatus
    current_period_end: datetime
    cancel_at_period_end: bool

class CheckoutSessionResponse(BaseModel):
    session_id: str
    url: str

class BillingPortalResponse(BaseModel):
    url: str
```

### Stripe Webhook Events to Handle

```python
HANDLED_EVENTS = [
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.trial_will_end",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "customer.created",
    "customer.updated",
]
```

### Feature Limits by Tier

```python
TIER_LIMITS = {
    "starter": {
        "users": 1,
        "deals": 10,
        "storage_gb": 5,
        "ai_credits_monthly": 100,
        "features": ["pipeline", "documents"],
    },
    "professional": {
        "users": 5,
        "deals": 50,
        "storage_gb": 25,
        "ai_credits_monthly": 500,
        "features": ["pipeline", "documents", "financial_analysis", "valuation"],
    },
    "enterprise": {
        "users": None,  # Unlimited
        "deals": None,  # Unlimited
        "storage_gb": 100,
        "ai_credits_monthly": 2000,
        "features": ["pipeline", "documents", "financial_analysis", "valuation", "api_access"],
    },
    "community": {
        "users": None,  # Unlimited
        "deals": None,  # Unlimited
        "storage_gb": 250,
        "ai_credits_monthly": 5000,
        "features": ["pipeline", "documents", "financial_analysis", "valuation", "api_access", "events", "community"],
    },
}
```

---

## 🧪 Test Plan (TDD)

### Backend Tests (Target: 100% coverage)

**Webhook Tests** (`test_stripe_webhooks.py`):
```python
def test_webhook_signature_verification_valid()
def test_webhook_signature_verification_invalid()
def test_webhook_subscription_created()
def test_webhook_subscription_updated()
def test_webhook_subscription_deleted()
def test_webhook_payment_succeeded()
def test_webhook_payment_failed()
def test_webhook_unknown_event_type()
```

**Subscription Service Tests** (`test_subscription_service.py`):
```python
def test_create_subscription()
def test_get_subscription_by_organization()
def test_update_subscription_status()
def test_cancel_subscription()
def test_check_feature_access_allowed()
def test_check_feature_access_denied()
def test_check_tier_limit_within()
def test_check_tier_limit_exceeded()
```

**Subscription API Tests** (`test_subscription_endpoints.py`):
```python
def test_create_checkout_session_success()
def test_create_checkout_session_requires_auth()
def test_get_current_subscription_success()
def test_get_current_subscription_none()
def test_create_portal_session_success()
def test_upgrade_subscription_success()
def test_cancel_subscription_success()
```

### Frontend Tests (Target: 100% coverage)

**Pricing Page Tests** (`Pricing.test.tsx`):
```typescript
it('renders all 4 pricing tiers')
it('shows correct prices for each tier')
it('shows feature lists for each tier')
it('calls checkout API when Subscribe clicked')
it('redirects to Stripe Checkout on success')
```

**Subscription Dashboard Tests** (`SubscriptionDashboard.test.tsx`):
```typescript
it('displays current subscription tier')
it('shows next billing date')
it('shows Manage Billing button')
it('creates portal session when button clicked')
it('shows upgrade prompt for lower tiers')
```

---

## 📁 File Structure

### Backend Files to Create
```
backend/
├── app/
│   ├── models/
│   │   └── subscription.py              # Subscription model
│   ├── schemas/
│   │   └── subscription.py              # Pydantic schemas
│   ├── services/
│   │   └── subscription_service.py      # Business logic
│   ├── api/
│   │   ├── routes/
│   │   │   └── subscriptions.py         # API endpoints
│   │   └── webhooks/
│   │       └── stripe.py                # Stripe webhook handler (update existing)
│   └── core/
│       └── subscription.py              # Feature access checks
└── tests/
    ├── test_subscription_service.py
    ├── test_subscription_endpoints.py
    └── test_stripe_webhooks.py
```

### Frontend Files to Create
```
frontend/
└── src/
    ├── pages/
    │   ├── Pricing.tsx                  # Pricing page
    │   ├── SubscriptionSuccess.tsx      # Success page
    │   └── SubscriptionCancel.tsx       # Cancel page
    ├── components/
    │   ├── SubscriptionCard.tsx         # Tier card component
    │   └── SubscriptionDashboard.tsx    # Current subscription display
    ├── services/
    │   └── api/
    │       └── subscriptions.ts         # API client
    └── tests/
        ├── Pricing.test.tsx
        └── SubscriptionDashboard.test.tsx
```

---

## 🔄 Implementation Workflow (TDD)

### Phase 1: Database Foundation
1. Create migration for `subscriptions` table
2. Create `Subscription` model
3. Run migration
4. Verify schema in database

### Phase 2: Webhook Handler (TDD)
1. **RED**: Write failing webhook tests
2. **GREEN**: Implement webhook endpoint
   - Verify Stripe signature
   - Parse webhook payload
   - Handle each event type
   - Update database
3. **REFACTOR**: Extract event handlers, improve error handling
4. **VERIFY**: All webhook tests passing

### Phase 3: Service Layer (TDD)
1. **RED**: Write failing service tests
2. **GREEN**: Implement subscription service
   - CRUD operations
   - Feature access checks
   - Tier limit checks
3. **REFACTOR**: Optimize queries, improve logic
4. **VERIFY**: All service tests passing

### Phase 4: API Routes (TDD)
1. **RED**: Write failing API tests
2. **GREEN**: Implement API endpoints
   - Create checkout session
   - Get current subscription
   - Create portal session
   - Upgrade/cancel subscription
3. **REFACTOR**: Standardize error responses
4. **VERIFY**: All API tests passing

### Phase 5: Frontend (TDD)
1. **RED**: Write failing component tests
2. **GREEN**: Implement components
   - Pricing page
   - Subscription dashboard
   - Success/cancel pages
3. **REFACTOR**: Improve UX, add loading states
4. **VERIFY**: All frontend tests passing

### Phase 6: Integration & Deployment
1. End-to-end testing (manual)
2. Stripe test mode verification
3. Deploy to production
4. Configure production Stripe keys
5. Test in production with test card
6. Monitor webhooks in Stripe dashboard

---

## 📊 Progress Tracking

### Checklist

**Database & Models**:
- [ ] Migration created
- [ ] Subscription model implemented
- [ ] Pydantic schemas created
- [ ] Migration applied

**Backend - Webhooks**:
- [ ] Webhook tests written (TDD RED)
- [ ] Webhook endpoint implemented
- [ ] Signature verification working
- [ ] All events handled
- [ ] Tests passing (TDD GREEN)

**Backend - Service Layer**:
- [ ] Service tests written (TDD RED)
- [ ] Subscription CRUD implemented
- [ ] Feature access checks implemented
- [ ] Tests passing (TDD GREEN)

**Backend - API Routes**:
- [ ] API tests written (TDD RED)
- [ ] Checkout session endpoint
- [ ] Current subscription endpoint
- [ ] Portal session endpoint
- [ ] Tests passing (TDD GREEN)

**Frontend - Components**:
- [ ] Component tests written (TDD RED)
- [ ] Pricing page implemented
- [ ] Subscription dashboard implemented
- [ ] Success/cancel pages implemented
- [ ] Tests passing (TDD GREEN)

**Integration & Deployment**:
- [ ] Stripe test mode configured
- [ ] End-to-end test passed
- [ ] Production deployment
- [ ] Stripe production mode configured
- [ ] Production smoke test passed

**Documentation**:
- [ ] API documentation updated
- [ ] BMAD tracker updated
- [ ] Completion summary created

---

## 🎯 Definition of Done

This story is complete when:

- ✅ All database migrations successful
- ✅ All backend tests passing (100%)
- ✅ All frontend tests passing (100%)
- ✅ Stripe webhooks verified working
- ✅ Users can subscribe to all 4 tiers
- ✅ Users can access billing portal
- ✅ Feature access controlled by tier
- ✅ Production deployment healthy
- ✅ Stripe webhooks processing in production
- ✅ BMAD documentation updated

---

## 🚨 Risks & Mitigation

### Risk: Webhook Replay Attacks
**Mitigation**: Verify Stripe signature, check event timestamp, deduplicate events by ID

### Risk: Failed Payments
**Mitigation**: Handle `invoice.payment_failed` webhook, send notification, grace period

### Risk: Race Conditions (webhook vs API)
**Mitigation**: Use Stripe subscription ID as source of truth, handle idempotently

### Risk: Subscription Downgrade Mid-Period
**Mitigation**: Use Stripe's prorated billing, apply changes at period end

---

## 📚 References

- [Stripe Subscriptions Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Stripe Python SDK](https://github.com/stripe/stripe-python)
- [Stripe React SDK](https://github.com/stripe/stripe-js)

---

**Story Status**: 🔄 IN PROGRESS
**Created**: October 24, 2025
**Methodology**: BMAD v6-alpha + TDD

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
