/**
 * Tests for DealRoomAlternative page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DealRoomAlternative } from './DealRoomAlternative';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DealRoomAlternative Page', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Page Rendering', () => {
    it('should render main heading', () => {
      renderWithRouter(<DealRoomAlternative />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render canonical URL for financeflo.ai', () => {
      renderWithRouter(<DealRoomAlternative />);
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toBe('https://financeflo.ai/compare/dealroom-alternative');
      expect(canonical?.getAttribute('href')).not.toContain('100daysandbeyond.com');
    });
  });
});

