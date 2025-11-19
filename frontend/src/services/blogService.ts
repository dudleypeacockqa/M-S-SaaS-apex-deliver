import api from './api'

export interface BlogPostDetail {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  primary_keyword: string
  secondary_keywords: string[]
  meta_description: string
  featured_image_url?: string | null
  author: string
  read_time_minutes: number
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostSummary = BlogPostDetail

export interface FetchBlogPostsParams {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export type BlogPostStatus = 'draft' | 'published'

export interface BlogPostEditorPayload {
  title: string
  content: string
  excerpt?: string
  author?: string
  tags?: string
  slug?: string
  metaDescription?: string
  status: BlogPostStatus
  publishedAt?: string
  featuredImageUrl?: string | null
}

const DEFAULT_CATEGORY = 'Insights'
const DEFAULT_AUTHOR = 'Dudley Peacock'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const parseTags = (tags?: string): string[] => {
  if (!tags) return []
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

const buildRequestBody = (payload: BlogPostEditorPayload) => {
  const safeTitle = payload.title.trim()
  const safeSlug = payload.slug?.trim() || slugify(safeTitle)
  const safeContent = payload.content.trim()
  const excerpt = payload.excerpt?.trim() || safeContent.slice(0, 280)
  const metaDescription = (payload.metaDescription?.trim() || excerpt).slice(0, 160)
  const author = payload.author?.trim() || DEFAULT_AUTHOR
  const words = safeContent.length ? safeContent.split(/\s+/).filter(Boolean).length : 0
  const readTimeMinutes = Math.max(1, Math.ceil(words / 200))
  const tags = parseTags(payload.tags)
  const category = tags[0] || DEFAULT_CATEGORY
  const primaryKeyword = tags[0] || safeTitle
  const published = payload.status === 'published'

  return {
    title: safeTitle,
    slug: safeSlug,
    excerpt,
    content: safeContent,
    category,
    primary_keyword: primaryKeyword,
    secondary_keywords: tags,
    meta_description: metaDescription,
    featured_image_url: payload.featuredImageUrl ?? null,
    author,
    read_time_minutes: readTimeMinutes,
    published,
    published_at: published ? payload.publishedAt ?? new Date().toISOString() : null,
  }
}

export const fetchBlogPosts = async (params?: FetchBlogPostsParams): Promise<BlogPostSummary[]> => {
  const queryParams = new URLSearchParams()
  if (params?.category) queryParams.append('category', params.category)
  if (params?.search) queryParams.append('search', params.search)
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())

  const queryString = queryParams.toString()
  const endpoint = queryString ? `/blog?${queryString}` : '/blog'

  const response = await api.get<BlogPostSummary[]>(endpoint)
  return response.data
}

export const getBlogPost = async (slug: string): Promise<BlogPostDetail> => {
  const response = await api.get<BlogPostDetail>(`/blog/${encodeURIComponent(slug)}`)
  return response.data
}

export const createBlogPost = async (payload: BlogPostEditorPayload): Promise<BlogPostDetail> => {
  const response = await api.post<BlogPostDetail>('/blog', buildRequestBody(payload))
  return response.data
}

export const updateBlogPost = async (
  slug: string,
  payload: BlogPostEditorPayload,
): Promise<BlogPostDetail> => {
  const response = await api.put<BlogPostDetail>(`/blog/${encodeURIComponent(slug)}`, buildRequestBody(payload))
  return response.data
}

export const publishBlogPost = async (
  slug: string,
  payload: BlogPostEditorPayload,
): Promise<BlogPostDetail> => updateBlogPost(slug, payload)
