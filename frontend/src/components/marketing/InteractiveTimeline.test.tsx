import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InteractiveTimeline } from './InteractiveTimeline';

describe('InteractiveTimeline', () => {
  it('renders timeline title', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('M&A Lifecycle Explorer')).toBeInTheDocument();
  });

  it('renders all stages in navigation', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Pre-Deal')).toBeInTheDocument();
    expect(screen.getByText('Post-Deal')).toBeInTheDocument();
    expect(screen.getByText('Optimization')).toBeInTheDocument();
  });

  it('shows first stage content by default', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Initial sourcing, screening, and preliminary valuation of potential targets.')).toBeInTheDocument();
  });

  it('changes content when stage is clicked', () => {
    render(<InteractiveTimeline />);
    const postDealButton = screen.getByText('Post-Deal');
    fireEvent.click(postDealButton);
    expect(screen.getByText('Closing the transaction and beginning the immediate integration tasks.')).toBeInTheDocument();
  });

  it('displays stage duration', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('0-90 Days')).toBeInTheDocument();
  });
});
