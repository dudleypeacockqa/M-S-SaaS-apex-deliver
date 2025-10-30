/**
 * Tests for Blog listing page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Blog from './Blog';
import { BrowserRouter} from 'react-router-dom';

// Mock fetch
global.fetch = vi.fn();

const mockBlogPosts = [
  {
    id: 1,
    title: 'Test Blog Post 1',
    excerpt: 'This is a test excerpt',
    category: 'M&A Strategy',
    slug: 'test-blog-post-1',
    featured_image_url: '/test-image.jpg',
    read_time_minutes: 5,
    published_at: '2025-01-15',
  },
  {
    id: 2,
    title: 'FP&A Best Practices',
    excerpt: 'Learn about FP&A',
    category: 'FP&A',
    slug: 'fpa-best-practices',
    featured_image_url: null,
    read_time_minutes: 10,
    published_at: '2025-01-20',
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Blog Listing Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ posts: mockBlogPosts, total: 2 }),
    });
  });

  describe('Page Rendering', () => {
    it('should render blog heading', async () => {
      renderWithRouter(<Blog />);
      await waitFor(() => {
        expect(screen.getByText(/insights.*strategies.*stories/i)).toBeInTheDocument();
      });
    });

    it('should fetch and render blog posts', async () => {
      renderWithRouter(<Blog />);
      await waitFor(() => {
        expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      });
    });

    it('should render blog post categories', async () => {
      renderWithRouter(<Blog />);
      await waitFor(() => {
        expect(screen.getByText('M&A Strategy')).toBeInTheDocument();
        expect(screen.getByText('FP&A')).toBeInTheDocument();
      });
    });

    it('should render read time for posts', async () => {
      renderWithRouter(<Blog />);
      await waitFor(() => {
        expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
      });
    });

    it('should show search bar', () => {
      renderWithRouter(<Blog />);
      const searchInput = screen.getByPlaceholderText(/search.*articles/i);
      expect(searchInput).toBeInTheDocument();
    });
  });
});
