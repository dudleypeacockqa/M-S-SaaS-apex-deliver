import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PricingPage } from './PricingPage';
import { useAuth } from '@clerk/clerk-react';
import { billingService } from '../../services/billingService';

vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/billingService', () => ({
  billingService: {
    redirectToCheckout: vi.fn(),
  },
}));

const renderPricing = () =>
  render(
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
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renders all 4 pricing tiers with correct headings and prices', () => {
    renderPricing();
    const expectedTierNames = [
      'CapLiquify FP&A',
      'ApexDeliver Professional',
      'ApexDeliver Enterprise',
      'Portfolio / Community Leader',
    ];

    expectedTierNames.forEach((tier) => {
      expect(screen.getByText(tier)).toBeInTheDocument();
    });

    ['£598', '£1,598', '£2,997'].forEach((price) => {
      expect(screen.getAllByText(price)[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Contact/i)[0]).toBeInTheDocument();
  });

  it('redirects unauthenticated users to sign-in when clicking Get Started', async () => {
    renderPricing();
    const user = userEvent.setup();
    const originalAssign = window.location.assign;
    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', { value: { assign: assignMock }, writable: true });

    await user.click(screen.getByTestId('pricing-cta-starter'));

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

    await user.click(screen.getByTestId('pricing-cta-starter'));

    expect(billingService.redirectToCheckout).toHaveBeenCalledWith('starter');
    Object.defineProperty(window, 'location', { value: { assign: originalAssign } });
  });

  it('uses correct tier mapping for Professional plan', async () => {
    setAuthState(true);
    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('pricing-cta-professional'));

    expect(billingService.redirectToCheckout).toHaveBeenCalledWith('professional');
  });

  it('shows loading state while redirect promise pending', async () => {
    setAuthState(true);
    vi.mocked(billingService.redirectToCheckout).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('pricing-cta-starter'));

    expect(screen.getByText(/creating checkout/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(billingService.redirectToCheckout).toHaveBeenCalled();
    });
  });

  it('shows error message when redirect fails', async () => {
    setAuthState(true);
    vi.mocked(billingService.redirectToCheckout).mockRejectedValue(new Error('Network error'));

    renderPricing();
    const user = userEvent.setup();

    await user.click(screen.getByTestId('pricing-cta-starter'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/failed to create checkout session/i);
    });
    expect(screen.getByTestId('pricing-cta-starter')).toBeEnabled();
  });

  it('publishes canonical and og:url metadata for the 100daysandbeyond.com domain', () => {
    renderPricing();

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).not.toBeNull();
    expect(canonical?.getAttribute('href')).toBe('https://100daysandbeyond.com/pricing');

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta).not.toBeNull();
    expect(ogUrlMeta?.getAttribute('content')).toBe('https://100daysandbeyond.com/pricing');
  });
});
