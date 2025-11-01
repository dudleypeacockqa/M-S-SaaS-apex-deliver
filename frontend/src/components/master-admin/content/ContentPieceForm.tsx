/**
 * ContentPieceForm Component
 *
 * Form for creating and editing published content pieces
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCreateContentPiece, useUpdateContentPiece } from '@/hooks/master-admin'
import { ContentType, PublishStatus } from '@/services/api/masterAdmin'
import type { AdminContentPiece, AdminContentPieceCreate, AdminContentPieceUpdate } from '@/services/api/masterAdmin'

export interface ContentPieceFormProps {
  piece?: AdminContentPiece
  scriptId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export const ContentPieceForm: React.FC<ContentPieceFormProps> = ({
  piece,
  scriptId,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!piece

  const [formData, setFormData] = useState<AdminContentPieceCreate>({
    script_id: piece?.script_id || scriptId || null,
    title: piece?.title || '',
    summary: piece?.summary || '',
    content_type: piece?.content_type || ContentType.ARTICLE,
    publish_status: piece?.publish_status || PublishStatus.DRAFT,
    published_url: piece?.published_url || '',
    published_at: piece?.published_at || null,
    views: piece?.views || null,
  })

  const createPiece = useCreateContentPiece()
  const updatePiece = useUpdateContentPiece()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await updatePiece.mutateAsync({
          pieceId: piece.id,
          update: formData as AdminContentPieceUpdate,
        })
      } else {
        await createPiece.mutateAsync(formData)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save content piece:', error)
    }
  }

  const handleChange = (field: keyof AdminContentPieceCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createPiece.isPending || updatePiece.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Content Type */}
      <div>
        <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 mb-1">
          Content Type *
        </label>
        <select
          id="content_type"
          value={formData.content_type}
          onChange={(e) => handleChange('content_type', e.target.value as ContentType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value={ContentType.ARTICLE}>Article</option>
          <option value={ContentType.VIDEO}>Video</option>
          <option value={ContentType.PODCAST}>Podcast</option>
          <option value={ContentType.SOCIAL}>Social</option>
          <option value={ContentType.NEWSLETTER}>Newsletter</option>
        </select>
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          id="summary"
          value={formData.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of this content..."
        />
      </div>

      {/* Publish Status */}
      <div>
        <label htmlFor="publish_status" className="block text-sm font-medium text-gray-700 mb-1">
          Publish Status
        </label>
        <select
          id="publish_status"
          value={formData.publish_status}
          onChange={(e) => handleChange('publish_status', e.target.value as PublishStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={PublishStatus.DRAFT}>Draft</option>
          <option value={PublishStatus.SCHEDULED}>Scheduled</option>
          <option value={PublishStatus.PUBLISHED}>Published</option>
        </select>
      </div>

      {/* Published URL */}
      {formData.publish_status === PublishStatus.PUBLISHED && (
        <div>
          <label htmlFor="published_url" className="block text-sm font-medium text-gray-700 mb-1">
            Published URL
          </label>
          <input
            type="url"
            id="published_url"
            value={formData.published_url || ''}
            onChange={(e) => handleChange('published_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
      )}

      {/* Published Date */}
      {formData.publish_status === PublishStatus.PUBLISHED && (
        <div>
          <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-1">
            Published Date
          </label>
          <input
            type="datetime-local"
            id="published_at"
            value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleChange('published_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" loading={isLoading}>
          {isEditing ? 'Update Content' : 'Create Content'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
