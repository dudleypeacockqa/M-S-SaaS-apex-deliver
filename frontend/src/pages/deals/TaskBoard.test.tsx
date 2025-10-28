import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import TaskBoard from './TaskBoard'
import * as tasksApi from '../../services/api/tasks'
import type { Task, TaskListResponse } from '../../services/api/tasks'

// Mock the tasks API
vi.mock('../../services/api/tasks')

const mockTasks: Task[] = [
  {
    id: 'task-1',
    deal_id: 'deal-123',
    organization_id: 'org-1',
    title: 'Review financials',
    description: 'Review target company financial statements',
    status: 'todo',
    priority: 'high',
    stage_gate: 'due_diligence',
    assignee_id: 'user-1',
    due_date: '2025-11-01T00:00:00Z',
    created_by: 'user-1',
    created_at: '2025-10-25T10:00:00Z',
    updated_at: null,
    completed_at: null,
  },
  {
    id: 'task-2',
    deal_id: 'deal-123',
    organization_id: 'org-1',
    title: 'Draft LOI',
    description: 'Draft letter of intent',
    status: 'in_progress',
    priority: 'normal',
    stage_gate: 'negotiation',
    assignee_id: 'user-2',
    due_date: '2025-11-05T00:00:00Z',
    created_by: 'user-1',
    created_at: '2025-10-26T10:00:00Z',
    updated_at: '2025-10-27T10:00:00Z',
    completed_at: null,
  },
  {
    id: 'task-3',
    deal_id: 'deal-123',
    organization_id: 'org-1',
    title: 'Sign NDA',
    description: 'Get NDA signed by all parties',
    status: 'completed',
    priority: 'urgent',
    stage_gate: 'sourcing',
    assignee_id: 'user-1',
    due_date: '2025-10-20T00:00:00Z',
    created_by: 'user-1',
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-10-19T10:00:00Z',
    completed_at: '2025-10-19T15:30:00Z',
  },
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('TaskBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders task board with columns for different statuses', async () => {
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // Check for status columns
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('displays tasks in correct status columns', async () => {
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // Todo column should have task-1
    const todoColumn = screen.getByText('To Do').closest('[data-testid="task-column-todo"]')
    expect(todoColumn).toBeDefined()
    if (todoColumn) {
      expect(within(todoColumn).getByText('Review financials')).toBeInTheDocument()
    }

    // In Progress column should have task-2
    const inProgressColumn = screen.getByText('In Progress').closest('[data-testid="task-column-in_progress"]')
    expect(inProgressColumn).toBeDefined()
    if (inProgressColumn) {
      expect(within(inProgressColumn).getByText('Draft LOI')).toBeInTheDocument()
    }

    // Completed column should have task-3
    const completedColumn = screen.getByText('Completed').closest('[data-testid="task-column-completed"]')
    expect(completedColumn).toBeDefined()
    if (completedColumn) {
      expect(within(completedColumn).getByText('Sign NDA')).toBeInTheDocument()
    }
  })

  it('displays task priority badges', async () => {
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // Check for priority indicators
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })

  it('opens create task modal when "Add Task" button is clicked', async () => {
    const user = userEvent.setup()
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    const addButton = screen.getByRole('button', { name: /add task/i })
    await user.click(addButton)

    // Modal should open
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create New Task')).toBeInTheDocument()
  })

  it('creates a new task when form is submitted', async () => {
    const user = userEvent.setup()
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    const newTask: Task = {
      id: 'task-4',
      deal_id: 'deal-123',
      organization_id: 'org-1',
      title: 'New test task',
      description: 'Test description',
      status: 'todo',
      priority: 'normal',
      stage_gate: null,
      assignee_id: null,
      due_date: null,
      created_by: 'user-1',
      created_at: '2025-10-28T10:00:00Z',
      updated_at: null,
      completed_at: null,
    }
    vi.mocked(tasksApi.createTask).mockResolvedValue(newTask)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // Open create modal
    const addButton = screen.getByRole('button', { name: /add task/i })
    await user.click(addButton)

    // Fill form
    const titleInput = screen.getByLabelText(/title/i)
    await user.type(titleInput, 'New test task')

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Test description')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i })
    await user.click(submitButton)

    // Verify API was called
    await waitFor(() => {
      expect(tasksApi.createTask).toHaveBeenCalledWith('deal-123', expect.objectContaining({
        title: 'New test task',
        description: 'Test description',
      }))
    })
  })

  it('updates task status when moved to different column', async () => {
    const user = userEvent.setup()
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)
    vi.mocked(tasksApi.updateTask).mockResolvedValue({
      ...mockTasks[0],
      status: 'in_progress',
      updated_at: '2025-10-28T10:00:00Z',
    })

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // Click on task to open detail modal
    const taskCard = screen.getByText('Review financials')
    await user.click(taskCard)

    // Change status in modal
    const statusSelect = screen.getByLabelText(/status/i)
    await user.selectOptions(statusSelect, 'in_progress')

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Verify API was called
    await waitFor(() => {
      expect(tasksApi.updateTask).toHaveBeenCalledWith('deal-123', 'task-1', expect.objectContaining({
        status: 'in_progress',
      }))
    })
  })

  it('filters tasks by priority when filter is applied', async () => {
    const user = userEvent.setup()
    const mockResponse: TaskListResponse = {
      total: mockTasks.length,
      items: mockTasks,
    }
    vi.mocked(tasksApi.listTasks).mockResolvedValue(mockResponse)

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Review financials')).toBeInTheDocument()
    })

    // All tasks should be visible initially
    expect(screen.getByText('Review financials')).toBeInTheDocument()
    expect(screen.getByText('Draft LOI')).toBeInTheDocument()
    expect(screen.getByText('Sign NDA')).toBeInTheDocument()

    // Apply high priority filter
    const filterSelect = screen.getByLabelText(/filter by priority/i)
    await user.selectOptions(filterSelect, 'high')

    // Only high priority task should be visible
    expect(screen.getByText('Review financials')).toBeInTheDocument()
    expect(screen.queryByText('Draft LOI')).not.toBeInTheDocument()
  })

  it('displays loading state while fetching tasks', () => {
    vi.mocked(tasksApi.listTasks).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays error state when API call fails', async () => {
    vi.mocked(tasksApi.listTasks).mockRejectedValue(new Error('API Error'))

    render(<TaskBoard dealId="deal-123" />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument()
    })
  })
})
