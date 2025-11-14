import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import TaskTemplateModal from './TaskTemplateModal';
import * as tasksService from '../../services/tasksService';

vi.mock('../../services/tasksService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TaskTemplateModal', () => {
  const defaultProps = {
    dealId: 'deal-123',
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders template creation form when modal is open', () => {
    render(<TaskTemplateModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/create task template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/template name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('allows adding tasks to the template', async () => {
    const user = userEvent.setup();
    render(<TaskTemplateModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const addTaskButton = screen.getByRole('button', { name: /add new task to template/i });
    await user.click(addTaskButton);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
  });

  it('validates that template name is required', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksService.createTaskTemplate).mockResolvedValue({
      id: 'template-1',
      organization_id: 'org-1',
      name: 'Test Template',
      description: null,
      tasks: [],
      created_by: 'user-1',
      created_at: '2025-11-13T10:00:00Z',
    });

    render(<TaskTemplateModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByRole('button', { name: /create template/i });
    await user.click(submitButton);

    expect(await screen.findByText(/template name is required/i)).toBeInTheDocument();
    expect(tasksService.createTaskTemplate).not.toHaveBeenCalled();
  });

  it('creates template when form is valid', async () => {
    const user = userEvent.setup();
    const mockTemplate = {
      id: 'template-1',
      organization_id: 'org-1',
      name: 'Due Diligence Checklist',
      description: 'Standard DD tasks',
      tasks: [
        { title: 'Financial Review', priority: 'high' as const },
      ],
      created_by: 'user-1',
      created_at: '2025-11-13T10:00:00Z',
    };

    vi.mocked(tasksService.createTaskTemplate).mockResolvedValue(mockTemplate);

    render(<TaskTemplateModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Fill in template name
    const nameInput = screen.getByLabelText(/template name/i);
    await user.type(nameInput, 'Due Diligence Checklist');

    // Fill in description
    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, 'Standard DD tasks');

    // Add a task
    const addTaskButton = screen.getByRole('button', { name: /add new task to template/i });
    await user.click(addTaskButton);

    const taskTitleInput = await screen.findByLabelText(/task title/i);
    await user.type(taskTitleInput, 'Financial Review');

    // Submit
    const submitButton = screen.getByRole('button', { name: /create template/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(tasksService.createTaskTemplate).toHaveBeenCalledWith('deal-123', {
        name: 'Due Diligence Checklist',
        description: 'Standard DD tasks',
        tasks: [{ title: 'Financial Review', description: null, priority: undefined, stage_gate: null }],
      });
    });

    expect(defaultProps.onSuccess).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskTemplateModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(tasksService.createTaskTemplate).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<TaskTemplateModal {...defaultProps} isOpen={false} />, {
      wrapper: createWrapper(),
    });

    expect(screen.queryByText(/create task template/i)).not.toBeInTheDocument();
  });
});

