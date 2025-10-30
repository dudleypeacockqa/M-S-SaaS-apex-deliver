/**
 * Tests for NotFound (404) page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from './NotFound';

// Mock wouter's useLocation hook
vi.mock('wouter', () => ({
  useLocation: () => {
    const setLocation = vi.fn();
    return ['/', setLocation];
  },
}));

describe('NotFound Page', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render "Page Not Found" message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render explanatory text about missing page', () => {
    render(<NotFound />);
    expect(screen.getByText(/the page you are looking for doesn't exist/i)).toBeInTheDocument();
  });

  it('should render "Go Home" button', () => {
    render(<NotFound />);
    const button = screen.getByRole('button', { name: /go home/i });
    expect(button).toBeInTheDocument();
  });

  it('should navigate to home when "Go Home" button is clicked', async () => {
    const { useLocation } = await import('wouter');
    const mockSetLocation = vi.fn();

    vi.mocked(useLocation).mockReturnValue(['/', mockSetLocation]);

    render(<NotFound />);
    const button = screen.getByRole('button', { name: /go home/i });

    fireEvent.click(button);

    expect(mockSetLocation).toHaveBeenCalledWith('/');
  });
});
