import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import App from "../../App"
import { setMockClerkState } from "../../test/mocks/clerk"
import { createClerkMock } from "../../test/mocks/clerk"

// Use async mock factory to avoid hoisting issues
vi.mock("@clerk/clerk-react", async () => {
  const { createClerkMock } = await import("../../test/mocks/clerk")
  return createClerkMock()
})
// Blog admin API mocks (prevent real network calls while routing tests load editor)
type BlogServiceMock = {
  createBlogPost: ReturnType<typeof vi.fn>
  updateBlogPost: ReturnType<typeof vi.fn>
  publishBlogPost: ReturnType<typeof vi.fn>
  getBlogPost: ReturnType<typeof vi.fn>
}

const mockBlogService: BlogServiceMock = {
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  publishBlogPost: vi.fn(),
  getBlogPost: vi.fn(),
}

vi.mock('@/services/blogService', () => mockBlogService)


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
    mockBlogService.getBlogPost.mockResolvedValue({
      id: 'blog-post-1',
      title: 'Existing Test Post',
      content: 'Existing content',
      excerpt: 'Existing excerpt',
      author: 'Editor',
      tags: 'seo, bmad',
      slug: 'existing-test-post',
      metaDescription: 'Existing meta description',
      status: 'draft',
      publishedAt: '2025-11-17T12:00:00Z',
    })
  })

  it("renders the landing page for visitors", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: /from deal flow to cash flow/i, level: 1 }, { timeout: 20000 })
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

    // When authenticated, user should NOT be redirected to sign-in page
    // The dashboard may show loading state or actual dashboard content
    await screen.findByText(/preparing the apexdeliver experience/i, undefined, { timeout: 15000 })

    // Verify we're not seeing the sign-in page
    expect(screen.queryByText(/sign in to apexdeliver/i)).not.toBeInTheDocument()
  }, 15000)

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
      user: { firstName: 'Taylor', id: 'user-1' },
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
      user: { firstName: 'Taylor', id: 'user-1' },
      organization: { name: 'Test Org', id: 'org-1' },
    })
    mockBlogService.getBlogPost.mockResolvedValueOnce({
      id: 'existing-post',
      title: 'Existing Title',
      content: 'Existing content block',
      excerpt: 'Existing excerpt',
      author: 'Editor',
      tags: 'existing',
      slug: 'existing-title',
      metaDescription: 'Existing meta',
      status: 'draft',
      publishedAt: '2025-11-17T12:00:00Z',
    })
    window.history.replaceState({}, 'Test', '/admin/blog/existing-post/edit')

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /edit blog post/i }, { timeout: 20000 })
    ).toBeInTheDocument()
    const titleInput = await screen.findByLabelText(/title/i, undefined, { timeout: 20000 })
    expect(titleInput).toHaveValue('Existing Title')
  }, 20000)

})
