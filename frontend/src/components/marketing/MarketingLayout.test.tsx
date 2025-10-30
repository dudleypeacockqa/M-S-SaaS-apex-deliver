/**
 * Tests for MarketingLayout component
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketingLayout } from './MarketingLayout';

// Mock child components
vi.mock('./MarketingNav', () => ({
  MarketingNav: () => <nav data-testid="marketing-nav">Marketing Nav</nav>,
}));

vi.mock('./Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('./OptInPopup', () => ({
  OptInPopup: () => <div data-testid="optin-popup">Opt-in Popup</div>,
}));

vi.mock('./AnalyticsProvider', () => ({
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../common/StructuredData', () => ({
  StructuredData: () => null,
}));

describe('MarketingLayout Component', () => {
  describe('Component Rendering', () => {
    it('should render MarketingNav component', () => {
      render(
        <MarketingLayout>
          <div>Test content</div>
        </MarketingLayout>
      );
      expect(screen.getByTestId('marketing-nav')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      render(
        <MarketingLayout>
          <div>Test content</div>
        </MarketingLayout>
      );
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render OptInPopup component', () => {
      render(
        <MarketingLayout>
          <div>Test content</div>
        </MarketingLayout>
      );
      expect(screen.getByTestId('optin-popup')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <MarketingLayout>
          <div>Test page content</div>
        </MarketingLayout>
      );
      expect(screen.getByText('Test page content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render skip to main content link', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    });

    it('should have main element with aria-label', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('aria-label', 'Main content');
    });

    it('should have main element with id for skip link', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });

  describe('Layout Structure', () => {
    it('should wrap content in flex container', () => {
      const { container } = render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('min-h-screen');
      expect(wrapper.className).toContain('flex');
    });
  });
});
