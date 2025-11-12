import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import VideoPlayerModal from './VideoPlayerModal';

vi.mock('./VideoPlayer', () => ({
  __esModule: true,
  default: ({ videoUrl }: { videoUrl: string | null }) => (
    <div data-testid="mock-video-player">{videoUrl ?? 'no-video'}</div>
  ),
}));

describe('VideoPlayerModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockReset();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <VideoPlayerModal open={false} onClose={onClose} episodeName="Demo" videoUrl="https://cdn/video.mp4" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders video player and download link when open', () => {
    render(
      <VideoPlayerModal open={true} onClose={onClose} episodeName="Demo Episode" videoUrl="https://cdn/video.mp4" />
    );

    expect(screen.getByTestId('video-player-modal')).toBeInTheDocument();
    expect(screen.getByText(/demo episode/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-video-player')).toHaveTextContent('https://cdn/video.mp4');
    expect(screen.getByRole('link', { name: /download video/i })).toHaveAttribute('href', 'https://cdn/video.mp4');
  });

  it('falls back to close button when video url missing', () => {
    render(<VideoPlayerModal open={true} onClose={onClose} episodeName="No Video" videoUrl={null} />);

    expect(screen.queryByRole('link', { name: /download video/i })).not.toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /^close$/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when escape is pressed', () => {
    render(<VideoPlayerModal open={true} onClose={onClose} episodeName="Demo" videoUrl={null} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking backdrop', () => {
    render(<VideoPlayerModal open={true} onClose={onClose} episodeName="Demo" videoUrl={null} />);

    fireEvent.click(screen.getByTestId('video-player-modal'));
    expect(onClose).toHaveBeenCalled();
  });
});
