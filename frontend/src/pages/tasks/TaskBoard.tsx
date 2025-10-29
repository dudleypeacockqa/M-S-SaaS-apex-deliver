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
  getDefaultFilters,
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

const isEditableElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
};

const TaskBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskFiltersState>(() => getDefaultFilters());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignees, setAssignees] = useState<TaskAssignee[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const filtersInitialisedRef = useRef(false);

  const { data, isLoading, isError, error } = useQuery<TaskBoardData>({
    queryKey: ['taskBoard'],
    queryFn: fetchTaskBoardData,
    refetchInterval: 45000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setAssignees(data.assignees);
    setTasks(data.tasks);
    if (!filtersInitialisedRef.current) {
      setFilters(data.filters);
      filtersInitialisedRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'n' || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (isEditableElement(event.target)) {
        return;
      }
      event.preventDefault();
      setIsCreateModalOpen(true);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const applyTasksUpdate = useCallback((updater: (current: Task[]) => Task[]) => {
    let computed: Task[] | undefined;
    setTasks((current) => {
      computed = updater(current);
      return computed;
    });
    queryClient.setQueryData<TaskBoardData | undefined>(['taskBoard'], (current) => {
      if (!current) {
        return current;
      }
      const nextTasks = computed ?? updater(current.tasks);
      return {
        ...current,
        tasks: nextTasks,
      };
    });
  }, [queryClient]);

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskCreateInput) => createTask(payload),
    onSuccess: (createdTask) => {
      applyTasksUpdate((current) => [...current, createdTask]);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: TaskUpdateInput }) => updateTask(taskId, updates),
    onSuccess: (updatedTask) => {
      applyTasksUpdate((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      setActiveTask((existing) => (existing?.id === updatedTask.id ? updatedTask : existing));
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status, position }: { taskId: string; status: TaskStatus; position: number }) =>
      updateTaskStatus(taskId, status, position),
    onSuccess: (updatedTask) => {
      applyTasksUpdate((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      setActiveTask((existing) => (existing?.id === updatedTask.id ? updatedTask : existing));
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) =>
      assignTask(taskId, assigneeId),
    onSuccess: (updatedTask) => {
      applyTasksUpdate((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      setActiveTask((existing) => (existing?.id === updatedTask.id ? updatedTask : existing));
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (_, taskId) => {
      applyTasksUpdate((current) => current.filter((task) => task.id !== taskId));
      setIsDetailOpen(false);
      setActiveTaskId(null);
      setActiveTask(null);
      setIsDetailLoading(false);
    },
  });

  const handleCreateTask = useCallback(async (payload: TaskCreateInput) => {
    await createTaskMutation.mutateAsync(payload);
  }, [createTaskMutation]);

  const handleTaskCardClick = useCallback(async (task: Task) => {
    setActiveTaskId(task.id);
    setActiveTask(task);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const detailedTask = await getTask(task.id);
      setActiveTask(detailedTask);
      applyTasksUpdate((current) =>
        current.map((currentTask) => (currentTask.id === detailedTask.id ? detailedTask : currentTask)),
      );
    } catch (detailError) {
      console.error('Failed to load task details', detailError);
    } finally {
      setIsDetailLoading(false);
    }
  }, [applyTasksUpdate]);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setActiveTaskId(null);
    setActiveTask(null);
    setIsDetailLoading(false);
  }, []);

  const handleSaveTask = useCallback(async (updates: TaskUpdateInput) => {
    if (!activeTaskId) {
      return;
    }
    await updateTaskMutation.mutateAsync({ taskId: activeTaskId, updates });
  }, [activeTaskId, updateTaskMutation]);

  const handleAssignTask = useCallback(async (assigneeId: string | null) => {
    if (!activeTaskId) {
      return;
    }
    await assignTaskMutation.mutateAsync({ taskId: activeTaskId, assigneeId });
  }, [activeTaskId, assignTaskMutation]);

  const handleDeleteTask = useCallback(async () => {
    if (!activeTaskId) {
      return;
    }
    await deleteTaskMutation.mutateAsync(activeTaskId);
  }, [activeTaskId, deleteTaskMutation]);

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

    applyTasksUpdate((current) =>
      current.map((task) => (task.id === draggableId ? { ...task, status: destinationStatus } : task)),
    );

    updateTaskStatusMutation.mutate(
      { taskId: draggableId, status: destinationStatus, position: destination.index },
      {
        onError: () => {
          applyTasksUpdate((current) =>
            current.map((task) => (task.id === draggableId ? { ...task, status: sourceStatus } : task)),
          );
        },
      },
    );
  }, [tasks, applyTasksUpdate, updateTaskStatusMutation]);

  const handleFiltersChange = useCallback((nextFilters: TaskFiltersState) => {
    setFilters(nextFilters);
    persistFilters(nextFilters).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    const defaults = getDefaultFilters();
    setFilters(defaults);
    persistFilters(defaults).catch((persistError) => {
      console.error('Failed to persist task filters', persistError);
    });
  }, []);

  useEffect(() => {
    if (!isDetailOpen || !activeTaskId) {
      return;
    }
    const latest = tasks.find((task) => task.id === activeTaskId);
    if (!latest) {
      return;
    }
    setActiveTask((current) => {
      if (!current) {
        return latest;
      }
      return {
        ...current,
        ...latest,
      };
    });
  }, [tasks, isDetailOpen, activeTaskId]);

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
  }, [tasks, filters]);

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
  const lastUpdated = data?.metadata?.lastUpdated ? new Date(data.metadata.lastUpdated).toLocaleString() : null;

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
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={isLoading || createTaskMutation.isPending}
        >
          New task
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>
          Showing {totalVisibleTasks} task{totalVisibleTasks === 1 ? '' : 's'}
        </span>
        {typeof data?.metadata?.total === 'number' && (
          <span className="text-gray-400">{data.metadata.total} total in workspace</span>
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

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load tasks. {error instanceof Error ? error.message : 'Please try again.'}
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
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        assignees={assignees}
        isSubmitting={createTaskMutation.isPending}
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
        isSaving={updateTaskMutation.isPending}
        isDeleting={deleteTaskMutation.isPending}
      />
    </div>
  );
};

export default TaskBoard;
