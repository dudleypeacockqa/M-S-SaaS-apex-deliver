/**
 * UploadPanel Enhanced Features Tests
 * Phase 1 Sprint 2 Task 1 - TDD RED Phase
 *
 * These tests cover the enhanced upload functionality:
 * - Multi-file upload queue visualization
 * - Individual file progress tracking
 * - Per-file cancellation
 * - Enhanced drag-drop visual feedback
 * - Upload queue management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadPanel from './UploadPanel';

describe('UploadPanel - Enhanced Features (Sprint 2 Task 1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Multi-File Upload Queue', () => {
    it('should display upload queue with multiple files', async () => {
      const handleUpload = vi.fn();
      render(<UploadPanel onUpload={handleUpload} isUploading={false} />);

      const dropzone = screen.getByTestId('upload-dropzone');
      const files = [
        new File(['content1'], 'document1.pdf', { type: 'application/pdf' }),
        new File(['content2'], 'document2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        new File(['content3'], 'document3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      ];

      const dataTransfer = {
        files,
        items: files.map(file => ({
          kind: 'file',
          type: file.type,
          getAsFile: () => file
        })),
        types: ['Files']
      };

      fireEvent.drop(dropzone, { dataTransfer });

      // onUpload should be called with files
      expect(handleUpload).toHaveBeenCalledWith(files);

      // Note: In a real implementation, the parent component would update uploadQueue prop
      // This test verifies that the callback is triggered correctly
    });

    it('should display individual progress bars for each file in queue', async () => {
      const handleUpload = vi.fn();
      const { rerender } = render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 25, status: 'uploading' },
            { id: '2', name: 'file2.docx', progress: 75, status: 'uploading' }
          ]}
        />
      );

      // Should show individual progress for each file
      expect(screen.getByTestId('file-progress-1')).toBeInTheDocument();
      expect(screen.getByTestId('file-progress-2')).toBeInTheDocument();

      // Should show correct progress percentages
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should show file upload status icons (uploading, complete, error)', async () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 50, status: 'uploading' },
            { id: '2', name: 'file2.docx', progress: 100, status: 'complete' },
            { id: '3', name: 'file3.xlsx', progress: 30, status: 'error', error: 'Upload failed' }
          ]}
        />
      );

      // Should show status indicators
      expect(screen.getByTestId('upload-status-uploading-1')).toBeInTheDocument();
      expect(screen.getByTestId('upload-status-complete-2')).toBeInTheDocument();
      expect(screen.getByTestId('upload-status-error-3')).toBeInTheDocument();

      // Should show error message
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
  });

  describe('Per-File Cancellation', () => {
    it('should display cancel button for each uploading file', async () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 25, status: 'uploading' },
            { id: '2', name: 'file2.docx', progress: 50, status: 'uploading' }
          ]}
          onCancelFile={vi.fn()}
        />
      );

      // Should have cancel button for each file
      const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
      expect(cancelButtons).toHaveLength(2);
      expect(cancelButtons[0]).toHaveAttribute('aria-label', 'Cancel upload for file1.pdf');
      expect(cancelButtons[1]).toHaveAttribute('aria-label', 'Cancel upload for file2.docx');
    });

    it('should call onCancelFile with correct file id when cancel clicked', async () => {
      const user = userEvent.setup();
      const handleCancelFile = vi.fn();

      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: 'file-123', name: 'document.pdf', progress: 40, status: 'uploading' }
          ]}
          onCancelFile={handleCancelFile}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel upload for document\.pdf/i });
      await user.click(cancelButton);

      expect(handleCancelFile).toHaveBeenCalledWith('file-123');
    });

    it('should remove file from queue after cancellation', async () => {
      const user = userEvent.setup();
      const handleCancelFile = vi.fn();

      const { rerender } = render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 30, status: 'uploading' },
            { id: '2', name: 'file2.docx', progress: 60, status: 'uploading' }
          ]}
          onCancelFile={handleCancelFile}
        />
      );

      // Click cancel on first file
      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0];
      await user.click(cancelButton);

      // Rerender with file removed
      rerender(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '2', name: 'file2.docx', progress: 60, status: 'uploading' }
          ]}
          onCancelFile={handleCancelFile}
        />
      );

      // First file should be gone
      await waitFor(() => {
        expect(screen.queryByText('file1.pdf')).not.toBeInTheDocument();
        expect(screen.getByText('file2.docx')).toBeInTheDocument();
      });
    });
  });

  describe('Enhanced Drag-Drop Visual Feedback', () => {
    it('should add border-blue-500 class on dragover', () => {
      render(<UploadPanel onUpload={vi.fn()} isUploading={false} />);
      const dropzone = screen.getByTestId('upload-dropzone');

      // Simulate drag over
      fireEvent.dragOver(dropzone, {
        dataTransfer: {
          types: ['Files']
        }
      });

      // Should have enhanced visual feedback
      expect(dropzone).toHaveClass('border-blue-500');
      expect(dropzone).toHaveClass('bg-blue-50');
      expect(dropzone).toHaveClass('scale-102'); // Subtle scale animation
    });

    it('should remove enhanced styling on drag leave', () => {
      render(<UploadPanel onUpload={vi.fn()} isUploading={false} />);
      const dropzone = screen.getByTestId('upload-dropzone');

      // Drag over then leave
      fireEvent.dragOver(dropzone, {
        dataTransfer: { types: ['Files'] }
      });

      expect(dropzone).toHaveClass('border-blue-500');

      fireEvent.dragLeave(dropzone);

      // Should revert to default styling
      expect(dropzone).not.toHaveClass('border-blue-500');
      expect(dropzone).not.toHaveClass('bg-blue-50');
      expect(dropzone).not.toHaveClass('scale-102');
    });

    it('should show animated upload icon on drag over', () => {
      render(<UploadPanel onUpload={vi.fn()} isUploading={false} />);
      const dropzone = screen.getByTestId('upload-dropzone');

      fireEvent.dragOver(dropzone, {
        dataTransfer: { types: ['Files'] }
      });

      // Should show animated icon
      const uploadIcon = screen.getByTestId('drag-active-icon');
      expect(uploadIcon).toBeInTheDocument();
      expect(uploadIcon).toHaveClass('animate-bounce');
    });
  });

  describe('Upload Queue Management', () => {
    it('should display total upload progress across all files', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 100, status: 'complete' },
            { id: '2', name: 'file2.docx', progress: 50, status: 'uploading' },
            { id: '3', name: 'file3.xlsx', progress: 0, status: 'pending' }
          ]}
        />
      );

      // Should show overall progress: (100 + 50 + 0) / 3 = 50%
      expect(screen.getByTestId('overall-progress')).toBeInTheDocument();
      expect(screen.getByText('Overall: 50%')).toBeInTheDocument();
    });

    it('should show upload speed and estimated time remaining', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 40, status: 'uploading', speed: '2.5 MB/s', eta: '10s' }
          ]}
        />
      );

      expect(screen.getByText('2.5 MB/s')).toBeInTheDocument();
      expect(screen.getByText('10s remaining')).toBeInTheDocument();
    });

    it('should display file size for each file in queue', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 25, status: 'uploading', size: 2500000 }, // 2.4 MB
            { id: '2', name: 'file2.docx', progress: 50, status: 'uploading', size: 512000 }  // 500.0 KB
          ]}
        />
      );

      // Format: (bytes / (1024 * 1024)).toFixed(1) for MB, (bytes / 1024).toFixed(1) for KB
      expect(screen.getByText('2.4 MB')).toBeInTheDocument(); // 2500000 / (1024 * 1024) = 2.38... → 2.4 MB
      expect(screen.getByText('500.0 KB')).toBeInTheDocument(); // 512000 / 1024 = 500.0 KB
    });

    it('should show retry button for failed uploads', async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();

      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 45, status: 'error', error: 'Network error' }
          ]}
          onRetryFile={handleRetry}
        />
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      await user.click(retryButton);
      expect(handleRetry).toHaveBeenCalledWith('1');
    });
  });

  describe('Accessibility', () => {
    it('should announce upload progress to screen readers', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'file1.pdf', progress: 60, status: 'uploading' }
          ]}
        />
      );

      const progressElement = screen.getByTestId('file-progress-1');
      expect(progressElement).toHaveAttribute('role', 'progressbar');
      expect(progressElement).toHaveAttribute('aria-valuenow', '60');
      expect(progressElement).toHaveAttribute('aria-valuemin', '0');
      expect(progressElement).toHaveAttribute('aria-valuemax', '100');
      expect(progressElement).toHaveAttribute('aria-label', 'Upload progress for file1.pdf');
    });

    it('should have proper ARIA labels for cancel buttons', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={true}
          uploadQueue={[
            { id: '1', name: 'document.pdf', progress: 30, status: 'uploading' }
          ]}
          onCancelFile={vi.fn()}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel upload for document\.pdf/i });
      expect(cancelButton).toHaveAttribute('aria-label', 'Cancel upload for document.pdf');
    });
  });
});
