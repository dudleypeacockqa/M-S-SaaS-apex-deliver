import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VideoShowcase } from './VideoShowcase';

describe('VideoShowcase', () => {
  it('renders the title and description', () => {
    render(
      <VideoShowcase
        title="Test Video Title"
        description="Test description for the video showcase."
      />
    );

    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
    expect(screen.getByText('Test description for the video showcase.')).toBeInTheDocument();
    expect(screen.getByText('See It In Action')).toBeInTheDocument();
  });

  it('opens the video modal when the play button is clicked', () => {
    render(
      <VideoShowcase
        title="Test Video"
        description="Test description"
        wistiaId="test-id"
      />
    );

    // Modal should not be visible initially
    expect(screen.queryByTitle('Demo Video')).not.toBeInTheDocument();

    // Click the main CTA button
    const playButton = screen.getByText('Watch the 60-second demo');
    fireEvent.click(playButton);

    // Modal should be visible (checking for the iframe title)
    expect(screen.getByTitle('Demo Video')).toBeInTheDocument();
  });

  it('opens the video modal when the thumbnail is clicked', () => {
    render(
      <VideoShowcase
        title="Test Video"
        description="Test description"
      />
    );

    // Click the thumbnail container (we can find it by the duration badge text or role if we added one, usually just finding the text inside is easiest)
    const durationBadge = screen.getByText('1:00');
    fireEvent.click(durationBadge.closest('div.cursor-pointer')!);

    expect(screen.getByTitle('Demo Video')).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', () => {
    render(
      <VideoShowcase
        title="Test Video"
        description="Test description"
      />
    );

    // Open modal
    fireEvent.click(screen.getByText('Watch the 60-second demo'));
    expect(screen.getByTitle('Demo Video')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(screen.queryByTitle('Demo Video')).not.toBeInTheDocument();
  });
});

