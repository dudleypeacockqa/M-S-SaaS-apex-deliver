# DEV-009: Subscription & Billing Management

**Story ID**: DEV-009
**Epic**: Phase 1 - Foundational Core Features
**Feature**: F-005 - Subscription & Billing
**Priority**: HIGH
**Complexity**: Medium-High
**Estimated Effort**: 16-20 hours
**Dependencies**:
- DEV-004 (Backend Auth) ✅
- DEV-005 (Master Admin Portal) ✅
**Status**: READY FOR IMPLEMENTATION

---

## Business Context

Subscription & Billing is the revenue engine of the M&A Intelligence Platform. It enables the business model (£1.4M ARR target Year 1) by providing Stripe-powered subscription management across 4 tiers: Starter (£279/month), Professional (£598/month), Enterprise (£1,598/month), and Community (£2,997/month).

**Business Value**:
- Enables monetization of the platform
- Automates subscription lifecycle management
- Provides self-service billing portal for customers
- Reduces manual billing overhead
- Essential for achieving revenue targets

**Target Users**:
- New users during onboarding (subscription selection)
- Existing users upgrading/downgrading tiers
- Admin users managing organization billing
- Finance team monitoring revenue

---

## User Stories

### US-9.1: Select Subscription Tier During Onboarding
**As a** new user signing up for the platform
**I want to** select a subscription tier that matches my needs
**So that** I can access the appropriate features for my use case

**Acceptance Criteria**:
- ✅ User sees 4 subscription tier options after sign-up
- ✅ Each tier displays: price, features, limits clearly
- ✅ User can select a tier and proceed to Stripe Checkout
- ✅ Successful payment redirects to dashboard with tier activated
- ✅ Failed payment shows error and allows retry
- ✅ Free trial option available (14-day trial before charging)
- ✅ Subscription status synced to database via Stripe webhooks

**Test Scenarios**:
```python
def test_subscription_tier_selection():
    """User can view and select subscription tiers"""
    assert tiers == ['starter', 'professional', 'enterprise', 'community']
    assert each_tier_has_price_and_features()

def test_stripe_checkout_redirect():
    """Clicking 'Subscribe' redirects to Stripe Checkout"""
    response = create_checkout_session(tier='professional')
    assert response.url.startswith('https://checkout.stripe.com')

def test_successful_payment_webhook():
    """Webhook activates subscription after successful payment"""
    webhook_event = stripe_webhook('checkout.session.completed')
    assert user.subscription_tier == 'professional'
    assert user.subscription_status == 'active'
```

---

### US-9.2: View Current Subscription Status
**As a** logged-in user
**I want to** view my current subscription details
**So that** I know my billing status and usage limits

**Acceptance Criteria**:
- ✅ User can access "Billing" page from settings/profile menu
- ✅ Page shows: current tier, billing cycle, next payment date, amount
- ✅ Page shows: usage metrics (e.g., deals created, documents uploaded)
- ✅ Page shows: tier limits (e.g., max 10 deals on Starter tier)
- ✅ "Upgrade" button visible if on lower tier
- ✅ "Manage Subscription" button links to Stripe Customer Portal

**Test Scenarios**:
```python
def test_billing_page_displays_subscription():
    """Billing page shows current subscription details"""
    user = create_user(tier='professional')
    response = client.get('/settings/billing')
    assert 'Professional Plan' in response.text
    assert '£598/month' in response.text
    assert 'Next billing: December 1, 2025' in response.text
```

---

### US-9.3: Upgrade/Downgrade Subscription Tier
**As a** user with an active subscription
**I want to** change my subscription tier
**So that** I can access more features (upgrade) or reduce costs (downgrade)

**Acceptance Criteria**:
- ✅ User can click "Upgrade" to see higher tiers
- ✅ User can click "Change Plan" to see all tiers
- ✅ Proration is calculated and displayed before confirmation
- ✅ Stripe handles tier change and webhook updates database
- ✅ User immediately gets new tier features (upgrade) or loses features (downgrade)
- ✅ Downgrade takes effect at end of billing period (unless immediate)

**Test Scenarios**:
```python
def test_upgrade_tier():
    """User can upgrade from Starter to Professional"""
    user = create_user(tier='starter')
    response = upgrade_subscription(user.id, new_tier='professional')
    assert response.status_code == 200
    assert user.subscription_tier == 'professional'

def test_downgrade_scheduled():
    """Downgrade scheduled for end of billing period"""
    user = create_user(tier='professional')
    downgrade_subscription(user.id, new_tier='starter', immediate=False)
    assert user.subscription_tier == 'professional'  # Still active
    assert user.scheduled_downgrade_tier == 'starter'
    assert user.downgrade_at == user.next_billing_date
```

---

### US-9.4: Cancel Subscription
**As a** user with an active subscription
**I want to** cancel my subscription
**So that** I stop being charged

**Acceptance Criteria**:
- ✅ User can click "Cancel Subscription" from Billing page
- ✅ Cancellation confirmation modal shows: "Are you sure? Access ends on [date]"
- ✅ User can choose: "Cancel immediately" or "Cancel at period end"
- ✅ Stripe processes cancellation and webhook updates database
- ✅ User retains access until end of paid period
- ✅ Admin receives notification of cancellation (for retention outreach)

**Test Scenarios**:
```python
def test_cancel_subscription_at_period_end():
    """User cancels but retains access until billing date"""
    user = create_user(tier='professional', next_billing='2025-12-01')
    cancel_subscription(user.id, immediately=False)
    assert user.subscription_status == 'active'  # Still active
    assert user.cancel_at_period_end == True
    assert user.access_until == '2025-12-01'
```

---

### US-9.5: Handle Failed Payments
**As a** user with a payment failure
**I want to** update my payment method and retry
**So that** I don't lose access to the platform

**Acceptance Criteria**:
- ✅ Stripe webhook notifies backend of payment failure
- ✅ User subscription status changes to 'past_due'
- ✅ User receives email notification to update payment method
- ✅ Banner in app prompts: "Payment failed. Update payment method"
- ✅ User can click "Update Payment" → redirects to Stripe portal
- ✅ After successful retry, subscription status returns to 'active'
- ✅ After 3 failed retries (configurable), subscription status → 'unpaid' and access restricted

**Test Scenarios**:
```python
def test_payment_failed_webhook():
    """Payment failure marks subscription as past_due"""
    webhook_event = stripe_webhook('invoice.payment_failed')
    user = get_user_from_webhook(webhook_event)
    assert user.subscription_status == 'past_due'
    assert user.payment_failed_at == datetime.now()

def test_restrict_access_after_multiple_failures():
    """Access restricted after 3 failed payment attempts"""
    user = create_user(subscription_status='past_due', failed_attempts=3)
    assert user.subscription_status == 'unpaid'
    assert user.has_access() == False
```

---

### US-9.6: Admin View Organization Billing
**As an** admin user
**I want to** view billing details for all organizations
**So that** I can monitor revenue and handle billing issues

**Acceptance Criteria**:
- ✅ Admin can access "Billing Dashboard" from Master Admin Portal
- ✅ Dashboard shows: total MRR, ARR, churn rate, new subscriptions
- ✅ Dashboard lists all organizations with: tier, status, MRR, next billing
- ✅ Admin can filter by: tier, status (active, past_due, canceled)
- ✅ Admin can click organization to see detailed billing history
- ✅ Admin can manually update subscription (e.g., comped plans, extensions)

**Test Scenarios**:
```python
def test_admin_billing_dashboard():
    """Admin can view revenue metrics"""
    admin = create_admin_user()
    response = client.get('/admin/billing', headers=auth_headers(admin))
    assert 'MRR: £50,000' in response.text
    assert 'ARR: £600,000' in response.text

def test_admin_filter_organizations_by_tier():
    """Admin can filter organizations by subscription tier"""
    response = client.get('/admin/billing?tier=professional')
    assert all(org.tier == 'professional' for org in response.json())
```

---

## Technical Specification

### Backend Implementation

#### 1. Database Models

**Subscription Table**:
```python
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID, ForeignKey("organizations.id"), unique=True, nullable=False)
    stripe_customer_id = Column(String, unique=True, nullable=False)
    stripe_subscription_id = Column(String, unique=True, nullable=True)

    tier = Column(Enum('starter', 'professional', 'enterprise', 'community'), nullable=False)
    status = Column(Enum('active', 'past_due', 'canceled', 'unpaid', 'trialing'), default='trialing')

    current_period_start = Column(DateTime(timezone=True), nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True), nullable=True)

    trial_start = Column(DateTime(timezone=True), nullable=True)
    trial_end = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="subscription")
```

**Invoice Table** (for billing history):
```python
class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID, ForeignKey("organizations.id"), nullable=False)
    stripe_invoice_id = Column(String, unique=True, nullable=False)

    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    currency = Column(String(3), default='GBP')
    status = Column(Enum('draft', 'open', 'paid', 'void', 'uncollectible'), nullable=False)

    invoice_pdf = Column(String, nullable=True)  # URL to PDF
    paid_at = Column(DateTime(timezone=True), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

#### 2. API Endpoints

**Stripe Checkout**:
```python
@router.post("/billing/create-checkout-session")
async def create_checkout_session(
    tier: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Stripe Checkout session for subscription"""
    # Create Stripe customer if doesn't exist
    # Create Checkout session with price based on tier
    # Return session URL
```

**Get Subscription**:
```python
@router.get("/billing/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription details"""
```

**Update Subscription**:
```python
@router.post("/billing/update-subscription")
async def update_subscription(
    new_tier: str,
    immediate: bool = True,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade/downgrade subscription tier"""
```

**Cancel Subscription**:
```python
@router.post("/billing/cancel")
async def cancel_subscription(
    immediately: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel subscription"""
```

**Stripe Webhooks**:
```python
@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    # Verify webhook signature
    # Handle events:
    #   - checkout.session.completed → activate subscription
    #   - customer.subscription.updated → update status
    #   - customer.subscription.deleted → mark as canceled
    #   - invoice.payment_succeeded → record payment
    #   - invoice.payment_failed → mark as past_due
```

#### 3. Stripe Configuration

**Price IDs** (from Stripe Dashboard):
```python
STRIPE_PRICES = {
    'starter_monthly': 'price_starter_monthly_id',
    'professional_monthly': 'price_professional_monthly_id',
    'enterprise_monthly': 'price_enterprise_monthly_id',
    'community_monthly': 'price_community_monthly_id',
}
```

**Tier Limits**:
```python
TIER_LIMITS = {
    'starter': {
        'max_deals': 10,
        'max_documents': 100,
        'max_users': 1,
        'features': ['basic_pipeline', 'document_room']
    },
    'professional': {
        'max_deals': 50,
        'max_documents': 1000,
        'max_users': 5,
        'features': ['basic_pipeline', 'document_room', 'advanced_analytics', 'api_access']
    },
    # ... enterprise, community
}
```

### Frontend Implementation

#### 1. Pages

**Pricing Page** (`/pricing`):
- Display 4 subscription tiers with pricing
- Feature comparison table
- "Start Free Trial" / "Subscribe Now" buttons
- Redirect to Stripe Checkout on selection

**Billing Settings Page** (`/settings/billing`):
- Current subscription status card
- Usage metrics vs. tier limits
- "Upgrade Plan" button
- "Manage Subscription" button (Stripe Customer Portal)
- Billing history table

**Checkout Success Page** (`/checkout/success`):
- Confirmation message: "Payment successful!"
- "Go to Dashboard" button
- Background: webhook activates subscription

**Checkout Cancel Page** (`/checkout/cancel`):
- "Payment canceled" message
- "Try Again" button
- Return to pricing page

#### 2. Components

**PricingCard Component**:
```typescript
interface PricingCardProps {
  tier: 'starter' | 'professional' | 'enterprise' | 'community';
  price: number;
  features: string[];
  isCurrentTier?: boolean;
  onSelect: () => void;
}
```

**BillingStatusCard Component**:
```typescript
interface BillingStatusProps {
  subscription: Subscription;
  onUpgrade: () => void;
  onManage: () => void;
}
```

#### 3. API Client

**Billing API** (`services/api/billing.ts`):
```typescript
export async function createCheckoutSession(tier: string): Promise<{ url: string }> {
  // POST /api/billing/create-checkout-session
}

export async function getSubscription(): Promise<Subscription> {
  // GET /api/billing/subscription
}

export async function updateSubscription(newTier: string): Promise<void> {
  // POST /api/billing/update-subscription
}

export async function cancelSubscription(immediately: boolean): Promise<void> {
  // POST /api/billing/cancel
}

export async function getCustomerPortalUrl(): Promise<{ url: string }> {
  // GET /api/billing/customer-portal
}
```

---

## Test-Driven Development Plan

### Phase 1: Backend Tests (RED)
1. Write tests for Subscription model
2. Write tests for Stripe Checkout session creation
3. Write tests for webhook event handling
4. Write tests for subscription CRUD endpoints

### Phase 2: Backend Implementation (GREEN)
1. Implement Subscription model with migrations
2. Implement Stripe integration (checkout, webhooks)
3. Implement subscription service layer
4. Implement API endpoints

### Phase 3: Frontend Tests (RED)
1. Write tests for PricingCard component
2. Write tests for BillingSettings page
3. Write tests for checkout flow
4. Write tests for subscription status display

### Phase 4: Frontend Implementation (GREEN)
1. Build pricing page with tier cards
2. Build billing settings page
3. Integrate Stripe Checkout redirect
4. Display subscription status and usage

### Phase 5: Integration Testing
1. End-to-end test: Sign up → Select tier → Payment → Dashboard
2. Test webhook flow: Stripe event → Database update
3. Test upgrade flow: Change tier → Proration → Confirmation
4. Test cancellation flow: Cancel → Retain access → Expiration

---

## Definition of Done

### Backend
- ✅ Subscription model with Alembic migration
- ✅ 4 Stripe products configured in Stripe Dashboard
- ✅ Checkout session creation endpoint
- ✅ Webhook endpoint with signature verification
- ✅ Subscription CRUD endpoints (get, update, cancel)
- ✅ Customer Portal URL generation endpoint
- ✅ 20+ backend tests passing (100% coverage)

### Frontend
- ✅ Pricing page with 4 tier cards
- ✅ Billing settings page with status and usage
- ✅ Stripe Checkout integration (redirect flow)
- ✅ Success/cancel pages
- ✅ "Manage Subscription" button → Stripe portal
- ✅ 15+ frontend tests passing

### Integration
- ✅ End-to-end subscription flow works in staging
- ✅ Webhooks successfully update database
- ✅ Admin can view billing dashboard
- ✅ Documentation updated (API docs, README)

### Production Readiness
- ✅ Stripe live mode keys configured
- ✅ Webhook endpoint registered in Stripe Dashboard
- ✅ Test cards work in test mode
- ✅ Revenue tracking setup (analytics)
- ✅ Customer email notifications configured

---

## Risks & Mitigation

**Risk**: Webhook failures cause subscription status inconsistency
**Mitigation**: Implement webhook retry logic, idempotency keys, manual reconciliation admin tool

**Risk**: Users upgrade/downgrade frequently causing proration complexity
**Mitigation**: Use Stripe's built-in proration handling, clearly communicate charges to users

**Risk**: Payment failures lead to churn
**Mitigation**: Implement dunning emails (3 reminders), grace period (7 days), easy payment update flow

**Risk**: Stripe outage blocks sign-ups
**Mitigation**: Allow sign-ups without payment (trial mode), queue payment for later, fallback to manual billing

---

## Success Metrics

- **Conversion Rate**: 30% of sign-ups convert to paid (target)
- **MRR Growth**: £10K+ MRR by end of Sprint 3
- **Churn Rate**: <5% monthly churn
- **Payment Success Rate**: >95% of payments succeed on first attempt
- **Customer Portal Usage**: 60%+ of billing actions self-service (not support tickets)

---

## Next Steps After Completion

1. **DEV-010**: Financial Intelligence Engine (F-006) - Accounting integrations, ratio calculations
2. **DEV-011**: Multi-Method Valuation Suite (F-007) - DCF, Comparables, Precedent Transactions
3. **Marketing**: Launch pricing page publicly, SEO optimization
4. **Sales**: Outreach to beta users, offer discounted early adopter pricing

---

**Story Created**: October 24, 2025
**Ready for Sprint 3**: ✅ Yes
**Estimated Sprint Duration**: 4-5 days (16-20 hours)
