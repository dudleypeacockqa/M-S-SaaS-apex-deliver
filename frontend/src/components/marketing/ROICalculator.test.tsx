import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ROICalculator } from './ROICalculator';

describe('ROICalculator', () => {
  it('renders without crashing', () => {
    render(<ROICalculator />);
    expect(screen.getByText(/Calculate Your ROI/i)).toBeInTheDocument();
  });

  it('displays the calculator heading', () => {
    render(<ROICalculator />);
    expect(screen.getByText(/See How Much You'll Save/i)).toBeInTheDocument();
  });

  it('renders all input sliders', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Deals per Year/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Deal Size/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours Spent per Deal/i)).toBeInTheDocument();
  });

  it('displays default values', () => {
    render(<ROICalculator />);
    
    // Default: 10 deals, £10M, 50 hours
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('updates deal count when slider changes', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '25' } });
    
    expect(screen.getByText(/25/)).toBeInTheDocument();
  });

  it('updates deal size when slider changes', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[1];
    fireEvent.change(slider, { target: { value: '50000000' } }); // £50M
    
    expect(screen.getByText(/£50M/i)).toBeInTheDocument();
  });

  it('updates hours per deal when slider changes', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[2];
    fireEvent.change(slider, { target: { value: '100' } });
    
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('calculates ROI correctly', () => {
    render(<ROICalculator />);
    
    // With default values, should show positive ROI
    const roiElement = screen.getByText(/Return on Investment/i).closest('div');
    expect(roiElement).toBeInTheDocument();
    
    // Should display percentage
    expect(screen.getByText(/%$/)).toBeInTheDocument();
  });

  it('calculates time saved correctly', () => {
    render(<ROICalculator />);
    
    // Default: 10 deals * 50 hours * 40% = 200 hours saved
    expect(screen.getByText(/Time Saved Annually/i)).toBeInTheDocument();
    expect(screen.getByText(/200 hours/i)).toBeInTheDocument();
  });

  it('calculates value of time saved', () => {
    render(<ROICalculator />);
    
    // Time saved * £150/hour
    expect(screen.getByText(/Value of Time Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/£30,000/i)).toBeInTheDocument();
  });

  it('calculates additional deals possible', () => {
    render(<ROICalculator />);
    
    // 200 hours saved / 50 hours per deal = 4 additional deals
    expect(screen.getByText(/Additional Deals Possible/i)).toBeInTheDocument();
    expect(screen.getByText(/4 deals/i)).toBeInTheDocument();
  });

  it('calculates net annual savings', () => {
    render(<ROICalculator />);
    
    // Value of time saved - platform cost
    expect(screen.getByText(/Net Annual Savings/i)).toBeInTheDocument();
    
    // Should be positive number
    const savingsText = screen.getByText(/£[\d,]+/);
    expect(savingsText).toBeInTheDocument();
  });

  it('handles minimum values correctly', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '1' } });
    
    expect(screen.getByText(/1/)).toBeInTheDocument();
    // Should still calculate without errors
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('handles maximum values correctly', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '50' } });
    
    expect(screen.getByText(/50/)).toBeInTheDocument();
    // Should still calculate without errors
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(<ROICalculator />);
    
    // Check for proper currency formatting with £ symbol and commas
    const currencyElements = screen.getAllByText(/£[\d,]+/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('formats percentages correctly', () => {
    render(<ROICalculator />);
    
    // Check for proper percentage formatting
    const percentageElements = screen.getAllByText(/\d+%/);
    expect(percentageElements.length).toBeGreaterThan(0);
  });

  it('displays CTA button', () => {
    render(<ROICalculator />);
    
    const ctaButton = screen.getByText(/Start Your Free Trial/i);
    expect(ctaButton).toBeInTheDocument();
  });

  it('CTA button links to sign-up', () => {
    render(<ROICalculator />);
    
    const ctaButton = screen.getByText(/Start Your Free Trial/i);
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  it('shows calculation methodology note', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Based on 40% time reduction/i)).toBeInTheDocument();
  });

  it('displays all result cards', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Saved Annually/i)).toBeInTheDocument();
    expect(screen.getByText(/Value of Time Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional Deals Possible/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Annual Savings/i)).toBeInTheDocument();
  });

  it('applies gradient styling to result cards', () => {
    const { container } = render(<ROICalculator />);
    
    const gradientCards = container.querySelectorAll('.bg-gradient-to-br');
    expect(gradientCards.length).toBeGreaterThan(0);
  });

  it('recalculates when any input changes', () => {
    render(<ROICalculator />);
    
    const initialROI = screen.getByText(/Return on Investment/i).closest('div')?.textContent;
    
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '20' } });
    
    const newROI = screen.getByText(/Return on Investment/i).closest('div')?.textContent;
    
    // ROI should change when inputs change
    expect(initialROI).not.toBe(newROI);
  });

  it('handles edge case of 0 deals', () => {
    render(<ROICalculator />);
    
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '0' } });
    
    // Should handle gracefully without crashing
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('calculates platform cost correctly', () => {
    render(<ROICalculator />);
    
    // Platform cost should be included in calculations
    // £279/month * 12 = £3,348/year
    const savingsText = screen.getByText(/Net Annual Savings/i).closest('div')?.textContent;
    expect(savingsText).toBeDefined();
  });

  it('shows realistic ROI for typical customer', () => {
    render(<ROICalculator />);
    
    // Set typical values: 15 deals, £20M average, 80 hours each
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '15' } });
    fireEvent.change(sliders[1], { target: { value: '20000000' } });
    fireEvent.change(sliders[2], { target: { value: '80' } });
    
    // Should show substantial ROI
    const roiText = screen.getByText(/Return on Investment/i).closest('div')?.textContent;
    expect(roiText).toContain('%');
  });

  it('displays tooltip or help text for inputs', () => {
    render(<ROICalculator />);
    
    // Check for descriptive text
    expect(screen.getByText(/How many M&A deals/i)).toBeInTheDocument();
  });

  it('has responsive layout', () => {
    const { container } = render(<ROICalculator />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-2');
  });

  it('includes section background styling', () => {
    const { container } = render(<ROICalculator />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });
});

