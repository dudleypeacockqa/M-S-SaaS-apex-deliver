import { beforeEach, describe, expect, it, vi } from 'vitest'

import api from './api'
import {
  fetchBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  type BlogPostEditorPayload,
} from './blogService'

vi.mock('./api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
  }
})

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
}

const basePayload: BlogPostEditorPayload = {
  title: 'Test Post',
  slug: 'test-post',
  content: 'Full content',
  excerpt: 'Summary',
  author: 'QA Writer',
  tags: 'qa, testing',
  metaDescription: 'Meta description',
  status: 'draft',
}

describe('blogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches blog posts with params', async () => {
    const response = [{ id: 1, title: 'Post', slug: 'post-slug' }]
    mockedApi.get.mockResolvedValueOnce({ data: response })

    const result = await fetchBlogPosts({ category: 'Insights', search: 'qa', limit: 5 })

    expect(mockedApi.get).toHaveBeenCalledWith('/blog?category=Insights&search=qa&limit=5')
    expect(result).toEqual(response)
  })

  it('retrieves single blog post by slug', async () => {
    const post = { id: 1, title: 'Single', slug: 'single', secondary_keywords: [] }
    mockedApi.get.mockResolvedValueOnce({ data: post })

    const result = await getBlogPost('single')
    expect(mockedApi.get).toHaveBeenCalledWith('/blog/single')
    expect(result).toEqual(post)
  })

  it('creates blog post with normalized payload', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { id: 99 } })

    await createBlogPost({ ...basePayload, featuredImageUrl: 'https://cdn/img.png' })

    expect(mockedApi.post).toHaveBeenCalledWith('/blog', expect.objectContaining({
      title: 'Test Post',
      slug: 'test-post',
      secondary_keywords: ['qa', 'testing'],
      featured_image_url: 'https://cdn/img.png',
      published: false,
      published_at: null,
    }))
  })

  it('updates blog post by slug', async () => {
    mockedApi.put.mockResolvedValueOnce({ data: { id: 99 } })

    await updateBlogPost('existing-post', { ...basePayload, status: 'draft' })

    expect(mockedApi.put).toHaveBeenCalledWith('/blog/existing-post', expect.objectContaining({
      slug: 'test-post',
      secondary_keywords: ['qa', 'testing'],
    }))
  })

  it('publishes blog post and injects timestamp', async () => {
    const fixed = new Date('2025-11-20T00:00:00Z')
    vi.setSystemTime(fixed)
    mockedApi.put.mockResolvedValueOnce({ data: { id: 99 } })

    await publishBlogPost('existing-post', basePayload)

    expect(mockedApi.put).toHaveBeenCalledWith('/blog/existing-post', expect.objectContaining({
      published: true,
      published_at: fixed.toISOString(),
    }))

    vi.useRealTimers()
  })
})

