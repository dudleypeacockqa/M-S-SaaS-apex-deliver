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

// Don't mock StructuredData - we need to test the actual schema output

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

  describe('Structured Data - Organization Schema', () => {
    it('should use FinanceFlo branding in organization schema', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      
      // Find structured data script tag by ID
      const schemaScript = document.getElementById('organization-schema');
      expect(schemaScript).not.toBeNull();
      
      const orgSchema = schemaScript?.textContent ? JSON.parse(schemaScript.textContent) : null;
      expect(orgSchema).not.toBeNull();
      
      // Assert FinanceFlo branding
      expect(orgSchema['@type']).toBe('Organization');
      expect(orgSchema.name).toBe('FinanceFlo');
      expect(orgSchema.url).toBe('https://financeflo.ai');
      expect(orgSchema.url).not.toContain('100daysandbeyond.com');
      expect(orgSchema.url).not.toContain('apexdeliver.com');
      expect(orgSchema.logo).toContain('financeflo.ai');
      expect(orgSchema.description).toContain('FinanceFlo');
    });

    it('should have FinanceFlo contact information', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      
      const schemaScript = document.getElementById('organization-schema');
      const orgSchema = schemaScript?.textContent ? JSON.parse(schemaScript.textContent) : null;
      
      // Verify contact point uses FinanceFlo email
      if (orgSchema?.contactPoint) {
        const contactPoint = Array.isArray(orgSchema.contactPoint) 
          ? orgSchema.contactPoint[0] 
          : orgSchema.contactPoint;
        expect(contactPoint.email).toContain('financeflo');
        expect(contactPoint.email).not.toContain('apexdeliver');
      }
    });

    it('should have FinanceFlo social media links', () => {
      render(
        <MarketingLayout>
          <div>Content</div>
        </MarketingLayout>
      );
      
      const schemaScript = document.getElementById('organization-schema');
      const orgSchema = schemaScript?.textContent ? JSON.parse(schemaScript.textContent) : null;
      
      if (orgSchema?.sameAs && Array.isArray(orgSchema.sameAs)) {
        // Verify social links don't reference legacy domains
        orgSchema.sameAs.forEach((link: string) => {
          expect(link).not.toContain('apexdeliver');
          expect(link).not.toContain('100daysandbeyond');
        });
      }
    });
  });
});
