import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { ...DEFAULT_FILTERS };
    }
    const parsed = JSON.parse(rawValue) as Partial<TaskFiltersState> | null;
    return { ...DEFAULT_FILTERS, ...(parsed ?? {}) };
  } catch (storageError) {
    console.warn('Failed to read stored task filters', storageError);
    return { ...DEFAULT_FILTERS };
  }
};

const storeFilters = (filters: TaskFiltersState) => {
  if (typeof window === 'undefined' || typeof window.localStorage?.setItem !== 'function') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (storageError) {
    console.warn('Failed to store task filters', storageError);
  }
};

const isEditableElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;
};

const TaskBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [metadata, setMetadata] = useState<TaskBoardData['metadata'] | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>(() => readStoredFilters());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const filtersInitialisedRef = useRef(false);

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<TaskBoardData>({
    queryKey: ['taskBoard'],
    queryFn: fetchTaskBoardData,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setTasks(data.tasks);
    setAssignees(data.assignees);
    setMetadata(data.metadata);
    if (!filtersInitialisedRef.current && data.filters) {
      setFilters((current) => ({ ...current, ...data.filters }));
      filtersInitialisedRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const intervalId = window.setInterval(() => {
      void refetch();
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [refetch]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'n' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isEditableElement(event.target)) {
        return;
      }
      event.preventDefault();
      setIsCreateModalOpen(true);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!isDetailOpen || !selectedTaskId) {
      return;
    }
    const latest = tasks.find((task) => task.id === selectedTaskId);
    if (!latest) {
      return;
    }
    setSelectedTask((current) => (current ? { ...current, ...latest } : latest));
  }, [isDetailOpen, selectedTaskId, tasks]);

  const updateQueryData = useCallback(
    (updater: (current: TaskBoardData) => TaskBoardData) => {
      queryClient.setQueryData<TaskBoardData | undefined>(['taskBoard'], (existing) => {
        if (!existing) {
          return existing;
        }
        return updater(existing);
      });
    },
    [queryClient],
  );

  const handleFiltersChange = useCallback((nextFilters: TaskFiltersState) => {
    const normalised: TaskFiltersState = { ...nextFilters };
    if (normalised.status !== 'all' && normalised.assigneeId !== 'all') {
      normalised.assigneeId = 'all';
    }
    setFilters(normalised);
    storeFilters(normalised);
    persistFilters(normalised).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    const defaults = { ...DEFAULT_FILTERS };
    setFilters(defaults);
    storeFilters(defaults);
    persistFilters(defaults).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, []);

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskCreateInput) => createTask(payload),
    onSuccess: (createdTask) => {
      setTasks((current) => {
        const next = [...current, createdTask];
        updateQueryData((existing) => ({
          ...existing,
          tasks: next,
          metadata: existing.metadata
            ? {
                ...existing.metadata,
                total: existing.metadata.total + 1,
                lastUpdated: new Date().toISOString(),
              }
            : existing.metadata,
        }));
        return next;
      });
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
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: TaskUpdateInput }) => updateTask(taskId, updates),
    onSuccess: (updatedTask) => {
      setTasks((current) => {
        const next = current.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        updateQueryData((existing) => ({ ...existing, tasks: next }));
        return next;
      });
      setSelectedTask((current) => (current && current.id === updatedTask.id ? { ...current, ...updatedTask } : current));
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) => assignTask(taskId, assigneeId),
    onSuccess: (updatedTask) => {
      setTasks((current) => {
        const next = current.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        updateQueryData((existing) => ({ ...existing, tasks: next }));
        return next;
      });
      setSelectedTask((current) => (current && current.id === updatedTask.id ? { ...current, ...updatedTask } : current));
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (_, taskId) => {
      setTasks((current) => {
        const next = current.filter((task) => task.id !== taskId);
        updateQueryData((existing) => ({
          ...existing,
          tasks: next,
          metadata: existing.metadata
            ? {
                ...existing.metadata,
                total: Math.max(0, existing.metadata.total - 1),
                lastUpdated: new Date().toISOString(),
              }
            : existing.metadata,
        }));
        return next;
      });
      setMetadata((current) =>
        current
          ? {
              ...current,
              total: Math.max(0, current.total - 1),
              lastUpdated: new Date().toISOString(),
            }
          : current,
      );
      setIsDetailOpen(false);
      setSelectedTaskId(null);
      setSelectedTask(null);
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status, position }: { taskId: string; status: TaskStatus; position: number }) =>
      updateTaskStatus(taskId, status, position),
    onSuccess: (updatedTask) => {
      setTasks((current) => {
        const next = current.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        updateQueryData((existing) => ({ ...existing, tasks: next }));
        return next;
      });
      setSelectedTask((current) => (current && current.id === updatedTask.id ? { ...current, ...updatedTask } : current));
    },
  });

  const handleCreateTask = useCallback(
    async (payload: TaskCreateInput) => {
      await createTaskMutation.mutateAsync(payload);
    },
    [createTaskMutation],
  );

  const handleOpenTaskDetail = useCallback(
    async (task: Task) => {
      setSelectedTaskId(task.id);
      setSelectedTask(task);
      setIsDetailOpen(true);
      setIsDetailLoading(true);
      try {
        const detailedTask = await getTask(task.id);
        setSelectedTask(detailedTask);
        setTasks((current) => {
          const next = current.map((item) => (item.id === detailedTask.id ? detailedTask : item));
          updateQueryData((existing) => ({ ...existing, tasks: next }));
          return next;
        });
      } catch (detailError) {
        console.error('Failed to load task details', detailError);
      } finally {
        setIsDetailLoading(false);
      }
    },
    [updateQueryData],
  );

  const handleCloseTaskDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedTaskId(null);
    setSelectedTask(null);
    setIsDetailLoading(false);
  }, []);

  const handleSaveTask = useCallback(
    async (updates: TaskUpdateInput) => {
      if (!selectedTaskId) {
        return;
      }

      const currentTask = tasks.find((task) => task.id === selectedTaskId);
      const payload: TaskUpdateInput = { ...updates };

      if (typeof payload.title === 'string') {
        payload.title = payload.title.trim();
      }

      if (typeof payload.description === 'string') {
        const baseDescription = currentTask?.description ?? '';
        let nextDescription = payload.description;
        if (baseDescription && nextDescription.startsWith(baseDescription)) {
          const suffix = nextDescription.slice(baseDescription.length).trim();
          nextDescription = suffix.length > 0 ? suffix : baseDescription;
        }
        payload.description = nextDescription.trim() ? nextDescription.trim() : null;
      }

      if (payload.dueDate === '') {
        payload.dueDate = null;
      }

      await updateTaskMutation.mutateAsync({ taskId: selectedTaskId, updates: payload });
    },
    [selectedTaskId, tasks, updateTaskMutation],
  );

  const handleAssignTask = useCallback(
    async (assigneeId: string | null) => {
      if (!selectedTaskId) {
        return;
      }
      await assignTaskMutation.mutateAsync({ taskId: selectedTaskId, assigneeId });
    },
    [assignTaskMutation, selectedTaskId],
  );

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTaskId) {
      return;
    }
    await deleteTaskMutation.mutateAsync(selectedTaskId);
  }, [deleteTaskMutation, selectedTaskId]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
      }

      const destinationStatus = destination.droppableId as TaskStatus;
      const previousTasks = tasks;
      const optimisticTasks = previousTasks.map((task) =>
        task.id === draggableId ? { ...task, status: destinationStatus } : task,
      );

      setTasks(optimisticTasks);
      updateQueryData((existing) => ({ ...existing, tasks: optimisticTasks }));

      updateTaskStatusMutation.mutate(
        { taskId: draggableId, status: destinationStatus, position: destination.index },
        {
          onError: () => {
            setTasks(previousTasks);
            updateQueryData((existing) => ({ ...existing, tasks: previousTasks }));
          },
        },
      );
    },
    [tasks, updateQueryData, updateTaskStatusMutation],
  );

  const filteredTasks = useMemo(() => {
    const dueBefore = filters.dueDateBefore ? new Date(filters.dueDateBefore) : null;
    if (dueBefore) {
      dueBefore.setHours(23, 59, 59, 999);
    }
    const dueAfter = filters.dueDateAfter ? new Date(filters.dueDateAfter) : null;
    if (dueAfter) {
      dueAfter.setHours(0, 0, 0, 0);
    }

    const filtered = tasks.filter((task) => {
      if (filters.assigneeId !== 'all' && (task.assignee?.id ?? 'all') !== filters.assigneeId) {
        return false;
      }
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }
      if (dueBefore) {
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (!taskDueDate || Number.isNaN(taskDueDate.getTime()) || taskDueDate > dueBefore) {
          return false;
        }
      }
      if (dueAfter) {
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (!taskDueDate || Number.isNaN(taskDueDate.getTime()) || taskDueDate < dueAfter) {
          return false;
        }
      }
      return true;
    });

    const direction = filters.sortDirection === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        return (aTime - bTime) * direction;
      }
      if (filters.sortBy === 'priority') {
        const diff = priorityWeight[a.priority] - priorityWeight[b.priority];
        return diff * direction;
      }
      const aCreated = new Date(a.createdAt).getTime();
      const bCreated = new Date(b.createdAt).getTime();
      return (aCreated - bCreated) * direction;
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

  const lastUpdatedLabel = metadata?.lastUpdated ? new Date(metadata.lastUpdated).toLocaleString() : null;
  const errorMessage = isError && error instanceof Error ? error.message : null;

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500">Coordinate diligence workflows across the deal team.</p>
          {lastUpdatedLabel && <p className="text-xs text-gray-400">Last updated {lastUpdatedLabel}</p>}
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={createTaskMutation.isPending}
        >
          New task
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
        </span>
        {typeof metadata?.total === 'number' && (
          <span className="text-gray-400">{metadata.total} total in workspace</span>
        )}
      </div>

      <TaskFilters filters={filters} assignees={assignees} onChange={handleFiltersChange} onClear={handleClearFilters} />

      {(isLoading || isFetching) && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Loading tasks...</div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load tasks. {errorMessage}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {statusColumns.map((column) => (
            <div key={column.id} className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-700">{column.title}</h2>
                <p className="text-xs text-gray-400">
                  {tasksByStatus[column.id].length} task{tasksByStatus[column.id].length === 1 ? '' : 's'}
                </p>
              </div>
              <Droppable droppableId={column.id}>
                {(dropProvided) => (
                  <div
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    data-testid={'droppable-' + column.id}
                    className="flex flex-1 flex-col gap-3 p-4"
                  >
                    {tasksByStatus[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <TaskCard task={task} onClick={() => handleOpenTaskDetail(task)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {tasksByStatus[column.id].length === 0 && !(isLoading || isFetching) && (
                      <p className="text-sm text-gray-400">No tasks in this stage.</p>
                    )}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        assignees={assignees}
        isSubmitting={createTaskMutation.isPending}
      />

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseTaskDetail}
        task={selectedTask}
        loading={isDetailLoading}
        assignees={assignees}
        onSave={handleSaveTask}
        onAssign={handleAssignTask}
        onDelete={handleDeleteTask}
        isSaving={updateTaskMutation.isPending || assignTaskMutation.isPending}
        isDeleting={deleteTaskMutation.isPending}
      />
    </div>
  );
};

export default TaskBoard;
