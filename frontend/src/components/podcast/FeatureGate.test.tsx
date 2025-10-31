/**
 * TDD Phase 1 (RED): Tests for podcast FeatureGate component
 *
 * FeatureGate component controls access to tier-gated podcast features
 * and displays upgrade CTAs when users lack access.
 *
 * Requirements from DEV-016:
 * - Check feature access via API (/podcasts/features/{feature})
 * - Show children when access granted
 * - Show upgrade CTA when access denied
 * - Handle loading and error states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FeatureGate } from './FeatureGate';

// Mock hooks used by FeatureGate
const mockFeatureAccess = {
  hasAccess: true,
  isLoading: false,
  error: null,
  requiredTier: 'professional',
  requiredTierLabel: 'Professional',
  upgradeMessage: null,
  upgradeCtaUrl: null,
};

const mockSubscriptionTier = {
  tier: 'professional' as const,
  label: 'Professional',
  isLoading: false,
  isAtLeast: vi.fn((tier: string) => tier === 'starter' || tier === 'professional'),
};

vi.mock('../../hooks/useFeatureAccess', () => ({
  useFeatureAccess: vi.fn(() => mockFeatureAccess),
}));

vi.mock('../../hooks/useSubscriptionTier', () => ({
  useSubscriptionTier: vi.fn(() => mockSubscriptionTier),
}));

import { useFeatureAccess } from '../../hooks/useFeatureAccess';
import { useSubscriptionTier } from '../../hooks/useSubscriptionTier';

describe('FeatureGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks to default state
    mockFeatureAccess.hasAccess = true;
    mockFeatureAccess.isLoading = false;
    mockFeatureAccess.error = null;
    mockFeatureAccess.requiredTier = 'professional';
    mockFeatureAccess.requiredTierLabel = 'Professional';
    mockFeatureAccess.upgradeMessage = null;
    mockFeatureAccess.upgradeCtaUrl = null;

    mockSubscriptionTier.tier = 'professional';
    mockSubscriptionTier.label = 'Professional';
    mockSubscriptionTier.isLoading = false;
    mockSubscriptionTier.isAtLeast = vi.fn((tier: string) => tier === 'starter' || tier === 'professional');
  });

  describe('Access Granted', () => {
    it('should render children when user has access', () => {
      mockFeatureAccess.hasAccess = true;
      mockSubscriptionTier.isAtLeast = vi.fn(() => true);

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Podcast Content')).toBeInTheDocument();
    });

    it('should not render upgrade CTA when access granted', () => {
      mockFeatureAccess.hasAccess = true;
      mockSubscriptionTier.tier = 'premium';
      mockSubscriptionTier.label = 'Premium';
      mockSubscriptionTier.isAtLeast = vi.fn(() => true);

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Podcast Content')).toBeInTheDocument();
      expect(screen.queryByText(/upgrade/i)).not.toBeInTheDocument();
    });
  });

  describe('Access Denied', () => {
    it('should render upgrade CTA when user lacks access', () => {
      mockFeatureAccess.hasAccess = false;
      mockFeatureAccess.requiredTier = 'professional';
      mockFeatureAccess.requiredTierLabel = 'Professional';
      mockFeatureAccess.upgradeMessage = 'Upgrade to Professional tier to unlock audio podcasting.';
      mockFeatureAccess.upgradeCtaUrl = '/pricing';
      mockSubscriptionTier.tier = 'starter';
      mockSubscriptionTier.label = 'Starter';
      mockSubscriptionTier.isAtLeast = vi.fn(() => false);

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
    });

    it('should not render children when access denied', () => {
      mockFeatureAccess.hasAccess = false;
      mockFeatureAccess.requiredTier = 'premium';
      mockFeatureAccess.requiredTierLabel = 'Premium';
      mockFeatureAccess.upgradeMessage = 'Upgrade to Premium tier to unlock video podcasting.';
      mockFeatureAccess.upgradeCtaUrl = '/pricing';
      mockSubscriptionTier.tier = 'professional';
      mockSubscriptionTier.label = 'Professional';
      mockSubscriptionTier.isAtLeast = vi.fn(() => false);

      render(
        <FeatureGate feature="podcast_video">
          <div>Video Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      expect(screen.queryByText('Video Content')).not.toBeInTheDocument();
    });

    it('should display required tier in upgrade CTA', () => {
      mockFeatureAccess.hasAccess = false;
      mockFeatureAccess.requiredTier = 'premium';
      mockFeatureAccess.requiredTierLabel = 'Premium';
      mockFeatureAccess.upgradeMessage = 'Upgrade to Premium tier to unlock video podcasting.';
      mockFeatureAccess.upgradeCtaUrl = '/pricing';
      mockSubscriptionTier.tier = 'professional';
      mockSubscriptionTier.label = 'Professional';
      mockSubscriptionTier.isAtLeast = vi.fn(() => false);

      render(
        <FeatureGate feature="podcast_video">
          <div>Video Content</div>
        </FeatureGate>
      );

      expect(screen.getByRole('button', { name: /upgrade to premium/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while checking access', () => {
      mockFeatureAccess.isLoading = true;
      mockSubscriptionTier.isLoading = false;

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/checking feature access/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should deny access by default when API fails', () => {
      mockFeatureAccess.hasAccess = false;
      mockFeatureAccess.error = new Error('Network error');
      mockSubscriptionTier.isAtLeast = vi.fn(() => false);

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
      expect(screen.queryByText('Podcast Content')).not.toBeInTheDocument();
    });

    it('should display error message when API fails', () => {
      mockFeatureAccess.hasAccess = false;
      mockFeatureAccess.error = new Error('Network error');
      mockSubscriptionTier.isAtLeast = vi.fn(() => false);

      render(
        <FeatureGate feature="podcast_audio">
          <div>Podcast Content</div>
        </FeatureGate>
      );

      expect(screen.getByText(/could not verify access/i)).toBeInTheDocument();
    });
  });
});
