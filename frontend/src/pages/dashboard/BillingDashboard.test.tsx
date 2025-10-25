import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BillingDashboard } from './BillingDashboard';
import * as billingService from '../../services/billingService';

vi.mock('../../services/billingService');

const mockBillingDashboard: billingService.BillingDashboard = {
  subscription: {
    id: 'sub_123',
    organization_id: 'org_123',
    tier: 'professional',
    status: 'active',
    stripe_customer_id: 'cus_123',
    stripe_subscription_id: 'sub_stripe_123',
    current_period_start: '2025-01-01T00:00:00Z',
    current_period_end: '2025-02-01T00:00:00Z',
    cancel_at_period_end: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  usage: {
    deals_count: 25,
    users_count: 5,
    documents_count: 150,
    storage_used_mb: 2500,
  },
  tier_details: {
    tier: 'professional',
    name: 'Professional Plan',
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
    stripe_price_id_monthly: 'price_professional_monthly',
    stripe_price_id_annual: 'price_professional_annual',
  },
  recent_invoices: [
    {
      id: 'inv_1',
      amount: '598.00',
      currency: 'GBP',
      status: 'paid',
      created_at: '2025-01-01T00:00:00Z',
      paid_at: '2025-01-01T00:05:00Z',
      invoice_pdf: 'https://stripe.com/invoice/inv_1.pdf',
    },
  ],
  upcoming_invoice_amount: null,
};

describe('BillingDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display subscription info when loaded', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockResolvedValue(
      mockBillingDashboard
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Professional Plan/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('should display usage metrics', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockResolvedValue(
      mockBillingDashboard
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Usage')).toBeInTheDocument();
    });

    // Check for usage metrics by looking for the specific numbers
    expect(screen.getByText('25')).toBeInTheDocument(); // Deals count
    expect(screen.getByText('5')).toBeInTheDocument(); // Users count
    expect(screen.getByText('150')).toBeInTheDocument(); // Documents count
    expect(screen.getByText('2.4 GB')).toBeInTheDocument(); // Storage
  });

  it('should display error message on API failure', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockRejectedValue(
      new Error('Failed to fetch billing data')
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
