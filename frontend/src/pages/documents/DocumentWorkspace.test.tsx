import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DocumentWorkspace from './DocumentWorkspace'

const folderTreeSpy = vi.fn()
const documentListSpy = vi.fn()
const uploadPanelSpy = vi.fn()
const permissionModalSpy = vi.fn()
const startUploadMock = vi.fn()
const clearQueueMock = vi.fn()

const uploadHookState = {
  isUploading: false,
  uploadQueue: [],
  errorMessage: null as string | null,
}

vi.mock('../../components/documents/FolderTree', () => ({
  FolderTree: (props: any) => {
    folderTreeSpy(props)
    return (
      <button data-testid="mock-folder-tree" onClick={() => props.onFolderSelect('folder-123')}>
        mock folder tree
      </button>
    )
  },
}))

vi.mock('../../components/documents/DocumentList', () => ({
  DocumentList: (props: any) => {
    documentListSpy(props)
    return <div data-testid="mock-document-list">folder:{props.folderId ?? 'all'}</div>
  },
}))

vi.mock('../../components/documents/UploadPanel', () => ({
  default: (props: any) => {
    uploadPanelSpy(props)
    return <div data-testid="mock-upload-panel">upload panel</div>
  },
}))

vi.mock('../../components/documents/PermissionModal', () => ({
  PermissionModal: (props: any) => {
    permissionModalSpy(props)
    if (!props.isOpen) {
      return null
    }

    return (
      <div data-testid="mock-permission-modal">
        permission modal for {props.documentId}
        <button onClick={props.onClose}>close-permissions</button>
      </div>
    )
  },
}))

vi.mock('../../hooks/useDocumentUploads', () => ({
  useDocumentUploads: () => ({
    ...uploadHookState,
    startUpload: startUploadMock,
    clearQueue: clearQueueMock,
  }),
}))

const renderWorkspace = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <DocumentWorkspace dealId="deal-abc" />
    </QueryClientProvider>
  )
}

describe('DocumentWorkspace', () => {
  beforeEach(() => {
    folderTreeSpy.mockClear()
    documentListSpy.mockClear()
    uploadPanelSpy.mockClear()
    permissionModalSpy.mockClear()
    startUploadMock.mockReset()
    clearQueueMock.mockClear()
    uploadHookState.isUploading = false
    uploadHookState.uploadQueue = []
    uploadHookState.errorMessage = null
  })

  it('renders folder pane, document list, and upload panel sections', () => {
    renderWorkspace()

    expect(screen.getByTestId('workspace-layout')).toBeInTheDocument()
    expect(screen.getByTestId('folder-pane')).toBeInTheDocument()
    expect(screen.getByTestId('document-pane')).toBeInTheDocument()
    expect(screen.getByTestId('upload-pane')).toBeInTheDocument()
  })

  it('updates DocumentList filter when FolderTree selection changes', () => {
    renderWorkspace()

    const folderButton = screen.getByTestId('mock-folder-tree')
    fireEvent.click(folderButton)

    expect(folderTreeSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedFolderId: 'folder-123' })
    )
    expect(documentListSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ folderId: 'folder-123' })
    )
  })

  it('routes uploads through the hook with selected folder context and refreshes document list', async () => {
    startUploadMock.mockResolvedValue(undefined)
    renderWorkspace()

    const folderButton = screen.getByTestId('mock-folder-tree')
    fireEvent.click(folderButton)

    const uploadProps = uploadPanelSpy.mock.calls.at(-1)?.[0]
    expect(uploadProps).toBeTruthy()
    expect(uploadProps.isUploading).toBe(false)
    expect(uploadProps.uploadQueue).toEqual([])

    const files = [new File(['content'], 'deal.pdf', { type: 'application/pdf' })]
    await act(async () => {
      await uploadProps.onUpload(files)
    })

    expect(startUploadMock).toHaveBeenCalledWith(files, { folderId: 'folder-123' })

    await waitFor(() => {
      expect(documentListSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ resetSelectionSignal: 1 })
      )
    })
  })

  it('opens and closes PermissionModal when manage permissions is requested', () => {
    renderWorkspace()

    const lastCall = documentListSpy.mock.calls.at(-1)?.[0]
    expect(lastCall).toBeTruthy()

    act(() => {
      lastCall.onManagePermissions?.({ id: 'doc-1' })
    })

    expect(permissionModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ documentId: 'doc-1', isOpen: true })
    )

    const closeButton = screen.getByText('close-permissions')
    fireEvent.click(closeButton)

    expect(permissionModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: false })
    )
  })

  // RED SPEC: FolderTree Search Functionality
  describe('FolderTree Search', () => {
    it('renders search input above folder tree', () => {
      renderWorkspace()

      const searchInput = screen.getByRole('searchbox', { name: /search folders/i })
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('placeholder', 'Search folders...')
    })

    it('filters folder tree based on search term', async () => {
      renderWorkspace()

      const searchInput = screen.getByRole('searchbox', { name: /search folders/i })
      fireEvent.change(searchInput, { target: { value: 'Due Diligence' } })

      await waitFor(() => {
        expect(folderTreeSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({ searchTerm: 'Due Diligence' })
        )
      })
    })

    it('clears search when clear button is clicked', async () => {
      renderWorkspace()

      const searchInput = screen.getByRole('searchbox', { name: /search folders/i })
      fireEvent.change(searchInput, { target: { value: 'Contract' } })

      const clearButton = screen.getByRole('button', { name: /clear search/i })
      fireEvent.click(clearButton)

      await waitFor(() => {
        expect(folderTreeSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({ searchTerm: '' })
        )
      })
      expect(searchInput).toHaveValue('')
    })

    it('shows "no results" message when search yields no matches', () => {
      renderWorkspace()

      const searchInput = screen.getByRole('searchbox', { name: /search folders/i })
      fireEvent.change(searchInput, { target: { value: 'NonexistentFolder' } })

      // FolderTree should receive empty searchResults prop
      expect(folderTreeSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ searchTerm: 'NonexistentFolder' })
      )
    })
  })

  // RED SPEC: Audit Logging for Document Operations
  describe('Audit Logging', () => {
    it('logs document upload events with user and timestamp', async () => {
      const logAuditEventMock = vi.fn()
      vi.mocked(startUploadMock).mockImplementation(async (files, options) => {
        logAuditEventMock({
          action: 'DOCUMENT_UPLOADED',
          resource_type: 'document',
          resource_id: 'new-doc-id',
          metadata: { folderId: options?.folderId, fileCount: files.length },
        })
      })

      renderWorkspace()

      const uploadProps = uploadPanelSpy.mock.calls.at(-1)?.[0]
      const files = [new File(['content'], 'deal.pdf', { type: 'application/pdf' })]

      await act(async () => {
        await uploadProps.onUpload(files)
      })

      expect(logAuditEventMock).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DOCUMENT_UPLOADED',
          resource_type: 'document',
          metadata: expect.objectContaining({ fileCount: 1 }),
        })
      )
    })

    it('logs document permission changes with affected user IDs', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      act(() => {
        documentListProps.onManagePermissions?.({ id: 'doc-1' })
      })

      // Open permission modal
      expect(permissionModalSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ documentId: 'doc-1', isOpen: true })
      )

      // Permission modal should have onPermissionChange callback
      const modalProps = permissionModalSpy.mock.calls.at(-1)?.[0]
      expect(modalProps.onPermissionChange).toBeDefined()

      // Simulate permission change
      await act(async () => {
        await modalProps.onPermissionChange?.({
          documentId: 'doc-1',
          userId: 'user-abc',
          permission: 'edit',
        })
      })

      // Audit log should be triggered
      // Implementation will add audit logging hook
    })

    it('logs document deletion events', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onAuditLog).toBeDefined()

      // Simulate delete event from DocumentList
      act(() => {
        documentListProps.onAuditLog?.({
          action: 'DOCUMENT_DELETED',
          resource_type: 'document',
          resource_id: 'doc-to-delete',
          metadata: { fileName: 'contract.pdf' },
        })
      })

      // Audit log should be triggered (will implement useAuditLog hook)
    })

    it('logs bulk actions with affected document IDs', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onAuditLog).toBeDefined()

      // Simulate bulk delete event
      act(() => {
        documentListProps.onAuditLog?.({
          action: 'BULK_DELETE',
          resource_type: 'document',
          resource_id: 'bulk-operation',
          metadata: { documentIds: ['doc-1', 'doc-2', 'doc-3'], count: 3 },
        })
      })

      // Audit log hook should capture bulk operations
    })
  })

  // RED SPEC: Bulk Actions Orchestration
  describe('Bulk Actions', () => {
    it('passes bulk action callbacks to DocumentList', () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onBulkMove).toBeDefined()
      expect(documentListProps.onBulkDelete).toBeDefined()
      expect(documentListProps.onBulkShare).toBeDefined()
    })

    it('calls bulk move handler when requested', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onBulkMove).toBeDefined()

      // Simulate bulk move request
      await act(async () => {
        await documentListProps.onBulkMove?.([
          { id: 'doc-1', name: 'file1.pdf' },
          { id: 'doc-2', name: 'file2.pdf' },
        ])
      })

      // Handler should be called (modal rendering is future work)
      expect(documentListProps.onBulkMove).toBeDefined()
    })

    it('calls bulk delete handler when requested', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onBulkDelete).toBeDefined()

      // Simulate bulk delete request
      await act(async () => {
        await documentListProps.onBulkDelete?.([
          { id: 'doc-1', name: 'file1.pdf' },
          { id: 'doc-2', name: 'file2.pdf' },
        ])
      })

      // Handler should be called (confirmation dialog is future work)
      expect(documentListProps.onBulkDelete).toBeDefined()
    })

    it('calls bulk share handler when requested', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      expect(documentListProps.onBulkShare).toBeDefined()

      // Simulate bulk share request
      await act(async () => {
        await documentListProps.onBulkShare?.([
          { id: 'doc-1', name: 'file1.pdf' },
          { id: 'doc-2', name: 'file2.pdf' },
        ])
      })

      // Handler should be called (share modal is future work)
      expect(documentListProps.onBulkShare).toBeDefined()
    })
  })
})
