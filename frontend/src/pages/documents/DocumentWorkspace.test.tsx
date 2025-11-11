import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DocumentWorkspace from './DocumentWorkspace'

const folderTreeSpy = vi.fn()
const documentListSpy = vi.fn()
const uploadPanelSpy = vi.fn()

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
  default: () => <div data-testid="mock-permission-modal">permission modal</div>,
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
})
