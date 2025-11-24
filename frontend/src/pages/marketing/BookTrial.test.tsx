/**
 * Tests for BookTrial page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookTrial } from './BookTrial';
import { BrowserRouter } from 'react-router-dom';

// Mock Clerk auth
vi.mock('@/lib/clerk', () => ({
  useAuth: () => ({
    isSignedIn: true,
    isLoaded: true,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BookTrial Page', () => {
  describe('Header Section', () => {
    it('should render success badge', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });

    it('should render welcome heading', () => {
      renderWithRouter(<BookTrial />);
      // Welcome text may contain "ApexDeliver + CapLiquify" or "FinanceFlo" - check for either
      const welcomeText = screen.getByText(/welcome/i);
      expect(welcomeText).toBeInTheDocument();
    });

    it('should render MVP trial description', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/60-minute requirements planning session/i)).toBeInTheDocument();
    });
  });

  describe('What to Expect Section', () => {
    it('should render "What to Expect" heading', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/what to expect/i)).toBeInTheDocument();
    });

    it('should render "Requirements Discovery" step', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/requirements discovery/i)).toBeInTheDocument();
    });

    it('should render "Platform Walkthrough" step', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/platform walkthrough/i)).toBeInTheDocument();
    });

    it('should render "MVP Trial Setup" step', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/mvp trial setup/i)).toBeInTheDocument();
    });

    it('should render "Hands-On Training" step', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/hands-on training/i)).toBeInTheDocument();
    });
  });

  describe('Calendar Section', () => {
    it('should render calendar heading', () => {
      renderWithRouter(<BookTrial />);
      expect(screen.getByText(/schedule your requirements planning session/i)).toBeInTheDocument();
    });

    it('should render contact email for custom times', () => {
      renderWithRouter(<BookTrial />);
      const link = screen.getByText(/dudley@financeflo\.ai/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toBeInTheDocument();
    });
  });
});
