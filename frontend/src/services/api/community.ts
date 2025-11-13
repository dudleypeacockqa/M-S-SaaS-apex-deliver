/**
 * Community Platform API Client
 *
 * Provides functions for calling community endpoints including posts,
 * comments, reactions, follows, and moderation features.
 * All endpoints require authentication and are organization-scoped.
 */

import { apiClient } from './client'

/**
 * Enums
 */
export type PostStatus = 'draft' | 'published' | 'archived' | 'flagged'
export type PostCategory = 'general' | 'deals' | 'insights' | 'qa' | 'networking'
export type ReactionType = 'like' | 'love' | 'insightful' | 'celebrate'
export type TargetType = 'post' | 'comment'
export type ModerationActionType = 'approve' | 'reject' | 'flag' | 'delete' | 'unflag'

/**
 * Post Interfaces
 */
export interface Post {
  id: string
  organization_id: string
  author_user_id: string
  title: string
  content: string
  category: PostCategory
  tags: string | null
  status: PostStatus
  view_count: number
  created_at: string
  updated_at: string
  comment_count?: number
  reaction_counts?: Record<ReactionType, number>
}

export interface PostCreate {
  title: string
  content: string
  category?: PostCategory
  tags?: string
  status?: PostStatus
}

export interface PostUpdate {
  title?: string
  content?: string
  category?: PostCategory
  tags?: string
  status?: PostStatus
}

export interface PostListParams {
  page?: number
  per_page?: number
  category?: PostCategory
  status?: PostStatus
  author_user_id?: string
  search?: string
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/**
 * Comment Interfaces
 */
export interface Comment {
  id: string
  post_id: string
  author_user_id: string
  content: string
  parent_comment_id: string | null
  created_at: string
  updated_at: string
  reaction_counts?: Record<ReactionType, number>
  replies?: Comment[]
}

export interface CommentCreate {
  content: string
  parent_comment_id?: string | null
}

export interface CommentUpdate {
  content: string
}

/**
 * Reaction Interfaces
 */
export interface Reaction {
  id: string
  target_type: TargetType
  target_id: string
  user_id: string
  reaction_type: ReactionType
  created_at: string
}

export interface ReactionCreate {
  target_type: TargetType
  target_id: string
  reaction_type: ReactionType
}

export interface ReactionSummary {
  reaction_type: ReactionType
  count: number
  user_reacted: boolean
}

/**
 * Follow Interfaces
 */
export interface Follow {
  id: string
  follower_user_id: string
  following_user_id: string
  organization_id: string
  created_at: string
}

export interface FollowCreate {
  following_user_id: string
}

export interface FollowStats {
  user_id: string
  followers_count: number
  following_count: number
  is_following?: boolean
}

/**
 * Moderation Interfaces
 */
export interface ModerationAction {
  id: string
  target_type: TargetType
  target_id: string
  action_type: ModerationActionType
  moderator_user_id: string
  reason: string | null
  created_at: string
}

export interface ModerationActionCreate {
  target_type: TargetType
  target_id: string
  action_type: ModerationActionType
  reason?: string
}

export interface FlaggedContent {
  target_type: TargetType
  target_id: string
  content_preview: string
  author_user_id: string
  flag_count: number
  last_flagged_at: string
}

/**
 * Analytics Interfaces
 */
export interface CommunityAnalytics {
  total_posts: number
  total_comments: number
  total_reactions: number
  total_follows: number
  active_users_count: number
  top_categories: Array<{ category: string; count: number }>
  recent_activity: Array<{ type: string; timestamp: string; details: any }>
}

export interface UserActivity {
  user_id: string
  posts_count: number
  comments_count: number
  reactions_given: number
  reactions_received: number
  followers_count: number
  following_count: number
}

// ============================================================================
// Post API Functions
// ============================================================================

/**
 * Create a new post
 */
export async function createPost(post: PostCreate): Promise<Post> {
  return apiClient.post<Post>('/api/community/posts', post)
}

/**
 * List posts with filters and pagination
 */
export async function listPosts(params: PostListParams = {}): Promise<PostListResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.append('page', params.page.toString())
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.category) searchParams.append('category', params.category)
  if (params.status) searchParams.append('status', params.status)
  if (params.author_user_id) searchParams.append('author_user_id', params.author_user_id)
  if (params.search) searchParams.append('search', params.search)

  return apiClient.get<PostListResponse>(`/api/community/posts?${searchParams}`)
}

/**
 * Get a single post by ID
 */
export async function getPost(postId: string): Promise<Post> {
  return apiClient.get<Post>(`/api/community/posts/${postId}`)
}

/**
 * Update a post
 */
export async function updatePost(postId: string, updates: PostUpdate): Promise<Post> {
  return apiClient.put<Post>(`/api/community/posts/${postId}`, updates)
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  return apiClient.delete<void>(`/api/community/posts/${postId}`)
}

// ============================================================================
// Comment API Functions
// ============================================================================

/**
 * Create a comment on a post
 */
export async function createComment(postId: string, comment: CommentCreate): Promise<Comment> {
  return apiClient.post<Comment>(`/api/community/posts/${postId}/comments`, comment)
}

/**
 * Get all comments for a post
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  return apiClient.get<Comment[]>(`/api/community/posts/${postId}/comments`)
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  return apiClient.delete<void>(`/api/community/comments/${commentId}`)
}

// ============================================================================
// Reaction API Functions
// ============================================================================

/**
 * Add a reaction to a post or comment
 */
export async function addReaction(reaction: ReactionCreate): Promise<Reaction> {
  return apiClient.post<Reaction>('/api/community/reactions', reaction)
}

/**
 * Remove a reaction from a post or comment
 */
export async function removeReaction(
  targetType: TargetType,
  targetId: string,
  reactionType: ReactionType
): Promise<void> {
  return apiClient.delete<void>(`/api/community/reactions/${targetType}/${targetId}/${reactionType}`)
}

/**
 * Get reaction counts for a post or comment
 */
export async function getReactions(targetType: TargetType, targetId: string): Promise<Record<ReactionType, number>> {
  return apiClient.get<Record<ReactionType, number>>(`/api/community/reactions/${targetType}/${targetId}`)
}

// ============================================================================
// Follow API Functions
// ============================================================================

/**
 * Follow a user
 */
export async function followUser(follow: FollowCreate): Promise<Follow> {
  return apiClient.post<Follow>('/api/community/follow', follow)
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userId: string): Promise<void> {
  return apiClient.delete<void>(`/api/community/follow/${userId}`)
}

/**
 * Get follow statistics for a user
 */
export async function getFollowStats(userId: string): Promise<FollowStats> {
  return apiClient.get<FollowStats>(`/api/community/follow/stats/${userId}`)
}

/**
 * Get list of followers for a user
 */
export async function getFollowers(userId: string): Promise<Follow[]> {
  return apiClient.get<Follow[]>(`/api/community/follow/followers/${userId}`)
}

/**
 * Get list of users a user is following
 */
export async function getFollowing(userId: string): Promise<Follow[]> {
  return apiClient.get<Follow[]>(`/api/community/follow/following/${userId}`)
}

// ============================================================================
// Moderation API Functions
// ============================================================================

/**
 * Perform a moderation action
 */
export async function moderateContent(moderation: ModerationActionCreate): Promise<ModerationAction> {
  return apiClient.post<ModerationAction>('/api/community/moderation/actions', moderation)
}

/**
 * Get list of flagged content
 */
export async function getFlaggedContent(): Promise<FlaggedContent[]> {
  return apiClient.get<FlaggedContent[]>('/api/community/moderation/flagged')
}

// ============================================================================
// Analytics API Functions
// ============================================================================

/**
 * Get community analytics
 */
export async function getCommunityAnalytics(): Promise<CommunityAnalytics> {
  return apiClient.get<CommunityAnalytics>('/api/community/analytics')
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get display name for post category
 */
export function getCategoryDisplayName(category: PostCategory): string {
  const categoryNames: Record<PostCategory, string> = {
    general: 'General',
    deals: 'Deals',
    insights: 'Insights',
    qa: 'Q&A',
    networking: 'Networking',
  }
  return categoryNames[category] || category
}

/**
 * Get display name for reaction type
 */
export function getReactionDisplayName(reactionType: ReactionType): string {
  const reactionNames: Record<ReactionType, string> = {
    like: 'Like',
    love: 'Love',
    insightful: 'Insightful',
    celebrate: 'Celebrate',
  }
  return reactionNames[reactionType] || reactionType
}

/**
 * Get emoji for reaction type
 */
export function getReactionEmoji(reactionType: ReactionType): string {
  const reactionEmojis: Record<ReactionType, string> = {
    like: '👍',
    love: '❤️',
    insightful: '💡',
    celebrate: '🎉',
  }
  return reactionEmojis[reactionType] || '👍'
}

/**
 * Format post date for display
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
