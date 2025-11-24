/**
 * Tests for TeamPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
      expect(screen.getByText(/financeflo operators who own implementation/i)).toBeInTheDocument();
    });
  });

  describe('Team Members', () => {
    it('should render Dudley Peacock with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Dudley Peacock')).toBeInTheDocument();
      expect(screen.getByText(/founder & ceo, erp \+ ai strategy/i)).toBeInTheDocument();
    });

    it('should render Sandra Peacock with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Sandra Peacock')).toBeInTheDocument();
      expect(screen.getByText(/managing director, delivery & success/i)).toBeInTheDocument();
    });

    it('should render Matthew Collins with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Matthew Collins')).toBeInTheDocument();
      expect(screen.getByText(/cfo & capliquify practice lead/i)).toBeInTheDocument();
    });

    it('should render Adam Pavitt with title', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText('Adam Pavitt')).toBeInTheDocument();
      expect(screen.getByText(/director of delivery operations/i)).toBeInTheDocument();
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
      expect(screen.getByText(/implementation \+ managed support in one/i)).toBeInTheDocument();
    });

    it('should mention team experience and track record', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByText(/500\+ ERP entities migrated/i)).toBeInTheDocument();
    });
  });

  describe('CTAs', () => {
    it('should include blueprint and trial CTAs', () => {
      renderWithRouter(<TeamPage />);
      expect(screen.getByRole('link', { name: /book implementation blueprint/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /start capliquify \+ apexdeliver trial/i })).toBeInTheDocument();
    });
  });

  describe('Structured Data', () => {
    it('publishes organization schema with team members', async () => {
      renderWithRouter(<TeamPage />);

      await waitFor(() => {
        const script = document.getElementById('team-schema') as HTMLScriptElement | null;
        expect(script).not.toBeNull();
        const schema = JSON.parse(script?.textContent ?? '{}');
        expect(schema.url).toBe('https://financeflo.ai/team');
        expect(Array.isArray(schema.employee)).toBe(true);
        expect(schema.employee[0].name).toBe('Dudley Peacock');
      });
    });
  });
});
