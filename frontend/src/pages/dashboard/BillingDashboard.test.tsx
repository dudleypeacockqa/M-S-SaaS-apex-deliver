import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    billing_period: 'monthly',
    cancel_at_period_end: false,
    canceled_at: null,
    trial_start: null,
    trial_end: null,
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

  it('shows loading skeleton while fetching data', () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(screen.getByTestId('billing-dashboard-loading')).toBeInTheDocument();
  });

  it('renders subscription details once loaded', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockResolvedValue(
      mockBillingDashboard
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText('Subscription & Billing')).toBeInTheDocument();
    expect(screen.getByText(/Professional Plan/)).toBeInTheDocument();
    expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/£598/)[0]).toBeInTheDocument();
  });

  it('renders usage metrics with progress bars', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockResolvedValue(
      mockBillingDashboard
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText('Usage Overview')).toBeInTheDocument();
    const activeDealsRow = screen.getByText('Active Deals').closest('div');
    expect(activeDealsRow).toHaveTextContent('25 / 50');

    const teamMembersRow = screen.getByText('Team Members').closest('div');
    expect(teamMembersRow).toHaveTextContent('5 / 10');

    const documentsRow = screen.getByText('Total Documents').closest('div');
    expect(documentsRow).toHaveTextContent('150');

    const storageRow = screen.getByText('Storage Used').closest('div');
    expect(storageRow).toHaveTextContent('2 GB / 50 GB');
  });

  it('renders invoice table', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockResolvedValue(
      mockBillingDashboard
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText('Recent Invoices')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    vi.mocked(billingService.billingService.getBillingDashboard).mockRejectedValue(
      new Error('Failed to load billing data')
    );

    render(
      <BrowserRouter>
        <BillingDashboard />
      </BrowserRouter>
    );

    expect(await screen.findByTestId('billing-dashboard-error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to load billing data/)).toBeInTheDocument();
  });
});
