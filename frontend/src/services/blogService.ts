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

export const fetchBlogPosts = async (): Promise<BlogPostSummary[]> => {
  const response = await api.get<BlogPostSummary[]>('/blog')
  return response.data
}
