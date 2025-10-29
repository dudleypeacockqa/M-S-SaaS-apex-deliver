import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskFilters from '../../components/tasks/TaskFilters';
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
  type TaskCreateInput,
  type TaskFiltersState,
  type TaskPriority,
  type TaskStatus,
  type TaskUpdateInput,
} from '../../services/tasksService';

const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'done'];
const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const priorityOrder: Record<TaskPriority, number> = {
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
  if (typeof getDefaultFilters === 'function') {
    const value = getDefaultFilters();
    if (value) return value;
  }
  return { ...FALLBACK_FILTERS };
};

const TaskBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFiltersState>(resolveDefaultFilters());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filtersReady, setFiltersReady] = useState(false);

  const filtersSyncedRef = useRef(false);
  const filtersPersistInitialisedRef = useRef(false);
  const boardTasksRef = useRef<Task[]>([]);

  const boardQuery = useQuery({
    queryKey: ['task-board'],
    queryFn: fetchTaskBoardData,
    refetchInterval: 45000,
  });

  useEffect(() => {
    if (boardQuery.data) {
      setTasks(boardQuery.data.tasks);
      boardTasksRef.current = boardQuery.data.tasks;
      if (!filtersSyncedRef.current) {
        setFilters(boardQuery.data.filters);
        filtersSyncedRef.current = true;
      }
      setFiltersReady(true);
    }
  }, [boardQuery.data]);

  useEffect(() => {
    boardTasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (!filtersReady) return;
    if (!filtersPersistInitialisedRef.current) {
      filtersPersistInitialisedRef.current = true;
      return;
    }
    persistFilters(filters).catch((error) => {
      console.warn('Failed to persist task filters', error);
    });
  }, [filters, filtersReady]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'n') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      event.preventDefault();
      setShowCreateModal(true);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskCreateInput) => createTask(payload),
    onSuccess: (newTask) => {
      setTasks((previous) => [...previous, newTask]);
      queryClient.invalidateQueries({ queryKey: ['task-board'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: TaskUpdateInput }) => updateTask(taskId, updates),
    onSuccess: (updatedTask) => {
      setTasks((previous) => previous.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      queryClient.setQueryData(['task-detail', updatedTask.id], updatedTask);
      queryClient.invalidateQueries({ queryKey: ['task-board'] });
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) => assignTask(taskId, assigneeId),
    onSuccess: (updatedTask) => {
      setTasks((previous) => previous.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      queryClient.setQueryData(['task-detail', updatedTask.id], updatedTask);
      queryClient.invalidateQueries({ queryKey: ['task-board'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (_result, taskId) => {
      setTasks((previous) => previous.filter((task) => task.id !== taskId));
      queryClient.removeQueries({ queryKey: ['task-detail', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-board'] });
      setSelectedTaskId(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status, position }: { taskId: string; status: TaskStatus; position: number }) => updateTaskStatus(taskId, status, position),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['task-board'] });
      const previousTasks = boardTasksRef.current.map((task) => ({ ...task }));
      setTasks((current) => current.map((task) => (task.id === variables.taskId ? { ...task, status: variables.status } : task)));
      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        setTasks(context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      setTasks((previous) => previous.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      queryClient.setQueryData(['task-detail', updatedTask.id], updatedTask);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['task-board'] });
    },
  });

  const handleDragEnd = useCallback((result: DropResult) => {
    const destination = result.destination;
    if (!destination) return;
    if (destination.droppableId === result.source.droppableId && destination.index === result.source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    updateStatusMutation.mutate({
      taskId: result.draggableId,
      status: newStatus,
      position: destination.index,
    });
  }, [updateStatusMutation]);

  const handleFiltersChange = (nextFilters: TaskFiltersState) => {
    setFilters(nextFilters);
  };

  const handleClearFilters = () => {
    setFilters(resolveDefaultFilters());
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.assigneeId !== 'all') {
        if ((task.assignee?.id ?? '') !== filters.assigneeId) return false;
      }
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

      if (filters.dueDateBefore) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
        const filterDate = new Date(filters.dueDateBefore).setHours(0, 0, 0, 0);
        if (taskDate > filterDate) return false;
      }

      if (filters.dueDateAfter) {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
        const filterDate = new Date(filters.dueDateAfter).setHours(0, 0, 0, 0);
        if (taskDate < filterDate) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };

    const comparator = (a: Task, b: Task) => {
      if (filters.sortBy === 'priority') {
        const difference = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (difference !== 0) return difference;
      } else if (filters.sortBy === 'dueDate') {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
        if (aTime !== bTime) return aTime - bTime;
      } else {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        if (aTime !== bTime) return aTime - bTime;
      }

      return a.title.localeCompare(b.title);
    };

    filteredTasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    statusOrder.forEach((status) => {
      grouped[status].sort((a, b) => {
        const outcome = comparator(a, b);
        return filters.sortDirection === 'asc' ? outcome : outcome * -1;
      });
    });

    return grouped;
  }, [filteredTasks, filters]);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTaskId(task.id);
  }, []);

  const selectedTaskQuery = useQuery({
    queryKey: ['task-detail', selectedTaskId],
    queryFn: () => getTask(selectedTaskId as string),
    enabled: Boolean(selectedTaskId),
    initialData: () => {
      if (!selectedTaskId) return undefined;
      return tasks.find((task) => task.id === selectedTaskId);
    },
  });

  const assignees: TaskAssignee[] = boardQuery.data?.assignees ?? [];

  if (boardQuery.isLoading && !boardQuery.data) {
    return <div className="p-6 text-sm text-gray-600">Loading tasks...</div>;
  }

  if (boardQuery.isError) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load tasks. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task automation board</h1>
          <p className="text-sm text-gray-500">Organise and prioritise tasks across your deals.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          New Task
        </button>
      </div>

      <TaskFilters filters={filters} assignees={assignees} onChange={handleFiltersChange} onClear={handleClearFilters} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {statusOrder.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  data-testid={'droppable-' + status}
                  className="flex min-h-[280px] flex-col rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">{statusLabels[status]}</h2>
                    <span className="text-xs text-gray-500">{tasksByStatus[status].length}</span>
                  </div>

                  <div className="flex-1 space-y-3">
                    {tasksByStatus[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <TaskCard task={task} onClick={handleTaskClick} />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {tasksByStatus[status].length === 0 && (
                      <p className="rounded-md border border-dashed border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
                        No tasks in this column
                      </p>
                    )}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showCreateModal && (
        <TaskFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createTaskMutation.mutateAsync(payload)}
          assignees={assignees}
          deals={[]}
          isSubmitting={createTaskMutation.isPending}
        />
      )}

      {selectedTaskId && (
        <TaskDetailModal
          isOpen={Boolean(selectedTaskId)}
          onClose={() => setSelectedTaskId(null)}
          task={selectedTaskQuery.data ?? null}
          loading={selectedTaskQuery.isFetching && !selectedTaskQuery.isFetched}
          assignees={assignees}
          onSave={(updates) => updateTaskMutation.mutateAsync({ taskId: selectedTaskId, updates })}
          onAssign={(assignee) => assignTaskMutation.mutateAsync({ taskId: selectedTaskId, assigneeId: assignee })}
          onDelete={() => deleteTaskMutation.mutateAsync(selectedTaskId)}
          isSaving={updateTaskMutation.isPending}
          isDeleting={deleteTaskMutation.isPending}
        />
      )}
    </div>
  );
};

export default TaskBoard;
