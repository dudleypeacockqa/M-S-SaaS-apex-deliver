import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ROICalculator } from './ROICalculator';

describe('ROICalculator', () => {
  it('renders without crashing', () => {
    render(<ROICalculator />);
    expect(screen.getByText(/Calculate Your ROI/i)).toBeInTheDocument();
  });

  it('displays the calculator heading', () => {
    render(<ROICalculator />);
    expect(screen.getByText(/See how much time and money you'll save/i)).toBeInTheDocument();
  });

  it('renders all input sliders', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Deals per year/i)).toBeInTheDocument();
    expect(screen.getByText(/Average deal size/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours spent per deal/i)).toBeInTheDocument();
  });

  it('displays default values', () => {
    render(<ROICalculator />);
    
    // Default: 12 deals, £5M, 40 hours
    expect(screen.getByText(/^12$/)).toBeInTheDocument();
    expect(screen.getByText(/£5M/i)).toBeInTheDocument();
    expect(screen.getByText(/40h/i)).toBeInTheDocument();
  });

  it('updates deal count when slider changes', () => {
    render(<ROICalculator />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '25' } });
    
    expect(screen.getByText(/^25$/)).toBeInTheDocument();
  });

  it('updates deal size when slider changes', () => {
    render(<ROICalculator />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[1], { target: { value: '50' } });
    
    expect(screen.getByText(/£50M/i)).toBeInTheDocument();
  });

  it('updates hours per deal when slider changes', () => {
    render(<ROICalculator />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[2], { target: { value: '100' } });
    
    expect(screen.getByText(/100h/i)).toBeInTheDocument();
  });

  it('calculates ROI correctly', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
    // Should display percentage
    const roiElement = screen.getByText(/%$/);
    expect(roiElement).toBeInTheDocument();
  });

  it('calculates time saved correctly', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Time Saved Annually/i)).toBeInTheDocument();
    // Default: 12 deals * 40 hours * 40% = 192 hours
    expect(screen.getByText(/192 hours/i)).toBeInTheDocument();
  });

  it('calculates value of time saved', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Value of Time Saved/i)).toBeInTheDocument();
    // 192 hours * £150 = £28,800
    expect(screen.getByText(/£28,800/i)).toBeInTheDocument();
  });

  it('calculates additional deals possible', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Additional Deals Possible/i)).toBeInTheDocument();
    // 192 hours / 40 hours = 4 deals
    expect(screen.getByText(/4 deals/i)).toBeInTheDocument();
  });

  it('calculates net annual savings', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Net Annual Savings/i)).toBeInTheDocument();
    // Should show savings after platform cost
    const savingsElement = screen.getByText(/£25,452/i);
    expect(savingsElement).toBeInTheDocument();
  });

  it('displays current annual cost', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Current Annual Cost/i)).toBeInTheDocument();
    // 12 deals * 40 hours * £150 = £72,000
    expect(screen.getByText(/£72,000/i)).toBeInTheDocument();
  });

  it('shows consulting rate', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/£150\/hour consulting rate/i)).toBeInTheDocument();
  });

  it('displays platform cost', () => {
    render(<ROICalculator />);
    
    // £279 * 12 = £3,348
    expect(screen.getByText(/£3,348/i)).toBeInTheDocument();
  });

  it('shows time reduction percentage', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/40% reduction/i)).toBeInTheDocument();
  });

  it('displays CTA button', () => {
    render(<ROICalculator />);
    
    const ctaButton = screen.getByText(/Start Saving Today/i);
    expect(ctaButton).toBeInTheDocument();
  });

  it('CTA button links to sign-up', () => {
    render(<ROICalculator />);
    
    const ctaButton = screen.getByText(/Start Saving Today/i);
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  it('shows free trial messaging', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument();
    expect(screen.getByText(/14-day free trial/i)).toBeInTheDocument();
  });

  it('displays disclaimer', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Calculations are estimates/i)).toBeInTheDocument();
  });

  it('shows potential revenue from additional deals', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Potential revenue/i)).toBeInTheDocument();
  });

  it('has two-column layout', () => {
    const { container } = render(<ROICalculator />);
    
    const grid = container.querySelector('.lg\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('applies gradient styling to input section', () => {
    const { container } = render(<ROICalculator />);
    
    const gradientSection = container.querySelector('.from-indigo-900');
    expect(gradientSection).toBeInTheDocument();
  });

  it('displays section headings', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Your Current Situation/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Results with ApexDeliver/i)).toBeInTheDocument();
  });

  it('shows all result cards', () => {
    render(<ROICalculator />);
    
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
    expect(screen.getByText(/Time Saved Annually/i)).toBeInTheDocument();
    expect(screen.getByText(/Value of Time Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional Deals Possible/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Annual Savings/i)).toBeInTheDocument();
  });

  it('recalculates when deal count changes', () => {
    render(<ROICalculator />);
    
    const initialSavings = screen.getByText(/£25,452/i);
    expect(initialSavings).toBeInTheDocument();
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '20' } });
    
    // Savings should change with more deals
    const newSavings = screen.getByText(/£44,652/i);
    expect(newSavings).toBeInTheDocument();
  });

  it('handles minimum deal count', () => {
    render(<ROICalculator />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '1' } });
    
    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    // Should still calculate without errors
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('handles maximum deal count', () => {
    render(<ROICalculator />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '50' } });
    
    expect(screen.getByText(/^50$/)).toBeInTheDocument();
    // Should still calculate without errors
    expect(screen.getByText(/Return on Investment/i)).toBeInTheDocument();
  });

  it('formats currency with commas', () => {
    render(<ROICalculator />);
    
    // Check for proper currency formatting
    const currencyElements = screen.getAllByText(/£[\d,]+/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('includes icons for visual appeal', () => {
    const { container } = render(<ROICalculator />);
    
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('has responsive padding', () => {
    const { container } = render(<ROICalculator />);
    
    const responsivePadding = container.querySelector('.lg\\:p-12');
    expect(responsivePadding).toBeInTheDocument();
  });

  it('applies card styling to results', () => {
    const { container } = render(<ROICalculator />);
    
    const cards = container.querySelectorAll('.rounded-xl');
    expect(cards.length).toBeGreaterThan(5);
  });

  it('shows section background gradient', () => {
    const { container } = render(<ROICalculator />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });
});

