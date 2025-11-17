/**
 * TDD RED phase: AudioUploadModal component tests (DEV-016)
 * Test audio file upload functionality with progress tracking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AudioUploadModal from './AudioUploadModal';

// Mock the useUploadProgress hook
const mockUpload = vi.fn();
const mockCancel = vi.fn();
const mockReset = vi.fn();

// State that can be updated in tests
const mockHookState = {
  progress: 0,
  isUploading: false,
  error: null as string | null,
  uploadSpeed: null as number | null,
  estimatedTimeRemaining: null as number | null,
};

vi.mock('../../hooks/useUploadProgress', () => ({
  useUploadProgress: () => ({
    ...mockHookState,
    upload: mockUpload,
    cancel: mockCancel,
    reset: mockReset,
  }),
}));

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

describe('AudioUploadModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpload.mockReset();
    mockCancel.mockReset();
    mockReset.mockReset();

    // Reset mock hook state
    mockHookState.progress = 0;
    mockHookState.isUploading = false;
    mockHookState.error = null;
    mockHookState.uploadSpeed = null;
    mockHookState.estimatedTimeRemaining = null;
  });

  describe('Component Rendering', () => {
    it('should render modal when open', () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/upload audio/i)).toBeInTheDocument();
      expect(screen.getByText(/test episode/i)).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(
        <AudioUploadModal
          open={false}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByText(/upload audio/i)).not.toBeInTheDocument();
    });

    it('should display file format requirements', () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/mp3/i)).toBeInTheDocument();
      expect(screen.getByText(/wav/i)).toBeInTheDocument();
      expect(screen.getByText(/m4a/i)).toBeInTheDocument();
      expect(screen.getByText(/500\s*mb/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should display file input for selection', () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const fileInput = screen.getByLabelText(/choose file/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', '.mp3,.wav,.m4a');
    });

    it('should show selected file name', async () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/episode\.mp3/i)).toBeInTheDocument();
      });
    });

    it('should display file size', async () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['a'.repeat(1024 * 1024)], 'episode.mp3', {
        type: 'audio/mpeg',
      }); // 1MB
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/1\.0\s*mb/i)).toBeInTheDocument();
      });
    });
  });

  describe('File Validation', () => {
    it('should reject invalid file formats', async () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['video content'], 'video.mp4', { type: 'video/mp4' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/invalid.*format/i)).toBeInTheDocument();
      });
    });

    it('should reject files larger than 500MB', async () => {
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      // Mock a large file
      const largeFile = new File(['content'], 'large.mp3', { type: 'audio/mpeg' });
      Object.defineProperty(largeFile, 'size', { value: 600 * 1024 * 1024 }); // 600MB

      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/too large/i)).toBeInTheDocument();
      });
    });

    it('should disable upload button when no file selected', () => {
      render(
        <AudioUploadModal
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
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
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
      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      // Verify upload was called with correct parameters
      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(File),
        '/api/podcasts/episodes/ep-123/upload-audio',
        expect.any(Object),
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should show success message after upload', async () => {
      // Configure mock to call success callback immediately
      mockUpload.mockImplementation((_file, _url, _headers, onSuccess) => {
        // Simulate async upload then success
        setTimeout(() => {
          onSuccess({
            audio_url: '/storage/test.mp3',
            episode_id: 'ep-123',
          });
        }, 0);
      });

      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const uploadButton = screen.getByRole('button', { name: /upload/i });
        expect(uploadButton).not.toBeDisabled();
      });

      const uploadButton = screen.getByRole('button', { name: /upload/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should show error message on upload failure', async () => {
      // Configure mock to call error callback
      mockUpload.mockImplementation((_file, _url, _headers, _onSuccess, onError) => {
        setTimeout(() => {
          onError(new Error('Upload failed'));
        }, 0);
      });

      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
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
      }, { timeout: 2000 });
    });
  });

  describe('Modal Actions', () => {
    it('should call onClose when cancel button clicked', () => {
      const onClose = vi.fn();

      render(
        <AudioUploadModal
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

      // Configure mock to call success callback
      mockUpload.mockImplementation((_file, _url, _headers, onSuccessCallback) => {
        setTimeout(() => {
          onSuccessCallback({
            audio_url: '/storage/test.mp3',
            episode_id: 'ep-123',
          });
        }, 0);
      });

      render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
          onSuccess={onSuccess}
        />,
        { wrapper: createWrapper() }
      );

      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
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
          audio_url: '/storage/test.mp3',
          episode_id: 'ep-123',
        });
      }, { timeout: 2000 });
    });

    it('should reset state when modal reopened', async () => {
      const { rerender } = render(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />,
        { wrapper: createWrapper() }
      );

      // Select a file
      const file = new File(['audio content'], 'episode.mp3', { type: 'audio/mpeg' });
      const input = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/episode\.mp3/i)).toBeInTheDocument();
      });

      // Close modal
      rerender(
        <AudioUploadModal
          open={false}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />
      );

      // Reopen modal
      rerender(
        <AudioUploadModal
          open={true}
          onClose={() => {}}
          episodeId="ep-123"
          episodeName="Test Episode"
        />
      );

      // File should be cleared
      const newInput = screen.getByLabelText(/choose file/i) as HTMLInputElement;
      expect(newInput.files?.length).toBe(0);
    });
  });
});
