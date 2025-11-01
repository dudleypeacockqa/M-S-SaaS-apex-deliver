/**
 * ScriptEditor Component
 *
 * Rich editor for creating and editing content scripts
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCreateContentScript, useUpdateContentScript } from '@/hooks/master-admin'
import { ContentType } from '@/services/api/masterAdmin'
import type { AdminContentScript, AdminContentScriptCreate, AdminContentScriptUpdate } from '@/services/api/masterAdmin'

export interface ScriptEditorProps {
  script?: AdminContentScript
  onSuccess?: () => void
  onCancel?: () => void
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, onSuccess, onCancel }) => {
  const isEditing = !!script

  const [formData, setFormData] = useState<AdminContentScriptCreate>({
    title: script?.title || '',
    description: script?.description || '',
    content_type: script?.content_type || ContentType.ARTICLE,
    script_text: script?.script_text || '',
    word_count: script?.word_count || null,
  })

  const createScript = useCreateContentScript()
  const updateScript = useUpdateContentScript()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Auto-calculate word count
    const wordCount = formData.script_text?.split(/\s+/).filter(Boolean).length || 0

    try {
      if (isEditing) {
        await updateScript.mutateAsync({
          scriptId: script.id,
          update: { ...formData, word_count: wordCount } as AdminContentScriptUpdate,
        })
      } else {
        await createScript.mutateAsync({ ...formData, word_count: wordCount })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save script:', error)
    }
  }

  const handleChange = (field: keyof AdminContentScriptCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createScript.isPending || updateScript.isPending
  const wordCount = formData.script_text?.split(/\s+/).filter(Boolean).length || 0

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

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of this script..."
        />
      </div>

      {/* Script Text */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="script_text" className="block text-sm font-medium text-gray-700">
            Script Content *
          </label>
          <span className="text-xs text-gray-500">{wordCount} words</span>
        </div>
        <textarea
          id="script_text"
          value={formData.script_text || ''}
          onChange={(e) => handleChange('script_text', e.target.value)}
          rows={16}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Write your content script here..."
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" loading={isLoading}>
          {isEditing ? 'Update Script' : 'Create Script'}
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
