import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PostCard } from '../../components/community/PostCard'
import { CreatePostModal } from '../../components/community/CreatePostModal'
import { HelpTooltip } from '../../components/common/HelpTooltip'
import {
  listPosts,
  createPost,
  deletePost,
  addReaction,
  removeReaction,
  type PostCreate,
  type ReactionType,
  type PostCategory,
  type PostStatus,
} from '../../services/api/community'

export const CommunityFeed: React.FC = () => {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | ''>('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | ''>('')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch posts with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['community-posts', currentPage, categoryFilter, statusFilter, searchQuery],
    queryFn: () =>
      listPosts({
        page: currentPage,
        per_page: 20,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      }),
  })

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
      setIsCreateModalOpen(false)
    },
  })

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })

  // Reaction mutation
  const reactionMutation = useMutation({
    mutationFn: ({ reactionType, postId }: { reactionType: ReactionType; postId: string }) =>
      addReaction({ target_type: 'post', target_id: postId, reaction_type: reactionType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })

  const handleCreatePost = (post: PostCreate) => {
    createPostMutation.mutate(post)
  }

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId)
    }
  }

  const handleReaction = (reactionType: ReactionType, postId: string) => {
    reactionMutation.mutate({ reactionType, postId })
  }

  const handleComment = (postId: string) => {
    // Navigate to post detail page (to be implemented)
    window.location.href = `/community/posts/${postId}`
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading posts. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            data-testid="create-post-button"
          >
            Create Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="search-input"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PostCategory | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="category-filter"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="deals">Deals</option>
            <option value="insights">Insights</option>
            <option value="qa">Q&A</option>
            <option value="networking">Networking</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="status-filter"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <HelpTooltip
            label="Community help"
            content={
              <div>
                <p className="font-semibold text-slate-800">Moderation checklist</p>
                <ul className="mt-1 list-disc pl-4 text-slate-600">
                  <li>Review new posts daily and remove spam.</li>
                  <li>Log key actions per the community guide (`docs/bmad/community-moderation-guide.md`).</li>
                  <li>Use reactions to highlight helpful insights for the team.</li>
                </ul>
              </div>
            }
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      )}

      {/* Posts List */}
      {!isLoading && data && (
        <>
          {data.posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts found. Be the first to create one!</p>
            </div>
          ) : (
            <div data-testid="posts-list">
              {data.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={undefined} // Should be passed from auth context
                  onReaction={handleReaction}
                  onComment={handleComment}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="prev-page-button"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {data.total_pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={currentPage === data.total_pages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="next-page-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  )
}
