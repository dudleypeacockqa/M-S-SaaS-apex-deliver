/**
 * Tests for TeamPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TeamPage } from './TeamPage';

// Helper to render with router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('TeamPage', () => {
  describe('Header Section', () => {
    it('should render main heading', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText(/meet the experts behind your success/i)).toBeInTheDocument();
    });
  });

  describe('Team Members', () => {
    it('should render Dudley Peacock with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Dudley Peacock')).toBeInTheDocument();
      expect(screen.getByText(/founder & ceo/i)).toBeInTheDocument();
    });

    it('should render Sandra Peacock with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Sandra Peacock')).toBeInTheDocument();
      expect(screen.getByText(/managing director/i)).toBeInTheDocument();
    });

    it('should render Matthew Collins with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Matthew Collins')).toBeInTheDocument();
      expect(screen.getByText(/^cfo$/i)).toBeInTheDocument();
    });

    it('should render Adam Pavitt with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Adam Pavitt')).toBeInTheDocument();
      expect(screen.getByText(/director of operations/i)).toBeInTheDocument();
    });

    it('should render all 6 team members', () => {
      renderWithRouter(<TeamPage />);
      // Check for unique names
      expect(screen.getByText('Dudley Peacock')).toBeInTheDocument();
      expect(screen.getByText('Sandra Peacock')).toBeInTheDocument();
      expect(screen.getByText('Matthew Collins')).toBeInTheDocument();
      expect(screen.getByText('Adam Pavitt')).toBeInTheDocument();
      expect(screen.getByText('Shaun Evertse')).toBeInTheDocument();
      expect(screen.getByText('Heike Venter')).toBeInTheDocument();
    });
  });

  describe('Experience Section', () => {
    it('should render "Experience That Drives Results" heading', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText(/experience that drives results/i)).toBeInTheDocument();
    });

    it('should mention team experience and track record', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText(/over 20 years of combined experience/i)).toBeInTheDocument();
    });
  });
});
