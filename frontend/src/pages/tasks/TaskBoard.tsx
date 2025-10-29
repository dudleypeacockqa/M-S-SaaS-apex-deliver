import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import {
  assignTask,
  createTask,
  deleteTask,
  fetchTaskBoardData,
  getTask,
  persistFilters,
  updateTask,
  updateTaskStatus,
  type Task,
  type TaskAssignee,
  type TaskBoardData,
  type TaskCreateInput,
  type TaskFiltersState,
  type TaskPriority,
  type TaskStatus,
  type TaskUpdateInput,
} from '../../services/tasksService';

const POLL_INTERVAL_MS = 45_000;
const STORAGE_KEY = 'task-board-filters';

const statusColumns: Array<{ id: TaskStatus; title: string }> = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const priorityWeight: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

const DEFAULT_FILTERS: TaskFiltersState = {
  assigneeId: 'all',
  status: 'all',
  priority: 'all',
  sortBy: 'priority',
  sortDirection: 'desc',
  dueDateBefore: null,
  dueDateAfter: null,
};

const readStoredFilters = (): TaskFiltersState => {
  if (typeof window === 'undefined' || typeof window.localStorage?.getItem !== 'function') {
    return { ...DEFAULT_FILTERS };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_FILTERS };
    }
    const parsed = JSON.parse(raw) as Partial<TaskFiltersState> | null;
    return { ...DEFAULT_FILTERS, ...(parsed ?? {}) };
  } catch (error) {
    console.warn('Failed to read stored task filters', error);
    return { ...DEFAULT_FILTERS };
  }
};

const storeFilters = (filters: TaskFiltersState) => {
  if (typeof window === 'undefined' || typeof window.localStorage?.setItem !== 'function') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to store task filters', error);
  }
};

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [metadata, setMetadata] = useState<TaskBoardData['metadata'] | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>(() => readStoredFilters());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const filtersInitialisedRef = useRef(false);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyBoardData = useCallback((data: TaskBoardData) => {
    setTasks(data.tasks);
    setAssignees(data.assignees);
    setMetadata(data.metadata);
    if (!filtersInitialisedRef.current) {
      setFilters((current) => ({ ...current, ...data.filters }));
      filtersInitialisedRef.current = true;
    }
  }, []);

  const loadBoardData = useCallback(async (showSpinner: boolean = false) => {
    if (!mountedRef.current) {
      return;
    }
    if (showSpinner) {
      setIsLoading(true);
    }
    try {
      const data = await fetchTaskBoardData();
      if (!mountedRef.current) {
        return;
      }
      applyBoardData(data);
      setLoadError(null);
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }
      setLoadError(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [applyBoardData]);

  const scheduleRefresh = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      void loadBoardData().finally(() => {
        scheduleRefresh();
      });
    }, POLL_INTERVAL_MS);
  }, [loadBoardData]);

  useEffect(() => {
    mountedRef.current = true;
    void loadBoardData(true).then(() => {
      scheduleRefresh();
    });
    return () => {
      mountedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadBoardData, scheduleRefresh]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'n' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      event.preventDefault();
      setIsCreateModalOpen(true);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleFiltersChange = useCallback((next: TaskFiltersState) => {
    setFilters(next);
    storeFilters(next);
    void persistFilters(next);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    storeFilters(DEFAULT_FILTERS);
    void persistFilters(DEFAULT_FILTERS);
  }, []);

  const handleCreateTask = useCallback(async (input: TaskCreateInput) => {
    setIsLoading(true);
    try {
      const created = await createTask(input);
      setTasks((current) => [...current, created]);
      setMetadata((current) =>
        current
          ? {
              ...current,
              total: current.total + 1,
              lastUpdated: new Date().toISOString(),
            }
          : current,
      );
      setIsCreateModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openTaskDetail = useCallback(async (task: Task) => {
    setSelectedTaskId(task.id);
    setSelectedTask(task);
    setIsDetailLoading(true);
    try {
      const detailed = await getTask(task.id);
      setSelectedTask(detailed);
      setTasks((current) => current.map((item) => (item.id === detailed.id ? detailed : item)));
    } catch (error) {
      console.error('Failed to load task details', error);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const closeTaskDetail = useCallback(() => {
    setSelectedTaskId(null);
    setSelectedTask(null);
    setIsDetailLoading(false);
  }, []);

  const handleSaveTask = useCallback(async (updates: TaskUpdateInput) => {
    if (!selectedTaskId) {
      return;
    }
    const updated = await updateTask(selectedTaskId, updates);
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedTask(updated);
  }, [selectedTaskId]);

  const handleAssignTask = useCallback(async (assigneeId: string | null) => {
    if (!selectedTaskId) {
      return;
    }
    const updated = await assignTask(selectedTaskId, assigneeId);
    setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedTask(updated);
  }, [selectedTaskId]);

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTaskId) {
      return;
    }
    await deleteTask(selectedTaskId);
    setTasks((current) => current.filter((item) => item.id !== selectedTaskId));
    setMetadata((current) =>
      current
        ? {
            ...current,
            total: Math.max(0, current.total - 1),
            lastUpdated: new Date().toISOString(),
          }
        : current,
    );
    closeTaskDetail();
  }, [selectedTaskId, closeTaskDetail]);

  const handleStatusChange = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    const newStatus = destination.droppableId as TaskStatus;
    const originalTasks = [...tasks];

    setTasks((current) =>
      current.map((item) => (item.id === draggableId ? { ...item, status: newStatus } : item)),
    );

    try {
      const updated = await updateTaskStatus(draggableId, newStatus, destination.index);
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error('Failed to update task status', error);
      setTasks(originalTasks);
    }
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const before = filters.dueDateBefore ? new Date(filters.dueDateBefore) : null;
    const after = filters.dueDateAfter ? new Date(filters.dueDateAfter) : null;

    if (before) {
      before.setHours(23, 59, 59, 999);
    }
    if (after) {
      after.setHours(0, 0, 0, 0);
    }

    const matches = tasks.filter((task) => {
      if (filters.assigneeId !== 'all' && task.assignee?.id !== filters.assigneeId) {
        return false;
      }
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (before) {
        if (!task.dueDate) {
          return false;
        }
        const due = new Date(task.dueDate);
        if (Number.isNaN(due.getTime()) || due > before) {
          return false;
        }
      }
      if (after) {
        if (!task.dueDate) {
          return false;
        }
        const due = new Date(task.dueDate);
        if (Number.isNaN(due.getTime()) || due < after) {
          return false;
        }
      }
      return true;
    });

    const factor = filters.sortDirection === 'asc' ? 1 : -1;

    return [...matches].sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        return (aTime - bTime) * factor;
      }
      if (filters.sortBy === 'priority') {
        const diff = priorityWeight[a.priority] - priorityWeight[b.priority];
        return diff * factor;
      }
      const aCreated = new Date(a.createdAt).getTime();
      const bCreated = new Date(b.createdAt).getTime();
      return (aCreated - bCreated) * factor;
    });
  }, [filters, tasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    filteredTasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const totalVisible = filteredTasks.length;
  const lastUpdated = metadata?.lastUpdated ? new Date(metadata.lastUpdated).toLocaleString() : null;

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500">Coordinate diligence workflows across the deal team.</p>
          {lastUpdated && <p className="text-xs text-gray-400">Last updated {lastUpdated}</p>}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          New task
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          Showing {totalVisible} task{totalVisible === 1 ? '' : 's'}
        </span>
        {typeof metadata?.total === 'number' && (
          <span className="text-gray-400">{metadata.total} total in workspace</span>
        )}
      </div>

      <TaskFilters filters={filters} assignees={assignees} onChange={handleFiltersChange} onClear={handleClearFilters} />

      {isLoading && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Loading tasks...</div>
      )}

      {loadError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load tasks. {loadError}
        </div>
      )}

      <DragDropContext onDragEnd={handleStatusChange}>
        <div className="grid gap-4 md:grid-cols-3">
          {statusColumns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(dropProvided) => (
                <div
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  data-testid={}
                  className="flex h-full flex-col rounded-lg border border-gray-200 bg-white"
                >
                  <div className="border-b border-gray-200 px-4 py-3">
                    <h2 className="text-sm font-semibold text-gray-700">{column.title}</h2>
                    <p className="text-xs text-gray-400">
                      {tasksByStatus[column.id].length} task{tasksByStatus[column.id].length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    {tasksByStatus[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <TaskCard task={task} onClick={openTaskDetail} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {tasksByStatus[column.id].length === 0 && (
                      <p className="text-sm text-gray-400">No tasks in this stage.</p>
                    )}
                  </div>
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isCreateModalOpen && (
        <TaskFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
          assignees={assignees}
          deals={[]}
          isSubmitting={false}
        />
      )}

      {selectedTaskId && (
        <TaskDetailModal
          isOpen={Boolean(selectedTaskId)}
          onClose={closeTaskDetail}
          task={selectedTask}
          loading={isDetailLoading}
          assignees={assignees}
          onSave={handleSaveTask}
          onAssign={handleAssignTask}
          onDelete={handleDeleteTask}
          isSaving={false}
          isDeleting={false}
        />
      )}
    </div>
  );
};

export default TaskBoard;
