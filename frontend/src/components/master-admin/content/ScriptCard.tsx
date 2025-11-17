/**
 * ScriptCard Component
 *
 * Display individual content script with metadata and actions
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { FileText, Edit2, Trash2, MoreVertical, Calendar } from '@/lib/icons'
import { ContentType } from '@/services/api/masterAdmin'
import type { AdminContentScript } from '@/services/api/masterAdmin'

export interface ScriptCardProps {
  script: AdminContentScript
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const getContentTypeBadge = (type: ContentType) => {
  const styles = {
    [ContentType.ARTICLE]: 'bg-blue-100 text-blue-800',
    [ContentType.VIDEO]: 'bg-purple-100 text-purple-800',
    [ContentType.PODCAST]: 'bg-green-100 text-green-800',
    [ContentType.SOCIAL]: 'bg-yellow-100 text-yellow-800',
    [ContentType.NEWSLETTER]: 'bg-red-100 text-red-800',
  }

  const labels = {
    [ContentType.ARTICLE]: 'Article',
    [ContentType.VIDEO]: 'Video',
    [ContentType.PODCAST]: 'Podcast',
    [ContentType.SOCIAL]: 'Social',
    [ContentType.NEWSLETTER]: 'Newsletter',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[type])}>
      {labels[type]}
    </span>
  )
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete?.()
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{script.title}</h3>
          {script.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{script.description}</p>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            aria-label="Script actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Type Badge */}
      <div className="mb-3">
        {getContentTypeBadge(script.content_type)}
      </div>

      {/* Word Count */}
      {script.word_count !== null && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FileText className="h-4 w-4" />
          <span>{script.word_count.toLocaleString()} words</span>
        </div>
      )}

      {/* Footer: Date */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Created {new Date(script.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
