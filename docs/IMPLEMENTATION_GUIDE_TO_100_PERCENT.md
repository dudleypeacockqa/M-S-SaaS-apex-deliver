# Implementation Guide to 100% Project Completion

**Document Purpose**: Step-by-step implementation guide for completing all remaining work to achieve 100% project delivery.

**Created**: 2025-10-29 11:40 UTC
**Methodology**: BMAD v6-alpha + Test-Driven Development (RED → GREEN → REFACTOR)
**Total Estimated Effort**: 24-32 hours
**Current Progress**: 95% Complete (14/17 stories COMPLETE)

---

## TABLE OF CONTENTS

1. [Current Status](#current-status)
2. [Sprint 1.1: DEV-008 Frontend (8-10 hours)](#sprint-11-dev-008-frontend-8-10-hours)
3. [Sprint 1.2: DEV-016 Backend Fixes (2 hours)](#sprint-12-dev-016-backend-fixes-2-hours)
4. [Sprint 1.3: DEV-016 Video & Transcription (4-6 hours)](#sprint-13-dev-016-video--transcription-4-6-hours)
5. [Sprint 2.1: MARK-002 Assets & Analytics (4-6 hours)](#sprint-21-mark-002-assets--analytics-4-6-hours)
6. [Sprint 2.2: Backend Coverage (2 hours)](#sprint-22-backend-coverage-2-hours)
7. [Sprint 3: Testing & Verification (4-6 hours)](#sprint-3-testing--verification-4-6-hours)
8. [Sprint 4: Deployment (2-3 hours)](#sprint-4-deployment-2-3-hours)
9. [Code Templates & Patterns](#code-templates--patterns)
10. [BMAD Workflow Integration](#bmad-workflow-integration)

---

## CURRENT STATUS

### Test Files Created (RED Phase Complete)
✅ `frontend/src/components/documents/FolderTree.test.tsx` (10 tests)
✅ `frontend/src/components/documents/DocumentList.test.tsx` (12 tests)
✅ `frontend/src/components/documents/PermissionModal.test.tsx` (8 tests)

### Test Files Remaining (RED Phase)
⏳ `frontend/src/components/documents/UploadPanel.test.tsx` (10 tests)
⏳ `frontend/src/components/documents/BulkActionsToolbar.test.tsx` (8 tests)

### Components to Implement (GREEN Phase)
⏳ All 5 components (FolderTree, DocumentList, PermissionModal, UploadPanel, BulkActionsToolbar)

### Backend Test Status
- **Current**: 512 passing, 38 skipped (OAuth integrations)
- **Target**: 520+ passing, 0 failing
- **Coverage**: 78% (target: 80%+)

### Frontend Test Status
- **Current**: 694 passing, 0 failing
- **Target**: 750+ passing (694 + 48 DEV-008 + 8 DEV-016)
- **Coverage**: 85.1% (exceeds 85% target)

---

## SPRINT 1.1: DEV-008 FRONTEND (8-10 hours)

**Story**: [docs/bmad/stories/DEV-008-secure-document-data-room.md](docs/bmad/stories/DEV-008-secure-document-data-room.md)
**Goal**: Complete Document & Data Room frontend components with full TDD coverage
**Dependencies**: Backend APIs already exist ✓ (`listDocuments`, `uploadDocument`, `createFolder`, etc.)

---

### STEP 1.1.1: Complete Remaining Test Files (30 minutes)

#### UploadPanel.test.tsx

Create `frontend/src/components/documents/UploadPanel.test.tsx`:

```typescript
/**
 * UploadPanel Component Tests
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UploadPanel } from './UploadPanel';

// Mock upload API
vi.mock('../../services/api/documents', () => ({
  uploadDocument: vi.fn(),
}));

describe('UploadPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload drop zone', () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    expect(screen.getByText(/drag and drop files/i)).toBeInTheDocument();
  });

  it('should allow file selection via button', () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const fileInput = screen.getByLabelText(/choose files/i);
    expect(fileInput).toBeInTheDocument();
  });

  it('should validate file size (max 50MB)', async () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const largeFile = new File(['x'.repeat(60 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [largeFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText(/file too large/i)).toBeInTheDocument();
    });
  });

  it('should validate file type (pdf, docx, xlsx, pptx, txt)', async () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const invalidFile = new File(['data'], 'script.exe', { type: 'application/exe' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [invalidFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText(/file type not supported/i)).toBeInTheDocument();
    });
  });

  it('should show upload progress bar', async () => {
    const { uploadDocument } = await import('../../services/api/documents');
    vi.mocked(uploadDocument).mockImplementation(() => new Promise(() => {})); // Pending

    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const validFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [validFile] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('should upload file successfully', async () => {
    const { uploadDocument } = await import('../../services/api/documents');
    vi.mocked(uploadDocument).mockResolvedValue({
      id: 'doc-new',
      name: 'uploaded.pdf',
      size: 1024,
      version: 1,
      created_at: '2025-01-01',
    });

    render(<UploadPanel dealId="deal-1" folderId="folder-1" />);
    const file = new File(['content'], 'uploaded.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith('deal-1', file, 'folder-1');
      expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
    });
  });

  it('should allow cancelling upload', async () => {
    const { uploadDocument } = await import('../../services/api/documents');
    const abortSpy = vi.fn();
    vi.mocked(uploadDocument).mockImplementation(() => new Promise(() => {}));

    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should handle upload errors gracefully', async () => {
    const { uploadDocument } = await import('../../services/api/documents');
    vi.mocked(uploadDocument).mockRejectedValue(new Error('Network error'));

    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('should support drag and drop', async () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const dropZone = screen.getByText(/drag and drop files/i).closest('div');

    const file = new File(['content'], 'dropped.pdf', { type: 'application/pdf' });
    const dataTransfer = { files: [file] };

    fireEvent.drop(dropZone!, { dataTransfer });

    await waitFor(() => {
      expect(screen.getByText('dropped.pdf')).toBeInTheDocument();
    });
  });

  it('should show multiple files in queue', async () => {
    render(<UploadPanel dealId="deal-1" folderId={null} />);
    const file1 = new File(['content1'], 'doc1.pdf', { type: 'application/pdf' });
    const file2 = new File(['content2'], 'doc2.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose files/i) as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', { value: [file1, file2] });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
      expect(screen.getByText('doc2.pdf')).toBeInTheDocument();
    });
  });
});
```

#### BulkActionsToolbar.test.tsx

Create `frontend/src/components/documents/BulkActionsToolbar.test.tsx`:

```typescript
/**
 * BulkActionsToolbar Component Tests
 * TDD RED phase - Write failing tests first
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BulkActionsToolbar } from './BulkActionsToolbar';

// Mock bulk actions API
vi.mock('../../services/api/documents', () => ({
  bulkDownloadDocuments: vi.fn(),
  bulkDeleteDocuments: vi.fn(),
}));

describe('BulkActionsToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no documents selected', () => {
    render(<BulkActionsToolbar selectedIds={[]} onClear={vi.fn()} />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('should render when documents are selected', () => {
    render(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
  });

  it('should show download button', () => {
    render(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should show clear selection button', () => {
    render(<BulkActionsToolbar selectedIds={['doc-1']} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should call bulk download API', async () => {
    const { bulkDownloadDocuments } = await import('../../services/api/documents');
    vi.mocked(bulkDownloadDocuments).mockResolvedValue('https://example.com/download-zip');

    render(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(bulkDownloadDocuments).toHaveBeenCalledWith(['doc-1', 'doc-2']);
    });
  });

  it('should confirm before bulk delete', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={vi.fn()} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('should call bulk delete API when confirmed', async () => {
    const { bulkDeleteDocuments } = await import('../../services/api/documents');
    vi.mocked(bulkDeleteDocuments).mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const onClear = vi.fn();
    render(<BulkActionsToolbar selectedIds={['doc-1', 'doc-2']} onClear={onClear} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(bulkDeleteDocuments).toHaveBeenCalledWith(['doc-1', 'doc-2']);
      expect(onClear).toHaveBeenCalled();
    });
  });

  it('should call onClear when clear button clicked', () => {
    const onClear = vi.fn();
    render(<BulkActionsToolbar selectedIds={['doc-1']} onClear={onClear} />);

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });
});
```

**Verification**:
```bash
cd frontend
npm test FolderTree.test.tsx DocumentList.test.tsx PermissionModal.test.tsx UploadPanel.test.tsx BulkActionsToolbar.test.tsx
# Expected: All tests FAIL (components don't exist yet - RED phase complete)
```

---

### STEP 1.1.2: Implement Components (GREEN Phase) (5 hours)

#### Implementation Order
1. FolderTree (1.5 hours)
2. DocumentList (1.5 hours)
3. UploadPanel (1 hour)
4. PermissionModal (45 min)
5. BulkActionsToolbar (45 min)

---

#### 1. FolderTree Component (1.5 hours)

**File**: `frontend/src/components/documents/FolderTree.tsx`

**Key Features**:
- Recursive folder rendering (nested hierarchy)
- Expand/collapse with chevron icons
- Selected folder highlighting
- Right-click context menu (rename, delete)
- Inline folder creation
- React Query for data fetching

**Implementation Pattern**:

```typescript
/**
 * FolderTree Component
 * Displays hierarchical folder structure with CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listFolders, createFolder, updateFolder, deleteFolder } from '../../services/api/documents';

interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  deal_id: string;
  created_at: string;
}

interface FolderTreeProps {
  dealId: string;
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  dealId,
  selectedFolderId,
  onFolderSelect,
}) => {
  const queryClient = useQueryClient();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ folderId: string; x: number; y: number } | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);

  // Fetch folders
  const { data: folders = [], isLoading } = useQuery<Folder[]>({
    queryKey: ['folders', dealId],
    queryFn: () => listFolders(dealId),
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: (data: { name: string; parent_id: string | null }) =>
      createFolder({ deal_id: dealId, name: data.name, parent_id: data.parent_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', dealId] });
      setNewFolderParentId(null);
    },
  });

  // Update folder mutation
  const updateFolderMutation = useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      updateFolder(folderId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', dealId] });
      setRenamingFolderId(null);
    },
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', dealId] });
    },
  });

  // Build folder tree (parent-child relationships)
  const buildFolderTree = (parentId: string | null): Folder[] => {
    return folders
      .filter((f) => f.parent_id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Toggle expand/collapse
  const toggleExpand = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    setContextMenu({ folderId, x: e.clientX, y: e.clientY });
  };

  // Handle rename
  const handleRename = (folderId: string) => {
    setRenamingFolderId(folderId);
    setContextMenu(null);
  };

  // Handle delete
  const handleDelete = (folderId: string) => {
    if (window.confirm('Delete this folder and all its contents?')) {
      deleteFolderMutation.mutate(folderId);
    }
    setContextMenu(null);
  };

  // Recursive folder rendering
  const renderFolder = (folder: Folder, depth: number = 0) => {
    const hasChildren = folders.some((f) => f.parent_id === folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const isRenaming = renamingFolderId === folder.id;

    return (
      <div key={folder.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`flex items-center py-2 px-3 rounded cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-indigo-50 font-medium' : ''
          }`}
          onContextMenu={(e) => handleContextMenu(e, folder.id)}
        >
          {/* Expand/collapse button */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(folder.id)}
              className="mr-2 text-gray-500"
              aria-label={`Expand ${folder.name}`}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}

          {/* Folder icon */}
          <span className="mr-2">📁</span>

          {/* Folder name (editable if renaming) */}
          {isRenaming ? (
            <input
              type="text"
              defaultValue={folder.name}
              autoFocus
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  updateFolderMutation.mutate({ folderId: folder.id, name: e.target.value });
                } else {
                  setRenamingFolderId(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                } else if (e.key === 'Escape') {
                  setRenamingFolderId(null);
                }
              }}
              className="border px-2 py-1 rounded"
            />
          ) : (
            <button
              onClick={() => onFolderSelect(folder.id)}
              className="flex-1 text-left"
              aria-label={`Select ${folder.name}`}
            >
              {folder.name}
            </button>
          )}
        </div>

        {/* Render children if expanded */}
        {isExpanded && hasChildren && (
          <div>
            {buildFolderTree(folder.id).map((child) => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4 text-gray-600">Loading folders...</div>;
  }

  return (
    <div className="relative">
      {/* Root folders */}
      <div>
        {buildFolderTree(null).map((folder) => renderFolder(folder, 0))}
      </div>

      {/* New folder button */}
      <button
        onClick={() => setNewFolderParentId(null)}
        className="mt-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
      >
        + New Folder
      </button>

      {/* Inline new folder input */}
      {newFolderParentId !== undefined && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Folder name..."
            autoFocus
            onBlur={(e) => {
              if (e.target.value.trim()) {
                createFolderMutation.mutate({
                  name: e.target.value,
                  parent_id: newFolderParentId,
                });
              } else {
                setNewFolderParentId(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                setNewFolderParentId(null);
              }
            }}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute bg-white border shadow-lg rounded py-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => handleRename(contextMenu.folderId)}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={() => handleDelete(contextMenu.folderId)}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
```

**Verification After Implementation**:
```bash
npm test FolderTree.test.tsx
# Expected: 10/10 tests GREEN
```

---

#### 2. DocumentList Component (1.5 hours)

**File**: `frontend/src/components/documents/DocumentList.tsx`

**Key Features**:
- Table view with columns (Name, Size, Version, Uploaded By, Date)
- Sortable columns (name, date, size)
- Search/filter by name
- Row selection with checkboxes
- Action buttons (download, delete)
- Loading and empty states

**Implementation Hints**:
- Use existing `listDocuments` API from `services/api/documents.ts`
- Implement client-side sorting and filtering
- Use React Query for data fetching and mutations
- Emit `onSelectionChange` events to parent (DataRoom)
- Format file sizes (bytes → KB/MB)
- Format dates (ISO → human-readable)

**Component Structure**:
```typescript
interface DocumentListProps {
  dealId: string;
  folderId: string | null;
  onSelectionChange: (selectedIds: string[]) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  dealId,
  folderId,
  onSelectionChange,
}) => {
  // State: search query, sort column, sort direction, selected IDs
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch documents with React Query
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', dealId, folderId],
    queryFn: () => listDocuments(dealId, folderId),
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (documentId: string) => downloadDocument(documentId),
    onSuccess: (url) => {
      window.open(url, '_blank');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', dealId] });
    },
  });

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Implement sorting logic
    });

  // Handle selection
  const handleSelectAll = () => {
    if (selectedIds.size === filteredDocuments.length) {
      setSelectedIds(new Set());
      onSelectionChange([]);
    } else {
      const allIds = new Set(filteredDocuments.map((d) => d.id));
      setSelectedIds(allIds);
      onSelectionChange(Array.from(allIds));
    }
  };

  // Render table with checkboxes, action buttons, etc.
  return (
    <div>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAll} /></th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('size')}>Size</th>
            <th>Version</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              {/* Render row */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {filteredDocuments.length === 0 && (
        <div>No documents found</div>
      )}
    </div>
  );
};
```

**Verification**:
```bash
npm test DocumentList.test.tsx
# Expected: 12/12 tests GREEN
```

---

#### 3. UploadPanel Component (1 hour)

**File**: `frontend/src/components/documents/UploadPanel.tsx`

**Key Features**:
- Drag-and-drop zone
- File input button
- File type validation (pdf, docx, xlsx, pptx, txt)
- File size validation (max 50MB)
- Progress bar during upload
- Multiple file queue
- Cancel upload
- Error handling with retry

**Implementation Hints**:
- Use `uploadDocument` API from `services/api/documents.ts`
- Use HTML5 drag-and-drop events (`onDrop`, `onDragOver`)
- Track upload progress with React state
- Use `useMutation` for upload operation
- Display file queue with individual progress bars

**Component Structure**:
```typescript
interface UploadPanelProps {
  dealId: string;
  folderId: string | null;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ dealId, folderId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', /* ... */];

    if (file.size > maxSize) return 'File too large (max 50MB)';
    if (!allowedTypes.includes(file.type)) return 'File type not supported';
    return null;
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Validate and add to queue
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    // Validate and add to queue
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(dealId, file, folderId),
    onSuccess: (response, file) => {
      // Remove from queue, show success
    },
    onError: (error, file) => {
      setErrors({ ...errors, [file.name]: error.message });
    },
  });

  // Render drag-drop zone, file queue, progress bars
  return (
    <div>
      {/* Drag-drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded p-8 text-center"
      >
        <p>Drag and drop files here</p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          aria-label="Choose files"
        />
      </div>

      {/* File queue */}
      <div>
        {files.map((file) => (
          <div key={file.name}>
            <span>{file.name}</span>
            {uploadProgress[file.name] && (
              <progress value={uploadProgress[file.name]} max={100} />
            )}
            {errors[file.name] && (
              <span className="text-red-600">{errors[file.name]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

**Verification**:
```bash
npm test UploadPanel.test.tsx
# Expected: 10/10 tests GREEN
```

---

#### 4. PermissionModal Component (45 minutes)

**File**: `frontend/src/components/documents/PermissionModal.tsx`

**Key Features**:
- Modal dialog
- List current permissions (user email, role)
- Add user by email
- Change user role (viewer/editor/owner)
- Remove user
- Close button

**Implementation Hints**:
- Use existing permission APIs: `listPermissions`, `addPermission`, `updatePermission`, `removePermission`
- Modal backdrop with close on click outside
- Role dropdown (viewer, editor, owner)
- Use React Query for fetching and mutations

**Component Structure**:
```typescript
interface PermissionModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  documentId,
  isOpen,
  onClose,
}) => {
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions', documentId],
    queryFn: () => listPermissions(documentId),
    enabled: isOpen,
  });

  // Add permission mutation
  const addMutation = useMutation({
    mutationFn: (email: string) => addPermission({
      document_id: documentId,
      user_email: email,
      role: 'viewer',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions', documentId] });
      setNewUserEmail('');
    },
  });

  // Update permission mutation
  const updateMutation = useMutation({
    mutationFn: ({ permId, role }: { permId: string; role: string }) =>
      updatePermission(permId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions', documentId] });
    },
  });

  // Remove permission mutation
  const removeMutation = useMutation({
    mutationFn: (permId: string) => removePermission(permId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions', documentId] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full" role="dialog">
        <h2>Document Permissions</h2>

        {/* Add user form */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter email..."
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <button onClick={() => addMutation.mutate(newUserEmail)}>
            Add User
          </button>
        </div>

        {/* Permissions list */}
        <div>
          {permissions.map((perm) => (
            <div key={perm.id} className="flex items-center justify-between py-2">
              <span>{perm.user_email}</span>
              <select
                value={perm.role}
                onChange={(e) => updateMutation.mutate({ permId: perm.id, role: e.target.value })}
                aria-label={`Role for ${perm.user_email}`}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
              <button
                onClick={() => removeMutation.mutate(perm.id)}
                aria-label={`Remove ${perm.user_email}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

**Verification**:
```bash
npm test PermissionModal.test.tsx
# Expected: 8/8 tests GREEN
```

---

#### 5. BulkActionsToolbar Component (45 minutes)

**File**: `frontend/src/components/documents/BulkActionsToolbar.tsx`

**Key Features**:
- Fixed toolbar at bottom when documents selected
- Show count of selected documents
- Bulk download button
- Bulk delete button (with confirmation)
- Clear selection button

**Implementation Hints**:
- Only render when `selectedIds.length > 0`
- Use `bulkDownloadDocuments` and `bulkDeleteDocuments` APIs
- Show confirmation dialog before delete
- Call `onClear()` after successful actions

**Component Structure**:
```typescript
interface BulkActionsToolbarProps {
  selectedIds: string[];
  onClear: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedIds,
  onClear,
}) => {
  const queryClient = useQueryClient();

  // Bulk download mutation
  const downloadMutation = useMutation({
    mutationFn: () => bulkDownloadDocuments(selectedIds),
    onSuccess: (url) => {
      window.open(url, '_blank');
    },
  });

  // Bulk delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => bulkDeleteDocuments(selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      onClear();
    },
  });

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} documents?`)) {
      deleteMutation.mutate();
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 flex items-center justify-between shadow-lg z-40"
      role="toolbar"
    >
      <span>{selectedIds.length} selected</span>
      <div className="flex gap-3">
        <button onClick={() => downloadMutation.mutate()}>
          Download
        </button>
        <button onClick={handleDelete} className="text-red-300">
          Delete
        </button>
        <button onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};
```

**Verification**:
```bash
npm test BulkActionsToolbar.test.tsx
# Expected: 8/8 tests GREEN
```

---

### STEP 1.1.3: Refactor & Integration (1 hour)

#### Integrate Components into DataRoom

**File**: `frontend/src/pages/deals/DataRoom.tsx`

**Current State**: DataRoom page exists but lacks the 5 new components

**Integration Steps**:

1. **Import new components** at top of file:
```typescript
import { FolderTree } from '../../components/documents/FolderTree';
import { DocumentList } from '../../components/documents/DocumentList';
import { UploadPanel } from '../../components/documents/UploadPanel';
import { PermissionModal } from '../../components/documents/PermissionModal';
import { BulkActionsToolbar } from '../../components/documents/BulkActionsToolbar';
```

2. **Add state for component interactions**:
```typescript
const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
const [permissionModalDocId, setPermissionModalDocId] = useState<string | null>(null);
```

3. **Replace placeholder UI with component layout**:
```typescript
return (
  <div className="flex h-screen">
    {/* Left sidebar: Folder tree */}
    <div className="w-1/4 border-r bg-gray-50 overflow-y-auto">
      <FolderTree
        dealId={dealId}
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
      />
    </div>

    {/* Main content: Document list and upload */}
    <div className="flex-1 flex flex-col">
      {/* Upload panel */}
      <div className="border-b p-4 bg-white">
        <UploadPanel dealId={dealId} folderId={selectedFolderId} />
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto p-4">
        <DocumentList
          dealId={dealId}
          folderId={selectedFolderId}
          onSelectionChange={setSelectedDocumentIds}
        />
      </div>
    </div>

    {/* Bulk actions toolbar */}
    <BulkActionsToolbar
      selectedIds={selectedDocumentIds}
      onClear={() => setSelectedDocumentIds([])}
    />

    {/* Permission modal */}
    <PermissionModal
      documentId={permissionModalDocId || ''}
      isOpen={permissionModalDocId !== null}
      onClose={() => setPermissionModalDocId(null)}
    />
  </div>
);
```

4. **Update existing DataRoom.test.tsx**:
   - Add test for folder selection
   - Add test for document upload flow
   - Add test for bulk actions
   - Verify integration

**Verification**:
```bash
npm test DataRoom.test.tsx
# Expected: All DataRoom tests GREEN (11 existing + any new integration tests)
```

---

### STEP 1.1.4: Final Sprint 1.1 Verification (30 minutes)

#### Run Full Test Suite
```bash
cd frontend
npm test -- src/components/documents/ src/pages/deals/DataRoom.test.tsx
# Expected: 48 new tests + 11 DataRoom tests = 59 total GREEN
```

#### Update Story Status
Edit `docs/bmad/stories/DEV-008-secure-document-data-room.md`:
```markdown
**Status**: ✅ COMPLETE (Updated 2025-10-29 12:00 UTC)

**✅ Phase 1 Complete**: Backend Models & API
- ✅ Document CRUD endpoints (37 tests GREEN)

**✅ Phase 2 Complete**: Frontend Document Workspace
- ✅ FolderTree component (10 tests GREEN)
- ✅ DocumentList component (12 tests GREEN)
- ✅ PermissionModal component (8 tests GREEN)
- ✅ UploadPanel component (10 tests GREEN)
- ✅ BulkActionsToolbar component (8 tests GREEN)
- ✅ DataRoom integration (11 tests GREEN)
- **Tests: 59/59 GREEN**

**Overall Test Results**:
- Backend: 37/37 tests GREEN (100%)
- Frontend: 59/59 tests GREEN (100%)
- **Total: 96/96 tests passing** ✅
```

#### Update Progress Tracker
Add session to `docs/bmad/BMAD_PROGRESS_TRACKER.md`:
```markdown
### Session 2025-10-29 (DEV-008 COMPLETE – Frontend Delivered – HH:MM UTC)
- **DEV-008 Status: ✅ 100% COMPLETE** - Document & Data Room fully functional
- Completed all 5 frontend components using strict TDD (RED → GREEN → REFACTOR)
- Integrated into DataRoom page with full CRUD workflow

**Test Results**:
- Backend: 37/37 tests GREEN
- Frontend: 59/59 tests GREEN
- Total DEV-008: **96/96 tests passing** ✅

**Deliverables Completed**:
- ✅ FolderTree with nested hierarchy and context menu
- ✅ DocumentList with sorting, filtering, and selection
- ✅ UploadPanel with drag-drop and progress tracking
- ✅ PermissionModal with role management
- ✅ BulkActionsToolbar for bulk operations
- ✅ Full DataRoom integration

**Commands Used**:
```bash
cd frontend && npm test -- src/components/documents/
```
```

#### Commit Changes
```bash
git add -A
git commit -m "feat(documents): complete DEV-008 frontend components (FolderTree, DocumentList, PermissionModal, UploadPanel, BulkActionsToolbar)

Phase 1: RED - Created comprehensive test suites
- FolderTree.test.tsx: 10 tests for nested folders, context menu, CRUD
- DocumentList.test.tsx: 12 tests for table, sorting, filtering, selection
- PermissionModal.test.tsx: 8 tests for role management
- UploadPanel.test.tsx: 10 tests for drag-drop, validation, progress
- BulkActionsToolbar.test.tsx: 8 tests for bulk operations

Phase 2: GREEN - Implemented all components
- FolderTree.tsx: Recursive rendering, expand/collapse, inline editing
- DocumentList.tsx: Sortable table, search, checkboxes, actions
- PermissionModal.tsx: Role management with viewer/editor/owner
- UploadPanel.tsx: Drag-drop zone with validation and progress
- BulkActionsToolbar.tsx: Fixed toolbar with bulk download/delete

Phase 3: REFACTOR - Integrated into DataRoom
- Updated DataRoom.tsx with 3-column layout
- Wired folder selection to document list
- Connected bulk actions to document selection
- Added permission modal trigger

Test Results:
- Backend: 37/37 GREEN (100%)
- Frontend: 59/59 GREEN (100%)
- Total: 96/96 tests passing ✅

DEV-008 Status: ✅ COMPLETE

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## SPRINT 1.2: DEV-016 BACKEND FIXES (2 hours)

**Story**: [docs/bmad/stories/DEV-016-podcast-studio-subscription.md](docs/bmad/stories/DEV-016-podcast-studio-subscription.md)
**Goal**: Fix 2 failing backend tests (quota summary fields, thumbnail generation)
**Current Status**: 71/73 backend tests passing (2 FAILING)

---

### STEP 1.2.1: Fix Quota Summary Period Fields (1 hour)

**Problem**: Test failing because `PodcastQuotaSummary` schema missing `period_start` and `period_end` fields

**Test File**: `backend/tests/test_podcast_api.py`
**Failing Test**: `test_includes_period_bounds_for_monthly_reset`

#### Fix 1: Update PodcastQuotaSummary Schema

**File**: `backend/app/schemas/podcasts.py` (around line 150)

**Before**:
```python
class PodcastQuotaSummary(BaseModel):
    """Podcast quota summary response"""
    audio_used: int
    audio_limit: int
    video_used: int
    video_limit: int

    model_config = ConfigDict(from_attributes=True)
```

**After**:
```python
from datetime import datetime

class PodcastQuotaSummary(BaseModel):
    """Podcast quota summary response"""
    audio_used: int
    audio_limit: int
    video_used: int
    video_limit: int
    period_start: datetime = Field(..., description="Quota period start timestamp")
    period_end: datetime = Field(..., description="Quota period end timestamp")

    model_config = ConfigDict(from_attributes=True)
```

#### Fix 2: Update Quota Service to Populate Fields

**File**: `backend/app/services/podcast_quota_service.py`

**Find the function** that returns quota summary (likely `get_quota_summary` or similar):

```python
def get_quota_summary(user_id: str, db: Session) -> PodcastQuotaSummary:
    """Get current quota usage and limits for user"""
    quota = db.query(PodcastQuota).filter(PodcastQuota.user_id == user_id).first()

    if not quota:
        # Create default quota
        quota = create_default_quota(user_id, db)

    # Calculate period bounds (current month)
    now = datetime.now(timezone.utc)
    period_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

    # Calculate period end (first day of next month)
    if now.month == 12:
        period_end = datetime(now.year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        period_end = datetime(now.year, now.month + 1, 1, tzinfo=timezone.utc)

    return PodcastQuotaSummary(
        audio_used=quota.audio_used,
        audio_limit=quota.audio_limit,
        video_used=quota.video_used,
        video_limit=quota.video_limit,
        period_start=period_start,
        period_end=period_end,
    )
```

#### Fix 3: Update API Route Response

**File**: `backend/app/api/routes/podcasts.py`

Find the `/quota` endpoint and ensure it returns the updated schema:

```python
@router.get("/quota", response_model=PodcastQuotaSummary)
async def get_quota(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current podcast quota status"""
    return get_quota_summary(current_user.id, db)
```

**Verification**:
```bash
cd backend
pytest tests/test_podcast_api.py::test_includes_period_bounds_for_monthly_reset -v
# Expected: PASSING ✅
```

---

### STEP 1.2.2: Implement Thumbnail Generation (1 hour)

**Problem**: Test failing because `generate_thumbnail` helper function doesn't exist

**Test File**: `backend/tests/test_podcast_api.py`
**Failing Test**: `test_generate_thumbnail_premium_success`

#### Fix 1: Add Thumbnail Generation Helper

**File**: `backend/app/api/routes/podcasts.py`

Add this function near the top of the file (after imports):

```python
import subprocess
import tempfile
import os
from pathlib import Path

async def generate_thumbnail(video_path: str, output_path: str) -> str:
    """
    Generate thumbnail from video first frame using ffmpeg

    Args:
        video_path: Path to video file (local or S3 URL)
        output_path: Path where thumbnail should be saved

    Returns:
        str: Path to generated thumbnail

    Raises:
        RuntimeError: If ffmpeg fails
    """
    try:
        # Use ffmpeg to extract first frame
        cmd = [
            'ffmpeg',
            '-i', video_path,
            '-ss', '00:00:01',  # Extract frame at 1 second
            '-vframes', '1',     # Extract only 1 frame
            '-vf', 'scale=640:360',  # Resize to 640x360
            output_path,
            '-y'  # Overwrite if exists
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
        )

        if result.returncode != 0:
            raise RuntimeError(f"ffmpeg failed: {result.stderr}")

        if not os.path.exists(output_path):
            raise RuntimeError(f"Thumbnail not generated at {output_path}")

        return output_path

    except subprocess.TimeoutExpired:
        raise RuntimeError("Thumbnail generation timed out")
    except FileNotFoundError:
        raise RuntimeError("ffmpeg not found - install ffmpeg to generate thumbnails")
```

#### Fix 2: Add Thumbnail Generation Endpoint

**File**: `backend/app/api/routes/podcasts.py`

Add new endpoint after the video upload endpoint:

```python
@router.post("/episodes/{episode_id}/generate-thumbnail")
async def generate_episode_thumbnail(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    storage: StorageService = Depends(get_storage_service),
):
    """Generate thumbnail for video episode (Premium+ tier)"""
    # Verify tier
    if current_user.tier not in ['premium', 'enterprise']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Thumbnail generation requires Premium tier or higher"
        )

    # Get episode
    episode = db.query(PodcastEpisode).filter(
        PodcastEpisode.id == episode_id,
        PodcastEpisode.organization_id == current_user.organization_id,
    ).first()

    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    if not episode.video_url:
        raise HTTPException(status_code=400, detail="Episode has no video")

    # Download video temporarily if needed
    with tempfile.TemporaryDirectory() as tmpdir:
        video_path = os.path.join(tmpdir, 'video.mp4')
        thumbnail_path = os.path.join(tmpdir, 'thumbnail.jpg')

        # Download video (if S3 URL)
        if episode.video_url.startswith('http'):
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(episode.video_url)
                with open(video_path, 'wb') as f:
                    f.write(response.content)
        else:
            video_path = episode.video_url

        # Generate thumbnail
        await generate_thumbnail(video_path, thumbnail_path)

        # Upload thumbnail to S3
        with open(thumbnail_path, 'rb') as f:
            thumbnail_url = await storage.upload_file(
                file=f,
                filename=f"thumbnails/{episode_id}.jpg",
                content_type='image/jpeg',
            )

        # Update episode
        episode.thumbnail_url = thumbnail_url
        db.commit()

        return {"thumbnail_url": thumbnail_url}
```

#### Fix 3: Add Storage Service Dependency

**File**: `backend/app/api/routes/podcasts.py` (at top)

```python
from app.services.storage_service import get_storage_service, StorageService
```

**Verification**:
```bash
cd backend
pytest tests/test_podcast_api.py::test_generate_thumbnail_premium_success -v
# Expected: PASSING ✅
```

---

### STEP 1.2.3: Sprint 1.2 Final Verification (15 minutes)

#### Run Full Backend Test Suite
```bash
cd backend
pytest tests/test_podcast_api.py -v
# Expected: 73/73 tests PASSING ✅
```

#### Update Story Status
Edit `docs/bmad/stories/DEV-016-podcast-studio-subscription.md`:
```markdown
**Backend Regressions Fixed**:
- ✅ Quota summary now includes period_start and period_end fields
- ✅ Thumbnail generation helper implemented with ffmpeg
- ✅ Thumbnail generation endpoint added (Premium+ tier)
- **Tests: 73/73 GREEN** ✅
```

#### Commit Changes
```bash
git add -A
git commit -m "fix(podcasts): resolve backend regressions for DEV-016

Fix 1: Add period bounds to quota summary
- Updated PodcastQuotaSummary schema with period_start/period_end
- Modified quota service to calculate monthly period bounds
- Test test_includes_period_bounds_for_monthly_reset now PASSING

Fix 2: Implement thumbnail generation
- Added generate_thumbnail() helper using ffmpeg
- Created POST /episodes/{id}/generate-thumbnail endpoint
- Requires Premium+ tier, extracts frame at 1 second
- Uploads thumbnail to S3 and updates episode record
- Test test_generate_thumbnail_premium_success now PASSING

Test Results:
- Backend: 73/73 tests GREEN (100%)
- Fixed: 2 failing tests resolved

DEV-016 Backend Regressions: ✅ RESOLVED

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## SPRINT 1.3: DEV-016 VIDEO & TRANSCRIPTION (4-6 hours)

**Story**: [docs/bmad/stories/DEV-016-podcast-studio-subscription.md](docs/bmad/stories/DEV-016-podcast-studio-subscription.md)
**Goal**: Implement video upload and Whisper transcription pipeline
**Current Status**: Audio upload complete, video and transcription missing

---

### STEP 1.3.1: Video Upload Backend (3 hours)

#### RED Phase: Write Tests (30 minutes)

Create `backend/tests/test_podcast_video_upload.py`:

```python
"""
Tests for Podcast Video Upload
Sprint 1.3.1 - DEV-016 Phase 2
"""

import pytest
from httpx import AsyncClient
from app.models.user import User
from app.models.podcast import PodcastEpisode

@pytest.mark.asyncio
class TestVideoUpload:
    """Test video upload endpoint"""

    async def test_video_upload_success(self, client: AsyncClient, auth_headers_professional):
        """Professional tier user can upload video"""
        # Create episode first
        episode_response = await client.post(
            "/api/podcasts/episodes",
            json={
                "title": "Test Episode",
                "description": "Test",
                "podcast_id": "podcast-1",
            },
            headers=auth_headers_professional,
        )
        episode_id = episode_response.json()["id"]

        # Upload video
        video_file = b"fake video content"
        response = await client.post(
            f"/api/podcasts/episodes/{episode_id}/upload-video",
            files={"file": ("video.mp4", video_file, "video/mp4")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 200
        data = response.json()
        assert "video_url" in data
        assert data["video_url"].endswith(".mp4")

    async def test_video_upload_requires_professional_tier(self, client: AsyncClient, auth_headers_starter):
        """Starter tier cannot upload video"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.mp4", b"content", "video/mp4")},
            headers=auth_headers_starter,
        )

        assert response.status_code == 403
        assert "professional" in response.json()["detail"].lower()

    async def test_video_upload_validates_file_format(self, client: AsyncClient, auth_headers_professional):
        """Only mp4, mov, avi formats allowed"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.exe", b"content", "application/exe")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 400
        assert "format" in response.json()["detail"].lower()

    async def test_video_upload_enforces_quota(self, client: AsyncClient, auth_headers_professional, db_session):
        """Video upload respects monthly quota"""
        # Set quota to 0
        from app.models.podcast import PodcastQuota
        quota = db_session.query(PodcastQuota).filter(
            PodcastQuota.user_id == "user-professional"
        ).first()
        quota.video_limit = 0
        db_session.commit()

        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.mp4", b"content", "video/mp4")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 403
        assert "quota" in response.json()["detail"].lower()

    async def test_video_upload_tracks_quota(self, client: AsyncClient, auth_headers_professional, db_session):
        """Video upload increments quota counter"""
        # Get initial quota
        from app.models.podcast import PodcastQuota
        quota_before = db_session.query(PodcastQuota).filter(
            PodcastQuota.user_id == "user-professional"
        ).first()
        video_used_before = quota_before.video_used

        # Upload video
        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.mp4", b"content", "video/mp4")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 200

        # Check quota incremented
        db_session.expire_all()
        quota_after = db_session.query(PodcastQuota).filter(
            PodcastQuota.user_id == "user-professional"
        ).first()
        assert quota_after.video_used == video_used_before + 1

    async def test_video_upload_requires_auth(self, client: AsyncClient):
        """Video upload requires authentication"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.mp4", b"content", "video/mp4")},
        )

        assert response.status_code == 401

    async def test_video_upload_validates_ownership(self, client: AsyncClient, auth_headers_professional, db_session):
        """User can only upload to own episodes"""
        # Create episode for different organization
        from app.models.podcast import PodcastEpisode
        other_episode = PodcastEpisode(
            id="other-episode",
            title="Other Episode",
            organization_id="other-org",
            podcast_id="other-podcast",
        )
        db_session.add(other_episode)
        db_session.commit()

        response = await client.post(
            f"/api/podcasts/episodes/other-episode/upload-video",
            files={"file": ("video.mp4", b"content", "video/mp4")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 404

    async def test_video_upload_handles_large_files(self, client: AsyncClient, auth_headers_professional):
        """Video upload supports large files (up to 2GB)"""
        # Simulate large file (mock, don't actually create 2GB)
        large_content = b"x" * (100 * 1024 * 1024)  # 100MB for test

        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("large_video.mp4", large_content, "video/mp4")},
            headers=auth_headers_professional,
            timeout=60.0,  # Longer timeout for large upload
        )

        assert response.status_code in [200, 413]  # 413 if size limit enforced

    async def test_video_upload_stores_metadata(self, client: AsyncClient, auth_headers_professional, db_session):
        """Video upload stores file size and duration metadata"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/upload-video",
            files={"file": ("video.mp4", b"fake content", "video/mp4")},
            headers=auth_headers_professional,
        )

        assert response.status_code == 200

        # Check episode updated
        from app.models.podcast import PodcastEpisode
        episode = db_session.query(PodcastEpisode).filter(
            PodcastEpisode.id == "episode-1"
        ).first()

        assert episode.video_url is not None
        assert episode.video_size_bytes is not None
```

**Verification**:
```bash
pytest backend/tests/test_podcast_video_upload.py -v
# Expected: 10 tests FAILING (RED phase complete)
```

---

#### GREEN Phase: Implement Video Upload (2 hours)

**File**: `backend/app/api/routes/podcasts.py`

Add video upload endpoint:

```python
from fastapi import UploadFile, File
from app.services.storage_service import StorageService, get_storage_service
from app.services.podcast_quota_service import check_and_increment_video_quota

@router.post("/episodes/{episode_id}/upload-video")
async def upload_video(
    episode_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    storage: StorageService = Depends(get_storage_service),
):
    """Upload video file for podcast episode (Professional+ tier)"""

    # 1. Verify tier (Professional+)
    if current_user.tier not in ['professional', 'growth', 'premium', 'enterprise']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Video upload requires Professional tier or higher"
        )

    # 2. Verify episode exists and belongs to user's organization
    episode = db.query(PodcastEpisode).filter(
        PodcastEpisode.id == episode_id,
        PodcastEpisode.organization_id == current_user.organization_id,
    ).first()

    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    # 3. Validate file format
    allowed_types = ['video/mp4', 'video/quicktime', 'video/x-msvideo']  # mp4, mov, avi
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format. Allowed: mp4, mov, avi"
        )

    # 4. Check quota
    from app.services.podcast_quota_service import check_video_quota
    quota_ok = check_video_quota(current_user.id, db)
    if not quota_ok:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Video upload quota exceeded. Upgrade tier for more uploads."
        )

    # 5. Upload to S3
    try:
        video_url = await storage.upload_file(
            file=file.file,
            filename=f"podcasts/{episode.podcast_id}/episodes/{episode_id}/video.mp4",
            content_type=file.content_type,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # 6. Update episode record
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get size

    episode.video_url = video_url
    episode.video_size_bytes = file_size
    db.commit()

    # 7. Increment quota
    from app.services.podcast_quota_service import increment_video_quota
    increment_video_quota(current_user.id, db)

    return {
        "video_url": video_url,
        "episode_id": episode_id,
        "size_bytes": file_size,
    }
```

**Add quota check functions** to `backend/app/services/podcast_quota_service.py`:

```python
def check_video_quota(user_id: str, db: Session) -> bool:
    """Check if user has video quota remaining"""
    quota = db.query(PodcastQuota).filter(PodcastQuota.user_id == user_id).first()
    if not quota:
        return True  # No quota record = unlimited
    return quota.video_used < quota.video_limit

def increment_video_quota(user_id: str, db: Session):
    """Increment video usage counter"""
    quota = db.query(PodcastQuota).filter(PodcastQuota.user_id == user_id).first()
    if quota:
        quota.video_used += 1
        db.commit()
```

**Verification**:
```bash
pytest backend/tests/test_podcast_video_upload.py -v
# Expected: 10/10 tests GREEN
```

---

#### REFACTOR Phase: Polish (30 minutes)

1. **Extract validation logic** into helper functions
2. **Add proper error messages** for each failure case
3. **Add logging** for video uploads
4. **Update OpenAPI documentation** with examples

---

### STEP 1.3.2: Transcription Pipeline (2-3 hours)

#### RED Phase: Write Transcription Tests (30 minutes)

Create `backend/tests/test_podcast_transcription.py`:

```python
"""
Tests for Podcast Transcription Service
Sprint 1.3.2 - DEV-016 Phase 3
"""

import pytest
from unittest.mock import patch, MagicMock
from httpx import AsyncClient
from app.services.transcription_service import transcribe_audio
from app.models.podcast import PodcastEpisode

@pytest.mark.asyncio
class TestTranscriptionService:
    """Test Whisper transcription integration"""

    @patch('app.services.transcription_service.openai.Audio.transcribe')
    async def test_transcription_success(self, mock_transcribe, db_session):
        """Successful transcription returns text"""
        mock_transcribe.return_value = {
            "text": "This is the transcribed audio content."
        }

        result = await transcribe_audio("episode-1", db_session)

        assert result["text"] == "This is the transcribed audio content."
        assert result["status"] == "completed"

    async def test_transcription_requires_growth_tier(self, client: AsyncClient, auth_headers_starter):
        """Starter tier cannot access transcription"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/transcribe",
            headers=auth_headers_starter,
        )

        assert response.status_code == 403
        assert "growth" in response.json()["detail"].lower()

    async def test_transcription_requires_audio_file(self, client: AsyncClient, auth_headers_growth, db_session):
        """Cannot transcribe episode without audio"""
        # Create episode without audio
        from app.models.podcast import PodcastEpisode
        episode = PodcastEpisode(
            id="no-audio",
            title="No Audio Episode",
            organization_id="org-1",
            podcast_id="podcast-1",
        )
        db_session.add(episode)
        db_session.commit()

        response = await client.post(
            "/api/podcasts/episodes/no-audio/transcribe",
            headers=auth_headers_growth,
        )

        assert response.status_code == 400
        assert "audio" in response.json()["detail"].lower()

    @patch('app.services.transcription_service.openai.Audio.transcribe')
    async def test_transcription_handles_errors(self, mock_transcribe, client: AsyncClient, auth_headers_growth):
        """Transcription errors are handled gracefully"""
        mock_transcribe.side_effect = Exception("Whisper API error")

        response = await client.post(
            "/api/podcasts/episodes/episode-1/transcribe",
            headers=auth_headers_growth,
        )

        assert response.status_code == 500
        assert "failed" in response.json()["detail"].lower()

    async def test_transcription_updates_episode_status(self, client: AsyncClient, auth_headers_growth, db_session):
        """Transcription updates episode with transcript"""
        with patch('app.services.transcription_service.openai.Audio.transcribe') as mock:
            mock.return_value = {"text": "Transcribed content"}

            response = await client.post(
                "/api/podcasts/episodes/episode-1/transcribe",
                headers=auth_headers_growth,
            )

            assert response.status_code == 200

            # Check episode updated
            from app.models.podcast import PodcastEpisode
            episode = db_session.query(PodcastEpisode).filter(
                PodcastEpisode.id == "episode-1"
            ).first()

            assert episode.transcript_text == "Transcribed content"
            assert episode.transcript_status == "completed"

    @patch('app.tasks.transcription_tasks.async_transcribe_episode.delay')
    async def test_transcription_celery_task_triggered(self, mock_celery, client: AsyncClient, auth_headers_growth):
        """Transcription triggers async Celery task"""
        response = await client.post(
            "/api/podcasts/episodes/episode-1/transcribe",
            headers=auth_headers_growth,
        )

        assert response.status_code == 202  # Accepted (async)
        assert mock_celery.called
        mock_celery.assert_called_with("episode-1")

    async def test_transcription_retry_on_failure(self, db_session):
        """Failed transcription can be retried"""
        from app.models.podcast import PodcastEpisode
        episode = db_session.query(PodcastEpisode).filter(
            PodcastEpisode.id == "episode-1"
        ).first()
        episode.transcript_status = "failed"
        db_session.commit()

        # Retry transcription
        with patch('app.services.transcription_service.openai.Audio.transcribe') as mock:
            mock.return_value = {"text": "Retry successful"}

            result = await transcribe_audio("episode-1", db_session)

            assert result["status"] == "completed"
            assert episode.transcript_status == "completed"

    async def test_transcription_enforces_quota(self, client: AsyncClient, auth_headers_growth, db_session):
        """Transcription respects monthly quota"""
        # Set transcription quota to 0
        from app.models.podcast import PodcastQuota
        quota = db_session.query(PodcastQuota).filter(
            PodcastQuota.user_id == "user-growth"
        ).first()
        quota.transcription_limit = 0
        db_session.commit()

        response = await client.post(
            "/api/podcasts/episodes/episode-1/transcribe",
            headers=auth_headers_growth,
        )

        assert response.status_code == 403
        assert "quota" in response.json()["detail"].lower()

    async def test_transcription_language_detection(self, db_session):
        """Transcription detects audio language"""
        with patch('app.services.transcription_service.openai.Audio.transcribe') as mock:
            mock.return_value = {
                "text": "Bonjour, comment allez-vous?",
                "language": "fr"
            }

            result = await transcribe_audio("episode-1", db_session)

            assert result["language"] == "fr"
```

**Verification**:
```bash
pytest backend/tests/test_podcast_transcription.py -v
# Expected: 10 tests FAILING (RED phase complete)
```

---

#### GREEN Phase: Implement Transcription Service (1.5-2 hours)

**Create**: `backend/app/services/transcription_service.py`

```python
"""
Transcription Service
Whisper API integration for podcast audio transcription
"""

import openai
import httpx
import tempfile
import os
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.podcast import PodcastEpisode

# Configure OpenAI API
openai.api_key = settings.OPENAI_API_KEY

async def transcribe_audio(episode_id: str, db: Session) -> dict:
    """
    Transcribe podcast episode audio using OpenAI Whisper

    Args:
        episode_id: Episode ID to transcribe
        db: Database session

    Returns:
        dict: Transcription result with text, language, status

    Raises:
        ValueError: If episode not found or has no audio
        RuntimeError: If transcription fails
    """
    # Get episode
    episode = db.query(PodcastEpisode).filter(PodcastEpisode.id == episode_id).first()
    if not episode:
        raise ValueError(f"Episode {episode_id} not found")

    if not episode.audio_url:
        raise ValueError(f"Episode {episode_id} has no audio file")

    # Update status to processing
    episode.transcript_status = "processing"
    db.commit()

    try:
        # Download audio file temporarily
        with tempfile.TemporaryDirectory() as tmpdir:
            audio_path = os.path.join(tmpdir, "audio.mp3")

            # Download audio from S3/URL
            async with httpx.AsyncClient() as client:
                response = await client.get(episode.audio_url)
                with open(audio_path, 'wb') as f:
                    f.write(response.content)

            # Call Whisper API
            with open(audio_path, 'rb') as audio_file:
                transcript_response = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",  # Include language detection
                )

            # Extract results
            transcript_text = transcript_response["text"]
            language = transcript_response.get("language", "unknown")

            # Update episode
            episode.transcript_text = transcript_text
            episode.transcript_language = language
            episode.transcript_status = "completed"
            db.commit()

            return {
                "text": transcript_text,
                "language": language,
                "status": "completed",
                "episode_id": episode_id,
            }

    except Exception as e:
        # Mark as failed
        episode.transcript_status = "failed"
        episode.transcript_error = str(e)
        db.commit()

        raise RuntimeError(f"Transcription failed: {str(e)}")
```

**Create**: `backend/app/tasks/transcription_tasks.py`

```python
"""
Celery Tasks for Transcription
Async background transcription processing
"""

from celery import shared_task
from app.core.database import get_db
from app.services.transcription_service import transcribe_audio

@shared_task(bind=True, max_retries=3)
def async_transcribe_episode(self, episode_id: str):
    """
    Async Celery task for episode transcription

    Args:
        episode_id: Episode ID to transcribe

    Returns:
        dict: Transcription result
    """
    db = next(get_db())

    try:
        result = transcribe_audio(episode_id, db)
        return result
    except Exception as e:
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))
    finally:
        db.close()
```

**Add endpoint** to `backend/app/api/routes/podcasts.py`:

```python
from app.tasks.transcription_tasks import async_transcribe_episode
from app.services.podcast_quota_service import check_transcription_quota, increment_transcription_quota

@router.post("/episodes/{episode_id}/transcribe", status_code=status.HTTP_202_ACCEPTED)
async def transcribe_episode(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Transcribe podcast episode audio (Growth+ tier)"""

    # 1. Verify tier (Growth+)
    if current_user.tier not in ['growth', 'premium', 'enterprise']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Transcription requires Growth tier or higher"
        )

    # 2. Verify episode exists and belongs to user's organization
    episode = db.query(PodcastEpisode).filter(
        PodcastEpisode.id == episode_id,
        PodcastEpisode.organization_id == current_user.organization_id,
    ).first()

    if not episode:
        raise HTTPException(status_code=404, detail="Episode not found")

    if not episode.audio_url:
        raise HTTPException(
            status_code=400,
            detail="Episode must have audio file before transcription"
        )

    # 3. Check quota
    quota_ok = check_transcription_quota(current_user.id, db)
    if not quota_ok:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Transcription quota exceeded. Upgrade tier for more transcriptions."
        )

    # 4. Trigger async transcription
    async_transcribe_episode.delay(episode_id)

    # 5. Increment quota
    increment_transcription_quota(current_user.id, db)

    return {
        "message": "Transcription started",
        "episode_id": episode_id,
        "status": "processing",
    }
```

**Add quota functions** to `backend/app/services/podcast_quota_service.py`:

```python
def check_transcription_quota(user_id: str, db: Session) -> bool:
    """Check if user has transcription quota remaining"""
    quota = db.query(PodcastQuota).filter(PodcastQuota.user_id == user_id).first()
    if not quota:
        return True
    return quota.transcription_used < quota.transcription_limit

def increment_transcription_quota(user_id: str, db: Session):
    """Increment transcription usage counter"""
    quota = db.query(PodcastQuota).filter(PodcastQuota.user_id == user_id).first()
    if quota:
        quota.transcription_used += 1
        db.commit()
```

**Update database model** `backend/app/models/podcast.py`:

Add fields to `PodcastEpisode`:
```python
class PodcastEpisode(Base):
    __tablename__ = "podcast_episodes"

    # ... existing fields ...

    # Transcription fields
    transcript_text = Column(Text, nullable=True)
    transcript_language = Column(String, nullable=True)
    transcript_status = Column(String, nullable=True)  # processing, completed, failed
    transcript_error = Column(Text, nullable=True)
```

**Create migration**:
```bash
cd backend
alembic revision --autogenerate -m "add transcription fields to podcast episodes"
alembic upgrade head
```

**Verification**:
```bash
pytest backend/tests/test_podcast_transcription.py -v
# Expected: 10/10 tests GREEN
```

---

### STEP 1.3.3: Frontend Video & Transcription UI (1 hour)

#### RED Phase: Write VideoUploadModal Tests (15 minutes)

Similar to AudioUploadModal tests, create `frontend/src/components/podcast/VideoUploadModal.test.tsx`:

```typescript
// Follow same pattern as AudioUploadModal.test.tsx
// 8 tests: render, file validation, tier check, upload success, progress, error handling, cancel, close
```

#### GREEN Phase: Implement VideoUploadModal (30 minutes)

**Copy and adapt** `AudioUploadModal.tsx` to `VideoUploadModal.tsx`:
- Change file type validation (mp4, mov, avi)
- Update API endpoint to `/upload-video`
- Adjust size limit display (up to 2GB for video)
- Keep same UI pattern (drag-drop, progress, errors)

#### Add Transcription UI to PodcastStudio (15 minutes)

**File**: `frontend/src/pages/podcast/PodcastStudio.tsx`

Add "Transcribe" button to episode rows:
```typescript
{episode.audio_url && !episode.transcript_text && (
  <button
    onClick={() => handleTranscribe(episode.id)}
    className="text-indigo-600 hover:text-indigo-800"
    disabled={userTier !== 'growth' && userTier !== 'premium' && userTier !== 'enterprise'}
  >
    {episode.transcript_status === 'processing' ? 'Transcribing...' : 'Transcribe'}
  </button>
)}

{episode.transcript_text && (
  <button
    onClick={() => handleViewTranscript(episode.id)}
    className="text-green-600"
  >
    View Transcript
  </button>
)}
```

**Verification**:
```bash
npm test VideoUploadModal.test.tsx PodcastStudio.test.tsx
# Expected: All tests GREEN
```

---

### Sprint 1.3 Final Verification & Commit (30 minutes)

#### Run Full Test Suite
```bash
# Backend
cd backend
pytest tests/test_podcast_*.py -v
# Expected: 93+ tests GREEN

# Frontend
cd frontend
npm test -- src/components/podcast/ src/pages/podcast/
# Expected: 30+ tests GREEN
```

#### Update Story
Edit `docs/bmad/stories/DEV-016-podcast-studio-subscription.md`:
```markdown
**Status**: ✅ 90% COMPLETE (Video + Transcription delivered)

**✅ Phase 2 Complete**: Video Upload
- ✅ Video upload endpoint (Professional+ tier)
- ✅ Quota enforcement
- ✅ VideoUploadModal component
- **Tests: 10/10 backend + 8/8 frontend = 18 GREEN**

**✅ Phase 3 Complete**: Transcription Pipeline
- ✅ Whisper API integration
- ✅ Async Celery task processing
- ✅ Transcription endpoint (Growth+ tier)
- ✅ Transcript display UI
- **Tests: 10/10 backend + tests integrated = 10 GREEN**

**Overall Test Results**:
- Backend: 93/93 tests GREEN (100%)
- Frontend: 38/38 tests GREEN (100%)
- **Total: 131/131 tests passing** ✅
```

#### Commit
```bash
git add -A
git commit -m "feat(podcasts): complete DEV-016 video upload and transcription (Phases 2-3)

Phase 2: Video Upload (Professional+ tier)
RED:
- Created test_podcast_video_upload.py with 10 comprehensive tests
- Validated tier enforcement, quota, file formats, ownership

GREEN:
- Implemented POST /episodes/{id}/upload-video endpoint
- Added video quota check and increment functions
- Integrated S3 storage for video files
- Created VideoUploadModal component matching AudioUploadModal pattern

REFACTOR:
- Extracted validation logic to helper functions
- Added proper error messages and logging

Phase 3: Transcription Pipeline (Growth+ tier)
RED:
- Created test_podcast_transcription.py with 10 tests
- Validated Whisper API integration, Celery tasks, error handling

GREEN:
- Implemented transcription_service.py with Whisper API integration
- Created Celery task async_transcribe_episode with retry logic
- Added POST /episodes/{id}/transcribe endpoint
- Updated episode model with transcript fields (migration created)
- Added transcript display UI to PodcastStudio

REFACTOR:
- Added language detection
- Implemented status tracking (processing/completed/failed)
- Added quota enforcement for transcriptions

Test Results:
- Backend: 93/93 tests GREEN (100%)
- Frontend: 38/38 tests GREEN (100%)
- Total: 131/131 passing ✅

DEV-016 Video & Transcription: ✅ COMPLETE (90% story done)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## NEXT STEPS SUMMARY

After completing Sprints 1.1-1.3 (DEV-008 + DEV-016 backend + video/transcription), you will have:

✅ **Sprint 1.1**: DEV-008 Document & Data Room frontend (48 tests)
✅ **Sprint 1.2**: DEV-016 Backend regression fixes (2 tests)
✅ **Sprint 1.3**: DEV-016 Video upload + Transcription (28 tests)

**Total Progress**: ~78 new tests, ~14-16 hours of work

**Remaining Sprints**:
- **Sprint 2.1**: MARK-002 Assets & Analytics (4-6 hours)
- **Sprint 2.2**: Backend Coverage to 80% (2 hours)
- **Sprint 3**: Full Testing & Verification (4-6 hours)
- **Sprint 4**: Production Deployment (2-3 hours)

**Estimated Time to 100%**: 8-12 additional hours after Sprint 1 completion

---

## CODE TEMPLATES & PATTERNS

### React Component Pattern
```typescript
interface ComponentProps {
  // Props with clear types
}

export const Component: React.FC<ComponentProps> = (props) => {
  // State
  const [state, setState] = useState();

  // React Query
  const { data, isLoading } = useQuery({
    queryKey: ['key'],
    queryFn: fetchFunction,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: apiFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['key'] });
    },
  });

  // Event handlers
  const handleEvent = () => {
    // Logic
  };

  // Render
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### FastAPI Endpoint Pattern
```python
@router.post("/resource", response_model=ResponseSchema)
async def create_resource(
    payload: RequestSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Docstring describing endpoint"""

    # 1. Validate tier/permissions
    if current_user.tier not in ['allowed', 'tiers']:
        raise HTTPException(status_code=403, detail="Insufficient tier")

    # 2. Validate ownership/access
    resource = db.query(Model).filter(...).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Not found")

    # 3. Business logic
    result = perform_operation(payload, db)

    # 4. Return response
    return result
```

### Test Pattern (Backend)
```python
@pytest.mark.asyncio
async def test_feature_success(client: AsyncClient, auth_headers):
    """Test description"""
    response = await client.post(
        "/api/endpoint",
        json={"key": "value"},
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["key"] == "expected"
```

### Test Pattern (Frontend)
```typescript
it('should do something', async () => {
  const { mockApi } = await import('../../services/api');
  vi.mocked(mockApi).mockResolvedValue({ data: 'mock' });

  render(<Component prop="value" />);

  await waitFor(() => {
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });

  const button = screen.getByRole('button', { name: /click/i });
  fireEvent.click(button);

  await waitFor(() => {
    expect(mockApi).toHaveBeenCalled();
  });
});
```

---

## BMAD WORKFLOW INTEGRATION

### After Each Sprint

1. **Update Story File**:
```markdown
**Status**: ✅ COMPLETE / 🟡 IN PROGRESS / 🔴 NOT STARTED

**Test Results**:
- Backend: X/X tests GREEN
- Frontend: Y/Y tests GREEN
- Total: Z/Z passing ✅

**Deliverables**:
- ✅ Feature 1
- ✅ Feature 2
```

2. **Update Progress Tracker**:
```markdown
### Session 2025-10-29 (STORY-NAME COMPLETE – HH:MM UTC)
- **STORY Status: ✅ COMPLETE**
- Brief description of work completed
- Test results summary
- Commands used for verification
```

3. **Update Workflow Status**:
```markdown
NEXT_ACTION: Description of next sprint
NEXT_COMMAND: Command to execute
STATUS: Current test counts and status
LAST_UPDATED: 2025-10-29THH:MM:00Z
```

4. **Commit with Template**:
```bash
git commit -m "feat(module): complete STORY-NAME (Phase X)

Phase X: Description
RED:
- List of tests written

GREEN:
- List of implementations

REFACTOR:
- List of improvements

Test Results:
- Backend: X/X GREEN
- Frontend: Y/Y GREEN
- Total: Z/Z passing ✅

STORY Status: ✅ COMPLETE

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## QUICK REFERENCE COMMANDS

### Run Tests
```bash
# Backend (all)
cd backend && pytest -v

# Backend (specific)
cd backend && pytest tests/test_file.py -v

# Frontend (all)
cd frontend && npm test

# Frontend (specific)
cd frontend && npm test ComponentName.test.tsx

# Coverage
cd backend && pytest --cov=app --cov-report=html
cd frontend && npm run test:coverage
```

### Database
```bash
# Create migration
cd backend && alembic revision --autogenerate -m "description"

# Apply migrations
cd backend && alembic upgrade head

# Rollback
cd backend && alembic downgrade -1
```

### Git
```bash
# Check status
git status

# Commit
git add -A
git commit -m "message"

# Push
git push origin main
```

---

## TROUBLESHOOTING

### Common Issues

**Test fails with "Module not found"**:
- Run `npm install` or `pip install -r requirements.txt`

**Database connection error**:
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running

**Import errors in tests**:
- Check `vi.mock()` paths match actual file locations
- Ensure mocked functions are actually exported

**Async test timeout**:
- Increase timeout: `waitFor(() => {...}, { timeout: 5000 })`
- Check mock promises are resolving correctly

**Migration conflicts**:
- Run `alembic heads` to check for multiple heads
- Run `alembic merge` if needed

---

## END OF IMPLEMENTATION GUIDE

This guide provides all the information needed to complete the remaining 24-32 hours of work to achieve 100% project delivery. Follow the sprints in order, use strict TDD methodology (RED → GREEN → REFACTOR), and update BMAD documentation after each sprint.

**Next Sprint to Execute**: Sprint 1.1 (DEV-008 Frontend Components)

Good luck! 🚀
