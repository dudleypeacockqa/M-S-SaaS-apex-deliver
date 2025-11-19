import api from './api'

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  read_time_minutes: number
  published_at: string | null
  featured_image_url?: string | null
}

export interface BlogPost extends BlogPostSummary {
  content: string
  primary_keyword: string
  secondary_keywords: string[]
  meta_description: string
  published: boolean
  featured_image_url?: string | null
  created_at: string
  updated_at: string
}

export interface FetchBlogPostsParams {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface BlogPostEditorPayload {
  title: string
  content: string
  excerpt: string
  author: string
  tags?: string
  slug: string
  metaDescription: string
  status: 'draft' | 'published'
  publishedAt?: string
  featuredImageUrl?: string | null
  category?: string
  primaryKeyword?: string
  readTimeMinutes?: number
}

const DEFAULT_CATEGORY = 'Insights'
const DEFAULT_AUTHOR = 'ApexDeliver Editorial'
const DEFAULT_READ_TIME = 8

const buildQuery = (params?: FetchBlogPostsParams): string => {
  if (!params) return ''
  const queryParams = new URLSearchParams()
  if (params.category) queryParams.append('category', params.category)
  if (params.search) queryParams.append('search', params.search)
  if (typeof params.limit === 'number') queryParams.append('limit', params.limit.toString())
  if (typeof params.offset === 'number') queryParams.append('offset', params.offset.toString())
  return queryParams.toString()
}

const parseTags = (tags?: string): string[] => {
  if (!tags) return []
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

const toApiPayload = (payload: BlogPostEditorPayload) => {
  const secondaryKeywords = parseTags(payload.tags)
  const isPublished = payload.status === 'published'
  const publishedAt = isPublished ? payload.publishedAt ?? new Date().toISOString() : null

  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category ?? DEFAULT_CATEGORY,
    primary_keyword: payload.primaryKeyword ?? secondaryKeywords[0] ?? payload.title,
    secondary_keywords: secondaryKeywords,
    meta_description: payload.metaDescription,
    featured_image_url: payload.featuredImageUrl ?? null,
    author: payload.author || DEFAULT_AUTHOR,
    read_time_minutes: payload.readTimeMinutes ?? DEFAULT_READ_TIME,
    published: isPublished,
    published_at: publishedAt,
  }
}

export const fetchBlogPosts = async (params?: FetchBlogPostsParams): Promise<BlogPostSummary[]> => {
  const queryString = buildQuery(params)
  const endpoint = queryString ? `/blog?${queryString}` : '/blog'
  const response = await api.get<BlogPostSummary[]>(endpoint)
  return response.data
}

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const response = await api.get<BlogPost>(`/blog/${slug}`)
  return response.data
}

export const createBlogPost = async (payload: BlogPostEditorPayload): Promise<BlogPost> => {
  const response = await api.post<BlogPost>('/blog', toApiPayload(payload))
  return response.data
}

export const updateBlogPost = async (
  slug: string,
  payload: BlogPostEditorPayload,
): Promise<BlogPost> => {
  const response = await api.put<BlogPost>(`/blog/${slug}`, toApiPayload(payload))
  return response.data
}

export const publishBlogPost = async (
  slug: string,
  payload: BlogPostEditorPayload,
): Promise<BlogPost> => {
  return updateBlogPost(slug, { ...payload, status: 'published' })
}

export type BlogPostEditorResponse = BlogPost

