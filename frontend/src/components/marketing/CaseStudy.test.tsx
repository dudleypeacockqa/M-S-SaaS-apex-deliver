import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CaseStudy } from './CaseStudy';
import { CaseStudy as CaseStudyType } from '../../data/caseStudies';

describe('CaseStudy Component', () => {
  const mockCaseStudy: CaseStudyType = {
    id: 'test-case',
    customerName: 'Test Company',
    industry: 'Technology',
    customerSize: '100-500',
    challenge: 'Manual processes slowing down growth.',
    solution: 'Implemented automation suite.',
    results: {
      metric1: { value: '50%', label: 'Growth' },
      metric2: { value: '10x', label: 'ROI' },
      metric3: { value: '2w', label: 'Time saved' },
    },
    quote: 'This platform changed everything.',
    quoteName: 'Jane Doe',
    quoteTitle: 'CEO',
    logoUrl: '/logo.png',
    publishedDate: '2025-01-01',
    featured: true
  };

  it('renders customer info correctly', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders challenge and solution', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('Manual processes slowing down growth.')).toBeInTheDocument();
    expect(screen.getByText('Implemented automation suite.')).toBeInTheDocument();
  });

  it('renders metrics', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('10x')).toBeInTheDocument();
  });

  it('renders quote', () => {
    render(<CaseStudy caseStudy={mockCaseStudy} />);
    expect(screen.getByText('"This platform changed everything."')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });
});
