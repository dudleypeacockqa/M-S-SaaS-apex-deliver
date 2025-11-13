/**
 * Tests for Blog listing page
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Blog from './Blog';
import { BrowserRouter} from 'react-router-dom';

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
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockBlogPosts,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Page Rendering', () => {
    it('should render blog heading', async () => {
      renderWithRouter(<Blog />);
      await waitFor(() => {
        expect(screen.getByText(/insights.*strategies/i)).toBeInTheDocument();
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

    it('should show search bar', async () => {
      renderWithRouter(<Blog />);
      const searchInput = await screen.findByPlaceholderText(/search.*articles/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should request posts for selected category', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockBlogPosts,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockBlogPosts[1]],
        });

      renderWithRouter(<Blog />);

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      });

      const fpACategory = await screen.findByRole('button', { name: 'FP&A' });
      fireEvent.click(fpACategory);

      await waitFor(() => {
        expect(fetchMock.mock.calls.length).toBe(2);
      });

      const secondCallUrl = fetchMock.mock.calls[1][0];
      expect(secondCallUrl).toContain('category=FP%26A');
      expect(screen.getByText('FP&A Best Practices')).toBeInTheDocument();
    });

    it('should include search term in request query', async () => {
      renderWithRouter(<Blog />);

      const searchInput = await screen.findByPlaceholderText(/search.*articles/i);
      fireEvent.change(searchInput, { target: { value: 'Best' } });

      await waitFor(() => {
        expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
      });

      const latestCallUrl = fetchMock.mock.calls.at(-1)[0];
      expect(latestCallUrl).toContain('search=Best');
    });

    it('should show loading indicator while fetching', async () => {
      let resolveFetch: (value: any) => void;
      fetchMock.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
      );

      renderWithRouter(<Blog />);

      expect(screen.getByText(/loading posts/i)).toBeInTheDocument();

      resolveFetch!({
        ok: true,
        json: async () => mockBlogPosts,
      });

      await waitFor(() => {
        expect(screen.getByText('Test Blog Post 1')).toBeInTheDocument();
      });
    });

    it('should render error banner when fetch fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      renderWithRouter(<Blog />);

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(/error loading posts/i);
      expect(alert).toHaveTextContent('Internal Server Error');
    });

    it('should clear filters and search when clicking Clear Filters', async () => {
      renderWithRouter(<Blog />);

      const searchInput = await screen.findByPlaceholderText(/search.*articles/i);
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'FP&A' } });
      });

      const fpACategory = await screen.findByRole('button', { name: 'FP&A' });
      await act(async () => {
        fireEvent.click(fpACategory);
      });

      await waitFor(() => {
        expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
      });

      await act(async () => {
        screen.getByText(/clear filters/i).click();
      });

      await waitFor(() => {
        expect((searchInput as HTMLInputElement).value).toBe('');
        expect(fpACategory).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });
});
