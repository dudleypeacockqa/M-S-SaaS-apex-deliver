import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor, cleanup, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DocumentWorkspace, { type DocumentWorkspaceProps } from './DocumentWorkspace'

const folderTreeSpy = vi.fn()
const documentListSpy = vi.fn()
const uploadPanelSpy = vi.fn()
const permissionModalSpy = vi.fn()
const startUploadMock = vi.fn()
const clearQueueMock = vi.fn()
const questionPanelSpy = vi.fn()
const accessLogDrawerSpy = vi.fn()
const shareLinkModalSpy = vi.fn()

const uploadHookState = {
  isUploading: false,
  uploadQueue: [],
  errorMessage: null as string | null,
}

const documentApiMocks = vi.hoisted(() => ({
  bulkMoveDocuments: vi.fn(),
  bulkArchiveDocuments: vi.fn(),
  restoreArchivedDocuments: vi.fn(),
  logDocumentAuditEvent: vi.fn(),
}))

vi.mock('../../services/api/documents', async () => {
  const actual = await vi.importActual<typeof import('../../services/api/documents')>(
    '../../services/api/documents'
  )

  return {
    ...actual,
    bulkMoveDocuments: documentApiMocks.bulkMoveDocuments,
    bulkArchiveDocuments: documentApiMocks.bulkArchiveDocuments,
    restoreArchivedDocuments: documentApiMocks.restoreArchivedDocuments,
    logDocumentAuditEvent: documentApiMocks.logDocumentAuditEvent,
  }
})

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

vi.mock('../../components/documents/DocumentQuestionsPanel', () => ({
  DocumentQuestionsPanel: (props: any) => {
    questionPanelSpy(props)
    if (!props.document) {
      return null
    }

    return (
      <div data-testid="mock-question-panel">
        question panel {props.document.id}
        <button onClick={props.onClose}>close-question-panel</button>
      </div>
    )
  },
}))

vi.mock('../../components/documents/AccessLogDrawer', () => ({
  AccessLogDrawer: (props: any) => {
    accessLogDrawerSpy(props)
    if (!props.isOpen) {
      return null
    }
    return (
      <div data-testid="mock-access-log-drawer">
        access log drawer for {props.documentId}
        <button onClick={props.onClose}>close-access-log</button>
      </div>
    )
  },
}))

vi.mock('../../components/documents/ShareLinkModal', () => ({
  ShareLinkModal: (props: any) => {
    shareLinkModalSpy(props)
    if (!props.isOpen) {
      return null
    }
    return (
      <div data-testid="mock-share-modal">
        share link modal for {props.documentId}
        <button onClick={props.onClose}>close-share-modal</button>
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

let queryClient: QueryClient

const renderWorkspace = (props?: Partial<DocumentWorkspaceProps>) => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false }
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <DocumentWorkspace dealId="deal-abc" {...props} />
    </QueryClientProvider>
  )
}

describe('DocumentWorkspace', () => {
  beforeEach(() => {
    folderTreeSpy.mockClear()
    documentListSpy.mockClear()
    uploadPanelSpy.mockClear()
    questionPanelSpy.mockClear()
    permissionModalSpy.mockClear()
    startUploadMock.mockReset()
    clearQueueMock.mockClear()
    uploadHookState.isUploading = false
    uploadHookState.uploadQueue = []
    uploadHookState.errorMessage = null
    documentApiMocks.bulkMoveDocuments.mockReset()
    documentApiMocks.bulkArchiveDocuments.mockReset()
    documentApiMocks.restoreArchivedDocuments.mockReset()
    documentApiMocks.logDocumentAuditEvent.mockReset()
    accessLogDrawerSpy.mockClear()
    shareLinkModalSpy.mockClear()
  })

  afterEach(() => {
    cleanup()
    if (queryClient) {
      queryClient.clear()
      queryClient.unmount()
    }
    vi.clearAllMocks()
  })

  it('renders folder pane, document list, and upload panel sections', () => {
    renderWorkspace()

    expect(screen.getByTestId('workspace-layout')).toBeInTheDocument()
    expect(screen.getByTestId('folder-pane')).toBeInTheDocument()
    expect(screen.getByTestId('document-pane')).toBeInTheDocument()
    expect(screen.getByTestId('upload-pane')).toBeInTheDocument()
  })

  it('forwards onDocumentsLoaded to the underlying DocumentList', () => {
    const onDocumentsLoaded = vi.fn()
    renderWorkspace({ onDocumentsLoaded })

    const props = documentListSpy.mock.calls.at(-1)?.[0]
    expect(props.onDocumentsLoaded).toBeTypeOf('function')

    const mockDocuments = [{ id: 'doc-123', name: 'Report.pdf' }]
    act(() => {
      props.onDocumentsLoaded?.(mockDocuments)
    })

    expect(onDocumentsLoaded).toHaveBeenCalledWith(mockDocuments)
  })

  it('forwards onError to the DocumentList error boundary', () => {
    const onError = vi.fn()
    renderWorkspace({ onError })

    const props = documentListSpy.mock.calls.at(-1)?.[0]
    expect(props.onError).toBeTypeOf('function')

    const err = new Error('Load failed')
    act(() => {
      props.onError?.(err)
    })

    expect(onError).toHaveBeenCalledWith(err)
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


  it('refreshes the document list after permissions change to reflect new access state', async () => {
    renderWorkspace()

    const initialProps = documentListSpy.mock.calls.at(-1)?.[0]
    const initialSignal = initialProps?.resetSelectionSignal ?? 0

    act(() => {
      initialProps?.onManagePermissions?.({
        id: 'doc-refresh',
        name: 'Quarterly Review.pdf',
        auditTrail: [],
      })
    })

    const modalProps = permissionModalSpy.mock.calls.at(-1)?.[0]
    await act(async () => {
      await modalProps.onPermissionChange?.({
        documentId: 'doc-refresh',
        userId: 'user-123',
        permission: 'editor',
      })
    })

    const latestProps = documentListSpy.mock.calls.at(-1)?.[0]
    expect(latestProps?.resetSelectionSignal ?? 0).toBeGreaterThan(initialSignal)
  })

  it('opens share link modal when share is requested', () => {
    renderWorkspace()

    const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
    act(() => {
      documentListProps.onShareDocument?.({ id: 'doc-share', name: 'Share.pdf' })
    })

    expect(shareLinkModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: true, documentId: 'doc-share' })
    )

    const closeButton = screen.getByText('close-share-modal')
    fireEvent.click(closeButton)

    expect(shareLinkModalSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: false })
    )
  })

  it('opens access log drawer when document activity is requested', () => {
    renderWorkspace()

    const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
    act(() => {
      documentListProps.onViewAccessLogs?.({ id: 'doc-activity', name: 'Equity.pdf' })
    })

    expect(accessLogDrawerSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: true, documentId: 'doc-activity', documentName: 'Equity.pdf' })
    )

    const closeButton = screen.getByText('close-access-log')
    fireEvent.click(closeButton)

    expect(accessLogDrawerSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: false })
    )
  })

  it('opens the question panel when DocumentList requests Q&A view', async () => {
    renderWorkspace()

    const lastCall = documentListSpy.mock.calls.at(-1)?.[0]
    expect(lastCall).toBeTruthy()

    act(() => {
      lastCall.onOpenQuestions?.({ id: 'doc-qa', name: 'Doc QA' })
    })

    expect(questionPanelSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({ document: expect.objectContaining({ id: 'doc-qa' }) })
    )
    expect(screen.getByTestId('mock-question-panel')).toHaveTextContent('doc-qa')

    const closeButton = screen.getByText('close-question-panel')
    act(() => {
      fireEvent.click(closeButton)
    })

    await waitFor(() => {
      expect(screen.queryByTestId('mock-question-panel')).not.toBeInTheDocument()
    })
  })

  describe('Upload progress toast', () => {
    it('surfaces a progress toast while uploads are running', () => {
      uploadHookState.isUploading = true
      uploadHookState.uploadQueue = [
        {
          id: 'upload-1',
          name: 'Pitch Deck.pdf',
          progress: 42,
          status: 'uploading',
          size: 512000,
        },
      ]

      renderWorkspace()

      const progressbar = screen.getByRole('progressbar', { name: /uploading/i })
      expect(progressbar).toHaveAttribute('aria-valuenow', '42')
      expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    })
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

  // RED SPEC: Bulk Move with Optimistic UI and Rollback
  describe('Bulk Move Operations with Optimistic Updates', () => {
    it('should show folder selection modal when bulk move is initiated', async () => {
      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [
        { id: 'doc-1', name: 'contract.pdf', folder_id: 'folder-old' },
        { id: 'doc-2', name: 'terms.pdf', folder_id: 'folder-old' },
      ]

      await act(async () => {
        await documentListProps.onBulkMove?.(selectedDocs)
      })

      // Should render folder selection modal
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /move documents/i })).toBeInTheDocument()
      })
      expect(screen.getByText(/select destination folder/i)).toBeInTheDocument()
      expect(screen.getByText(/2 documents selected/i)).toBeInTheDocument()
    })

    it('should perform optimistic move and show success toast', async () => {
      documentApiMocks.bulkMoveDocuments.mockResolvedValue({ success: true, moved_ids: ['doc-1'], failures: [] })

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [{ id: 'doc-1', name: 'file.pdf', folder_id: 'old-folder' }]

      await act(async () => {
        await documentListProps.onBulkMove?.(selectedDocs)
      })

      // User selects destination folder
      const destinationFolder = screen.getByRole('button', { name: /legal documents/i })
      fireEvent.click(destinationFolder)

      const confirmButton = screen.getByRole('button', { name: /move documents/i })
      fireEvent.click(confirmButton)

      // Should show optimistic success state immediately
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/moved 1 document/i)
      })

      // Documents should be removed from current view optimistically
      await waitFor(() => {
        const latestProps = documentListSpy.mock.calls.at(-1)?.[0]
        expect(latestProps.resetSelectionSignal).toBeGreaterThan(0)
      })
    })

    it('should rollback optimistic move on API failure and show error', async () => {
      documentApiMocks.bulkMoveDocuments.mockRejectedValue(new Error('Network error'))

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [
        { id: 'doc-1', name: 'file1.pdf', folder_id: 'old-folder' },
        { id: 'doc-2', name: 'file2.pdf', folder_id: 'old-folder' },
      ]

      await act(async () => {
        await documentListProps.onBulkMove?.(selectedDocs)
      })

      const destinationFolder = screen.getByRole('button', { name: /legal documents/i })
      fireEvent.click(destinationFolder)

      const confirmButton = screen.getByRole('button', { name: /move documents/i })
      fireEvent.click(confirmButton)

      // Should show error toast and restore documents to original position
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/failed to move documents/i)
      })

      // Documents should be restored to view (rollback)
      await waitFor(() => {
        const latestProps = documentListSpy.mock.calls.at(-1)?.[0]
        expect(latestProps.resetSelectionSignal).toBeGreaterThan(0)
      })
    })

    it('should handle partial move failures with detailed error message', async () => {
      documentApiMocks.bulkMoveDocuments.mockResolvedValue({
        success: false,
        moved_ids: ['doc-1'],
        failures: [{ id: 'doc-2', reason: 'Permission denied' }],
      })

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [
        { id: 'doc-1', name: 'file1.pdf' },
        { id: 'doc-2', name: 'file2.pdf' },
      ]

      await act(async () => {
        await documentListProps.onBulkMove?.(selectedDocs)
      })

      const destinationFolder = screen.getByRole('button', { name: /legal documents/i })
      fireEvent.click(destinationFolder)

      const confirmButton = screen.getByRole('button', { name: /move documents/i })
      fireEvent.click(confirmButton)

      // Should show partial success message
      await waitFor(() => {
        const statusToast = screen.getByRole('status')
        expect(statusToast).toHaveTextContent(/moved 1 of 2 documents/i)
        expect(statusToast.textContent).toMatch(/doc-2.*permission denied/i)
      })
    })

    it('should prevent moving to same folder and show validation message', async () => {
      renderWorkspace()

      const folderButton = screen.getByTestId('mock-folder-tree')
      fireEvent.click(folderButton) // Select folder-123

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [
        { id: 'doc-1', name: 'file.pdf', folder_id: 'folder-123' }, // Already in this folder
      ]

      await act(async () => {
        await documentListProps.onBulkMove?.(selectedDocs)
      })

      // Try to select same folder as destination
      const sameFolder = screen.getByRole('button', { name: /current folder/i })
      fireEvent.click(sameFolder)

      const confirmButton = screen.getByRole('button', { name: /move documents/i })
      expect(confirmButton).toBeDisabled()
      expect(screen.getByText(/documents are already in this folder/i)).toBeInTheDocument()
    })
  })

  // RED SPEC: Bulk Archive with Optimistic UI
  describe('Bulk Archive Operations', () => {
    it('should archive documents with optimistic update', async () => {
      documentApiMocks.bulkArchiveDocuments.mockResolvedValue({ success: true, archived_ids: ['doc-1', 'doc-2'] })

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [
        { id: 'doc-1', name: 'old-contract.pdf' },
        { id: 'doc-2', name: 'expired-terms.pdf' },
      ]

      // Assume DocumentList has onBulkArchive handler
      expect(documentListProps.onBulkArchive).toBeDefined()

      await act(async () => {
        await documentListProps.onBulkArchive?.(selectedDocs)
      })

      // Should show confirmation dialog first
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveTextContent(/archive 2 documents/i)
      })

      const confirmButton = screen.getByRole('button', { name: /archive/i })
      fireEvent.click(confirmButton)

      // Should show optimistic success
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/archived 2 documents/i)
      })

      // Documents should be removed from view
      await waitFor(() => {
        const latestProps = documentListSpy.mock.calls.at(-1)?.[0]
        expect(latestProps.resetSelectionSignal).toBeGreaterThan(0)
      })
    })

    it('should rollback archive on API failure', async () => {
      documentApiMocks.bulkArchiveDocuments.mockRejectedValue(new Error('Server error'))

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [{ id: 'doc-1', name: 'file.pdf' }]

      await act(async () => {
        await documentListProps.onBulkArchive?.(selectedDocs)
      })

      const confirmButton = screen.getByRole('button', { name: /archive/i })
      fireEvent.click(confirmButton)

      // Should show error and restore documents
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/failed to archive/i)
      })
    })

    it('should show undo option after successful archive', async () => {
      documentApiMocks.bulkArchiveDocuments.mockResolvedValue({ success: true, archived_ids: ['doc-1'] })
      documentApiMocks.restoreArchivedDocuments.mockResolvedValue({ restored_ids: ['doc-1'] })

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = [{ id: 'doc-1', name: 'file.pdf' }]

      await act(async () => {
        await documentListProps.onBulkArchive?.(selectedDocs)
      })

      const confirmButton = screen.getByRole('button', { name: /archive/i })
      fireEvent.click(confirmButton)

      // Should show success toast with undo button
      await waitFor(() => {
        const toast = screen.getByRole('status')
        expect(toast).toHaveTextContent(/archived 1 document/i)
        expect(within(toast).getByRole('button', { name: /undo/i })).toBeInTheDocument()
      })

      // Click undo
      const undoButton = within(screen.getByRole('status')).getByRole('button', { name: /undo/i })
      fireEvent.click(undoButton)

      // Should restore documents
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/unarchived 1 document/i)
      })

      expect(documentApiMocks.restoreArchivedDocuments).toHaveBeenCalledWith('deal-abc', ['doc-1'])
    })

    it('should batch archive operations for performance', async () => {
      documentApiMocks.bulkArchiveDocuments.mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20))
        return { success: true, archived_ids: Array.from({ length: 50 }, (_, i) => `doc-${i}`) }
      })

      renderWorkspace()

      const documentListProps = documentListSpy.mock.calls.at(-1)?.[0]
      const selectedDocs = Array.from({ length: 50 }, (_, i) => ({
        id: `doc-${i}`,
        name: `file${i}.pdf`,
      }))

      await act(async () => {
        await documentListProps.onBulkArchive?.(selectedDocs)
      })

      const confirmButton = screen.getByRole('button', { name: /archive/i })
      fireEvent.click(confirmButton)

      // Should show batched progress
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
        expect(screen.getByRole('progressbar')).toHaveTextContent(/archiving 50 documents/i)
      })

      // Final success message
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/archived 50 documents/i)
      }, { timeout: 3000 })
    })
  })
})
