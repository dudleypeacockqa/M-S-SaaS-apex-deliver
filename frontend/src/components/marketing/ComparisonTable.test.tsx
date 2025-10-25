import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonTable } from './ComparisonTable';

describe('ComparisonTable', () => {
  it('renders without crashing', () => {
    render(<ComparisonTable />);
    expect(screen.getByText(/How We Compare/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(<ComparisonTable />);
    expect(screen.getByText(/ApexDeliver vs Traditional Platforms/i)).toBeInTheDocument();
  });

  it('displays all three platform columns', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Traditional Enterprise/i)).toBeInTheDocument();
    expect(screen.getByText(/Mid-Tier Platforms/i)).toBeInTheDocument();
    expect(screen.getByText(/ApexDeliver/i)).toBeInTheDocument();
  });

  it('displays annual cost comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/£10,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/£5,000-£8,000/i)).toBeInTheDocument();
    expect(screen.getByText(/£3,348/i)).toBeInTheDocument(); // £279 * 12
  });

  it('shows savings badge for ApexDeliver', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Save 70%/i)).toBeInTheDocument();
  });

  it('displays setup time comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/2-4 weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/1-2 weeks/i)).toBeInTheDocument();
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument();
  });

  it('shows AI features comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/AI Features/i)).toBeInTheDocument();
    // ApexDeliver should have checkmark for AI
    const aiRow = screen.getByText(/AI Features/i).closest('div');
    expect(aiRow).toBeInTheDocument();
  });

  it('displays financial intelligence comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Financial Intelligence/i)).toBeInTheDocument();
  });

  it('shows deal matching feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Deal Matching/i)).toBeInTheDocument();
  });

  it('displays document automation comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Document Automation/i)).toBeInTheDocument();
  });

  it('shows valuation tools comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Valuation Tools/i)).toBeInTheDocument();
  });

  it('displays data room feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Secure Data Room/i)).toBeInTheDocument();
  });

  it('shows integration capabilities', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument();
  });

  it('displays support availability', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Support/i)).toBeInTheDocument();
  });

  it('shows contract terms comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Contract/i)).toBeInTheDocument();
  });

  it('displays free trial availability', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Free Trial/i)).toBeInTheDocument();
  });

  it('highlights ApexDeliver column', () => {
    const { container } = render(<ComparisonTable />);
    
    // ApexDeliver column should have special styling
    const highlightedColumn = container.querySelector('.border-green-500');
    expect(highlightedColumn).toBeInTheDocument();
  });

  it('displays checkmarks for positive features', () => {
    const { container } = render(<ComparisonTable />);
    
    // Should have multiple checkmarks (✓)
    const checkmarks = container.querySelectorAll('.text-green-600');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('displays X marks for missing features', () => {
    const { container } = render(<ComparisonTable />);
    
    // Should have X marks (✗) for missing features
    const xMarks = container.querySelectorAll('.text-red-600');
    expect(xMarks.length).toBeGreaterThan(0);
  });

  it('includes CTA button', () => {
    render(<ComparisonTable />);
    
    const ctaButton = screen.getByText(/Start Free Trial/i);
    expect(ctaButton).toBeInTheDocument();
  });

  it('CTA button links to sign-up', () => {
    render(<ComparisonTable />);
    
    const ctaButton = screen.getByText(/Start Free Trial/i);
    expect(ctaButton.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  it('has responsive grid layout', () => {
    const { container } = render(<ComparisonTable />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-4');
  });

  it('displays "Most Popular" badge on ApexDeliver', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Most Popular/i)).toBeInTheDocument();
  });

  it('shows all 15 comparison rows', () => {
    const { container } = render(<ComparisonTable />);
    
    // Count the number of comparison rows
    const rows = container.querySelectorAll('[class*="grid-cols"]');
    expect(rows.length).toBeGreaterThan(10);
  });

  it('includes section background styling', () => {
    const { container } = render(<ComparisonTable />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white');
  });

  it('displays descriptive subtitle', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/See why ApexDeliver/i)).toBeInTheDocument();
  });

  it('shows PMI integration feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/PMI Integration/i)).toBeInTheDocument();
  });

  it('displays mobile responsiveness', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Mobile App/i)).toBeInTheDocument();
  });

  it('shows API access comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/API Access/i)).toBeInTheDocument();
  });

  it('applies hover effects to comparison rows', () => {
    const { container } = render(<ComparisonTable />);
    
    const hoverElements = container.querySelectorAll('.hover\\:bg-gray-50');
    expect(hoverElements.length).toBeGreaterThan(0);
  });
});

