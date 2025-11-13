import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import TaskTemplateSelector from './TaskTemplateSelector';
import * as tasksService from '../../services/tasksService';

vi.mock('../../services/tasksService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TaskTemplateSelector', () => {
  const mockTemplates: tasksService.TaskTemplate[] = [
    {
      id: 'template-1',
      organization_id: 'org-1',
      name: 'Due Diligence Checklist',
      description: 'Standard DD tasks',
      tasks: [
        { title: 'Financial Review', priority: 'high' },
        { title: 'Legal Review', priority: 'high' },
      ],
      created_by: 'user-1',
      created_at: '2025-11-13T10:00:00Z',
    },
    {
      id: 'template-2',
      organization_id: 'org-1',
      name: 'Integration Planning',
      description: 'Post-close integration tasks',
      tasks: [
        { title: 'IT Integration', priority: 'medium' },
        { title: 'HR Alignment', priority: 'medium' },
      ],
      created_by: 'user-1',
      created_at: '2025-11-13T11:00:00Z',
    },
  ];

  const defaultProps = {
    dealId: 'deal-123',
    onTemplateSelect: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders template selector with list of available templates', async () => {
    vi.mocked(tasksService.listTaskTemplates).mockResolvedValue(mockTemplates);

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByText('Due Diligence Checklist')).toBeInTheDocument();
    expect(screen.getByText('Standard DD tasks')).toBeInTheDocument();
    expect(screen.getByText('Integration Planning')).toBeInTheDocument();
    expect(screen.getByText('Post-close integration tasks')).toBeInTheDocument();
  });

  it('displays template task count for each template', async () => {
    vi.mocked(tasksService.listTaskTemplates).mockResolvedValue(mockTemplates);

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const taskCounts = screen.getAllByText(/2 tasks/i);
      expect(taskCounts.length).toBe(2); // Both templates have 2 tasks
    });
  });

  it('calls onTemplateSelect when a template is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksService.listTaskTemplates).mockResolvedValue(mockTemplates);

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const templateButton = await screen.findByRole('button', {
      name: /due diligence checklist/i,
    });
    await user.click(templateButton);

    expect(defaultProps.onTemplateSelect).toHaveBeenCalledWith('template-1');
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksService.listTaskTemplates).mockResolvedValue(mockTemplates);

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const closeButton = await screen.findByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows loading state while fetching templates', () => {
    vi.mocked(tasksService.listTaskTemplates).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/loading templates/i)).toBeInTheDocument();
  });

  it('shows empty state when no templates are available', async () => {
    vi.mocked(tasksService.listTaskTemplates).mockResolvedValue([]);

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(
      await screen.findByText(/no templates available/i)
    ).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(tasksService.listTaskTemplates).mockRejectedValue(
      new Error('Failed to load templates')
    );

    render(<TaskTemplateSelector {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const errorMessages = await screen.findAllByText('Failed to load templates');
    expect(errorMessages.length).toBeGreaterThan(0);
  });
});

