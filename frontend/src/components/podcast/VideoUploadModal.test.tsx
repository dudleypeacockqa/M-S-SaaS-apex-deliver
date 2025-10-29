/**
 * TDD RED phase: VideoUploadModal component tests (DEV-016)
 * Test video file upload functionality with progress tracking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VideoUploadModal from './VideoUploadModal';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('VideoUploadModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render modal when open', () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/upload video/i)).toBeInTheDocument();
      expect(screen.getByText(/test episode/i)).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(
        <VideoUploadModal
          open={false}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByText(/upload video/i)).not.toBeInTheDocument();
    });

    it('should display file format requirements', () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/mp4/i)).toBeInTheDocument();
      expect(screen.getByText(/mov/i)).toBeInTheDocument();
      expect(screen.getByText(/2\s+gb/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should display file input for selection', () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const fileInput = screen.getByLabelText(/choose file/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.mp4,.mov');
    });

    it('should show selected file name', async () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('episode.mp4')).toBeInTheDocument();
      });
    });

    it('should display file size', async () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['a'.repeat(10 * 1024 * 1024)], 'episode.mp4', {
        type: 'video/mp4',
      }); // 10MB
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/10\.0\s+mb/i)).toBeInTheDocument();
      });
    });
  });

  describe('File Validation', () => {
    it('should reject invalid file formats', async () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'audio.mp3', { type: 'audio/mpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/invalid.*format/i)).toBeInTheDocument();
      });
    });

    it('should reject files larger than 2GB', async () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      // Mock a large file
      const largeFile = new File(['content'], 'large.mp4', { type: 'video/mp4' });
      Object.defineProperty(largeFile, 'size', { value: 2.5 * 1024 * 1024 * 1024 }); // 2.5GB

      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/too large/i)).toBeInTheDocument();
      });
    });

    it('should disable upload button when no file selected', () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      expect(uploadButton).toBeDisabled();
    });

    it('should enable upload button when valid file selected', async () => {
      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });
    });
  });

  describe('Upload Progress', () => {
    it('should show progress bar during upload', async () => {
      const mockUpload = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ video_url: '/storage/test.mp4', episode_id: 'ep-123' }),
              100
            );
          })
      );

      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
          onUpload={mockUpload}
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('should show success message after upload', async () => {
      const mockUpload = vi.fn().mockResolvedValue({
        video_url: '/storage/test.mp4',
        episode_id: 'ep-123',
      });

      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
          onUpload={mockUpload}
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });
    });

    it('should show error message on upload failure', async () => {
      const mockUpload = vi.fn().mockRejectedValue(new Error('Upload failed'));

      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
          onUpload={mockUpload}
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/failed|error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Modal Actions', () => {
    it('should call onClose when cancel button clicked', () => {
      const onClose = vi.fn();

      render(
        <VideoUploadModal
          open={true}
          onClose={onClose}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onSuccess after successful upload', async () => {
      const onSuccess = vi.fn();
      const mockUpload = vi.fn().mockResolvedValue({
        video_url: '/storage/test.mp4',
        episode_id: 'ep-123',
      });

      render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
          onUpload={mockUpload}
          onSuccess={onSuccess}
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith({
          video_url: '/storage/test.mp4',
          episode_id: 'ep-123',
        });
      });
    });

    it('should reset state when modal reopened', async () => {
      const { rerender } = render(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      // Select a file
      const file = new File(['video content'], 'episode.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('episode.mp4')).toBeInTheDocument();
      });

      // Close modal
      rerender(
        <VideoUploadModal
          open={false}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />
      );

      // Reopen modal
      rerender(
        <VideoUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />
      );

      // File should be cleared - check that the filename is no longer displayed
      await waitFor(() => {
        expect(screen.queryByText('episode.mp4')).not.toBeInTheDocument();
      });
    });
  });
});
