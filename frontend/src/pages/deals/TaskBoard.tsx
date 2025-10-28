import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listTasks, createTask, updateTask, type Task, type TaskCreate, type TaskUpdate } from '../../services/api/tasks'

interface TaskBoardProps {
  dealId: string
}

const TaskBoard: React.FC<TaskBoardProps> = ({ dealId }) => {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Fetch tasks
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', dealId],
    queryFn: () => listTasks(dealId),
  })

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (payload: TaskCreate) => createTask(dealId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', dealId] })
      setIsCreateModalOpen(false)
    },
  })

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: TaskUpdate }) => updateTask(dealId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', dealId] })
      setSelectedTask(null)
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading tasks...</div>
  }

  if (error) {
    return <div className="rounded-md bg-red-50 p-4 text-red-800">Error loading tasks. Please try again.</div>
  }

  const tasks = data?.items || []

  // Filter tasks by priority
  const filteredTasks =
    priorityFilter === 'all' ? tasks : tasks.filter((task) => task.priority === priorityFilter)

  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === 'todo'),
    in_progress: filteredTasks.filter((task) => task.status === 'in_progress'),
    completed: filteredTasks.filter((task) => task.status === 'completed'),
    blocked: filteredTasks.filter((task) => task.status === 'blocked'),
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="priority-filter" className="mr-2 text-sm font-medium text-gray-700">
              Filter by Priority:
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* To Do Column */}
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={tasksByStatus.todo}
          onTaskClick={setSelectedTask}
          getPriorityBadgeClass={getPriorityBadgeClass}
        />

        {/* In Progress Column */}
        <TaskColumn
          title="In Progress"
          status="in_progress"
          tasks={tasksByStatus.in_progress}
          onTaskClick={setSelectedTask}
          getPriorityBadgeClass={getPriorityBadgeClass}
        />

        {/* Completed Column */}
        <TaskColumn
          title="Completed"
          status="completed"
          tasks={tasksByStatus.completed}
          onTaskClick={setSelectedTask}
          getPriorityBadgeClass={getPriorityBadgeClass}
        />

        {/* Blocked Column */}
        <TaskColumn
          title="Blocked"
          status="blocked"
          tasks={tasksByStatus.blocked}
          onTaskClick={setSelectedTask}
          getPriorityBadgeClass={getPriorityBadgeClass}
        />
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={(payload) => createMutation.mutate(payload)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(payload) => updateMutation.mutate({ taskId: selectedTask.id, payload })}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  )
}

interface TaskColumnProps {
  title: string
  status: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  getPriorityBadgeClass: (priority: string) => string
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onTaskClick, getPriorityBadgeClass }) => {
  return (
    <div data-testid={`task-column-${status}`} className="rounded-lg bg-gray-50 p-4">
      <h3 className="mb-4 font-semibold text-gray-700">{title}</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="cursor-pointer rounded-md bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
            {task.description && <p className="mb-2 text-sm text-gray-600">{task.description}</p>}
            {task.due_date && (
              <p className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-center text-sm text-gray-400">No tasks</p>}
      </div>
    </div>
  )
}

interface CreateTaskModalProps {
  onClose: () => void
  onCreate: (payload: TaskCreate) => void
  isLoading: boolean
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate, isLoading }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({
      title,
      description: description || null,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div role="dialog" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
  onUpdate: (payload: TaskUpdate) => void
  isLoading: boolean
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onUpdate, isLoading }) => {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      title,
      description: description || null,
      status,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div role="dialog" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-due_date" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              id="edit-due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskBoard
