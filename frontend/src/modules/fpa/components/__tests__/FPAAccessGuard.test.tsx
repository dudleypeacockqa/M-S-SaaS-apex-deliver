import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FPAAccessGuard } from '../FPAAccessGuard';
import { useFPAAccess } from '../../hooks/useFPAAccess';

vi.mock('../../hooks/useFPAAccess', () => ({
  useFPAAccess: vi.fn(),
}));

const mockUseFPAAccess = vi.mocked(useFPAAccess);

describe('FPAAccessGuard', () => {
  beforeEach(() => {
    mockUseFPAAccess.mockReset();
  });

  const renderGuard = () =>
    render(
      <MemoryRouter>
        <FPAAccessGuard>
          <div>child</div>
        </FPAAccessGuard>
      </MemoryRouter>
    );

  it('renders loader state while verifying access', () => {
    mockUseFPAAccess.mockReturnValue({
      hasAccess: false,
      isLoading: true,
      error: null,
      upgradeMessage: '',
      requiredTier: 'Professional',
      upgradeCtaUrl: '/pricing',
    });

    renderGuard();

    expect(screen.getByText(/checking fp&a access/i)).toBeInTheDocument();
  });

  it('shows upgrade prompt when access is missing', () => {
    mockUseFPAAccess.mockReturnValue({
      hasAccess: false,
      isLoading: false,
      error: null,
      upgradeMessage: 'Upgrade required',
      requiredTier: 'Professional',
      upgradeCtaUrl: '/pricing',
    });

    renderGuard();

    expect(screen.getByText(/capliquify fp&a access required/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view pricing/i })).toBeInTheDocument();
  });

  it('renders children when access is granted', () => {
    mockUseFPAAccess.mockReturnValue({
      hasAccess: true,
      isLoading: false,
      error: null,
      upgradeMessage: null,
      requiredTier: 'Professional',
      upgradeCtaUrl: '/pricing',
    });

    render(
      <MemoryRouter>
        <FPAAccessGuard>
          <div>secure content</div>
        </FPAAccessGuard>
      </MemoryRouter>
    );

    expect(screen.getByText(/secure content/i)).toBeInTheDocument();
  });
});
