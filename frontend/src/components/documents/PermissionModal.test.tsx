/**
 * PermissionModal Component Tests
 * TDD RED phase - Write failing tests first
 * Sprint 1.1.1 - DEV-008 Secure Document & Data Room
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PermissionModal } from './PermissionModal';

// Mock permissions API
vi.mock('../../services/api/documents', () => ({
  listPermissions: vi.fn(),
  addPermission: vi.fn(),
  updatePermission: vi.fn(),
  removePermission: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('PermissionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={false}
        onClose={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render modal with permissions list when isOpen is true', async () => {
    const { listPermissions } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([
      { id: 'perm-1', user_id: 'user-1', user_email: 'john@example.com', role: 'viewer', document_id: 'doc-1' },
      { id: 'perm-2', user_id: 'user-2', user_email: 'jane@example.com', role: 'editor', document_id: 'doc-1' },
    ]);

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('should display user roles (viewer/editor/owner)', async () => {
    const { listPermissions } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([
      { id: 'perm-1', user_id: 'user-1', user_email: 'viewer@example.com', role: 'viewer', document_id: 'doc-1' },
      { id: 'perm-2', user_id: 'user-2', user_email: 'editor@example.com', role: 'editor', document_id: 'doc-1' },
      { id: 'perm-3', user_id: 'user-3', user_email: 'owner@example.com', role: 'owner', document_id: 'doc-1' },
    ]);

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/viewer/i)).toBeInTheDocument();
      expect(screen.getByText(/editor/i)).toBeInTheDocument();
      expect(screen.getByText(/owner/i)).toBeInTheDocument();
    });
  });

  it('should show add user input field', async () => {
    const { listPermissions } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([]);

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    });
  });

  it('should add new user with default viewer role', async () => {
    const { listPermissions, addPermission } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([]);
    vi.mocked(addPermission).mockResolvedValue({
      id: 'perm-new',
      user_id: 'user-new',
      user_email: 'newuser@example.com',
      role: 'viewer',
      document_id: 'doc-1',
    });

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const emailInput = await screen.findByPlaceholderText(/enter email/i);
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });

    const addButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addPermission).toHaveBeenCalledWith({
        document_id: 'doc-1',
        user_email: 'newuser@example.com',
        role: 'viewer',
      });
    });
  });

  it('should change user role via dropdown', async () => {
    const { listPermissions, updatePermission } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([
      { id: 'perm-1', user_id: 'user-1', user_email: 'user@example.com', role: 'viewer', document_id: 'doc-1' },
    ]);
    vi.mocked(updatePermission).mockResolvedValue({
      id: 'perm-1',
      user_id: 'user-1',
      user_email: 'user@example.com',
      role: 'editor',
      document_id: 'doc-1',
    });

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    const roleSelect = screen.getByRole('combobox', { name: /role for user@example\.com/i });
    fireEvent.change(roleSelect, { target: { value: 'editor' } });

    await waitFor(() => {
      expect(updatePermission).toHaveBeenCalledWith('perm-1', { role: 'editor' });
    });
  });

  it('should remove user permission', async () => {
    const { listPermissions, removePermission } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([
      { id: 'perm-1', user_id: 'user-1', user_email: 'remove@example.com', role: 'viewer', document_id: 'doc-1' },
    ]);
    vi.mocked(removePermission).mockResolvedValue(undefined);

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('remove@example.com')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove remove@example\.com/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(removePermission).toHaveBeenCalledWith('perm-1');
    });
  });

  it('should close modal when close button clicked', async () => {
    const { listPermissions } = await import('../../services/api/documents');
    vi.mocked(listPermissions).mockResolvedValue([]);

    const onClose = vi.fn();

    renderWithProviders(
      <PermissionModal
        documentId="doc-1"
        isOpen={true}
        onClose={onClose}
      />
    );

    const closeButton = await screen.findByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
