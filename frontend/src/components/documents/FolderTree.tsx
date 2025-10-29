import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFolder,
  deleteFolder,
  listFolders,
  updateFolder,
  type Folder,
} from '../../services/api/documents'

interface FolderTreeProps {
  dealId: string
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
}

interface FolderNode extends Folder {
  parent_id: string | null
  document_count: number
  children?: FolderNode[]
}

function buildTree(folders: Folder[]): FolderNode[] {
  const nodes = new Map<string, FolderNode>()
  const roots: FolderNode[] = []

  // Convert Folder to FolderNode, handling both parent_folder_id (API) and parent_id (test mocks)
  folders.forEach((folder) => {
    const parentId = (folder as any).parent_id ?? folder.parent_folder_id
    nodes.set(folder.id, { ...folder, parent_id: parentId, children: [] })
  })

  // Build parent-child relationships
  nodes.forEach((node) => {
    if (node.parent_id) {
      const parent = nodes.get(node.parent_id)
      if (parent) {
        parent.children?.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  const sortNodes = (list: FolderNode[]): FolderNode[] =>
    list
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : [],
      }))

  return sortNodes(roots)
}

export const FolderTree: React.FC<FolderTreeProps> = ({ dealId, selectedFolderId, onFolderSelect }) => {
  const queryClient = useQueryClient()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [contextFolderId, setContextFolderId] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['folders', dealId],
    queryFn: () => listFolders(dealId),
  })

  const folders = useMemo(() => (data ? buildTree(data) : []), [data])

  const invalidateFolders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['folders', dealId] })
  }, [dealId, queryClient])

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; parent_folder_id: string | null }) =>
      createFolder(dealId, { name: payload.name, parent_folder_id: payload.parent_folder_id }),
    onSuccess: () => invalidateFolders(),
  })

  const updateMutation = useMutation({
    mutationFn: (args: { folderId: string; name: string }) =>
      updateFolder(dealId, args.folderId, { name: args.name }),
    onSuccess: () => invalidateFolders(),
  })

  const deleteMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(dealId, folderId),
    onSuccess: () => invalidateFolders(),
  })

  const toggleExpand = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }, [])

  const handleCreateSubmit = async () => {
    if (!newFolderName.trim()) {
      setIsCreating(false)
      setNewFolderName('')
      return
    }

    await createMutation.mutateAsync({ name: newFolderName.trim(), parent_folder_id: null })
    setIsCreating(false)
    setNewFolderName('')
  }

  const handleRenameSubmit = async () => {
    if (!renamingFolderId) return
    if (!renameValue.trim()) {
      setRenamingFolderId(null)
      setRenameValue('')
      return
    }

    await updateMutation.mutateAsync({ folderId: renamingFolderId, name: renameValue.trim() })
    setRenamingFolderId(null)
    setRenameValue('')
  }

  const renderFolder = (folder: FolderNode, depth = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = folder.id === selectedFolderId
    const hasChildren = folder.children && folder.children.length > 0

    return (
      <div key={folder.id} className={depth === 0 ? 'mt-2' : 'mt-1 ml-4'}>
        <div
          className={`flex items-center justify-between rounded-md px-2 py-1 text-sm ${
            isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'
          }`}
          onContextMenu={(event) => {
            event.preventDefault()
            setContextFolderId(folder.id)
            setContextMenuPosition({ x: event.clientX, y: event.clientY })
          }}
        >
          <div className="flex items-center gap-2">
            {hasChildren && (
              <button
                type="button"
                onClick={() => toggleExpand(folder.id)}
                className="text-xs font-medium text-slate-500"
                aria-label={`Expand ${folder.name}`}
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
            {renamingFolderId === folder.id ? (
              <input
                autoFocus
                className="rounded border border-slate-300 px-2 py-1 text-sm"
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleRenameSubmit()
                  }
                  if (event.key === 'Escape') {
                    setRenamingFolderId(null)
                    setRenameValue('')
                  }
                }}
                onBlur={() => {
                  setRenamingFolderId(null)
                  setRenameValue('')
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => onFolderSelect(folder.id)}
                className="text-left"
                aria-label={`Select ${folder.name}`}
              >
                {folder.name}
              </button>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>{folder.children!.map((child) => renderFolder(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading folders...</p>
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Folders</h3>
        <button
          type="button"
          onClick={() => {
            setIsCreating(true)
            setContextFolderId(null)
          }}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
        >
          New folder
        </button>
      </div>

      {isCreating && (
        <div className="mt-2">
          <input
            autoFocus
            placeholder="Folder name"
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
            value={newFolderName}
            onChange={(event) => setNewFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleCreateSubmit()
              }
              if (event.key === 'Escape') {
                setIsCreating(false)
                setNewFolderName('')
              }
            }}
            onBlur={() => {
              setIsCreating(false)
              setNewFolderName('')
            }}
          />
        </div>
      )}

      <div className="mt-3">
        {folders.length === 0 ? (
          <p className="text-sm text-slate-500">No folders yet. Create one to organise your files.</p>
        ) : (
          folders.map((folder) => renderFolder(folder))
        )}
      </div>

      {/* Context menu */}
      {contextFolderId && contextMenuPosition && (
        <>
          {/* Backdrop to close context menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setContextFolderId(null)
              setContextMenuPosition(null)
            }}
          />

          {/* Context menu */}
          <div
            className="fixed z-20 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[120px]"
            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          >
            <button
              type="button"
              onClick={() => {
                const folder = folders.flatMap((f) => [f, ...(f.children || [])]).find((f) => f.id === contextFolderId)
                if (folder) {
                  setRenamingFolderId(folder.id)
                  setRenameValue(folder.name)
                }
                setContextFolderId(null)
                setContextMenuPosition(null)
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => {
                setContextFolderId(null)
                setContextMenuPosition(null)
                if (window.confirm('Delete this folder and its contents?')) {
                  deleteMutation.mutate(contextFolderId)
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
