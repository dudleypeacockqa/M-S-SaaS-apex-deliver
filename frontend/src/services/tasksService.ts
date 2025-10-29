import { apiClient } from './api/client';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskAssignee {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface TaskComment {
  id: string;
  author: TaskAssignee | null;
  message: string;
  createdAt: string;
}

export interface TaskActivityEntry {
  id: string;
  message: string;
  createdAt: string;
  actor?: TaskAssignee | null;
}

export interface TaskDealSummary {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignee: TaskAssignee | null;
  deal: TaskDealSummary | null;
  comments: TaskComment[];
  activity: TaskActivityEntry[];
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string | null;
  dealId?: string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string | null;
  dealId?: string | null;
}

export interface TaskFiltersState {
  assigneeId: string | 'all';
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDirection: 'asc' | 'desc';
  dueDateBefore: string | null;
  dueDateAfter: string | null;
}

export interface TaskBoardMetadata {
  total: number;
  lastUpdated: string | null;
}

export interface TaskBoardData {
  tasks: Task[];
  assignees: TaskAssignee[];
  filters: TaskFiltersState;
  metadata: TaskBoardMetadata;
}

interface TaskAssigneeApi {
  id: string;
  name: string;
  avatar_url?: string | null;
}

interface TaskCommentApi {
  id: string;
  author: TaskAssigneeApi | null;
  message: string;
  created_at: string;
}

interface TaskActivityApi {
  id: string;
  message: string;
  created_at: string;
  actor?: TaskAssigneeApi | null;
}

interface TaskDealApi {
  id: string;
  name: string;
}

interface TaskApiResponse {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assignee?: TaskAssigneeApi | null;
  deal?: TaskDealApi | null;
  comments?: TaskCommentApi[];
  activity?: TaskActivityApi[];
  created_at: string;
  updated_at: string | null;
}

interface TaskListApiResponse {
  items: TaskApiResponse[];
  total: number;
  last_updated?: string | null;
}

interface TaskAssigneeListResponse {
  assignees: TaskAssigneeApi[];
}

const FILTERS_STORAGE_KEY = 'task-board-filters';

export const DEFAULT_FILTERS: TaskFiltersState = {
  assigneeId: 'all',
  status: 'all',
  priority: 'all',
  sortBy: 'priority',
  sortDirection: 'desc',
  dueDateBefore: null,
  dueDateAfter: null,
};

const statusMapFromApi: Record<string, TaskStatus> = {
  todo: 'todo',
  to_do: 'todo',
  backlog: 'todo',
  in_progress: 'in_progress',
  doing: 'in_progress',
  done: 'done',
  completed: 'done',
};

const statusMapToApi: Record<TaskStatus, string> = {
  todo: 'todo',
  in_progress: 'in_progress',
  done: 'done',
};

const priorityFromApi: Record<string, TaskPriority> = {
  low: 'low',
  normal: 'medium',
  medium: 'medium',
  high: 'high',
  urgent: 'urgent',
};

const priorityToApi: Record<TaskPriority, string> = {
  low: 'low',
  medium: 'normal',
  high: 'high',
  urgent: 'urgent',
};

const toTaskStatus = (value: string): TaskStatus => {
  const normalised = value.toLowerCase();
  return statusMapFromApi[normalised] ?? 'todo';
};

const toTaskPriority = (value: string): TaskPriority => {
  const normalised = value.toLowerCase();
  return priorityFromApi[normalised] ?? 'medium';
};

const toIsoDate = (value?: string | null): string | null => {
  if (!value) return null;
  if (/\d{4}-\d{2}-\d{2}t\d{2}:/i.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }
  return value;
};

const fromApiAssignee = (assignee?: TaskAssigneeApi | null): TaskAssignee | null => {
  if (!assignee) return null;
  return {
    id: assignee.id,
    name: assignee.name,
    avatarUrl: assignee.avatar_url ?? null,
  };
};

const fromApiComment = (comment: TaskCommentApi): TaskComment => ({
  id: comment.id,
  author: fromApiAssignee(comment.author),
  message: comment.message,
  createdAt: comment.created_at,
});

const fromApiActivity = (activity: TaskActivityApi): TaskActivityEntry => ({
  id: activity.id,
  message: activity.message,
  createdAt: activity.created_at,
  actor: activity.actor ? fromApiAssignee(activity.actor) : undefined,
});

const fromApiDeal = (deal?: TaskDealApi | null): TaskDealSummary | null => {
  if (!deal) return null;
  return {
    id: deal.id,
    name: deal.name,
  };
};

const fromApiTask = (task: TaskApiResponse): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? null,
  status: toTaskStatus(task.status),
  priority: toTaskPriority(task.priority),
  dueDate: task.due_date ?? null,
  assignee: fromApiAssignee(task.assignee),
  deal: fromApiDeal(task.deal),
  comments: (task.comments ?? []).map(fromApiComment),
  activity: (task.activity ?? []).map(fromApiActivity),
  createdAt: task.created_at,
  updatedAt: task.updated_at,
});

const readFiltersFromStorage = (): TaskFiltersState => {
  if (typeof window === 'undefined') return DEFAULT_FILTERS;
  try {
    const raw = window.localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<TaskFiltersState>;
    return {
      ...DEFAULT_FILTERS,
      ...parsed,
    };
  } catch (error) {
    console.warn('Failed to read task filters from storage', error);
    return DEFAULT_FILTERS;
  }
};

const writeFiltersToStorage = (filters: TaskFiltersState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.warn('Failed to persist task filters', error);
  }
};

export async function fetchTaskBoardData(): Promise<TaskBoardData> {
  const filters = readFiltersFromStorage();

  const [tasksResponse, assigneesResponse] = await Promise.all([
    apiClient.get<TaskListApiResponse>('/api/v1/tasks'),
    apiClient.get<TaskAssigneeListResponse>('/api/v1/tasks/assignees'),
  ]);

  return {
    tasks: tasksResponse.items.map(fromApiTask),
    assignees: (assigneesResponse.assignees ?? []).map((assignee) => ({
      id: assignee.id,
      name: assignee.name,
      avatarUrl: assignee.avatar_url ?? null,
    })),
    filters,
    metadata: {
      total: tasksResponse.total,
      lastUpdated: tasksResponse.last_updated ?? null,
    },
  };
}

export async function createTask(payload: TaskCreateInput): Promise<Task> {
  const response = await apiClient.post<TaskApiResponse>('/api/v1/tasks', {
    title: payload.title,
    description: payload.description ?? null,
    due_date: payload.dueDate ? toIsoDate(payload.dueDate) : null,
    priority: payload.priority ? priorityToApi[payload.priority] : undefined,
    status: payload.status ? statusMapToApi[payload.status] : undefined,
    assignee_id: payload.assigneeId ?? null,
    deal_id: payload.dealId ?? null,
  });

  return fromApiTask(response);
}

export async function updateTask(taskId: string, updates: TaskUpdateInput): Promise<Task> {
  const response = await apiClient.put<TaskApiResponse>('/api/v1/tasks/' + taskId, {
    title: updates.title,
    description: updates.description ?? null,
    due_date: updates.dueDate ? toIsoDate(updates.dueDate) : undefined,
    priority: updates.priority ? priorityToApi[updates.priority] : undefined,
    status: updates.status ? statusMapToApi[updates.status] : undefined,
    assignee_id: updates.assigneeId ?? undefined,
    deal_id: updates.dealId ?? undefined,
  });

  return fromApiTask(response);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus, position: number): Promise<Task> {
  const response = await apiClient.put<TaskApiResponse>('/api/v1/tasks/' + taskId + '/status', {
    status: statusMapToApi[status],
    position,
  });

  return fromApiTask(response);
}

export async function assignTask(taskId: string, assigneeId: string | null): Promise<Task> {
  const response = await apiClient.post<TaskApiResponse>('/api/v1/tasks/' + taskId + '/assign', {
    assignee_id: assigneeId,
  });

  return fromApiTask(response);
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiClient.delete('/api/v1/tasks/' + taskId);
}

export async function getTask(taskId: string): Promise<Task> {
  const response = await apiClient.get<TaskApiResponse>('/api/v1/tasks/' + taskId);
  return fromApiTask(response);
}

export async function persistFilters(filters: TaskFiltersState): Promise<void> {
  writeFiltersToStorage(filters);
}

export async function logTaskActivity(taskId: string, message: string): Promise<void> {
  await apiClient.post('/api/v1/tasks/' + taskId + '/activity', {
    message,
  });
}

export const getDefaultFilters = (): TaskFiltersState => ({ ...DEFAULT_FILTERS });
