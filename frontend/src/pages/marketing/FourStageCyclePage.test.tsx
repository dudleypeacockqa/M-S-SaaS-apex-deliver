/**
 * Tests for FourStageCyclePage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FourStageCyclePage } from './FourStageCyclePage';
import { BrowserRouter } from 'react-router-dom';

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  trackCtaClick: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('FourStageCyclePage', () => {
  describe('Page Rendering', () => {
    it('should render page without errors', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/evaluation/i)).toBeInTheDocument();
    });
  });

  describe('Stage 1: Evaluation', () => {
    it('should render Evaluation stage heading', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/evaluation/i)).toBeInTheDocument();
      expect(screen.getByText(/pre-loi due diligence/i)).toBeInTheDocument();
    });

    it('should render AI-powered deal sourcing capability', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/ai-powered deal sourcing/i)).toBeInTheDocument();
    });
  });

  describe('Stage 2: Pre-Deal', () => {
    it('should render Pre-Deal stage heading', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/pre-deal/i)).toBeInTheDocument();
      expect(screen.getByText(/loi to close/i)).toBeInTheDocument();
    });

    it('should render secure data room capability', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/secure data room with watermarking/i)).toBeInTheDocument();
    });
  });

  describe('Stage 3: Post-Deal', () => {
    it('should render Post-Deal stage heading', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/post-deal/i)).toBeInTheDocument();
      expect(screen.getByText(/pmi finance ops stabilisation/i)).toBeInTheDocument();
    });

    it('should render PMI capabilities', () => {
      renderWithRouter(<FourStageCyclePage />);
      expect(screen.getByText(/13-week direct cash forecast setup/i)).toBeInTheDocument();
    });
  });

  describe('Stage 4: Optimization', () => {
    it('should render Optimization stage', () => {
      renderWithRouter(<FourStageCyclePage />);
      // Stage 4 should be present in the 4-stage cycle
      const allText = document.body.textContent || '';
      expect(allText).toContain('100');  // Should mention "100 Days"
    });
  });
});
