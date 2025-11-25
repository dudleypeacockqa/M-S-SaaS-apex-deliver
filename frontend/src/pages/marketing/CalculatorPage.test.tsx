/**
 * Tests for CalculatorPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CalculatorPage } from './CalculatorPage';

// Mock the Calculator component
vi.mock('../../components/calculator/Calculator', () => ({
  Calculator: () => <div data-testid="calculator-component">Calculator Component</div>,
}));

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
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
    it('should render Helmet for SEO', () => {
      renderWithRouter(<CalculatorPage />);
      expect(screen.getByTestId('helmet')).toBeInTheDocument();
    });
  });
});

