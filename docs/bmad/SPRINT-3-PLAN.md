# Sprint 3 Plan: Subscription & Billing System (DEV-011)

**Sprint**: Sprint 3
**Start Date**: October 24, 2025
**Target Completion**: TBD (autonomous execution until 100%)
**Methodology**: BMAD v6-alpha + Test-Driven Development
**Priority**: HIGH (Phase 1 - Revenue Engine)

---

## 🎯 Sprint Goal

Implement a complete Stripe-based subscription and billing system with 4 pricing tiers, enabling revenue generation and user onboarding.

### Success Criteria
- ✅ Users can subscribe to any of 4 tiers
- ✅ Stripe webhooks handle all subscription events
- ✅ Subscriptions stored in database with organization
- ✅ Users can upgrade/downgrade subscriptions
- ✅ Users can access Stripe billing portal
- ✅ Feature access controlled by subscription tier
- ✅ 100% test coverage (backend + frontend)
- ✅ Production deployment verified

---

## 📋 Story: DEV-011 - Subscription & Billing System

### Story Description

**As a** platform user
**I want to** subscribe to a paid plan
**So that** I can access premium features and the platform can generate revenue

**As a** platform owner
**I want** automated subscription management via Stripe
**So that** billing is handled reliably and securely

### Acceptance Criteria

#### AC-11.1: Subscription Tiers Defined ✅
- ✅ 4 tiers configured: Starter, Professional, Enterprise, Community
- ✅ Pricing: £279, £598, £1,598, £2,997 per month
- ✅ Feature limits defined per tier
- ✅ Stripe products and prices created

#### AC-11.2: Stripe Integration
- [ ] Stripe API keys configured (test + production)
- [ ] Stripe webhooks endpoint created
- [ ] Webhook signature verification implemented
- [ ] All subscription events handled:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

#### AC-11.3: Database Schema
- [ ] `subscriptions` table created with migration
- [ ] Foreign key to `organizations` table
- [ ] Subscription status tracked (active, past_due, canceled, etc.)
- [ ] Current period start/end dates stored
- [ ] Stripe customer ID and subscription ID stored

#### AC-11.4: Backend API
- [ ] POST `/api/subscriptions/checkout` - Create Stripe checkout session
- [ ] GET `/api/subscriptions/current` - Get organization's subscription
- [ ] POST `/api/subscriptions/portal` - Create billing portal session
- [ ] POST `/api/webhooks/stripe` - Handle Stripe webhooks
- [ ] All endpoints tested with 100% coverage

#### AC-11.5: Service Layer
- [ ] `subscription_service.py` - Business logic for subscriptions
- [ ] Create subscription record
- [ ] Update subscription status
- [ ] Cancel subscription
- [ ] Check feature access by tier
- [ ] Handle webhook events

#### AC-11.6: Frontend Components
- [ ] Pricing page showing 4 tiers
- [ ] Subscription selection flow
- [ ] Redirect to Stripe Checkout
- [ ] Success/cancel return pages
- [ ] Current subscription display
- [ ] Upgrade/downgrade UI
- [ ] Billing portal access button

#### AC-11.7: Feature Access Control
- [ ] Middleware to check subscription tier
- [ ] Feature flags based on tier:
  - Starter: 1 user, basic features
  - Professional: 5 users, advanced features
  - Enterprise: Unlimited users, all features
  - Community: Custom limits
- [ ] Graceful degradation for expired subscriptions

#### AC-11.8: Testing
- [ ] Backend: All webhook events tested
- [ ] Backend: All API endpoints tested
- [ ] Frontend: Pricing page tested
- [ ] Frontend: Checkout flow tested
- [ ] Integration: Full user journey tested
- [ ] 100% test pass rate

---

## 🏗️ Technical Architecture

### Subscription Data Model

```python
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID, primary_key=True)
    organization_id = Column(UUID, ForeignKey("organizations.id"))
    stripe_customer_id = Column(String)
    stripe_subscription_id = Column(String)
    tier = Column(String)  # starter, professional, enterprise, community
    status = Column(String)  # active, past_due, canceled, incomplete
    current_period_start = Column(DateTime)
    current_period_end = Column(DateTime)
    cancel_at_period_end = Column(Boolean, default=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
```

### API Endpoints

```
POST   /api/subscriptions/checkout        # Create checkout session
GET    /api/subscriptions/current         # Get current subscription
POST   /api/subscriptions/portal          # Access billing portal
POST   /api/subscriptions/upgrade         # Upgrade subscription
POST   /api/subscriptions/cancel          # Cancel subscription
POST   /api/webhooks/stripe               # Stripe webhook handler
```

### Stripe Integration Flow

```
User → Select Tier → Frontend creates checkout session → Stripe Checkout
                                                              ↓
User pays → Stripe sends webhook → Backend updates DB → User gets access
```

---

## 📊 Subscription Tiers

| Tier | Price/month | Users | Deals | Storage | AI Credits | Features |
|------|-------------|-------|-------|---------|------------|----------|
| **Starter** | £279 | 1 | 10 | 5GB | 100/month | Basic pipeline, documents |
| **Professional** | £598 | 5 | 50 | 25GB | 500/month | + Financial analysis, valuation |
| **Enterprise** | £1,598 | Unlimited | Unlimited | 100GB | 2000/month | + API access, white-label |
| **Community** | £2,997 | Unlimited | Unlimited | 250GB | 5000/month | + Event platform, community tools |

---

## 🧪 Testing Strategy (TDD)

### Test-First Approach

**Phase 1: Webhook Tests (RED)**
```python
def test_webhook_creates_subscription():
    # Test that subscription.created event creates DB record

def test_webhook_updates_subscription_status():
    # Test that subscription.updated event updates DB

def test_webhook_cancels_subscription():
    # Test that subscription.deleted event marks canceled
```

**Phase 2: Implement Webhook Handler (GREEN)**
- Implement `/api/webhooks/stripe`
- Verify signature
- Parse events
- Update database
- **All tests pass**

**Phase 3: Refactor**
- Extract event handlers
- Improve error handling
- Add logging

### Backend Test Coverage Target: 100%

- Webhook signature verification
- Each event type handler
- Subscription creation
- Subscription updates
- Feature access checks
- Error scenarios

### Frontend Test Coverage Target: 100%

- Pricing page renders tiers
- Checkout button creates session
- Success page shows confirmation
- Billing portal access works

---

## 📅 Implementation Phases

### Phase 1: Database & Models (1-2 hours)
- [ ] Create `subscriptions` table migration
- [ ] Create `Subscription` model
- [ ] Create Pydantic schemas
- [ ] Run migration
- [ ] Verify schema

**Deliverable**: Database ready for subscriptions

### Phase 2: Stripe Webhook Handler (2-3 hours)
- [ ] Write webhook tests (TDD RED)
- [ ] Implement webhook endpoint
- [ ] Verify signature
- [ ] Handle all subscription events
- [ ] Tests pass (TDD GREEN)
- [ ] Refactor

**Deliverable**: Webhook endpoint processing Stripe events

### Phase 3: Subscription Service Layer (2-3 hours)
- [ ] Write service layer tests
- [ ] Implement subscription CRUD
- [ ] Implement feature access checks
- [ ] Handle upgrade/downgrade logic
- [ ] Tests pass

**Deliverable**: Business logic for subscriptions

### Phase 4: API Routes (2-3 hours)
- [ ] Write API endpoint tests
- [ ] Implement checkout session creation
- [ ] Implement current subscription retrieval
- [ ] Implement portal session creation
- [ ] Tests pass

**Deliverable**: REST API for subscriptions

### Phase 5: Frontend Components (3-4 hours)
- [ ] Write component tests
- [ ] Create Pricing page
- [ ] Create checkout flow
- [ ] Create success/cancel pages
- [ ] Create subscription dashboard
- [ ] Tests pass

**Deliverable**: Complete subscription UI

### Phase 6: Integration & Deployment (1-2 hours)
- [ ] End-to-end testing
- [ ] Stripe test mode verification
- [ ] Production deployment
- [ ] Stripe production mode setup
- [ ] Smoke tests

**Deliverable**: Fully functional billing system in production

**Total Estimated Time**: 12-17 hours

---

## 🔐 Security Considerations

### Webhook Security
- ✅ Verify Stripe signature on all webhooks
- ✅ Use environment variables for API keys
- ✅ Never expose secret keys to frontend
- ✅ Validate all webhook data before DB writes

### Payment Security
- ✅ All payment processing via Stripe (PCI compliant)
- ✅ No card data stored in our database
- ✅ Use Stripe Checkout (hosted payment page)
- ✅ HTTPS enforced on all endpoints

### Access Control
- ✅ Subscription checks on all feature endpoints
- ✅ Graceful degradation for expired subscriptions
- ✅ Organization-scoped subscription data

---

## 📈 Success Metrics

### Functional Metrics
- [ ] 100% test pass rate (backend + frontend)
- [ ] All 4 tiers selectable
- [ ] Webhook handles all event types
- [ ] Zero failed transactions in logs

### Performance Metrics
- [ ] Checkout session creation: <500ms
- [ ] Webhook processing: <200ms
- [ ] Subscription status check: <50ms

### Business Metrics
- [ ] Able to process real payments
- [ ] Subscriptions tracked accurately
- [ ] Revenue reportable from Stripe dashboard

---

## 🚀 Deployment Plan

### Environment Variables Needed
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PROFESSIONAL=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
STRIPE_PRICE_ID_COMMUNITY=price_...
```

### Stripe Dashboard Setup
1. Create products for each tier
2. Create prices (monthly recurring)
3. Configure webhook endpoint
4. Generate webhook signing secret
5. Test webhooks with Stripe CLI

### Deployment Steps
1. Deploy backend with new endpoints
2. Configure environment variables on Render
3. Deploy frontend with pricing page
4. Register webhook endpoint with Stripe
5. Test in Stripe test mode
6. Switch to production mode

---

## 🎯 Definition of Done

Sprint 3 is complete when:

- ✅ All database migrations run successfully
- ✅ All backend tests passing (100%)
- ✅ All frontend tests passing (100%)
- ✅ Stripe webhook endpoint verified
- ✅ All 4 tiers selectable and functional
- ✅ Users can complete checkout flow
- ✅ Users can access billing portal
- ✅ Feature access controlled by tier
- ✅ Production deployment healthy
- ✅ Stripe webhooks processing in production
- ✅ Documentation updated
- ✅ BMAD tracker updated to 100%

---

## 📚 Resources

### Stripe Documentation
- [Stripe Subscriptions API](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

### Implementation References
- Stripe Python SDK: `stripe`
- Stripe React SDK: `@stripe/stripe-js`, `@stripe/react-stripe-js`
- Webhook verification: `stripe.Webhook.construct_event()`

---

## ✅ Pre-Flight Checklist

Before starting implementation:

- ✅ Sprint 2 is 100% complete (verified)
- ✅ All tests passing (133/133)
- ✅ Production deployments healthy
- ✅ Git up to date with origin/main
- ✅ PRD reviewed for requirements
- ✅ Stripe account ready (test mode)
- ✅ Story drafted and approved
- ✅ TDD methodology ready

**Ready to begin Sprint 3!** 🚀

---

**Document Version**: 1.0
**Created**: October 24, 2025
**Methodology**: BMAD v6-alpha
**Estimated Duration**: 12-17 hours
**Priority**: HIGH (Revenue Engine)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
