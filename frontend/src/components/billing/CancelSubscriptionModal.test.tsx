import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import * as billingService from '../../services/billingService';

vi.mock('../../services/billingService');

const mockSubscription: billingService.Subscription = {
  id: 'sub_123',
  organization_id: 'org_123',
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
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('CancelSubscriptionModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(billingService.billingService.cancelSubscription).mockResolvedValue({
      ...mockSubscription,
      cancel_at_period_end: true,
    });
  });

  it('should not render when isOpen is false', () => {
    render(
      <CancelSubscriptionModal
        isOpen={false}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <CancelSubscriptionModal
        isOpen={true}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to cancel/i)).toBeInTheDocument();
  });

  it('should close modal when Keep Subscription button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CancelSubscriptionModal
        isOpen={true}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess={mockOnSuccess}
      />
    );

    await user.click(screen.getByText('Keep Subscription'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(billingService.billingService.cancelSubscription).not.toHaveBeenCalled();
  });

  it('should cancel subscription at period end by default', async () => {
    const user = userEvent.setup();

    render(
      <CancelSubscriptionModal
        isOpen={true}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess={mockOnSuccess}
      />
    );

    // Confirm cancellation
    await user.click(screen.getByText('Confirm Cancellation'));

    await waitFor(() => {
      expect(billingService.billingService.cancelSubscription).toHaveBeenCalledWith({
        immediately: false,
      });
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('should allow immediate cancellation when checkbox is selected', async () => {
    const user = userEvent.setup();

    render(
      <CancelSubscriptionModal
        isOpen={true}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess=  {mockOnSuccess}
      />
    );

    // Check the immediate cancellation checkbox
    const immediateCheckbox = screen.getByRole('checkbox', { name: /Cancel immediately/i });
    await user.click(immediateCheckbox);

    // Confirm cancellation
    await user.click(screen.getByText('Confirm Cancellation'));

    await waitFor(() => {
      expect(billingService.billingService.cancelSubscription).toHaveBeenCalledWith(true);
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('should display loading state while canceling', async () => {
    const user = userEvent.setup();

    // Mock a delayed response
    vi.mocked(billingService.billingService.cancelSubscription).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ...mockSubscription,
        cancel_at_period_end: true,
      }), 100))
    );

    render(
      <CancelSubscriptionModal
        isOpen={true}
        onClose={mockOnClose}
        subscription={mockSubscription}
        onSuccess={mockOnSuccess}
      />
    );

    // Confirm cancellation
    await user.click(screen.getByText('Confirm Cancellation'));

    // Should show loading state
    expect(screen.getByText(/Canceling/i)).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
