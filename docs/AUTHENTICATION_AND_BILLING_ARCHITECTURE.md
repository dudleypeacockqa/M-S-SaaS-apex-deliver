# Authentication and Billing Architecture

**Last Updated**: October 23, 2025  
**Status**: Production Configuration

---

## Overview

The M&A Intelligence Platform uses a dual-payment architecture:

1. **Clerk** handles authentication AND subscription billing (recurring payments)
2. **Stripe** handles one-off payments (events, masterclasses, premium content)

This architecture provides the best of both worlds: seamless authentication with integrated subscription management via Clerk, and flexible one-off payment processing via Stripe.

---

## Clerk: Authentication + Subscription Billing

### What Clerk Handles

**Authentication**:
- User sign-up and sign-in
- Email verification
- Password reset
- Multi-factor authentication (MFA)
- Session management
- User profile management

**Subscription Billing** (via Clerk's Stripe integration):
- Monthly recurring subscriptions
- 4 subscription tiers (Starter, Professional, Enterprise, Community Leader)
- Subscription upgrades/downgrades
- Billing portal for users to manage their subscriptions
- Automatic subscription renewal
- Subscription cancellation
- Webhook events for subscription changes

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Starter** | £279/month | Solo dealmakers, 5 active deals, basic features |
| **Professional** | £598/month | Growth firms, 25 active deals, advanced features |
| **Enterprise** | £1,598/month | Large firms, unlimited deals, all features + API access |
| **Community Leader** | £2,997/month | Event organizers, all features + community management |

### Configuration

**Clerk Dashboard** (https://dashboard.clerk.com):
1. Navigate to "Billing" section
2. Connect your Stripe account
3. Create subscription plans matching the tiers above
4. Configure webhook endpoints for subscription events

**Environment Variables**:
```bash
# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here

# Backend
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here

# Webhooks
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Implementation

#### Frontend (React)

```typescript
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);
```

```typescript
// src/components/SubscriptionButton.tsx
import { useUser } from '@clerk/clerk-react';

export const SubscriptionButton = ({ tier }: { tier: string }) => {
  const { user } = useUser();
  
  const handleSubscribe = async () => {
    // Clerk handles the subscription flow
    // Redirect to Clerk's billing portal
    window.location.href = `https://clerk.100daysandbeyond.com/subscribe?tier=${tier}`;
  };
  
  return (
    <button onClick={handleSubscribe}>
      Subscribe to {tier}
    </button>
  );
};
```

#### Backend (Python/FastAPI)

```python
# app/core/auth.py
from clerk_backend_api import Clerk
from fastapi import Depends, HTTPException, Header

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

async def get_current_user(authorization: str = Header(None)):
    """Verify Clerk JWT and return current user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Verify the JWT with Clerk
        session = clerk.sessions.verify_token(token)
        user_id = session.user_id
        
        # Get user details
        user = clerk.users.get(user_id)
        
        # Check subscription status
        subscription = user.public_metadata.get("subscription")
        
        return {
            "id": user.id,
            "email": user.email_addresses[0].email_address,
            "subscription_tier": subscription.get("tier"),
            "subscription_status": subscription.get("status")
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

```python
# app/api/webhooks/clerk.py
from fastapi import APIRouter, Request, HTTPException
from svix.webhooks import Webhook

router = APIRouter()

@router.post("/webhooks/clerk")
async def clerk_webhook(request: Request):
    """Handle Clerk webhook events for subscription changes."""
    
    # Verify webhook signature
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")
    svix_id = request.headers.get("svix-id")
    svix_timestamp = request.headers.get("svix-timestamp")
    svix_signature = request.headers.get("svix-signature")
    
    body = await request.body()
    
    try:
        wh = Webhook(webhook_secret)
        payload = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    event_type = payload["type"]
    
    if event_type == "user.subscription.created":
        # Handle new subscription
        user_id = payload["data"]["user_id"]
        tier = payload["data"]["subscription"]["tier"]
        # Update user in database
        
    elif event_type == "user.subscription.updated":
        # Handle subscription upgrade/downgrade
        pass
        
    elif event_type == "user.subscription.deleted":
        # Handle subscription cancellation
        pass
    
    return {"status": "success"}
```

---

## Stripe: One-Off Payments

### What Stripe Handles

**One-Off Payments**:
- Event ticket purchases
- Masterclass enrollments
- Premium content purchases
- One-time consulting fees
- Any non-recurring payment

### Use Cases

| Payment Type | Description | Price Range |
|--------------|-------------|-------------|
| **Event Tickets** | Quarterly forums, annual summits | £50 - £500 |
| **Masterclasses** | Specialized training sessions | £100 - £300 |
| **Premium Content** | Whitepapers, research reports | £20 - £100 |
| **Consulting** | One-time advisory services | £500 - £5,000 |

### Configuration

**Stripe Dashboard** (https://dashboard.stripe.com):
1. Create products for each payment type
2. Create prices for each product
3. Configure webhook endpoints for payment events

**Environment Variables**:
```bash
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Backend
STRIPE_SECRET_KEY=sk_test_your_secret_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Product IDs
STRIPE_EVENT_TICKET_PRICE_ID=price_event_ticket
STRIPE_MASTERCLASS_PRICE_ID=price_masterclass
STRIPE_PREMIUM_CONTENT_PRICE_ID=price_premium_content
```

### Implementation

#### Frontend (React)

```typescript
// src/components/EventCheckout.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const EventCheckout = ({ eventId, priceId }: Props) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    // Call backend to create checkout session
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price_id: priceId,
        event_id: eventId
      })
    });
    
    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId });
    
    if (result.error) {
      console.error(result.error.message);
    }
  };
  
  return (
    <button onClick={handleCheckout}>
      Purchase Ticket
    </button>
  );
};
```

#### Backend (Python/FastAPI)

```python
# app/api/checkout.py
import stripe
from fastapi import APIRouter, Depends

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter()

@router.post("/checkout/create-session")
async def create_checkout_session(
    price_id: str,
    event_id: str,
    current_user = Depends(get_current_user)
):
    """Create a Stripe Checkout session for one-off payment."""
    
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='payment',  # One-off payment
            success_url='https://apexdeliver.com/events/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://apexdeliver.com/events/cancel',
            client_reference_id=current_user["id"],
            metadata={
                'event_id': event_id,
                'user_id': current_user["id"]
            }
        )
        
        return {"sessionId": session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

```python
# app/api/webhooks/stripe.py
from fastapi import APIRouter, Request, HTTPException
import stripe

router = APIRouter()

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events for one-off payments."""
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Fulfill the purchase
        event_id = session['metadata']['event_id']
        user_id = session['metadata']['user_id']
        
        # Grant access to the event
        # Send confirmation email
        # Update database
        
    return {"status": "success"}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     M&A Intelligence Platform                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │    CLERK              │   │    STRIPE             │
    │                       │   │                       │
    │  Authentication       │   │  One-Off Payments     │
    │  +                    │   │                       │
    │  Subscription Billing │   │  - Event Tickets      │
    │                       │   │  - Masterclasses      │
    │  - User Sign-Up       │   │  - Premium Content    │
    │  - User Sign-In       │   │  - Consulting Fees    │
    │  - Session Mgmt       │   │                       │
    │  - Starter £279/mo    │   │                       │
    │  - Pro £598/mo        │   │                       │
    │  - Enterprise £1598/mo│   │                       │
    │  - Community £2997/mo │   │                       │
    └───────────────────────┘   └───────────────────────┘
                │                           │
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │  - Users        │
                    │  - Subscriptions│
                    │  - Payments     │
                    └─────────────────┘
```

---

## Webhook Configuration

### Clerk Webhooks

**Endpoint**: `https://ma-saas-backend.onrender.com/api/webhooks/clerk`

**Events to Subscribe**:
- `user.created`
- `user.updated`
- `user.deleted`
- `user.subscription.created`
- `user.subscription.updated`
- `user.subscription.deleted`

### Stripe Webhooks

**Endpoint**: `https://ma-saas-backend.onrender.com/api/webhooks/stripe`

**Events to Subscribe**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

## Testing

### Local Testing with Clerk

1. Use Clerk's test mode
2. Create test users
3. Test subscription flows
4. Use Clerk CLI to trigger webhook events locally

### Local Testing with Stripe

1. Use Stripe test mode
2. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:8000/api/webhooks/stripe
   ```
3. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

---

## Security Considerations

1. **Always verify webhook signatures** (both Clerk and Stripe)
2. **Never expose secret keys** in frontend code
3. **Use HTTPS** for all webhook endpoints
4. **Implement rate limiting** on webhook endpoints
5. **Log all payment events** for audit trail
6. **Handle webhook retries** gracefully (idempotent processing)

---

## Summary

| Aspect | Clerk | Stripe |
|--------|-------|--------|
| **Purpose** | Authentication + Subscription Billing | One-Off Payments |
| **Payment Type** | Recurring (monthly) | One-time |
| **Use Cases** | Platform subscriptions | Events, masterclasses, content |
| **Integration** | Clerk SDK + Stripe (via Clerk) | Stripe SDK |
| **Webhooks** | Clerk webhooks | Stripe webhooks |
| **User Flow** | Sign up → Subscribe → Recurring billing | Browse → Purchase → One-time payment |

This dual-payment architecture provides maximum flexibility while keeping the implementation clean and maintainable.

---

**Last Updated**: October 23, 2025  
**Maintained By**: Dudley Peacock with AI assistance

