import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { PostCard } from '../../components/community/PostCard'
import {
  listPosts,
  getFollowStats,
  followUser,
  unfollowUser,
  type ReactionType,
} from '../../services/api/community'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const queryClient = useQueryClient()

  // Fetch user's posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', userId],
    queryFn: () =>
      listPosts({
        author_user_id: userId,
        page: 1,
        per_page: 20,
      }),
    enabled: !!userId,
  })

  // Fetch follow stats
  const { data: followStats, isLoading: statsLoading } = useQuery({
    queryKey: ['follow-stats', userId],
    queryFn: () => getFollowStats(userId!),
    enabled: !!userId,
  })

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-stats', userId] })
    },
  })

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-stats', userId] })
    },
  })

  const handleFollowToggle = () => {
    if (!userId) return

    if (followStats?.is_following) {
      unfollowMutation.mutate(userId)
    } else {
      followMutation.mutate({ following_user_id: userId })
    }
  }

  const handleReaction = (reactionType: ReactionType, postId: string) => {
    // Implementation
  }

  const isLoading = postsLoading || statsLoading

  return (
    <WorkspaceContainer maxWidth="4xl" className="p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="user-profile-title">
              User Profile
            </h1>
            {followStats && (
              <div className="flex gap-6 text-gray-600">
                <div>
                  <span className="font-semibold" data-testid="followers-count">
                    {followStats.followers_count}
                  </span>{' '}
                  Followers
                </div>
                <div>
                  <span className="font-semibold" data-testid="following-count">
                    {followStats.following_count}
                  </span>{' '}
                  Following
                </div>
              </div>
            )}
          </div>
          {userId && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded-lg transition-colors ${
                followStats?.is_following
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              data-testid="follow-button"
            >
              {followStats?.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Posts</h2>
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
        {!isLoading && postsData && (
          <>
            {postsData.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No posts yet.</p>
              </div>
            ) : (
              <div data-testid="user-posts-list">
                {postsData.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onReaction={handleReaction}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </WorkspaceContainer>
  )
}
