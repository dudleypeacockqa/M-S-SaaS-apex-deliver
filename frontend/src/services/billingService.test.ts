import { beforeEach, describe, expect, it, vi } from 'vitest'

import { billingService, type BillingDashboard, type Subscription } from './billingService'
import { api } from './api'

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

const mockSubscription: Subscription = {
  id: 'sub_001',
  organization_id: 'org_001',
  tier: 'professional',
  status: 'active',
  stripe_customer_id: 'cus_123',
  stripe_subscription_id: 'sub_stripe_123',
  current_period_start: '2025-01-01T00:00:00Z',
  current_period_end: '2025-02-01T00:00:00Z',
  cancel_at_period_end: false,
  canceled_at: null,
  trial_start: null,
  trial_end: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: null,
}

describe('billingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches billing dashboard', async () => {
    const dashboard: BillingDashboard = {
      subscription: mockSubscription,
      usage: { deals_count: 10, users_count: 5, documents_count: 200, storage_used_mb: 1024 },
      tier_details: {
        tier: 'professional',
        name: 'Professional',
        price_monthly: 598,
        price_annual: 5980,
        features: {
          max_deals: 50,
          max_users: 10,
          storage_gb: 50,
          ai_features: true,
          api_access: true,
          priority_support: true,
        },
        stripe_price_id_monthly: 'price_monthly',
        stripe_price_id_annual: 'price_annual',
      },
      recent_invoices: [],
      upcoming_invoice_amount: null,
    }

    mockedApi.get.mockResolvedValueOnce({ data: dashboard })

    const result = await billingService.getBillingDashboard()

    expect(mockedApi.get).toHaveBeenCalledWith('/subscriptions/billing-dashboard')
    expect(result).toEqual(dashboard)
  })

  it('changes subscription tier', async () => {
    mockedApi.put.mockResolvedValueOnce({ data: mockSubscription })

    const result = await billingService.changeTier({ new_tier: 'enterprise', prorate: true })

    expect(mockedApi.put).toHaveBeenCalledWith('/subscriptions/change-tier', {
      new_tier: 'enterprise',
      prorate: true,
    })
    expect(result).toEqual(mockSubscription)
  })

  it('cancels subscription with request payload', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: mockSubscription })

    const result = await billingService.cancelSubscription({ immediately: true, reason: 'testing' })

    expect(mockedApi.post).toHaveBeenCalledWith('/subscriptions/cancel', {
      immediately: true,
      reason: 'testing',
    })
    expect(result).toEqual(mockSubscription)
  })

  it('retrieves customer portal url', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { url: 'https://portal.example.com' } })

    const result = await billingService.getCustomerPortalUrl()

    expect(mockedApi.get).toHaveBeenCalledWith('/subscriptions/customer-portal')
    expect(result).toEqual({ url: 'https://portal.example.com' })
  })

  it('creates checkout session when redirecting to checkout', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { checkout_url: 'https://checkout.example.com', session_id: 'sess_123' },
    })

    const assignSpy = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign: assignSpy } as Location,
    })

    await billingService.redirectToCheckout('starter')

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/subscriptions/create-checkout-session',
      expect.objectContaining({ tier: 'starter' })
    )
    expect(assignSpy).toHaveBeenCalledWith('https://checkout.example.com')

    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
  })
})
