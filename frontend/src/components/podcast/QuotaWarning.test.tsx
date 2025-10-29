import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import QuotaWarning from './QuotaWarning';
import type { QuotaSummary } from '../../services/api/podcasts';

describe('QuotaWarning', () => {
  const buildQuota = (overrides: Partial<QuotaSummary> = {}): QuotaSummary => ({
    tier: 'professional',
    tierLabel: 'Professional',
    limit: 10,
    remaining: 4,
    used: 6,
    isUnlimited: false,
    period: '2025-10',
    periodLabel: 'October 2025',
    periodStart: '2025-10-01T00:00:00Z',
    periodEnd: '2025-10-31T23:59:59Z',
    quotaState: 'normal',
    warningStatus: null,
    warningMessage: null,
    upgradeRequired: false,
    upgradeMessage: null,
    upgradeCtaUrl: '/pricing',
    ...overrides,
  });

  it('renders nothing for unlimited plans', () => {
    const { container } = render(<QuotaWarning quota={buildQuota({ isUnlimited: true, limit: null })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows warning when usage crosses threshold', () => {
    render(<QuotaWarning quota={buildQuota({ used: 8, remaining: 2 })} threshold={0.75} />);
    expect(screen.getByRole('status')).toHaveTextContent('80% of your monthly quota');
    expect(screen.getByText(/resets on/i)).toBeInTheDocument();
  });

  it('shows upgrade call-to-action when quota exceeded', () => {
    render(
      <QuotaWarning
        quota={buildQuota({ used: 10, remaining: 0, quotaState: 'critical', upgradeRequired: true, upgradeMessage: 'Upgrade for unlimited episodes' })}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Quota exhausted');
    expect(screen.getByRole('link', { name: /view upgrade options/i })).toBeInTheDocument();
  });

  it('caps percentage display at 100%', () => {
    render(<QuotaWarning quota={buildQuota({ used: 15, remaining: -5 })} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('does not render when usage below threshold', () => {
    const { container } = render(<QuotaWarning quota={buildQuota({ used: 3, remaining: 7 })} threshold={0.8} />);
    expect(container).toBeEmptyDOMElement();
  });
});
