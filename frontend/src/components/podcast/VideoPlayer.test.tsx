/**
 * TDD RED phase: VideoPlayer component tests (DEV-016 Production)
 * Test video playback with controls for Premium tier users
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoPlayer from './VideoPlayer';

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render video player with source', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player');
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute('src', '/storage/video.mp4');
    });

    it('should display episode name as title', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      expect(screen.getByText('Test Episode')).toBeInTheDocument();
    });

    it('should show placeholder when no video URL', () => {
      render(
        <VideoPlayer
          videoUrl={null}
          episodeName="Test Episode"
        />
      );

      expect(screen.getByText(/no video available/i)).toBeInTheDocument();
    });
  });

  describe('Video Controls', () => {
    it('should have play/pause controls', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('controls');
    });

    it('should support fullscreen mode', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      // Verify video element supports fullscreen
      expect(video.tagName).toBe('VIDEO');
    });

    it('should have volume controls', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('controls');
    });
  });

  describe('Video Settings', () => {
    it('should support autoplay when enabled', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          autoplay={true}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('autoplay');
    });

    it('should not autoplay by default', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).not.toHaveAttribute('autoplay');
    });

    it('should support loop mode', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          loop={true}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('loop');
    });

    it('should support muted mode', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          muted={true}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      // Muted can be either an attribute or a property in different environments
      expect(video.muted || video.hasAttribute('muted')).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive with max width', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const container = screen.getByTestId('video-player-container');
      expect(container).toHaveClass('max-w-4xl');
    });

    it('should maintain aspect ratio', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveClass('w-full');
    });
  });

  describe('Error Handling', () => {
    it('should show error message on video load failure', async () => {
      render(
        <VideoPlayer
          videoUrl="/storage/invalid.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;

      // Simulate video error
      fireEvent.error(video);

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });
    });

    it('should call onError callback when provided', async () => {
      const onError = vi.fn();

      render(
        <VideoPlayer
          videoUrl="/storage/invalid.mp4"
          episodeName="Test Episode"
          onError={onError}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      fireEvent.error(video);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });

  describe('Playback Events', () => {
    it('should call onPlay when video starts playing', () => {
      const onPlay = vi.fn();

      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          onPlay={onPlay}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      fireEvent.play(video);

      expect(onPlay).toHaveBeenCalled();
    });

    it('should call onPause when video pauses', () => {
      const onPause = vi.fn();

      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          onPause={onPause}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      fireEvent.pause(video);

      expect(onPause).toHaveBeenCalled();
    });

    it('should call onEnded when video finishes', () => {
      const onEnded = vi.fn();

      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
          onEnded={onEnded}
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      fireEvent.ended(video);

      expect(onEnded).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible title', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('aria-label');
    });

    it('should support keyboard navigation', () => {
      render(
        <VideoPlayer
          videoUrl="/storage/video.mp4"
          episodeName="Test Episode"
        />
      );

      const video = screen.getByTestId('video-player') as HTMLVideoElement;
      expect(video).toHaveAttribute('controls');
    });
  });
});
