import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedTestimonials } from './EnhancedTestimonials';

describe('EnhancedTestimonials', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/What Our Customers Say/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Real Results from Real Professionals/i)).toBeInTheDocument();
  });

  it('renders first testimonial by default', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('displays testimonial quote', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/ApexDeliver transformed/i)).toBeInTheDocument();
  });

  it('shows customer role and company', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Independent M&A Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Davidson Advisory/i)).toBeInTheDocument();
  });

  it('displays 5-star rating', () => {
    render(<EnhancedTestimonials />);
    const stars = screen.getAllByText('⭐');
    expect(stars).toHaveLength(5);
  });

  it('shows verified customer badge', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Verified Customer/i)).toBeInTheDocument();
  });

  it('displays customer metrics', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/60%/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Saved/i)).toBeInTheDocument();
  });

  it('navigates to next testimonial on next button click', () => {
    render(<EnhancedTestimonials />);
    
    const nextButton = screen.getByLabelText(/Next testimonial/i);
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Sarah Reynolds/i)).toBeInTheDocument();
  });

  it('navigates to previous testimonial on prev button click', () => {
    render(<EnhancedTestimonials />);
    
    const nextButton = screen.getByLabelText(/Next testimonial/i);
    fireEvent.click(nextButton);
    
    const prevButton = screen.getByLabelText(/Previous testimonial/i);
    fireEvent.click(prevButton);
    
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('displays navigation dots', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const dots = container.querySelectorAll('button[aria-label*="Go to testimonial"]');
    expect(dots).toHaveLength(5);
  });

  it('navigates to specific testimonial on dot click', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const dots = container.querySelectorAll('button[aria-label*="Go to testimonial"]');
    fireEvent.click(dots[2]);
    
    expect(screen.getByText(/Michael Park/i)).toBeInTheDocument();
  });

  it('highlights active dot', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const activeDot = container.querySelector('.bg-indigo-600');
    expect(activeDot).toBeInTheDocument();
  });

  it('auto-advances testimonials after delay', async () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
    
    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.getByText(/Sarah Reynolds/i)).toBeInTheDocument();
    });
  });

  it('stops auto-advance on user interaction', () => {
    render(<EnhancedTestimonials />);
    
    const nextButton = screen.getByLabelText(/Next testimonial/i);
    fireEvent.click(nextButton);
    
    // Auto-advance should be paused
    vi.advanceTimersByTime(5000);
    
    // Should still be on second testimonial
    expect(screen.getByText(/Sarah Reynolds/i)).toBeInTheDocument();
  });

  it('displays all 5 testimonials', () => {
    render(<EnhancedTestimonials />);
    
    const testimonials = [
      'James Davidson',
      'Sarah Reynolds',
      'Michael Park',
      'Emma Thompson',
      'David Chen'
    ];
    
    testimonials.forEach((name, index) => {
      const { container } = render(<EnhancedTestimonials />);
      const dots = container.querySelectorAll('button[aria-label*="Go to testimonial"]');
      fireEvent.click(dots[index]);
      
      expect(screen.getByText(new RegExp(name, 'i'))).toBeInTheDocument();
    });
  });

  it('displays company logos section', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Trusted by Leading M&A Firms/i)).toBeInTheDocument();
  });

  it('shows multiple company logos', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/Goldman Sachs/i)).toBeInTheDocument();
    expect(screen.getByText(/KKR/i)).toBeInTheDocument();
    expect(screen.getByText(/Barclays/i)).toBeInTheDocument();
  });

  it('displays platform statistics bar', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Rating/i)).toBeInTheDocument();
  });

  it('shows customer count statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/500\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
  });

  it('displays deals managed statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/847\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Deals Managed/i)).toBeInTheDocument();
  });

  it('shows deal value statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/£50B\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Deal Value/i)).toBeInTheDocument();
  });

  it('includes testimonial avatar placeholder', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('displays metrics for each testimonial', () => {
    render(<EnhancedTestimonials />);
    
    // First testimonial should have 3 metrics
    expect(screen.getByText(/60%/i)).toBeInTheDocument();
    expect(screen.getByText(/£2\.5M/i)).toBeInTheDocument();
    expect(screen.getByText(/15/i)).toBeInTheDocument();
  });

  it('wraps around to first testimonial after last', () => {
    render(<EnhancedTestimonials />);
    
    const nextButton = screen.getByLabelText(/Next testimonial/i);
    
    // Click next 5 times to go through all testimonials
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Should be back to first testimonial
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('wraps around to last testimonial when going back from first', () => {
    render(<EnhancedTestimonials />);
    
    const prevButton = screen.getByLabelText(/Previous testimonial/i);
    fireEvent.click(prevButton);
    
    // Should show last testimonial
    expect(screen.getByText(/David Chen/i)).toBeInTheDocument();
  });

  it('has responsive layout', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-3');
  });

  it('includes section background styling', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('displays quote icon', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const quoteIcon = container.querySelector('svg');
    expect(quoteIcon).toBeInTheDocument();
  });

  it('applies card styling to testimonial', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const card = container.querySelector('.bg-white');
    expect(card).toHaveClass('rounded-2xl');
  });

  it('cleans up auto-advance timer on unmount', () => {
    const { unmount } = render(<EnhancedTestimonials />);
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

