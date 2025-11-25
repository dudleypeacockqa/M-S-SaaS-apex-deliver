import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"

import App from "../../App"
import { setMockClerkState } from "../../test/mocks/clerk"
import { createClerkMock } from "../../test/mocks/clerk"

// Use async mock factory to avoid hoisting issues
vi.mock("@clerk/clerk-react", async () => {
  const { createClerkMock } = await import("../../test/mocks/clerk")
  return createClerkMock()
})
// Blog admin API mocks (prevent real network calls while routing tests load editor)
const mockBlogService = vi.hoisted(() => ({
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  publishBlogPost: vi.fn(),
  getBlogPost: vi.fn(),
}))

const buildMockBlogPost = (overrides: Partial<import('@/services/blogService').BlogPost> = {}) => ({
  id: 'blog-post-1',
  title: 'Existing Test Post',
  slug: 'existing-test-post',
  excerpt: 'Existing excerpt',
  content: 'Existing content',
  author: 'Editor',
  category: 'Insights',
  read_time_minutes: 8,
  published_at: '2025-11-17T12:00:00Z',
  featured_image_url: null,
  primary_keyword: 'Existing',
  secondary_keywords: ['seo', 'bmad'],
  meta_description: 'Existing meta description',
  published: false,
  created_at: '2025-11-17T12:00:00Z',
  updated_at: '2025-11-17T12:00:00Z',
  ...overrides,
})

vi.mock('@/services/blogService', async () => {
  const actual = await vi.importActual<typeof import('@/services/blogService')>('@/services/blogService')
  return {
    ...actual,
    ...mockBlogService,
  }
})

vi.mock("../../pages/marketing/financeflo/EnhancedIndex", () => ({
  default: () => (
    <div>
      <h1>From deal flow to cash flow</h1>
      <a href="/sign-in">Sign In</a>
    </div>
  ),
}))

vi.mock("../../pages/marketing/EnhancedLandingPage", () => ({
  EnhancedLandingPage: () => (
    <div>
      <h1>ERP Implementation + CapLiquify & ApexDeliver in One Partner Stack</h1>
      <a href="/sign-in">Sign In</a>
    </div>
  ),
}))


describe("Integration: routing", () => {
  beforeEach(() => {
    // Reset state before each test
    setMockClerkState({
      isSignedIn: false,
      isLoaded: true,
      user: null,
      organization: null,
    })
    window.history.replaceState({}, "Test", "/")

    Object.values(mockBlogService).forEach((fn) => fn.mockReset())
    mockBlogService.createBlogPost.mockResolvedValue({ id: 'blog-post-1' })
    mockBlogService.updateBlogPost.mockResolvedValue({ id: 'blog-post-1' })
    mockBlogService.publishBlogPost.mockResolvedValue({ id: 'blog-post-1' })
    mockBlogService.getBlogPost.mockResolvedValue(buildMockBlogPost())
  })

  it("renders the landing page for visitors", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /ERP Implementation \+ CapLiquify & ApexDeliver in One Partner Stack/i, level: 1 }, { timeout: 20000 })
    ).toBeInTheDocument()
    // Marketing nav uses regular links, not Clerk's SignInButton
    expect(screen.getAllByRole("link", { name: /sign in/i }).length).toBeGreaterThan(0)
  }, 20000)

  it("directs visitors to the sign-in page when accessing the dashboard", async () => {
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    // When not signed in, ProtectedRoute shows a loading state initially,
    // then redirects to sign-in page
    expect(
      await screen.findByText(/sign in to apexdeliver/i, undefined, { timeout: 20000 })
    ).toBeInTheDocument()
  }, 20000)

  it("displays the dashboard when the user is authenticated", async () => {
    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: "Taylor", id: "user-1" },
      organization: { name: "Test Org", id: "org-1" },
    })
    window.history.replaceState({}, "Test", "/dashboard")

    render(<App />)

    // When authenticated, ensure the dashboard shell loads instead of redirecting
    expect(
      await screen.findByRole("heading", { name: /workflow shortcuts/i }, { timeout: 20000 })
    ).toBeInTheDocument()

    // Verify we're not seeing the sign-in page
    expect(screen.queryByText(/sign in to apexdeliver/i)).not.toBeInTheDocument()
  }, 20000)

  it("renders the rich sign-in page without redirecting", async () => {
    window.history.replaceState({}, "Test", "/sign-in")

    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /sign in to apexdeliver/i }, { timeout: 20000 })
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe("/sign-in")
  }, 20000)

  it("allows authenticated admins to reach /admin/blog/new", async () => {
    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: 'Taylor', id: 'user-1', publicMetadata: { role: 'admin' } },
      organization: { name: 'Test Org', id: 'org-1' },
    })
    window.history.replaceState({}, 'Test', '/admin/blog/new')

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /create new blog post/i }, { timeout: 20000 })
    ).toBeInTheDocument()
    expect(await screen.findByLabelText(/title/i, undefined, { timeout: 20000 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
  }, 20000)

  it("preloads existing post data on /admin/blog/:id/edit", async () => {
    setMockClerkState({
      isSignedIn: true,
      isLoaded: true,
      user: { firstName: 'Taylor', id: 'user-1', publicMetadata: { role: 'admin' } },
      organization: { name: 'Test Org', id: 'org-1' },
    })
    mockBlogService.getBlogPost.mockResolvedValueOnce(
      buildMockBlogPost({
        id: 'existing-post',
        title: 'Existing Title',
        slug: 'existing-title',
        content: 'Existing content block',
        excerpt: 'Existing excerpt',
        secondary_keywords: ['existing'],
        meta_description: 'Existing meta',
        published_at: '2025-11-17T12:00:00Z',
        updated_at: '2025-11-18T12:00:00Z',
      }),
    )
    window.history.replaceState({}, 'Test', '/admin/blog/existing-post/edit')

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /edit blog post/i }, { timeout: 20000 })
    ).toBeInTheDocument()
    const titleInput = await screen.findByLabelText(/title/i, undefined, { timeout: 20000 })
    expect(titleInput).toHaveValue('Existing Title')
  }, 20000)

})
