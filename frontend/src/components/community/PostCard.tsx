import React, { useState } from 'react'
import type { Post, ReactionType } from '../../services/api/community'
import { formatPostDate, getCategoryDisplayName, getReactionEmoji } from '../../services/api/community'

interface PostCardProps {
  post: Post
  currentUserId?: string
  onReaction?: (reactionType: ReactionType, postId: string) => void
  onComment?: (postId: string) => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
}

const MAX_CONTENT_LENGTH = 300

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onReaction,
  onComment,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const isOwnPost = currentUserId && currentUserId === post.author_user_id
  const shouldTruncate = post.content.length > MAX_CONTENT_LENGTH
  const displayContent = shouldTruncate && !isExpanded
    ? post.content.slice(0, MAX_CONTENT_LENGTH) + '...'
    : post.content

  const reactionTypes: ReactionType[] = ['like', 'love', 'insightful', 'celebrate']

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getCategoryDisplayName(post.category)}
            </span>
            <span data-testid="post-timestamp">{formatPostDate(post.created_at)}</span>
            <span>{post.view_count} views</span>
          </div>
        </div>
        {isOwnPost && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(post.id)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                aria-label="Edit post"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(post.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                aria-label="Delete post"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap" data-testid="post-content">
          {displayContent}
        </p>
        {shouldTruncate && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
            aria-label="Read more"
          >
            Read more
          </button>
        )}
      </div>

      {/* Reactions and Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        {/* Reaction Buttons */}
        {reactionTypes.map((reactionType) => {
          const count = post.reaction_counts?.[reactionType] || 0
          return (
            <button
              key={reactionType}
              onClick={() => onReaction?.(reactionType, post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label={`${reactionType} reaction`}
            >
              <span className="text-lg">{getReactionEmoji(reactionType)}</span>
              {count > 0 && <span className="text-sm font-medium">{count}</span>}
            </button>
          )
        })}

        {/* Comment Button */}
        {onComment && (
          <button
            onClick={() => onComment(post.id)}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors ml-auto"
            aria-label="Comment on post"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">
              {post.comment_count || 0}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
