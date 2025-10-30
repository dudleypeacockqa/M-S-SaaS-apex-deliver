/**
 * Tests for BlogPostPage
 * Following TDD RED → GREEN → REFACTOR methodology
 *
 * MARK-004 FR-1.3: BlogPostPage Tests (12 tests)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogPostPage } from './BlogPostPage';

// Mock fetch globally
const mockPost = {
  id: 1,
  title: 'Complete Guide to M&A Deal Flow Management',
  slug: 'complete-guide-manda-deal-flow',
  excerpt: 'Learn how to optimize your M&A deal flow process',
  content: '# Introduction\n\nThis is **markdown** content.\n\n## Section 1\n\nSome content here.',
  author: 'Dudley Peacock',
  category: 'M&A Strategy',
  primary_keyword: 'M&A deal flow',
  meta_description: 'Comprehensive guide to M&A deal flow management',
  read_time_minutes: 10,
  featured_image_url: 'https://example.com/image.png',
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-01-16T12:00:00Z',
};

const mockRelatedPosts = [
  {
    id: 2,
    title: 'Due Diligence Best Practices',
    slug: 'due-diligence-best-practices',
    excerpt: 'Essential checklist for M&A due diligence',
    content: 'Content...',
    author: 'Dudley Peacock',
    category: 'M&A Strategy',
    primary_keyword: 'due diligence',
    meta_description: 'Due diligence guide',
    read_time_minutes: 12,
    featured_image_url: 'https://example.com/image2.png',
  },
  {
    id: 3,
    title: 'Valuation Methods for M&A',
    slug: 'valuation-methods-manda',
    excerpt: 'Compare DCF, comparable, and precedent transaction methods',
    content: 'Content...',
    author: 'Dudley Peacock',
    category: 'M&A Strategy',
    primary_keyword: 'valuation',
    meta_description: 'Valuation methods explained',
    read_time_minutes: 15,
  },
];

const renderBlogPost = (slug: string = 'complete-guide-manda-deal-flow') => {
  // Set initial URL to match the blog post route
  window.history.pushState({}, 'Test page', `/blog/${slug}`);

  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('BlogPostPage', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  describe('Loading State', () => {
    it('should display loading spinner while fetching post', async () => {
      // Mock slow API response
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderBlogPost();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Post Content Rendering', () => {
    beforeEach(() => {
      // Mock successful API responses
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
        if (url.includes('/api/blog/complete-guide-manda-deal-flow')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockPost,
          });
        }
        if (url.includes('/api/blog?category=')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockRelatedPosts,
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    it('should render blog post title', async () => {
      renderBlogPost();

      await waitFor(() => {
        expect(screen.getByText('Complete Guide to M&A Deal Flow Management')).toBeInTheDocument();
      });
    });

    it('should display author name', async () => {
      renderBlogPost();

      await waitFor(() => {
        const authorElements = screen.getAllByText(/dudley peacock/i);
        expect(authorElements.length).toBeGreaterThan(0);
      });
    });

    it('should show reading time', async () => {
      renderBlogPost();

      await waitFor(() => {
        expect(screen.getByText(/10 min read/i)).toBeInTheDocument();
      });
    });

    it('should display category badge', async () => {
      renderBlogPost();

      await waitFor(() => {
        const categoryElements = screen.getAllByText(/m&a strategy/i);
        expect(categoryElements.length).toBeGreaterThan(0);
      });
    });

    it('should render featured image with alt text', async () => {
      renderBlogPost();

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        const featuredImage = images.find(img =>
          img.getAttribute('src') === 'https://example.com/image.png'
        );
        expect(featuredImage).toBeTruthy();
        expect(featuredImage?.getAttribute('alt')).toBe('Complete Guide to M&A Deal Flow Management');
      });
    });

    it('should render markdown content correctly', async () => {
      renderBlogPost();

      await waitFor(() => {
        // Check for markdown-rendered elements
        expect(screen.getByText(/introduction/i)).toBeInTheDocument();
        expect(screen.getByText(/section 1/i)).toBeInTheDocument();
        expect(screen.getByText(/this is/i)).toBeInTheDocument();
      });
    });
  });

  describe('Related Posts Section', () => {
    beforeEach(() => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
        if (url.includes('/api/blog/complete-guide-manda-deal-flow')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockPost,
          });
        }
        if (url.includes('/api/blog?category=')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockRelatedPosts,
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    it('should display related posts section with heading', async () => {
      renderBlogPost();

      await waitFor(() => {
        expect(screen.getByText(/related articles/i)).toBeInTheDocument();
      });
    });

    it('should show up to 3 related posts from same category', async () => {
      renderBlogPost();

      await waitFor(() => {
        expect(screen.getByText('Due Diligence Best Practices')).toBeInTheDocument();
        expect(screen.getByText('Valuation Methods for M&A')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
        if (url.includes('/api/blog/complete-guide-manda-deal-flow')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockPost,
          });
        }
        if (url.includes('/api/blog?category=')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockRelatedPosts,
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    it('should display breadcrumb navigation with "Back to Blog" link', async () => {
      renderBlogPost();

      await waitFor(() => {
        const blogLinks = screen.getAllByRole('link', { name: /blog/i });
        expect(blogLinks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when post not found', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: 'Not found' }),
        })
      );

      renderBlogPost('non-existent-post');

      await waitFor(() => {
        expect(screen.getByText(/post not found/i)).toBeInTheDocument();
      });
    });

    it('should show "Back to Blog" link when post not found', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        })
      );

      renderBlogPost('non-existent-post');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to blog/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink.getAttribute('href')).toBe('/blog');
      });
    });
  });

  describe('SEO & Structured Data', () => {
    beforeEach(() => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
        if (url.includes('/api/blog/complete-guide-manda-deal-flow')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockPost,
          });
        }
        if (url.includes('/api/blog?category=')) {
          return Promise.resolve({
            ok: true,
            json: async () => [],
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    it('should include Article structured data schema', async () => {
      renderBlogPost();

      await waitFor(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        const articleSchema = Array.from(scripts).find(script => {
          try {
            const json = JSON.parse(script.textContent || '{}');
            return json['@type'] === 'Article' || json['@type'] === 'BlogPosting';
          } catch {
            return false;
          }
        });
        expect(articleSchema).toBeTruthy();
      });
    });
  });
});
