/**
 * ContentPieceCard Component
 *
 * Display individual published content piece with status and metrics
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { FileText, Edit2, Trash2, MoreVertical, Calendar, ExternalLink, Eye } from 'lucide-react'
import { ContentType, PublishStatus } from '@/services/api/masterAdmin'
import type { AdminContentPiece } from '@/services/api/masterAdmin'

export interface ContentPieceCardProps {
  piece: AdminContentPiece
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

const getPublishStatusBadge = (status: PublishStatus) => {
  const styles = {
    [PublishStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [PublishStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [PublishStatus.PUBLISHED]: 'bg-green-100 text-green-800',
  }

  const labels = {
    [PublishStatus.DRAFT]: 'Draft',
    [PublishStatus.SCHEDULED]: 'Scheduled',
    [PublishStatus.PUBLISHED]: 'Published',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export const ContentPieceCard: React.FC<ContentPieceCardProps> = ({
  piece,
  onClick,
  onEdit,
  onDelete,
}) => {
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

  const publishedDate = piece.published_at ? new Date(piece.published_at) : null

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
          <h3 className="text-lg font-semibold text-gray-900 truncate">{piece.title}</h3>
          {piece.summary && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{piece.summary}</p>
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
            aria-label="Content piece actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  {piece.published_url && (
                    <a
                      href={piece.published_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Published
                    </a>
                  )}
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

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        {getContentTypeBadge(piece.content_type)}
        {getPublishStatusBadge(piece.publish_status)}
      </div>

      {/* Views (if published) */}
      {piece.publish_status === PublishStatus.PUBLISHED && piece.views !== null && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Eye className="h-4 w-4" />
          <span>{piece.views.toLocaleString()} views</span>
        </div>
      )}

      {/* Footer: Date */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {publishedDate ? (
            <span>Published {publishedDate.toLocaleDateString()}</span>
          ) : (
            <span>Created {new Date(piece.created_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  )
}
