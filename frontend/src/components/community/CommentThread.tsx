import React, { useState } from 'react'
import type { Comment, ReactionType } from '../../services/api/community'
import { formatPostDate, getReactionEmoji } from '../../services/api/community'

interface CommentThreadProps {
  comments: Comment[]
  postId: string
  currentUserId?: string
  onAddComment?: (content: string, parentCommentId: string | null) => void
  onDeleteComment?: (commentId: string) => void
  onReaction?: (reactionType: ReactionType, commentId: string) => void
}

interface CommentItemProps {
  comment: Comment
  currentUserId?: string
  onReply: (commentId: string) => void
  onDelete?: (commentId: string) => void
  onReaction?: (reactionType: ReactionType, commentId: string) => void
  depth: number
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  onDelete,
  onReaction,
  depth,
}) => {
  const isOwnComment = currentUserId && currentUserId === comment.author_user_id
  const reactionTypes: ReactionType[] = ['like', 'love', 'insightful', 'celebrate']

  return (
    <div
      className={`${depth > 0 ? 'ml-8' : ''} mb-4`}
      data-testid={`comment-${comment.id}`}
    >
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <span
              className="text-sm text-gray-500"
              data-testid={`comment-timestamp-${comment.id}`}
            >
              {formatPostDate(comment.created_at)}
            </span>
          </div>
          {isOwnComment && onDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
              aria-label="Delete comment"
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-3">{comment.content}</p>

        <div className="flex items-center gap-4">
          {/* Reaction Buttons */}
          {reactionTypes.map((reactionType) => {
            const count = comment.reaction_counts?.[reactionType] || 0
            return (
              <button
                key={reactionType}
                onClick={() => onReaction?.(reactionType, comment.id)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                aria-label={`${reactionType} reaction`}
              >
                <span>{getReactionEmoji(reactionType)}</span>
                {count > 0 && <span className="text-xs font-medium">{count}</span>}
              </button>
            )
          })}

          {/* Reply Button */}
          <button
            onClick={() => onReply(comment.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-auto"
            aria-label="Reply to comment"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onReaction={onReaction}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentFormProps {
  onSubmit: (content: string) => void
  placeholder: string
  autoFocus?: boolean
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, placeholder, autoFocus }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={3}
        autoFocus={autoFocus}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Submit comment"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  postId,
  currentUserId,
  onAddComment,
  onDeleteComment,
  onReaction,
}) => {
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)

  const handleAddTopLevelComment = (content: string) => {
    onAddComment?.(content, null)
  }

  const handleAddReply = (content: string) => {
    if (replyToCommentId) {
      onAddComment?.(content, replyToCommentId)
      setReplyToCommentId(null)
    }
  }

  const handleReply = (commentId: string) => {
    setReplyToCommentId(commentId)
  }

  return (
    <div className="comment-thread">
      {/* Add Comment Form */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Comments</h4>
        <CommentForm onSubmit={handleAddTopLevelComment} placeholder="Add a comment..." />
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                onReply={handleReply}
                onDelete={onDeleteComment}
                onReaction={onReaction}
                depth={0}
              />

              {/* Reply Form */}
              {replyToCommentId === comment.id && (
                <div className="ml-8 mb-4">
                  <CommentForm
                    onSubmit={handleAddReply}
                    placeholder="Write a reply..."
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
