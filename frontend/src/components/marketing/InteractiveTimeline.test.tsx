import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveTimeline } from './InteractiveTimeline';

describe('InteractiveTimeline', () => {
  it('renders all 4 stages', () => {
    render(<InteractiveTimeline />);
    expect(screen.getByText('Stage 1: Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Stage 2: Pre-Deal')).toBeInTheDocument();
    expect(screen.getByText('Stage 3: Post-Deal')).toBeInTheDocument();
    expect(screen.getByText('Stage 4: Operations')).toBeInTheDocument();
  });

  it('shows details for active stage', () => {
    render(<InteractiveTimeline />);
    // Default is Stage 1
    expect(screen.getByText('Deal sourcing')).toBeInTheDocument();
    expect(screen.getByText('Initial screening')).toBeInTheDocument();
  });

  it('updates details when stage clicked', () => {
    render(<InteractiveTimeline />);
    
    // Click Stage 2
    const stage2Buttons = screen.getAllByText('Stage 2: Pre-Deal');
    // Click the desktop button (first one usually) or just any
    fireEvent.click(stage2Buttons[0]);
    
    expect(screen.getByText('Due diligence')).toBeInTheDocument();
    expect(screen.getByText('Legal review')).toBeInTheDocument();
  });
});

