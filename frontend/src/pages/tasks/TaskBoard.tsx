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
  getDefaultFilters,
  getTask,
  persistFilters,
  updateTask,
  updateTaskStatus,
  type Task,
  type TaskAssignee,
  type TaskBoardMetadata,
  type TaskCreateInput,
  type TaskFiltersState,
  type TaskPriority,
  type TaskStatus,
  type TaskUpdateInput,
} from '../../services/tasksService';

const columns: Array<{ id: TaskStatus; title: string }> = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const priorityWeights: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

const FALLBACK_FILTERS: TaskFiltersState = {
  assigneeId: 'all',
  status: 'all',
  priority: 'all',
  sortBy: 'priority',
  sortDirection: 'desc',
  dueDateBefore: null,
  dueDateAfter: null,
};

const resolveDefaultFilters = (): TaskFiltersState => {
  try {
    const defaults = getDefaultFilters();
    if (defaults) {
      return { ...defaults };
    }
  } catch (resolutionError) {
    console.warn('Falling back to default task filters', resolutionError);
  }
  return { ...FALLBACK_FILTERS };
};

const isEditableElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
};

const TaskBoard: React.FC = () => {
  const [filters, setFilters] = useState<TaskFiltersState>(() => resolveDefaultFilters());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [metadata, setMetadata] = useState<TaskBoardMetadata | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const filtersInitialisedRef = useRef(false);
  const skipNextRenderRef = useRef(false);
  const hasMountedRef = useRef(false);
  const isFetchingRef = useRef(false);

  const markSkipNextRender = useCallback(() => {
    skipNextRenderRef.current = true;
  }, []);

  const loadTaskBoard = useCallback(async ({ showSpinner = false } = {}) => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    if (showSpinner) {
      setIsLoading(true);
    }

    try {
      const data = await fetchTaskBoardData();
      markSkipNextRender();
      setTasks(data.tasks);
      setAssignees(data.assignees);
      setMetadata(data.metadata);
      if (!filtersInitialisedRef.current) {
        setFilters(data.filters ?? resolveDefaultFilters());
        filtersInitialisedRef.current = true;
      }
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      if (showSpinner) {
        setIsLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [markSkipNextRender]);

  useEffect(() => {
    void loadTaskBoard({ showSpinner: true });
  }, [loadTaskBoard]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (skipNextRenderRef.current) {
      skipNextRenderRef.current = false;
      return;
    }
    void loadTaskBoard();
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }
    const intervalId = window.setInterval(() => {
      void loadTaskBoard();
    }, 45000);
    return () => window.clearInterval(intervalId);
  }, [loadTaskBoard]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'n' || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (isEditableElement(event.target)) {
        return;
      }
      event.preventDefault();
      markSkipNextRender();
      setIsCreateModalOpen(true);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [markSkipNextRender]);

  const handleFiltersChange = useCallback((nextFilters: TaskFiltersState) => {
    markSkipNextRender();
    setFilters(nextFilters);
    persistFilters(nextFilters).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, [markSkipNextRender]);

  const handleClearFilters = useCallback(() => {
    const defaults = resolveDefaultFilters();
    markSkipNextRender();
    setFilters(defaults);
    persistFilters(defaults).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, [markSkipNextRender]);

  const handleCreateTask = useCallback(async (payload: TaskCreateInput) => {
    markSkipNextRender();
    setIsCreatingTask(true);
    try {
      const newTask = await createTask(payload);
      markSkipNextRender();
      setTasks((current) => [...current, newTask]);
      setMetadata((current) => (
        current
          ? {
              ...current,
              total: current.total + 1,
              lastUpdated: new Date().toISOString(),
            }
          : current
      ));
      setLoadError(null);
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    } finally {
      markSkipNextRender();
      setIsCreatingTask(false);
    }
  }, [markSkipNextRender]);

  const handleTaskCardClick = useCallback(async (task: Task) => {
    markSkipNextRender();
    setActiveTaskId(task.id);
    setActiveTask(task);
    setIsDetailOpen(true);
    markSkipNextRender();
    setIsDetailLoading(true);
    try {
      const detailedTask = await getTask(task.id);
      markSkipNextRender();
      setActiveTask(detailedTask);
      setTasks((current) => current.map((item) => (item.id === detailedTask.id ? detailedTask : item)));
    } catch (error) {
      console.error('Failed to load task details', error);
    } finally {
      markSkipNextRender();
      setIsDetailLoading(false);
    }
  }, [markSkipNextRender]);

  const handleCloseDetail = useCallback(() => {
    markSkipNextRender();
    setIsDetailOpen(false);
    markSkipNextRender();
    setActiveTaskId(null);
    markSkipNextRender();
    setActiveTask(null);
  }, [markSkipNextRender]);

  const handleSaveTask = useCallback(async (updates: TaskUpdateInput) => {
    if (!activeTaskId) {
      return;
    }
    markSkipNextRender();
    setIsUpdatingTask(true);
    try {
      const updatedTask = await updateTask(activeTaskId, updates);
      markSkipNextRender();
      setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      markSkipNextRender();
      setActiveTask(updatedTask);
      setLoadError(null);
    } catch (error) {
      console.error('Failed to update task', error);
      throw error;
    } finally {
      markSkipNextRender();
      setIsUpdatingTask(false);
    }
  }, [activeTaskId, markSkipNextRender]);

  const handleAssignTask = useCallback(async (assigneeId: string | null) => {
    if (!activeTaskId) {
      return;
    }
    markSkipNextRender();
    setIsAssigningTask(true);
    try {
      const updatedTask = await assignTask(activeTaskId, assigneeId);
      markSkipNextRender();
      setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      markSkipNextRender();
      setActiveTask(updatedTask);
      setLoadError(null);
    } catch (error) {
      console.error('Failed to assign task', error);
      throw error;
    } finally {
      markSkipNextRender();
      setIsAssigningTask(false);
    }
  }, [activeTaskId, markSkipNextRender]);

  const handleDeleteTask = useCallback(async () => {
    if (!activeTaskId) {
      return;
    }
    markSkipNextRender();
    setIsDeletingTask(true);
    try {
      await deleteTask(activeTaskId);
      markSkipNextRender();
      setTasks((current) => current.filter((task) => task.id !== activeTaskId));
      markSkipNextRender();
      setMetadata((current) => (
        current
          ? {
              ...current,
              total: Math.max(0, current.total - 1),
              lastUpdated: new Date().toISOString(),
            }
          : current
      ));
      markSkipNextRender();
      setActiveTask(null);
      markSkipNextRender();
      setActiveTaskId(null);
      markSkipNextRender();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Failed to delete task', error);
      throw error;
    } finally {
      markSkipNextRender();
      setIsDeletingTask(false);
    }
  }, [activeTaskId, markSkipNextRender]);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    if (destinationStatus === sourceStatus && destination.index === source.index) {
      return;
    }

    const movedTask = tasks.find((task) => task.id === draggableId);
    if (!movedTask) {
      return;
    }

    markSkipNextRender();
    setTasks((current) => current.map((task) => (task.id === draggableId ? { ...task, status: destinationStatus } : task)));

    updateTaskStatus(draggableId, destinationStatus, destination.index)
      .then((updatedTask) => {
        markSkipNextRender();
        setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
        markSkipNextRender();
        setActiveTask((existing) => (existing?.id === updatedTask.id ? updatedTask : existing));
        setLoadError(null);
      })
      .catch((error) => {
        console.error('Failed to update task status', error);
        markSkipNextRender();
        setTasks((current) => current.map((task) => (task.id === draggableId ? { ...task, status: sourceStatus } : task)));
      });
  }, [markSkipNextRender, tasks]);

  useEffect(() => {
    if (!isDetailOpen || !activeTaskId) {
      return;
    }
    const latest = tasks.find((task) => task.id === activeTaskId);
    if (!latest) {
      return;
    }
    markSkipNextRender();
    setActiveTask((current) => {
      if (!current) {
        return latest;
      }
      return {
        ...current,
        ...latest,
      };
    });
  }, [tasks, isDetailOpen, activeTaskId, markSkipNextRender]);

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

      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      if (dueBefore) {
        if (!taskDueDate || Number.isNaN(taskDueDate.getTime()) || taskDueDate > dueBefore) {
          return false;
        }
      }
      if (dueAfter) {
        if (!taskDueDate || Number.isNaN(taskDueDate.getTime()) || taskDueDate < dueAfter) {
          return false;
        }
      }

      return true;
    });

    const factor = filters.sortDirection === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        return (aTime - bTime) * factor;
      }

      if (filters.sortBy === 'priority') {
        const diff = priorityWeights[a.priority] - priorityWeights[b.priority];
        return diff * factor;
      }

      const aCreatedAt = new Date(a.createdAt).getTime();
      const bCreatedAt = new Date(b.createdAt).getTime();
      return (aCreatedAt - bCreatedAt) * factor;
    });
  }, [filters, tasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    filteredTasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const totalVisibleTasks = filteredTasks.length;
  const lastUpdated = metadata?.lastUpdated ? new Date(metadata.lastUpdated).toLocaleString() : null;
  const errorMessage = loadError ? `Failed to load tasks. ${loadError}` : null;

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500">Coordinate diligence workflows across the deal team.</p>
          {lastUpdated && (
            <p className="text-xs text-gray-400">Last updated {lastUpdated}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            markSkipNextRender();
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={isLoading || isCreatingTask}
        >
          New task
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          Showing {totalVisibleTasks} task{totalVisibleTasks === 1 ? '' : 's'}
        </span>
        {typeof metadata?.total === 'number' && (
          <span className="text-gray-400">{metadata.total} total in workspace</span>
        )}
      </div>

      <TaskFilters
        filters={filters}
        assignees={assignees}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />

      {isLoading && (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading tasks...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
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
                            <TaskCard task={task} onClick={() => handleTaskCardClick(task)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {tasksByStatus[column.id].length === 0 && !isLoading && (
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
        onClose={() => {
          markSkipNextRender();
          setIsCreateModalOpen(false);
        }}
        onSubmit={handleCreateTask}
        assignees={assignees}
        isSubmitting={isCreatingTask}
      />

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        task={activeTask}
        loading={isDetailLoading}
        assignees={assignees}
        onSave={handleSaveTask}
        onAssign={handleAssignTask}
        onDelete={handleDeleteTask}
        isSaving={isUpdatingTask || isAssigningTask}
        isDeleting={isDeletingTask}
      />
    </div>
  );
};

export default TaskBoard;
