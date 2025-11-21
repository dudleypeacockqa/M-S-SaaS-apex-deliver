/**
 * BlogAdminEditor Component Tests (TDD - RED Phase)
 * 
 * Tests for blog admin editor with draft/publish workflow
 * Following BMAD methodology: RED → GREEN → REFACTOR
 * 
 * Story: F-010 Content Creation & Lead Gen (20% gap completion)
 * Created: 2025-11-17
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogAdminEditor from './BlogAdminEditor';
import * as blogService from '@/services/blogService';

// Mock blog API service
vi.mock('@/services/blogService', () => ({
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  publishBlogPost: vi.fn(),
  getBlogPost: vi.fn(),
}));

const renderWithProviders = (component: React.ReactElement, route = '/admin/blog/new') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/admin/blog/new" element={component} />
          <Route path="/admin/blog/:id/edit" element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('BlogAdminEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AC-10.1: Editor UI and Rich Text Editing', () => {
    it('renders editor with title, content, and metadata fields', () => {
      renderWithProviders(<BlogAdminEditor />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });

    it('supports rich text formatting (bold, italic, links)', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      const contentEditor = screen.getByLabelText(/content/i);
      await user.click(contentEditor);
      await user.type(contentEditor, 'Test content');

      // Check for formatting toolbar
      expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /link/i })).toBeInTheDocument();
    });
  });

  describe('AC-10.2: Draft/Publish Workflow', () => {
    it('saves post as draft by default', async () => {
      const user = userEvent.setup();
      vi.mocked(blogService.createBlogPost).mockResolvedValue({ id: 'post-1' } as any);
      
      renderWithProviders(<BlogAdminEditor />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/content/i), 'Test content');
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        expect(blogService.createBlogPost).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Post',
            content: 'Test content',
            status: 'draft',
          })
        );
      });
    });

    it('shows publish confirmation dialog with guardrails', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/content/i), 'Test content');
      await user.click(screen.getByRole('button', { name: /publish/i }));

      // Confirmation dialog should appear
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/are you sure.*publish/i)).toBeInTheDocument();
    });

    it('validates required fields before publishing', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      await user.click(screen.getByRole('button', { name: /publish/i }));

      expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/content is required/i)).toBeInTheDocument();
    });

    it('publishes post with timestamp after confirmation', async () => {
      const user = userEvent.setup();
      vi.mocked(blogService.createBlogPost).mockResolvedValue({ id: 'post-1' } as any);
      
      renderWithProviders(<BlogAdminEditor />);

      await user.type(screen.getByLabelText(/title/i), 'Test Post');
      await user.type(screen.getByLabelText(/content/i), 'Test content');
      await user.click(screen.getByRole('button', { name: /publish/i }));

      // Confirm in dialog
      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(blogService.createBlogPost).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'published',
            publishedAt: expect.any(String),
          })
        );
      });
    });

    it('loads existing post data when editing', async () => {
      vi.mocked(blogService.getBlogPost).mockResolvedValue({
        id: 1,
        title: 'Existing Title',
        slug: 'existing-title',
        excerpt: 'Existing excerpt',
        content: 'Existing content',
        category: 'Insights',
        primary_keyword: 'insights',
        secondary_keywords: ['seo', 'growth'],
        meta_description: 'Existing meta',
        featured_image_url: 'https://example.com/image.jpg',
        author: 'Editor',
        read_time_minutes: 5,
        published: false,
        published_at: null,
        created_at: '2025-11-17T00:00:00Z',
        updated_at: '2025-11-18T00:00:00Z',
      } as any);

      renderWithProviders(<BlogAdminEditor />, '/admin/blog/existing-title/edit');

      expect(await screen.findByDisplayValue('Existing Title')).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toHaveValue('seo, growth');
      expect(blogService.getBlogPost).toHaveBeenCalledWith('existing-title');
    });

    it('updates an existing post when saving a draft', async () => {
      const user = userEvent.setup();
      vi.mocked(blogService.getBlogPost).mockResolvedValue({
        id: 1,
        title: 'Existing Title',
        slug: 'existing-title',
        excerpt: 'Existing excerpt',
        content: 'Existing content',
        category: 'Insights',
        primary_keyword: 'insights',
        secondary_keywords: ['seo'],
        meta_description: 'Existing meta',
        featured_image_url: null,
        author: 'Editor',
        read_time_minutes: 5,
        published: false,
        published_at: null,
        created_at: '2025-11-17T00:00:00Z',
        updated_at: '2025-11-18T00:00:00Z',
      } as any);
      vi.mocked(blogService.updateBlogPost).mockResolvedValue({ id: 'post-1' } as any);

      renderWithProviders(<BlogAdminEditor />, '/admin/blog/existing-title/edit');

      await screen.findByDisplayValue('Existing Title');
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      await waitFor(() => {
        expect(blogService.updateBlogPost).toHaveBeenCalled();
      });
    });
  });

  describe('AC-10.3: Image Upload and Media Management', () => {
    it('allows uploading featured image', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      const fileInput = screen.getByLabelText(/featured image/i);
      const file = new File(['image'], 'test.png', { type: 'image/png' });

      await user.upload(fileInput, file);

      expect(await screen.findByAltText(/preview/i)).toBeInTheDocument();
    });

    it('shows image preview after upload', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      const fileInput = screen.getByLabelText(/featured image/i);
      const file = new File(['image'], 'test.png', { type: 'image/png' });

      await user.upload(fileInput, file);

      const preview = await screen.findByAltText(/preview/i);
      expect(preview).toHaveAttribute('src', expect.stringContaining('data:image/png;base64'));
    });
  });

  describe('AC-10.4: Auto-save and Draft Management', () => {
    it('auto-saves draft every 30 seconds', async () => {
      vi.useFakeTimers();
      vi.mocked(blogService.createBlogPost).mockResolvedValue({ id: 'post-1' } as any);

      try {
        renderWithProviders(<BlogAdminEditor autoSaveIntervalMs={50} />);

        const titleInput = screen.getByLabelText(/title/i);
        fireEvent.change(titleInput, { target: { value: 'Auto-save test' } });
        expect(screen.getByDisplayValue('Auto-save test')).toBeInTheDocument();
        
        await act(async () => {
          vi.advanceTimersByTime(50);
        });

        expect(blogService.createBlogPost).toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });

    it('shows last saved timestamp', async () => {
      const user = userEvent.setup();
      vi.mocked(blogService.createBlogPost).mockResolvedValue({ id: 'post-1' } as any);
      renderWithProviders(<BlogAdminEditor />);

      await user.type(screen.getByLabelText(/title/i), 'Test');
      await user.click(screen.getByRole('button', { name: /save draft/i }));

      expect(await screen.findByText(/saved at/i, {}, { timeout: 2000 })).toBeInTheDocument();
    });
  });

  describe('AC-10.5: SEO and Metadata', () => {
    it('generates URL slug from title', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      await user.type(screen.getByLabelText(/title/i), 'My Test Post');

      const slugField = screen.getByLabelText(/url slug/i);
      expect(slugField).toHaveValue('my-test-post');
    });

    it('allows custom meta description', async () => {
      const user = userEvent.setup();
      renderWithProviders(<BlogAdminEditor />);

      const metaDesc = screen.getByLabelText(/meta description/i);
      await user.type(metaDesc, 'Custom SEO description');

      expect(metaDesc).toHaveValue('Custom SEO description');
    });
  });
});
