import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeTierModal } from './ChangeTierModal';
import * as billingService from '../../services/billingService';

vi.mock('../../services/billingService');

const mockTiers: billingService.TierDetails[] = [
  {
    tier: 'starter',
    name: 'Starter Plan',
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
  },
  {
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
  {
    tier: 'enterprise',
    name: 'Enterprise Plan',
    price_monthly: 1598,
    price_annual: 15980,
    features: {
      max_deals: null,
      max_users: null,
      storage_gb: null,
      ai_features: true,
      api_access: true,
      priority_support: true,
    },
    stripe_price_id_monthly: 'price_enterprise_monthly',
    stripe_price_id_annual: 'price_enterprise_annual',
  },
];

describe('ChangeTierModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(billingService.billingService.getAllTiers).mockResolvedValue(mockTiers);
    vi.mocked(billingService.billingService.changeTier).mockResolvedValue({
      id: 'sub_123',
      organization_id: 'org_123',
      tier: 'enterprise',
      status: 'active',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: 'sub_stripe_123',
      current_period_start: '2025-01-01T00:00:00Z',
      current_period_end: '2025-02-01T00:00:00Z',
      cancel_at_period_end: false,
      canceled_at: null,
      trial_start: null,
      trial_end: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });
  });

  it('should not render when isOpen is false', () => {
    render(
      <ChangeTierModal
        isOpen={false}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', async () => {
    render(
      <ChangeTierModal
        isOpen={true}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Select a New Tier')).toBeInTheDocument();
    expect(
      screen.getByText((content, node) =>
        content.includes('Current tier') && node?.textContent?.includes('professional')
      )
    ).toBeTruthy();
  });

  it('should load and display all available tiers', async () => {
    render(
      <ChangeTierModal
        isOpen={true}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Starter Plan')).toBeInTheDocument();
    });

    expect(screen.getByText('Professional Plan')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Plan')).toBeInTheDocument();
    expect(billingService.billingService.getAllTiers).toHaveBeenCalledTimes(1);
  });

  it('should close modal when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ChangeTierModal
        isOpen={true}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should allow tier selection and submit change', async () => {
    const user = userEvent.setup();

    render(
      <ChangeTierModal
        isOpen={true}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Enterprise Plan')).toBeInTheDocument();
    });

    // Find and click the Enterprise tier card
    const enterpriseCard = screen.getByText('Enterprise Plan').closest('div[role="button"]');
    expect(enterpriseCard).toBeInTheDocument();
    await user.click(enterpriseCard!);

    // Confirm the tier change
    const confirmButton = screen.getByText('Confirm Change');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(billingService.billingService.changeTier).toHaveBeenCalledWith({
        new_tier: 'enterprise',
        prorate: true,
      });
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('should display loading state while changing tier', async () => {
    const user = userEvent.setup();

    // Mock a delayed response
    vi.mocked(billingService.billingService.changeTier).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        id: 'sub_123',
        organization_id: 'org_123',
        tier: 'enterprise',
        status: 'active',
        stripe_customer_id: 'cus_123',
        stripe_subscription_id: 'sub_stripe_123',
        current_period_start: '2025-01-01T00:00:00Z',
        current_period_end: '2025-02-01T00:00:00Z',
        cancel_at_period_end: false,
        canceled_at: null,
        trial_start: null,
        trial_end: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }), 100))
    );

    render(
      <ChangeTierModal
        isOpen={true}
        onClose={mockOnClose}
        currentTier="professional"
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Enterprise Plan')).toBeInTheDocument();
    });

    // Select tier and confirm
    const enterpriseCard = screen.getByText('Enterprise Plan').closest('div[role="button"]');
    await user.click(enterpriseCard!);
    await user.click(screen.getByText('Confirm Change'));

    // Should show loading state
    expect(screen.getByText(/Changing tier/i)).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
