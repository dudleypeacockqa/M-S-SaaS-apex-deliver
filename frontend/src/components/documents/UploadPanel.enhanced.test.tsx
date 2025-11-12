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
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

  // RED SPEC: Storage Quota Validation
  describe('Storage Quota Enforcement', () => {
    it('should display storage quota usage before upload', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 2_500_000_000, limit: 5_000_000_000 }} // 2.5 GB / 5 GB
        />
      );

      expect(screen.getByTestId('storage-quota-display')).toBeInTheDocument();
      // formatGB(2_500_000_000) = (2500000000 / 1024^3).toFixed(1) = 2.3 GB
      expect(screen.getByText(/2\.3 GB/i)).toBeInTheDocument();
      expect(screen.getByText(/4\.7 GB/i)).toBeInTheDocument(); // formatGB(5_000_000_000) = 4.7 GB
      expect(screen.getByText(/50% used/i)).toBeInTheDocument();
    });

    it('should show visual warning when quota is above 80%', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 4_200_000_000, limit: 5_000_000_000 }} // 4.2 GB / 5 GB = 84%
        />
      );

      const quotaDisplay = screen.getByTestId('storage-quota-display');
      expect(quotaDisplay).toHaveClass('border-orange-200'); // Warning color - check border class
      expect(screen.getByText(/84% used/i)).toBeInTheDocument();
      expect(screen.getByText(/approaching storage limit/i)).toBeInTheDocument();
    });

    it('should show critical alert when quota is above 95%', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 4_800_000_000, limit: 5_000_000_000 }} // 4.8 GB / 5 GB = 96%
        />
      );

      const quotaDisplay = screen.getByTestId('storage-quota-display');
      expect(quotaDisplay).toHaveClass('border-red-200'); // Critical color - check border class
      expect(screen.getByText(/96% used/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(/storage almost full/i);
    });

    it('should prevent upload when file would exceed quota', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          storageQuota={{ used: 4_900_000_000, limit: 5_000_000_000 }} // 4.9 GB / 5 GB
        />
      );

      // Try to upload a 200 MB file (would exceed 5 GB limit)
      const fileInput = screen.getByTestId('upload-input');
      // Create file with size property instead of large content
      const largeFile = new File(['content'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 200_000_000 });

      await user.upload(fileInput, largeFile);

      // Should show quota exceeded error
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        const errorAlert = alerts.find((alert) =>
          alert.textContent?.match(/storage quota exceeded/i)
        );
        expect(errorAlert).toBeDefined();
        expect(errorAlert).toHaveTextContent(/storage quota exceeded/i);
        expect(handleUpload).not.toHaveBeenCalled();
      });
    });

    it('should allow upload when file fits within quota', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          storageQuota={{ used: 2_000_000_000, limit: 5_000_000_000 }} // 2 GB / 5 GB
        />
      );

      // Upload a 50 MB file (well within limit)
      const fileInput = screen.getByTestId('upload-input');
      const normalFile = new File(['content'], 'normal.pdf', { type: 'application/pdf' });
      Object.defineProperty(normalFile, 'size', { value: 50_000_000 });

      await user.upload(fileInput, normalFile);

      await waitFor(() => {
        expect(handleUpload).toHaveBeenCalledWith([normalFile]);
      });
    });

    it('should show upgrade prompt when quota exceeded for paid tier', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 5_000_000_000, limit: 5_000_000_000 }} // 5 GB / 5 GB = 100%
          userTier="professional"
        />
      );

      expect(screen.getByRole('link', { name: /upgrade storage/i })).toBeInTheDocument();
      expect(screen.getByText(/upgrade to enterprise/i)).toBeInTheDocument();
    });

    it('should disable dropzone and browse button when quota is fully used', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 5_000_000_000, limit: 5_000_000_000 }}
          userTier="starter"
        />
      );

      const dropzone = screen.getByTestId('upload-dropzone');
      expect(dropzone).toHaveAttribute('aria-disabled', 'true');
      expect(dropzone).toHaveClass('cursor-not-allowed');

      const browseButton = screen.getByRole('button', { name: /browse files/i });
      expect(browseButton).toBeDisabled();
    });

    it('should show quota lock message and block drag-and-drop uploads when locked', () => {
      const handleUpload = vi.fn();
      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          storageQuota={{ used: 5_000_000_000, limit: 5_000_000_000 }}
          userTier="professional"
          quotaLockMessage="Storage quota reached. Delete files or upgrade."
          onManageStorage={vi.fn()}
        />
      );

      const dropzone = screen.getByTestId('upload-dropzone');
      expect(dropzone).toHaveAttribute('aria-disabled', 'true');

      const overlay = screen.getByTestId('quota-lock-overlay');
      expect(overlay).toHaveTextContent(/storage quota reached/i);
      expect(within(overlay).getByRole('button', { name: /manage storage/i })).toBeInTheDocument();

      const files = [new File(['content'], 'locked.pdf', { type: 'application/pdf' })];
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files,
          items: files.map((file) => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file,
          })),
          types: ['Files'],
        },
      });

      expect(handleUpload).not.toHaveBeenCalled();
    });

    it('should surface manage storage action when quota error is shown', async () => {
      const user = userEvent.setup();
      const handleManageStorage = vi.fn();

      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          storageQuota={{ used: 5_000_000_000, limit: 5_000_000_000 }}
          userTier="professional"
          errorMessage="Storage quota exceeded. Please delete some files or upgrade your plan."
          onManageStorage={handleManageStorage}
        />
      );

      const alerts = screen.getAllByRole('alert');
      const quotaAlert = alerts.find((element) =>
        element.textContent?.toLowerCase().includes('storage quota exceeded')
      );
      expect(quotaAlert).toBeDefined();
      expect(quotaAlert).toHaveTextContent(/storage quota exceeded/i);

      const manageButtons = screen.getAllByRole('button', { name: /manage storage/i });
      expect(manageButtons.length).toBeGreaterThan(0);

      await user.click(manageButtons[0]);
      expect(handleManageStorage).toHaveBeenCalled();
    });
  });

  // RED SPEC: File Size Limits
  describe('File Size Validation', () => {
    it('should reject files exceeding max file size limit', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          maxFileSize={100_000_000} // 100 MB limit
        />
      );

      const fileInput = screen.getByTestId('upload-input');
      const oversizedFile = new File(['content'], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(oversizedFile, 'size', { value: 150_000_000 });

      await user.upload(fileInput, oversizedFile);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/file size exceeds 100 MB limit/i);
        expect(handleUpload).not.toHaveBeenCalled();
      });
    });

    it('should show tier-specific file size limits', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          maxFileSize={50_000_000} // 50 MB for starter tier
          userTier="starter"
        />
      );

      expect(screen.getByText(/max file size: 50 MB/i)).toBeInTheDocument();
    });

    it('should allow larger files for enterprise tier', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          maxFileSize={500_000_000} // 500 MB for enterprise tier
          userTier="enterprise"
        />
      );

      const fileInput = screen.getByTestId('upload-input');
      const largeFile = new File(['content'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 300_000_000 });

      await user.upload(fileInput, largeFile);

      await waitFor(() => {
        expect(handleUpload).toHaveBeenCalledWith([largeFile]);
      });
    });
  });

  // RED SPEC: Error State Handling
  describe('Upload Error States', () => {
    it('should display network error with retry option', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          errorMessage="Network connection lost. Please check your internet connection."
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/network connection lost/i);
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should display server error with support contact', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          errorMessage="Server error: 500 Internal Server Error"
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/server error/i);
      expect(screen.getByRole('link', { name: /contact support/i })).toBeInTheDocument();
    });

    it('should display file type validation error', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          allowedFileTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
        />
      );

      const invalidFile = new File(['content'], 'image.png', { type: 'image/png' });
      const dropzone = screen.getByTestId('upload-dropzone');

      const dataTransfer = {
        files: [invalidFile],
        items: [
          {
            kind: 'file',
            type: invalidFile.type,
            getAsFile: () => invalidFile,
          },
        ],
        types: ['Files'],
      };

      fireEvent.drop(dropzone, { dataTransfer });

      const alerts = await screen.findAllByRole('alert');
      const errorAlert = alerts.find((element) =>
        element.textContent?.toLowerCase().includes('file type not allowed')
      );
      expect(errorAlert).toBeDefined();
      expect(errorAlert?.textContent).toMatch(/allowed types: pdf, docx/i);
      expect(handleUpload).not.toHaveBeenCalled();
    });

    it('should clear error message after successful upload', async () => {
      const { rerender } = render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          errorMessage="Previous upload failed"
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/previous upload failed/i);

      // Rerender with no error after successful upload
      rerender(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          errorMessage={undefined}
        />
      );

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    it('should show authentication error and redirect to login', () => {
      render(
        <UploadPanel
          onUpload={vi.fn()}
          isUploading={false}
          errorMessage="Session expired. Please log in again."
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent(/session expired/i);
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });

  // RED SPEC: Batch Upload Limits
  describe('Batch Upload Restrictions', () => {
    it('should enforce max files per upload for starter tier', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          maxFilesPerUpload={5} // Starter tier: 5 files max
          userTier="starter"
        />
      );

      const fileInput = screen.getByTestId('upload-input');
      const files = Array.from({ length: 10 }, (_, i) =>
        new File(['content'], `file${i}.pdf`, { type: 'application/pdf' })
      );

      await user.upload(fileInput, files);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/max 5 files per upload/i);
        expect(screen.getByText(/upgrade to upload more files/i)).toBeInTheDocument();
      });
    });

    it('should allow unlimited files for enterprise tier', async () => {
      const user = userEvent.setup();
      const handleUpload = vi.fn();

      render(
        <UploadPanel
          onUpload={handleUpload}
          isUploading={false}
          maxFilesPerUpload={-1} // Enterprise tier: unlimited
          userTier="enterprise"
        />
      );

      const fileInput = screen.getByTestId('upload-input');
      const files = Array.from({ length: 50 }, (_, i) =>
        new File(['content'], `file${i}.pdf`, { type: 'application/pdf' })
      );

      await user.upload(fileInput, files);

      await waitFor(() => {
        expect(handleUpload).toHaveBeenCalledWith(files);
      });
    });
  });
});
