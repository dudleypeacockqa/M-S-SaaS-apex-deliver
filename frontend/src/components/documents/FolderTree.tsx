import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  createFolder,
  deleteFolder,
  listFolders,
  updateFolder,
  type ListFoldersOptions,
  type Folder,
} from '../../services/api/documents'

interface FolderTreeProps {
  dealId: string
  selectedFolderId: string | null
  searchTerm?: string
  onFolderSelect: (folderId: string | null) => void
}

interface FolderNode extends Folder {
  parent_id: string | null
  document_count: number
  children?: FolderNode[]
}

const parentKey = (parentId: string | null) => parentId ?? '__ROOT__'

type FolderCache = Record<string, FolderNode[]>
type FlagMap = Record<string, boolean>

interface VisibleNode {
  id: string
  name: string
  depth: number
  hasChildren: boolean
  isExpanded: boolean
  parentId: string | null
}

export const FolderTree: React.FC<FolderTreeProps> = ({ dealId, selectedFolderId, searchTerm = '', onFolderSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [contextFolderId, setContextFolderId] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [folderCache, setFolderCache] = useState<FolderCache>({})
  const [loadedParents, setLoadedParents] = useState<FlagMap>({})
  const [loadingParents, setLoadingParents] = useState<FlagMap>({})
  const [focusedFolderId, setFocusedFolderId] = useState<string | null>(null)
  const treeContainerRef = useRef<HTMLDivElement | null>(null)
  const treeitemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const renameInputRef = useRef<HTMLInputElement | null>(null)

  const markLoading = useCallback((parentId: string | null, value: boolean) => {
    setLoadingParents((prev) => ({
      ...prev,
      [parentKey(parentId)]: value,
    }))
  }, [])

  const markLoaded = useCallback((parentId: string | null) => {
    setLoadedParents((prev) => ({
      ...prev,
      [parentKey(parentId)]: true,
    }))
  }, [])

  const isLoaded = useCallback(
    (parentId: string | null) => !!loadedParents[parentKey(parentId)],
    [loadedParents]
  )

  const isLoadingParent = useCallback(
    (parentId: string | null) => !!loadingParents[parentKey(parentId)],
    [loadingParents]
  )

  const folderChildren = useCallback(
    (parentId: string | null) => folderCache[parentKey(parentId)] ?? [],
    [folderCache]
  )

  const fetchFolders = useCallback(
    async (parentId: string | null, opts: Partial<ListFoldersOptions> = {}) => {
      const cacheKey = parentKey(parentId)
      if (isLoaded(parentId) || isLoadingParent(parentId)) {
        return
      }

      markLoading(parentId, true)

      try {
        const response = await listFolders(dealId, {
          parentFolderId: parentId ?? undefined,
          ...opts,
        })

        const normalized = response.map((folder) => ({
          ...folder,
          parent_id:
            (folder as any).parent_id ?? (folder as any).parent_folder_id ?? parentId ?? null,
          children: [],
        }))

        setFolderCache((prev) => ({
          ...prev,
          [cacheKey]: normalized,
        }))

        markLoaded(parentId)
      } finally {
        markLoading(parentId, false)
      }
    },
    [dealId, isLoaded, isLoadingParent, markLoaded, markLoading]
  )

  useEffect(() => {
    void fetchFolders(null)
  }, [fetchFolders])

  const [searchResults, setSearchResults] = useState<FolderNode[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const term = searchTerm.trim()
    if (!term) {
      setSearchResults(null)
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    void (async () => {
      try {
        const results = await listFolders(dealId, { search: term })
        if (cancelled) return
        setSearchResults(
          results.map((folder) => ({
            ...folder,
            parent_id: (folder as any).parent_id ?? folder.parent_folder_id ?? null,
            children: [],
          }))
        )
      } finally {
        if (!cancelled) {
          setIsSearching(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dealId, searchTerm])

  const filteredFolders = useMemo(() => {
    if (searchTerm.trim()) {
      return searchResults ?? []
    }
    return folderChildren(null)
  }, [folderChildren, searchResults, searchTerm])

  useEffect(() => {
    if (!focusedFolderId) {
      const firstVisible = filteredFolders[0]
      if (firstVisible) {
        setFocusedFolderId(firstVisible.id)
      }
    }
  }, [filteredFolders, focusedFolderId])

  useEffect(() => {
    if (focusedFolderId && treeitemRefs.current[focusedFolderId]) {
      treeitemRefs.current[focusedFolderId]?.focus()
    }
  }, [focusedFolderId])

  const invalidateFolders = useCallback(() => {
    setFolderCache({})
    setLoadedParents({})
    setLoadingParents({})
    setExpandedFolders(new Set())
    setFocusedFolderId(null)
    void fetchFolders(null)
  }, [fetchFolders])

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

  const storageKey = `folder-tree-expanded-${dealId}`

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        const parsed: string[] = JSON.parse(stored)
        setExpandedFolders(new Set(parsed))
      }
    } catch {
      // ignore read errors (e.g., unavailable localStorage)
    }
  }, [storageKey])

  const persistExpanded = useCallback((next: Set<string>) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(next)))
    } catch {
      // ignore write errors in non-browser contexts
    }
  }, [storageKey])

  const ensureChildrenLoaded = useCallback(
    (folder: FolderNode) => {
      if ((folder.has_children || folderChildren(folder.id).length === 0) && !isLoaded(folder.id)) {
        void fetchFolders(folder.id)
      }
    },
    [fetchFolders, folderChildren, isLoaded]
  )

  const toggleExpand = useCallback((folder: FolderNode) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folder.id)) {
        next.delete(folder.id)
      } else {
        next.add(folder.id)
        ensureChildrenLoaded(folder)
      }
      persistExpanded(next)
      return next
    })
  }, [ensureChildrenLoaded, persistExpanded])

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

  const visibleNodes: VisibleNode[] = useMemo(() => {
    const nodes: VisibleNode[] = []

    const traverse = (items: FolderNode[], depth: number, parentId: string | null) => {
      items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((folder) => {
          const children = folderChildren(folder.id)
          const hasChildren = (children && children.length > 0) || !!folder.has_children
          const isExpanded = expandedFolders.has(folder.id)

          const effectiveHasChildren = searchTerm.trim() ? false : hasChildren

          nodes.push({
            id: folder.id,
            name: folder.name,
            depth,
            hasChildren: effectiveHasChildren,
            isExpanded,
            parentId,
          })

          if (!searchTerm.trim() && hasChildren && isExpanded) {
            traverse(children, depth + 1, folder.id)
          }
        })
    }

    traverse(filteredFolders, 1, null)
    return nodes
  }, [expandedFolders, filteredFolders, folderChildren])

  const focusNodeByIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < visibleNodes.length) {
        setFocusedFolderId(visibleNodes[index].id)
      }
    },
    [visibleNodes]
  )

  const focusNodeById = useCallback(
    (id: string | null) => {
      if (!id) return
      const index = visibleNodes.findIndex((node) => node.id === id)
      if (index !== -1) {
        setFocusedFolderId(visibleNodes[index].id)
      }
    },
    [visibleNodes]
  )

  const flattenedFolders = useMemo(() => {
    const build = (parentId: string | null): FolderNode[] => {
      const items = folderChildren(parentId)
      return items.flatMap((node) => [node, ...build(node.id)])
    }
    return build(null)
  }, [folderChildren])

  const findFolderById = useCallback(
    (id: string) => flattenedFolders.find((folder) => folder.id === id) ?? null,
    [flattenedFolders]
  )

  const handleTreeKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!visibleNodes.length) return

      const currentIndex = visibleNodes.findIndex((node) => node.id === focusedFolderId)
      const currentNode = currentIndex >= 0 ? visibleNodes[currentIndex] : visibleNodes[0]

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0
          focusNodeByIndex(Math.min(nextIndex, visibleNodes.length - 1))
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          const prevIndex = currentIndex >= 0 ? currentIndex - 1 : visibleNodes.length - 1
          focusNodeByIndex(Math.max(prevIndex, 0))
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          if (currentNode) {
            if (currentNode.hasChildren && !currentNode.isExpanded) {
              const folder = findFolderById(currentNode.id)
              if (folder) {
                toggleExpand(folder)
              }
            } else {
              focusNodeByIndex(Math.min(currentIndex + 1, visibleNodes.length - 1))
            }
          }
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          if (currentNode) {
            if (currentNode.isExpanded) {
              const folder = findFolderById(currentNode.id)
              if (folder) {
                toggleExpand(folder)
              }
            } else if (currentNode.parentId) {
              focusNodeById(currentNode.parentId)
            }
          }
          break
        }
        case 'Home': {
          event.preventDefault()
          focusNodeByIndex(0)
          break
        }
        case 'End': {
          event.preventDefault()
          focusNodeByIndex(visibleNodes.length - 1)
          break
        }
        case 'Enter':
        case ' ': {
          event.preventDefault()
          if (currentNode) {
            onFolderSelect(currentNode.id)
            setFocusedFolderId(currentNode.id)
          }
          break
        }
        default:
          break
      }
    },
    [findFolderById, focusNodeById, focusNodeByIndex, focusedFolderId, onFolderSelect, toggleExpand, visibleNodes]
  )

  useEffect(() => {
    if (renamingFolderId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingFolderId])

  const cancelRename = useCallback(() => {
    setRenamingFolderId(null)
    setRenameValue('')
  }, [])

  const isSearchMode = Boolean(searchTerm.trim())

  const renderFolder = (folder: FolderNode, depth = 1): React.ReactNode => {
    const children = folderChildren(folder.id)
    const hasChildren = (!isSearchMode && ((children && children.length > 0) || !!folder.has_children))
    const isExpanded = hasChildren && expandedFolders.has(folder.id)
    const isSelected = folder.id === selectedFolderId
    const isFocused = folder.id === focusedFolderId
    const isLoading = isLoadingParent(folder.id)

    const toggleLabel = `${isExpanded ? 'Collapse' : 'Expand'} ${folder.name}`
    const containerClasses = `flex items-center justify-between rounded-md px-1 py-1 transition-colors ${
      isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'
    }`

    return (
      <li
        key={folder.id}
        role="none"
        className="mt-1"
        onContextMenu={(event) => {
          event.preventDefault()
          setContextFolderId(folder.id)
          setContextMenuPosition({ x: event.clientX, y: event.clientY })
        }}
      >
        <div className={containerClasses}>
          <div className="flex items-center gap-2 flex-1">
            {hasChildren && (
              <button
                type="button"
                aria-label={toggleLabel}
                className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-xs font-semibold text-slate-600"
                onClick={() => toggleExpand(folder)}
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}

            {renamingFolderId === folder.id ? (
              <input
                id={`rename-${folder.id}`}
                ref={renameInputRef}
                className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                value={renameValue}
                onChange={(event) => setRenameValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleRenameSubmit()
                  }
                  if (event.key === 'Escape') {
                    cancelRename()
                  }
                }}
                onBlur={() => {
                  void handleRenameSubmit()
                }}
                aria-label={`Rename ${folder.name}`}
              />
            ) : (
              <button
                type="button"
                className="flex-1 justify-start rounded-md px-2 py-1 text-left text-sm focus:outline-none"
                aria-label={`Select ${folder.name}`}
                data-folder-id={folder.id}
                ref={(element) => {
                  treeitemRefs.current[folder.id] = element
                }}
                role="treeitem"
                tabIndex={isFocused ? 0 : -1}
                aria-selected={isSelected}
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-level={depth}
                onFocus={() => setFocusedFolderId(folder.id)}
                onClick={() => {
                  setFocusedFolderId(folder.id)
                  onFolderSelect(folder.id)
                }}
              >
                <span>{folder.name}</span>
                {isLoading && <span className="ml-2 text-xs text-slate-400">(loading…)</span>}
              </button>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <ul role="group" className="ml-4 border-l border-slate-100 pl-4">
            {children.map((child) => renderFolder(child, depth + 1))}
          </ul>
        )}
      </li>
    )
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
        {isSearchMode ? (
          isSearching ? (
            <p className="text-sm text-slate-500">Searching folders...</p>
          ) : filteredFolders.length === 0 ? (
            <p className="text-sm text-slate-500">No folders match that search.</p>
          ) : (
            <div
              ref={treeContainerRef}
              role="tree"
              tabIndex={0}
              aria-label="Folders"
              className="focus:outline-none"
              onKeyDown={handleTreeKeyDown}
              onFocus={() => {
                if (!focusedFolderId && filteredFolders.length > 0) {
                  setFocusedFolderId(filteredFolders[0].id)
                }
              }}
            >
              <ul role="presentation">
                {filteredFolders.map((folder) => renderFolder(folder, 1))}
              </ul>
            </div>
          )
        ) : isLoadingParent(null) && !isLoaded(null) && filteredFolders.length === 0 ? (
          <p className="text-sm text-slate-500">Loading folders...</p>
        ) : filteredFolders.length === 0 ? (
          <p className="text-sm text-slate-500">No folders yet. Create one to organise your files.</p>
        ) : (
          <div
            ref={treeContainerRef}
            role="tree"
            tabIndex={0}
            aria-label="Folders"
            className="focus:outline-none"
            onKeyDown={handleTreeKeyDown}
            onFocus={() => {
              if (!focusedFolderId && filteredFolders.length > 0) {
                setFocusedFolderId(filteredFolders[0].id)
              }
            }}
          >
            <ul role="presentation">
              {filteredFolders.map((folder) => {
                const hasChildren = (folderChildren(folder.id)?.length ?? 0) > 0 || !!folder.has_children
                if (hasChildren && expandedFolders.has(folder.id)) {
                  ensureChildrenLoaded(folder)
                }
                return renderFolder(folder, 1)
              })}
            </ul>
          </div>
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
                const folder = flattenedFolders.find((f) => f.id === contextFolderId)
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
