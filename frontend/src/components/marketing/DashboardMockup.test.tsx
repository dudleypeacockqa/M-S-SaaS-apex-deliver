/**
 * Tests for DashboardMockup component
 * Following TDD RED → GREEN → REFACTOR methodology
 *
 * MARK-004 FR-5.4: DashboardMockup Tests (6 tests)
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardMockup } from './DashboardMockup';

describe('DashboardMockup', () => {
  describe('Dashboard Header', () => {
    it('should render 13-Week Cash Forecast heading', () => {
      render(<DashboardMockup />);
      expect(screen.getByText('13-Week Cash Forecast')).toBeInTheDocument();
    });

    it('should display accuracy percentage', () => {
      render(<DashboardMockup />);
      expect(screen.getByText(/95.8% accuracy/i)).toBeInTheDocument();
    });
  });

  describe('KPI Cards', () => {
    it('should display Current Cash KPI', () => {
      render(<DashboardMockup />);
      expect(screen.getByText('Current Cash')).toBeInTheDocument();
      expect(screen.getByText('£2.4M')).toBeInTheDocument();
    });

    it('should display Week 13 Cash forecast KPI', () => {
      render(<DashboardMockup />);
      expect(screen.getByText('Week 13 Cash')).toBeInTheDocument();
      expect(screen.getByText('£3.1M')).toBeInTheDocument();
    });

    it('should display DSO and DPO metrics', () => {
      render(<DashboardMockup />);
      expect(screen.getByText('DSO')).toBeInTheDocument();
      expect(screen.getByText('42 days')).toBeInTheDocument();
      expect(screen.getByText('DPO')).toBeInTheDocument();
      expect(screen.getByText('38 days')).toBeInTheDocument();
    });
  });

  describe('Action Items', () => {
    it('should display action items with alerts and confirmations', () => {
      render(<DashboardMockup />);
      expect(screen.getByText('Action Required')).toBeInTheDocument();
      expect(screen.getByText(/3 invoices overdue/i)).toBeInTheDocument();
      expect(screen.getByText('On Track')).toBeInTheDocument();
      expect(screen.getByText(/Cash runway: 18 months/i)).toBeInTheDocument();
    });
  });
});
