import React, { useState, useEffect } from 'react'
import type { PostCreate, PostCategory } from '../../services/api/community'
import { getCategoryDisplayName } from '../../services/api/community'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: PostCreate) => void
}

const categories: PostCategory[] = ['general', 'deals', 'insights', 'qa', 'networking']

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('general')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setTitle('')
      setContent('')
      setCategory('general')
      setTags('')
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags: tags.trim() || undefined,
      status: 'published',
    })

    // Reset form
    setTitle('')
    setContent('')
    setCategory('general')
    setTags('')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h2>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title..."
                maxLength={255}
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="What's on your mind?"
                rows={6}
              />
              <div className="text-sm text-gray-500 mt-1">
                {content.length} characters
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="post-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryDisplayName(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="post-tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                id="post-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. M&A, finance, deals"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Create post"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
