import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkActionsToolbar } from './BulkActionsToolbar';

describe('BulkActionsToolbar', () => {
  const baseProps = {
    selectedCount: 0,
    disableDownload: false,
    disableDelete: false,
    onDownload: vi.fn(),
    onDelete: vi.fn(),
    onClearSelection: vi.fn(),
  };

  it('renders selection summary when items selected', () => {
    render(<BulkActionsToolbar {...baseProps} selectedCount={3} />);
    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();
  });

  it('hides toolbar when no items selected', () => {
    render(<BulkActionsToolbar {...baseProps} selectedCount={0} />);
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it('disables download button when disableDownload true', () => {
    render(<BulkActionsToolbar {...baseProps} selectedCount={2} disableDownload />);
    expect(screen.getByRole('button', { name: /download/i })).toBeDisabled();
  });

  it('disables delete button when disableDelete true', () => {
    render(<BulkActionsToolbar {...baseProps} selectedCount={2} disableDelete />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });

  it('invokes onDownload when download clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<BulkActionsToolbar {...baseProps} selectedCount={2} onDownload={onDownload} />);
    await user.click(screen.getByRole('button', { name: /download/i }));
    expect(onDownload).toHaveBeenCalled();
  });

  it('invokes onDelete when delete clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<BulkActionsToolbar {...baseProps} selectedCount={2} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalled();
  });

  it('invokes onClearSelection when clear button clicked', async () => {
    const user = userEvent.setup();
    const onClearSelection = vi.fn();
    render(<BulkActionsToolbar {...baseProps} selectedCount={2} onClearSelection={onClearSelection} />);
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(onClearSelection).toHaveBeenCalled();
  });

  it('shows warning message when selection exceeds limit', () => {
    render(
      <BulkActionsToolbar
        {...baseProps}
        selectedCount={200}
        warningMessage="Too many files"
      />
    );
    expect(screen.getByText(/too many files/i)).toBeInTheDocument();
  });
});
