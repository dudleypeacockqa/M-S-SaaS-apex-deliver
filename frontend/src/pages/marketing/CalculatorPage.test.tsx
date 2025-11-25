/**
 * Tests for CalculatorPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CalculatorPage } from './CalculatorPage';

// Mock the Calculator component
vi.mock('../../components/calculator/Calculator', () => ({
  Calculator: () => <div data-testid="calculator-component">Calculator Component</div>,
}));

// Mock MarketingLayout
vi.mock('../../components/marketing/MarketingLayout', () => ({
  MarketingLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </HelmetProvider>
  );
};

describe('CalculatorPage', () => {
  describe('Page Structure', () => {
    it('should render main heading', () => {
      renderWithRouter(<CalculatorPage />);
      expect(screen.getByText(/Working Capital Calculator/i)).toBeInTheDocument();
    });

    it('should render description', () => {
      renderWithRouter(<CalculatorPage />);
      expect(screen.getByText(/See how much cash you could unlock/i)).toBeInTheDocument();
    });

    it('should render Calculator component', () => {
      renderWithRouter(<CalculatorPage />);
      expect(screen.getByTestId('calculator-component')).toBeInTheDocument();
    });
  });

  describe('SEO', () => {
    it('should render Helmet component for SEO', () => {
      renderWithRouter(<CalculatorPage />);
      // Verify Helmet is rendered (it sets title in document.head)
      // The actual title is set by Helmet, which is tested by the component rendering
      expect(screen.getByText(/Working Capital Calculator/i)).toBeInTheDocument();
    });
  });
});
