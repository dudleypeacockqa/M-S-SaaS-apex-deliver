import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadPanel from './UploadPanel';

// TDD RED suite for DEV-008 Upload Panel
// Tests will fail until implementation is completed.

describe('UploadPanel', () => {
  const noop = () => undefined;

  it('renders drop zone with default instructions', () => {
    render(<UploadPanel onUpload={noop} isUploading={false} />);
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
  });

  it('opens file picker when upload button clicked', async () => {
    const user = userEvent.setup();
    render(<UploadPanel onUpload={noop} isUploading={false} />);
    const button = screen.getByRole('button', { name: /browse files/i });
    await user.click(button);
    expect(screen.getByTestId('upload-input')).toBeInTheDocument();
  });

  it('supports dropping multiple files into drop zone', async () => {
    const user = userEvent.setup();
    const handleUpload = jest.fn();
    render(<UploadPanel onUpload={handleUpload} isUploading={false} />);
    const dropzone = screen.getByTestId('upload-dropzone');
    const files = [
      new File(['a'], 'doc1.pdf', { type: 'application/pdf' }),
      new File(['b'], 'doc2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    ];
    await user.upload(dropzone, files);
    expect(handleUpload).toHaveBeenCalledWith(files);
  });

  it('displays uploading state with progress indicator', () => {
    render(<UploadPanel onUpload={noop} isUploading progress={45} />);
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(screen.getByText(/45%/i)).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(
      <UploadPanel
        onUpload={noop}
        isUploading={false}
        errorMessage="File type not supported"
      />
    );
    expect(screen.getByText(/file type not supported/i)).toBeInTheDocument();
  });

  it('clears error when user selects new files', async () => {
    const user = userEvent.setup();
    const files = [new File(['a'], 'doc.pdf', { type: 'application/pdf' })];
    render(
      <UploadPanel
        onUpload={noop}
        isUploading={false}
        errorMessage="File too large"
      />
    );
    const dropzone = screen.getByTestId('upload-dropzone');
    await user.upload(dropzone, files);
    await waitFor(() => expect(screen.queryByText(/file too large/i)).not.toBeInTheDocument());
  });

  it('invokes onRemove callback when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(
      <UploadPanel
        onUpload={noop}
        onRemove={onRemove}
        isUploading={true}
      />
    );
    const cancelBtn = screen.getByRole('button', { name: /cancel upload/i });
    await user.click(cancelBtn);
    expect(onRemove).toHaveBeenCalled();
  });

  it('shows allowed file types helper text by default', () => {
    render(<UploadPanel onUpload={noop} isUploading={false} />);
    expect(screen.getByText(/pdf, docx, xlsx, pptx/i)).toBeInTheDocument();
  });

  it('disables drop zone while upload in progress', () => {
    render(<UploadPanel onUpload={noop} isUploading={true} />);
    expect(screen.getByTestId('upload-dropzone')).toHaveAttribute('aria-disabled', 'true');
  });

  it('passes accepted types to hidden input', () => {
    render(
      <UploadPanel
        onUpload={noop}
        isUploading={false}
        accept=".pdf,.docx"
      />
    );
    const input = screen.getByTestId('upload-input');
    expect(input).toHaveAttribute('accept', '.pdf,.docx');
  });
});
