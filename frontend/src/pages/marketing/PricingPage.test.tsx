import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PricingPage } from './PricingPage';
import * as billingService from '../../services/billingService';
import { useAuth } from '@clerk/clerk-react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/billingService', () => ({
  billingService: {
    redirectToCheckout: vi.fn(),
  },
}));

const renderPricing = () => render(
  <MemoryRouter>
    <PricingPage />
  </MemoryRouter>
);

const setAuthState = (signedIn: boolean) => {
  vi.mocked(useAuth).mockReturnValue({
    isSignedIn: signedIn,
    isLoaded: true,
  } as any);
};

describe('PricingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAuthState(false);
  });

  it('renders all 4 pricing tiers with correct headings and prices', () => {
    renderPricing();
    ['Starter', 'Professional', 'Enterprise', 'Community Leader'].forEach((tier) => {
      expect(screen.getAllByText(tier).length).toBeGreaterThan(0);
    });
    ['£279', '£598', '£1,598', '£2,997'].forEach((price) => {
      expect(screen.getByText(price)).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated users to sign-in when clicking Get Started', async () => {
    renderPricing();
    const user = userEvent.setup();
    const originalAssign = window.location.assign;
    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', { value: { assign: assignMock }, writable: true });

    await user.click(screen.getAllByRole('button', { name: /get started/i })[0]);

    expect(assignMock).toHaveBeenCalledWith('/sign-in');
    Object.defineProperty(window, 'location', { value: { assign: originalAssign } });
  });

  it('calls redirectToCheckout for authenticated users selecting Starter', async () => {
    setAuthState(true);
    renderPricing();
    const user = userEvent.setup();

    const assignMock = vi.fn();
    const originalAssign = window.location.assign;
    Object.defineProperty(window, 'location', { value: { assign: assignMock }, writable: true });

    await user.click(screen.getAllByRole('button', { name: /get started/i })[0]);

    expect(billingService.billingService.redirectToCheckout).toHaveBeenCalledWith('starter');
    Object.defineProperty(window, 'location', { value: { assign: originalAssign } });
  });

  it('uses correct tier mapping for Professional plan', async () => {
    setAuthState(true);
    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /get started/i })[1]);

    expect(billingService.billingService.redirectToCheckout).toHaveBeenCalledWith('professional');
  });

  it('shows loading state while redirect promise pending', async () => {
    setAuthState(true);
    vi.mocked(billingService.billingService.redirectToCheckout).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /get started/i })[0]);

    expect(screen.getByText(/creating checkout/i)).toBeInTheDocument();

    await waitFor(() => Expect(billingService.billingService.redirectToCheckout).toHaveBeenCalled());
  });

  it('shows error message when redirect fails', async () => {
    setAuthState(true);
    vi.mocked(billingService.billingService.redirectToCheckout).mockRejectedValue(
      new Error('Network error')
    );

    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /get started/i })[0]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to create checkout/i);
    });
    expect(screen.getAllByRole('button', { name: /get started/i })[0]).toBeEnabled();
  });
});
