/**
 * Tests for FAQPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQPage } from './FAQPage';
import { BrowserRouter } from 'react-router-dom';

// Wrap component with router for Link components
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FAQPage', () => {
  describe('Header Section', () => {
    it('should render main heading', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    });

    it('should render contact link in header', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/contact our team/i)).toBeInTheDocument();
    });
  });

  describe('FAQ Categories', () => {
    it('should render "Product & Features" category', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/product & features/i)).toBeInTheDocument();
    });

    it('should render "Security & Compliance" category', () => {
      renderWithRouter(<FAQPage />);
      // Find the category heading (h2 element), not nav links
      const categoryHeadings = screen.getAllByText(/security & compliance/i);
      expect(categoryHeadings.length).toBeGreaterThan(0);
      // Verify at least one is a heading element
      const heading = categoryHeadings.find((el) => el.tagName === 'H2');
      expect(heading).toBeInTheDocument();
    });

    it('should render "Pricing & ROI" category', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/pricing & roi/i)).toBeInTheDocument();
    });

    it('should render "Implementation & Support" category', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/implementation & support/i)).toBeInTheDocument();
    });

    it('should render "About Us" category', () => {
      renderWithRouter(<FAQPage />);
      // Multiple instances of "About Us" exist (category heading + nav link)
      expect(screen.getAllByText(/^about us$/i)[0]).toBeInTheDocument();
    });
  });

  describe('FAQ Questions', () => {
    it('should render question about problem CapLiquify solves', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/what problem does capliquify.*solve/i)).toBeInTheDocument();
    });

    it('should render question about security posture', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/what is your security posture/i)).toBeInTheDocument();
    });

    it('should render question about pricing tiers', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/what are the pricing tiers/i)).toBeInTheDocument();
    });

    it('should render question about time to value', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/how long does it take to get value/i)).toBeInTheDocument();
    });

    it('should render question about founder', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/who is behind capliquify/i)).toBeInTheDocument();
    });
  });

  describe('FAQ Interactions', () => {
    it('should expand FAQ answer when question is clicked', () => {
      renderWithRouter(<FAQPage />);
      const firstQuestion = screen.getByText(/what problem does capliquify.*solve/i);

      // First question should be open by default (openIndex = 0)
      expect(screen.getByText(/unified platform for 13-week direct cash forecasting/i)).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(firstQuestion);

      // Answer should be hidden
      expect(screen.queryByText(/unified platform for 13-week direct cash forecasting/i)).not.toBeInTheDocument();
    });

    it('should toggle between different FAQ answers', () => {
      renderWithRouter(<FAQPage />);

      // Click on security question
      const securityQuestion = screen.getByText(/what is your security posture/i);
      fireEvent.click(securityQuestion);

      // Security answer should be visible
      expect(screen.getByText(/enterprise-grade security with EU.*Frankfurt/i)).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('should render "Still Have Questions?" heading', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/still have questions/i)).toBeInTheDocument();
    });

    it('should render "Contact Sales" button', () => {
      renderWithRouter(<FAQPage />);
      expect(screen.getByText(/contact sales/i)).toBeInTheDocument();
    });
  });
});
