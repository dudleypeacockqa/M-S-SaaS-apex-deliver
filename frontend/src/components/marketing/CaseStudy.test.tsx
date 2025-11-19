import { render, screen } from '@testing-library/react';
import { CaseStudy } from './CaseStudy';
import { CaseStudy as CaseStudyType } from '../../data/caseStudies';

describe('CaseStudy', () => {
  const mockCaseStudy: CaseStudyType = {
    id: 'test-1',
    customerName: 'Test Company',
    industry: 'Test Industry',
    customerSize: '100 employees',
    challenge: 'Test challenge',
    solution: 'Test solution',
    results: {
      metric1: { value: '50%', label: 'Test metric' },
      metric2: { value: '10 days', label: 'Test time' },
    },
    quote: 'Test quote',
    quoteName: 'John Doe',
    quoteTitle: 'CEO',
    logoUrl: '/test-logo.svg',
    publishedDate: '2025-10-01',
    featured: true,
  };

  it('renders customer name and industry', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText(/Test Industry/)).toBeInTheDocument();
  });

  it('displays challenge and solution sections', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('Test challenge')).toBeInTheDocument();
    expect(screen.getByText('Test solution')).toBeInTheDocument();
  });

  it('shows metrics in results section', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Test metric')).toBeInTheDocument();
  });

  it('displays customer quote with attribution', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText(/Test quote/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/CEO/)).toBeInTheDocument();
  });

  it('includes CTA button', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText(/Start Your Free Trial/i)).toBeInTheDocument();
  });
});

