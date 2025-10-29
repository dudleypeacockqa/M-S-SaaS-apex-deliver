import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MatchingActivity } from './MatchingActivity';

describe('MatchingActivity', () => {
  it('renders timeline events', () => {
    render(
      <MatchingActivity
        events={[
          {
            id: 'event-1',
            timestamp: '2025-10-28T09:00:00Z',
            label: 'Saved match Alpha Corp',
            status: 'saved',
          },
        ]}
      />
    );

    const widget = screen.getByTestId('matching-activity');
    expect(widget).toBeInTheDocument();
    const activityItem = widget.querySelector('li');
    expect(activityItem).toBeTruthy();
    if (activityItem) {
      expect(activityItem.textContent).toMatch(/Saved match Alpha Corp/i);
      expect(activityItem.textContent).toMatch(/saved/i);
    }
  });

  it('renders empty state when no events provided', () => {
    render(<MatchingActivity events={[]} />);

    expect(screen.getByText(/activity will appear here/i)).toBeInTheDocument();
  });
});
