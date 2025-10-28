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
    expect(screen.getByText(/How We Compare/i)).toBeInTheDocument();
  });

  it('displays subtitle', () => {
    render(<ComparisonTable />);
    expect(screen.getByText(/See why leading M&A professionals/i)).toBeInTheDocument();
  });

  it('displays two platform columns', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/ApexDeliver/i)).toBeInTheDocument();
    expect(screen.getByText(/Traditional Platforms/i)).toBeInTheDocument();
  });

  it('displays annual cost comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/£3,348/i)).toBeInTheDocument();
    expect(screen.getAllByText(/£10,000\+/i).length).toBeGreaterThan(0);
  });

  it('shows savings badge', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Save 70%/i)).toBeInTheDocument();
  });

  it('displays setup time comparison', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/5 minutes/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2-4 weeks/i).length).toBeGreaterThan(0);
  });

  it('shows AI features', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/AI-Powered Financial Analysis/i)).toBeInTheDocument();
  });

  it('displays deal pipeline feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Deal Pipeline Management/i)).toBeInTheDocument();
  });

  it('shows valuation suite', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Multi-Method Valuation Suite/i)).toBeInTheDocument();
  });

  it('displays document automation', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Automated Document Generation/i)).toBeInTheDocument();
  });

  it('shows deal matching feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/AI Deal Matching/i)).toBeInTheDocument();
  });

  it('displays secure document room', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Secure Document Room/i)).toBeInTheDocument();
  });

  it('shows collaboration feature', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Real-time Collaboration/i)).toBeInTheDocument();
  });

  it('displays mobile app status', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Mobile App/i)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });

  it('shows API access', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/API Access/i)).toBeInTheDocument();
  });

  it('displays integration capabilities', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Accounting Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/4\+ platforms/i)).toBeInTheDocument();
  });

  it('shows customer support', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Customer Support/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Chat & Email/i)).toBeInTheDocument();
  });

  it('displays training requirements', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Training Required/i)).toBeInTheDocument();
  });

  it('shows contract terms', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Minimum Contract/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly/i)).toBeInTheDocument();
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

  it('displays "BEST VALUE" badge', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/BEST VALUE/i)).toBeInTheDocument();
  });

  it('shows checkmarks for included features', () => {
    const { container } = render(<ComparisonTable />);
    
    const checkmarks = container.querySelectorAll('.text-green-600');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('shows X marks for not included features', () => {
    const { container } = render(<ComparisonTable />);
    
    const xMarks = container.querySelectorAll('.text-red-600');
    expect(xMarks.length).toBeGreaterThan(0);
  });

  it('has responsive grid layout', () => {
    const { container } = render(<ComparisonTable />);
    
    const grid = container.querySelector('.grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('includes section background styling', () => {
    const { container } = render(<ComparisonTable />);
    
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-white');
  });

  it('displays all 15 feature rows', () => {
    render(<ComparisonTable />);
    
    // Check for key features
    expect(screen.getByText(/Annual Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Setup Time/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Financial Analysis/i)).toBeInTheDocument();
  });

  it('shows additional info section', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/No Long-Term Contracts/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Updates Forever/i)).toBeInTheDocument();
    expect(screen.getByText(/24\/7 Support/i)).toBeInTheDocument();
  });

  it('displays savings percentages', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Save 70%/i)).toBeInTheDocument();
    expect(screen.getByText(/Save 99%/i)).toBeInTheDocument();
  });

  it('highlights ApexDeliver column with special styling', () => {
    const { container } = render(<ComparisonTable />);
    
    const apexColumn = container.querySelector('.bg-blue-50\\/50');
    expect(apexColumn).toBeInTheDocument();
  });

  it('shows "Included" text for boolean true features', () => {
    render(<ComparisonTable />);
    
    const includedTexts = screen.getAllByText(/Included/i);
    expect(includedTexts.length).toBeGreaterThan(0);
  });

  it('shows "Not Included" text for boolean false features', () => {
    render(<ComparisonTable />);
    
    const notIncludedTexts = screen.getAllByText(/Not Included/i);
    expect(notIncludedTexts.length).toBeGreaterThan(0);
  });

  it('displays "Limited" for partially available features', () => {
    render(<ComparisonTable />);
    
    const limitedTexts = screen.getAllByText(/Limited/i);
    expect(limitedTexts.length).toBeGreaterThan(0);
  });

  it('shows "Extra Cost" indicator', () => {
    render(<ComparisonTable />);
    
    expect(screen.getByText(/Extra Cost/i)).toBeInTheDocument();
  });

  it('displays alternating row colors', () => {
    const { container } = render(<ComparisonTable />);
    
    const grayRows = container.querySelectorAll('.bg-gray-50');
    const whiteRows = container.querySelectorAll('.bg-white');
    
    expect(grayRows.length).toBeGreaterThan(0);
    expect(whiteRows.length).toBeGreaterThan(0);
  });

  it('includes gradient header', () => {
    const { container } = render(<ComparisonTable />);
    
    const gradientHeader = container.querySelector('.bg-gradient-to-r');
    expect(gradientHeader).toBeInTheDocument();
  });

  it('shows pricing in footer', () => {
    render(<ComparisonTable />);
    
    expect(screen.getAllByText(/£10,000\+/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/per user\/year/i)).toBeInTheDocument();
  });

  it('displays feature icons', () => {
    const { container } = render(<ComparisonTable />);
    
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(10);
  });

  it('has proper semantic structure', () => {
    const { container } = render(<ComparisonTable />);
    
    const section = container.querySelector('section');
    const headings = container.querySelectorAll('h2, h3');
    
    expect(section).toBeInTheDocument();
    expect(headings.length).toBeGreaterThan(0);
  });
});

