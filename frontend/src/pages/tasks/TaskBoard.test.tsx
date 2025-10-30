import { beforeAll, beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import TaskBoard from './TaskBoard';
import * as taskService from '../../services/tasksService';
import type { Task, TaskFiltersState, TaskAssignee } from '../../services/tasksService';

// Mock drag-and-drop library to simplify tests
vi.mock('@hello-pangea/dnd', () => {
  let latestOnDragEnd: ((result: any) => void) | null = null;

  const DragDropContext = ({ children, onDragEnd }: any) => {
    latestOnDragEnd = onDragEnd;
    return <div data-testid="drag-drop-context">{children}</div>;
  };

  const Droppable = ({ children, droppableId }: any) => (
    <div data-droppable-id={droppableId}>
      {children({
        droppableProps: {
          'data-droppable-id': droppableId,
        },
        innerRef: vi.fn(),
        placeholder: null,
      })}
    </div>
  );

  const Draggable = ({ children, draggableId }: any) => (
    <div data-testid={'draggable-' + draggableId} data-draggable-id={draggableId}>
      {children({
        draggableProps: {
          'data-draggable-id': draggableId,
        },
        dragHandleProps: {
          'aria-label': 'drag-handle-' + draggableId,
        },
        innerRef: vi.fn(),
      })}
    </div>
  );

  return {
    __esModule: true,
    DragDropContext,
    Droppable,
    Draggable,
    __mock: {
      getLatestOnDragEnd: () => latestOnDragEnd,
    },
  };
});

// Mock the task service module
vi.mock('../../services/tasksService');

// Provide window matchMedia/ResizeObserver mocks for jsdom
beforeAll(() => {
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }

  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
});

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TaskBoard', () => {
  const mockAssignees: TaskAssignee[] = [
    {
      id: 'user-1',
      name: 'Alice Harper',
      avatarUrl: 'https://example.com/alice.png',
    },
    {
      id: 'user-2',
      name: 'Ben Carter',
      avatarUrl: null,
    },
  ];

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Build diligence checklist',
      description: 'Draft initial due diligence checklist for target company',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-11-01T00:00:00Z',
      assignee: mockAssignees[0],
      deal: {
        id: 'deal-1',
        name: 'Atlas Acquisition',
      },
      comments: [],
      activity: [
        {
          id: 'activity-1',
          message: 'Task created by Alice',
          createdAt: '2025-10-01T09:00:00Z',
        },
      ],
      createdAt: '2025-10-01T09:00:00Z',
      updatedAt: '2025-10-02T09:30:00Z',
    },
    {
      id: 'task-2',
      title: 'Compile CIM summary',
      description: 'Summarize key metrics from confidential information memorandum',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2025-10-28T00:00:00Z',
      assignee: mockAssignees[1],
      deal: {
        id: 'deal-2',
        name: 'Beacon Capital',
      },
      comments: [
        {
          id: 'comment-1',
          author: mockAssignees[1],
          message: 'Draft completed, ready for review',
          createdAt: '2025-10-20T12:00:00Z',
        },
      ],
      activity: [
        {
          id: 'activity-2',
          message: 'Ben moved task to In Progress',
          createdAt: '2025-10-15T10:15:00Z',
        },
      ],
      createdAt: '2025-10-05T11:00:00Z',
      updatedAt: '2025-10-20T12:00:00Z',
    },
    {
      id: 'task-3',
      title: 'Board approval prep',
      description: 'Prepare slides for investment committee',
      status: 'done',
      priority: 'urgent',
      dueDate: '2025-10-10T00:00:00Z',
      assignee: null,
      deal: null,
      comments: [],
      activity: [
        {
          id: 'activity-3',
          message: 'Task completed by Ben',
          createdAt: '2025-10-09T17:30:00Z',
        },
      ],
      createdAt: '2025-09-20T08:00:00Z',
      updatedAt: '2025-10-09T17:30:00Z',
    },
  ];

  const mockFilters: TaskFiltersState = {
    assigneeId: 'all',
    status: 'all',
    priority: 'all',
    sortBy: 'priority',
    sortDirection: 'desc',
    dueDateBefore: null,
    dueDateAfter: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    vi.mocked(taskService.fetchTaskBoardData).mockResolvedValue({
      tasks: mockTasks,
      assignees: mockAssignees,
      filters: mockFilters,
      metadata: {
        total: mockTasks.length,
        lastUpdated: '2025-10-25T12:00:00Z',
      },
    });

    vi.mocked(taskService.createTask).mockResolvedValue({
      ...mockTasks[0],
      id: 'task-new',
      title: 'Financial model review',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-11-05T00:00:00Z',
      assignee: mockAssignees[0],
    });

    vi.mocked(taskService.updateTask).mockImplementation(async (taskId, updates) => ({
      ...mockTasks.find((task) => task.id === taskId)!,
      ...updates,
    }));

    vi.mocked(taskService.updateTaskStatus).mockImplementation(async (taskId, status, position) => ({
      ...mockTasks.find((task) => task.id === taskId)!,
      status,
      position,
    }));

    vi.mocked(taskService.assignTask).mockImplementation(async (taskId, assigneeId) => ({
      ...mockTasks.find((task) => task.id === taskId)!,
      assignee: mockAssignees.find((assignee) => assignee.id === assigneeId) ?? null,
    }));

    vi.mocked(taskService.deleteTask).mockResolvedValue(undefined);
    vi.mocked(taskService.persistFilters).mockResolvedValue(undefined);
    vi.mocked(taskService.logTaskActivity).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

const renderTaskBoard = () => {
  let utils = render(<TaskBoard />, { wrapper: createWrapper() });
  return {
    ...utils,
    rerender: (ui?: React.ReactElement) => {
      cleanup();
      utils = render(ui ?? <TaskBoard />, { wrapper: createWrapper() });
      return utils;
    },
  };
};


  it('renders task board with required columns and tasks', async () => {
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /done/i })).toBeInTheDocument();

    const todoColumn = screen.getByTestId('droppable-todo');
    expect(within(todoColumn).getByText('Build diligence checklist')).toBeInTheDocument();

    const inProgressColumn = screen.getByTestId('droppable-in_progress');
    expect(within(inProgressColumn).getByText('Compile CIM summary')).toBeInTheDocument();

    const doneColumn = screen.getByTestId('droppable-done');
    expect(within(doneColumn).getByText('Board approval prep')).toBeInTheDocument();
  });

  it('persists filters when modified', async () => {
    const user = userEvent.setup();
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText('Status');
    await user.selectOptions(statusSelect, 'in_progress');

    await waitFor(() => {
      expect(taskService.persistFilters).toHaveBeenCalledWith({
        ...mockFilters,
        status: 'in_progress',
      });
    });
  });

  it('filters tasks by assignee, status, priority, and due date', async () => {
    const user = userEvent.setup();
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    const assigneeSelect = screen.getByLabelText('Assignee');
    await user.selectOptions(assigneeSelect, 'user-2');

    await waitFor(() => {
      expect(screen.queryByText('Build diligence checklist')).not.toBeInTheDocument();
      expect(screen.getByText('Compile CIM summary')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText('Status');
    await user.selectOptions(statusSelect, 'done');

    await waitFor(() => {
      expect(screen.getByText('Board approval prep')).toBeInTheDocument();
      expect(screen.queryByText('Compile CIM summary')).not.toBeInTheDocument();
    });

    const prioritySelect = screen.getByLabelText('Priority');
    await user.selectOptions(prioritySelect, 'urgent');

    await waitFor(() => {
      expect(screen.getByText('Board approval prep')).toBeInTheDocument();
      expect(screen.queryByText('Build diligence checklist')).not.toBeInTheDocument();
    });

    const dueBeforeInput = screen.getByLabelText('Due before');
    await user.clear(dueBeforeInput);
    await user.type(dueBeforeInput, '2025-10-15');

    await waitFor(() => {
      expect(screen.getByText('Board approval prep')).toBeInTheDocument();
      expect(screen.queryByText('Build diligence checklist')).not.toBeInTheDocument();
    });
  });

  it('sorts tasks by due date and priority', async () => {
    const user = userEvent.setup();
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText('Sort by');
    await user.selectOptions(sortSelect, 'dueDate');

    const todoColumn = screen.getByTestId('droppable-todo');
    const cards = within(todoColumn).getAllByTestId(/task-card/);
    expect(cards[0]).toHaveTextContent('Build diligence checklist');

    await user.selectOptions(sortSelect, 'priority');
    await user.click(screen.getByRole('button', { name: /toggle sort direction/i }));

    const priorityCards = within(todoColumn).getAllByTestId(/task-card/);
    expect(priorityCards[0]).toHaveTextContent('Build diligence checklist');
  });

  it('opens task creation modal and validates required fields', async () => {
    const user = userEvent.setup();
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /new task/i }));

    const modal = screen.getByRole('dialog', { name: /create task/i });
    expect(within(modal).getByLabelText('Title')).toBeInTheDocument();

    const submitButton = within(modal).getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(within(modal).getByText(/title is required/i)).toBeInTheDocument();

    await user.type(within(modal).getByLabelText('Title'), 'Financial model review');
    await user.type(within(modal).getByLabelText('Due date'), '2025-11-05');
    await user.selectOptions(within(modal).getByLabelText('Priority'), 'medium');
    await user.selectOptions(within(modal).getByLabelText('Assignee'), 'user-1');

    await user.click(submitButton);

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalled();
    });
  });

  it('supports keyboard shortcut for opening the new task modal', async () => {
    const user = userEvent.setup();
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    await user.keyboard('n');

    expect(screen.getByRole('dialog', { name: /create task/i })).toBeInTheDocument();
  });

  it('opens task detail modal on card click and loads task detail data', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTask).mockResolvedValue({
      ...mockTasks[0],
      comments: [
        {
          id: 'comment-2',
          author: mockAssignees[0],
          message: 'Reviewed documents',
          createdAt: '2025-10-22T10:00:00Z',
        },
      ],
    });

    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Build diligence checklist'));

    await waitFor(() => {
      expect(taskService.getTask).toHaveBeenCalledWith('task-1');
    });

    const modal = await screen.findByRole('dialog', { name: /task details/i });
    expect(within(modal).getByText('Build diligence checklist')).toBeInTheDocument();
    expect(within(modal).getByText('Reviewed documents')).toBeInTheDocument();
  });

  it('updates task details from detail modal', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTask).mockResolvedValue(mockTasks[1]);

    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Compile CIM summary')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Compile CIM summary'));

    const modal = await screen.findByRole('dialog', { name: /task details/i });
    const descriptionField = within(modal).getByLabelText('Description');

    await user.clear(descriptionField);
    await user.type(descriptionField, 'Updated description for review');
    await user.selectOptions(within(modal).getByLabelText('Status'), 'done');
    await user.click(within(modal).getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith('task-2', expect.objectContaining({
        description: 'Updated description for review',
        status: 'done',
      }));
    });
  });

  it('assigns a task from the detail modal', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTask).mockResolvedValue(mockTasks[0]);

    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Build diligence checklist'));

    const modal = await screen.findByRole('dialog', { name: /task details/i });

    const assigneeSelect = within(modal).getByLabelText('Assignee');
    await user.selectOptions(assigneeSelect, 'user-2');

    await waitFor(() => {
      expect(taskService.assignTask).toHaveBeenCalledWith('task-1', 'user-2');
    });
  });

  it('deletes a task from the detail modal', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.getTask).mockResolvedValue(mockTasks[2]);

    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Board approval prep')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Board approval prep'));

    const modal = await screen.findByRole('dialog', { name: /task details/i });
    await user.click(within(modal).getByRole('button', { name: /delete task/i }));

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith('task-3');
    });
  });

  it('handles drag and drop between columns and calls updateTaskStatus', async () => {
    renderTaskBoard();

    await waitFor(() => {
      expect(screen.getByText('Build diligence checklist')).toBeInTheDocument();
    });

    const dndModule: any = await import('@hello-pangea/dnd');
    const onDragEnd = dndModule.__mock.getLatestOnDragEnd();
    expect(typeof onDragEnd).toBe('function');

    onDragEnd({
      source: { droppableId: 'todo', index: 0 },
      destination: { droppableId: 'in_progress', index: 0 },
      draggableId: 'task-1',
      type: 'DEFAULT',
    });

    await waitFor(() => {
      expect(taskService.updateTaskStatus).toHaveBeenCalledWith('task-1', 'in_progress', 0);
    });
  });

  it('shows loading and error states', async () => {
    vi.mocked(taskService.fetchTaskBoardData).mockClear();
    vi.mocked(taskService.fetchTaskBoardData).mockResolvedValueOnce({
      tasks: [],
      assignees: [],
      filters: mockFilters,
      metadata: {
        total: 0,
        lastUpdated: null,
      },
    });

    const { rerender } = renderTaskBoard();
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();

    vi.mocked(taskService.fetchTaskBoardData).mockRejectedValueOnce(new Error('Network error'));
    rerender(<TaskBoard />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });

  it('refreshes tasks on polling interval', { timeout: 10000 }, async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    renderTaskBoard();

    // Wait for initial load
    await waitFor(() => {
      expect(taskService.fetchTaskBoardData).toHaveBeenCalledTimes(1);
    });

    const initialCallCount = vi.mocked(taskService.fetchTaskBoardData).mock.calls.length;

    // Advance timers by 45 seconds (polling interval) and run pending timers
    await vi.advanceTimersByTimeAsync(45000);
    await vi.advanceTimersToNextTimerAsync();

    // Wait for the second fetch
    await waitFor(
      () => {
        const currentCallCount = vi.mocked(taskService.fetchTaskBoardData).mock.calls.length;
        expect(currentCallCount).toBeGreaterThan(initialCallCount);
      },
      { timeout: 1000 },
    );

    vi.useRealTimers();
  });
});
