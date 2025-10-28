import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedTestimonials } from './EnhancedTestimonials';

describe('EnhancedTestimonials', () => {
  it('renders without crashing', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Trusted by M&A Professionals Worldwide/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getAllByText(/Join 500\+ dealmakers who have transformed/i).length).toBeGreaterThan(0);
  });

  it('renders first testimonial by default', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('displays testimonial quote', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/ApexDeliver has been a game-changer/i)).toBeInTheDocument();
  });

  it('shows customer role and company', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Independent M&A Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Davidson Advisory/i)).toBeInTheDocument();
  });

  it('displays 5-star rating', () => {
    const { container } = render(<EnhancedTestimonials />);
    const stars = container.querySelectorAll('.text-yellow-400');
    expect(stars).toHaveLength(5);
  });

  it('shows verified customer badge', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Verified Customer/i)).toBeInTheDocument();
  });

  it('displays customer metrics', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/120 hours\/year/i)).toBeInTheDocument();
    expect(screen.getByText(/\+5 deals/i)).toBeInTheDocument();
    expect(screen.getByText(/450%/i)).toBeInTheDocument();
  });

  it('navigates to next testimonial on next button click', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const buttons = container.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1]; // Last button is next
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Sarah Reynolds/i)).toBeInTheDocument();
  });

  it('navigates to previous testimonial on prev button click', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const buttons = container.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);
    
    const prevButton = buttons[0]; // First button is prev
    fireEvent.click(prevButton);
    
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('displays navigation dots', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const dots = container.querySelectorAll('.rounded-full.w-3');
    expect(dots).toHaveLength(5);
  });

  it('navigates to specific testimonial on dot click', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const dots = container.querySelectorAll('.rounded-full.w-3');
    fireEvent.click(dots[2]);
    
    expect(screen.getByText(/Michael Park/i)).toBeInTheDocument();
  });

  it('highlights active dot', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const activeDot = container.querySelector('.bg-blue-600.w-8');
    expect(activeDot).toBeInTheDocument();
  });

  it('displays all 5 testimonials', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const testimonials = [
      { name: 'James Davidson', index: 0 },
      { name: 'Sarah Reynolds', index: 1 },
      { name: 'Michael Park', index: 2 },
      { name: 'Emma Thompson', index: 3 },
      { name: 'David Chen', index: 4 }
    ];
    
    testimonials.forEach(({ name, index }) => {
      const dots = container.querySelectorAll('.rounded-full.w-3');
      fireEvent.click(dots[index]);
      expect(screen.getByText(new RegExp(name, 'i'))).toBeInTheDocument();
    });
  });

  it('displays company logos section', () => {
    render(<EnhancedTestimonials />);
    expect(screen.getByText(/Trusted by professionals from leading firms/i)).toBeInTheDocument();
  });

  it('shows multiple company logos', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/Goldman Sachs/i)).toBeInTheDocument();
    expect(screen.getByText(/KKR/i)).toBeInTheDocument();
    expect(screen.getByText(/Barclays/i)).toBeInTheDocument();
    expect(screen.getByText(/BlackRock/i)).toBeInTheDocument();
    expect(screen.getByText(/Morgan Stanley/i)).toBeInTheDocument();
  });

  it('displays platform statistics bar', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Rating/i)).toBeInTheDocument();
  });

  it('shows customer count statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getAllByText(/500\+/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Active Users/i)).toBeInTheDocument();
  });

  it('displays deals managed statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getAllByText(/£50B\+/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Deals Managed/i)).toBeInTheDocument();
  });

  it('shows uptime statistic', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getByText(/99\.9%/i)).toBeInTheDocument();
    expect(screen.getByText(/Uptime/i)).toBeInTheDocument();
  });

  it('includes testimonial avatar placeholder', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const avatar = container.querySelector('.rounded-full.w-24');
    expect(avatar).toBeInTheDocument();
  });

  it('displays metrics for each testimonial', () => {
    render(<EnhancedTestimonials />);
    
    // First testimonial metrics
    expect(screen.getByText(/120 hours\/year/i)).toBeInTheDocument();
    expect(screen.getByText(/\+5 deals/i)).toBeInTheDocument();
    expect(screen.getByText(/450%/i)).toBeInTheDocument();
  });

  it('wraps around to first testimonial after last', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const buttons = container.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1];
    
    // Click next 5 times to go through all testimonials
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Should be back to first testimonial
    expect(screen.getByText(/James Davidson/i)).toBeInTheDocument();
  });

  it('wraps around to last testimonial when going back from first', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const buttons = container.querySelectorAll('button');
    const prevButton = buttons[0];
    fireEvent.click(prevButton);
    
    // Should show last testimonial
    expect(screen.getByText(/David Chen/i)).toBeInTheDocument();
  });

  it('has responsive layout', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const grid = container.querySelector('.md\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('includes section background styling', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('displays quote icon', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const quoteIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(quoteIcon).toBeInTheDocument();
  });

  it('applies card styling to testimonial', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const card = container.querySelector('.bg-white.rounded-2xl');
    expect(card).toBeInTheDocument();
  });

  it('shows all 5 company logos', () => {
    render(<EnhancedTestimonials />);
    
    const companies = ['Goldman Sachs', 'KKR', 'Barclays', 'BlackRock', 'Morgan Stanley'];
    companies.forEach(company => {
      expect(screen.getByText(company)).toBeInTheDocument();
    });
  });

  it('displays metrics in grid layout', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const metricsGrid = container.querySelector('.grid-cols-3');
    expect(metricsGrid).toBeInTheDocument();
  });

  it('shows navigation buttons with icons', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const navButtons = container.querySelectorAll('.rounded-full.bg-white.shadow-lg');
    expect(navButtons).toHaveLength(2);
  });

  it('displays verified badge icon', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const verifiedIcon = container.querySelector('.text-blue-200 svg');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('shows person info in gradient background', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const gradientBg = container.querySelector('.from-indigo-900');
    expect(gradientBg).toBeInTheDocument();
  });

  it('displays testimonial content in italic', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const italicText = container.querySelector('.italic');
    expect(italicText).toBeInTheDocument();
  });

  it('shows stats in grid layout', () => {
    const { container } = render(<EnhancedTestimonials />);
    
    const statsGrid = container.querySelector('.md\\:grid-cols-4');
    expect(statsGrid).toBeInTheDocument();
  });

  it('displays all 4 statistics', () => {
    render(<EnhancedTestimonials />);
    
    expect(screen.getAllByText(/500\+/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/£50B\+/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/4\.9\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/99\.9%/i)).toBeInTheDocument();
  });
});

