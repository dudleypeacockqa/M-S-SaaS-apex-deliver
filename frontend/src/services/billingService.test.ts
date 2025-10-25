import { describe, it, expect, vi, beforeEach } from 'vitest';
import { billingService } from './billingService';
import * as apiModule from './api';

// Mock the api module
vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('billingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts to checkout session endpoint', async () => {
    const mockSession = { checkout_url: 'https://stripe/checkout', session_id: 'sess_123' };
    vi.mocked(apiModule.api.post).mockResolvedValue({ data: mockSession } as any);

    const result = await billingService.createCheckoutSession({ tier: 'professional' });

    expect(apiModule.api.post).toHaveBeenCalledWith(
      '/subscriptions/create-checkout-session',
      { tier: 'professional' }
    );
    expect(result).toEqual(mockSession);
  });

  it('returns subscription when available', async () => {
    const mockSubscription = {
      id: 'sub_123',
      tier: 'starter',
      status: 'active',
      organization_id: 'org_123',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
    };
    vi.mocked(apiModule.api.get).mockResolvedValue({ data: mockSubscription } as any);

    const result = await billingService.getMySubscription();

    expect(apiModule.api.get).toHaveBeenCalledWith('/subscriptions/me');
    expect(result).toEqual(mockSubscription);
  });

  it('fetches billing dashboard data', async () => {
    const mockDashboard = {
      subscription: {
        id: 'sub_123',
        tier: 'professional',
        status: 'active',
        organization_id: 'org_123',
        stripe_customer_id: 'cus_123',
        stripe_subscription_id: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: null,
        trial_end: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: null,
      },
      usage: { deals_count: 5, users_count: 3, documents_count: 20, storage_used_mb: 512 },
      tier_details: {
        tier: 'professional' as const,
        name: 'Professional',
        price_monthly: 598,
        price_annual: 5980,
        features: {
          max_deals: null,
          max_users: null,
          storage_gb: null,
          ai_features: true,
          api_access: true,
          priority_support: true
        },
        stripe_price_id_monthly: 'price_monthly',
        stripe_price_id_annual: 'price_annual'
      },
      recent_invoices: [],
      upcoming_invoice_amount: null,
    };
    vi.mocked(apiModule.api.get).mockResolvedValue({ data: mockDashboard } as any);

    const result = await billingService.getBillingDashboard();

    expect(apiModule.api.get).toHaveBeenCalledWith('/subscriptions/billing-dashboard');
    expect(result).toEqual(mockDashboard);
  });

  it('sends tier change request', async () => {
    const mockResponse = {
      id: 'sub_123',
      tier: 'enterprise' as const,
      status: 'active' as const,
      organization_id: 'org_123',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
    };
    vi.mocked(apiModule.api.put).mockResolvedValue({ data: mockResponse } as any);

    const result = await billingService.changeTier({ new_tier: 'enterprise', prorate: false });

    expect(apiModule.api.put).toHaveBeenCalledWith(
      '/subscriptions/change-tier',
      { new_tier: 'enterprise', prorate: false }
    );
    expect(result).toEqual(mockResponse);
  });

  it('requests end-of-period cancellation by default', async () => {
    const mockResponse = {
      id: 'sub_123',
      cancel_at_period_end: true,
      tier: 'starter' as const,
      status: 'active' as const,
      organization_id: 'org_123',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: null,
      current_period_start: null,
      current_period_end: null,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: null,
    };
    vi.mocked(apiModule.api.post).mockResolvedValue({ data: mockResponse } as any);

    const result = await billingService.cancelSubscription({ immediately: false });

    expect(apiModule.api.post).toHaveBeenCalledWith(
      '/subscriptions/cancel',
      { immediately: false }
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetches public tier information', async () => {
    const mockTiers = [
      {
        tier: 'starter' as const,
        name: 'Starter',
        price_monthly: 279,
        price_annual: 2790,
        features: {
          max_deals: 10,
          max_users: 3,
          storage_gb: 10,
          ai_features: false,
          api_access: false,
          priority_support: false,
        },
        stripe_price_id_monthly: 'price_starter_monthly',
        stripe_price_id_annual: 'price_starter_annual',
      }
    ];
    vi.mocked(apiModule.api.get).mockResolvedValue({ data: mockTiers } as any);

    const result = await billingService.getAllTiers();

    expect(apiModule.api.get).toHaveBeenCalledWith('/subscriptions/tiers');
    expect(result).toEqual(mockTiers);
  });

  it('retrieves customer portal URL', async () => {
    const mockPortal = { url: 'https://portal.stripe.com/session_123' };
    vi.mocked(apiModule.api.get).mockResolvedValue({ data: mockPortal } as any);

    const result = await billingService.getCustomerPortalUrl();

    expect(apiModule.api.get).toHaveBeenCalledWith('/subscriptions/customer-portal');
    expect(result).toEqual(mockPortal);
  });

  it('redirects to checkout with success/cancel URLs', async () => {
    const mockSession = { checkout_url: 'https://stripe/checkout', session_id: 'sess_123' };
    vi.mocked(apiModule.api.post).mockResolvedValue({ data: mockSession } as any);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        origin: 'https://app.example.com',
        assign: vi.fn(),
      },
    });

    await billingService.redirectToCheckout('starter');

    expect(apiModule.api.post).toHaveBeenCalledWith(
      '/subscriptions/create-checkout-session',
      {
        tier: 'starter',
        success_url: 'https://app.example.com/checkout/success',
        cancel_url: 'https://app.example.com/checkout/cancel',
      }
    );
    expect(window.location.assign).toHaveBeenCalledWith(mockSession.checkout_url);
  });
});
