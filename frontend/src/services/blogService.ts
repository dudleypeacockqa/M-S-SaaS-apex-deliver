import api from './api'

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  read_time_minutes: number
  published_at: string
  featured_image_url?: string | null
}

export interface FetchBlogPostsParams {
  category?: string
  search?: string
  limit?: number
  offset?: number
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
