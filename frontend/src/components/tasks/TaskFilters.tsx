import React from 'react';
import type { TaskFiltersState, TaskAssignee, TaskPriority, TaskStatus } from '../../services/tasksService';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  assignees: TaskAssignee[];
  onChange: (next: TaskFiltersState) => void;
  onClear: () => void;
}

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const sortOptions: { value: TaskFiltersState['sortBy']; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'createdAt', label: 'Created date' },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, assignees, onChange, onClear }) => {
  const updateFilters = (partial: Partial<TaskFiltersState>) => {
    onChange({
      ...filters,
      ...partial,
    });
  };

  return (
    <section aria-label="Task filters" className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5">
        <div className="flex flex-col">
          <label htmlFor="assignee-filter" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Assignee
          </label>
          <select
            id="assignee-filter"
            value={filters.assigneeId}
            onChange={(event) => updateFilters({ assigneeId: event.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            {assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="status-filter" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(event) => updateFilters({ status: event.target.value as TaskStatus | 'all' })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="priority-filter" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(event) => updateFilters({ priority: event.target.value as TaskPriority | 'all' })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="due-before" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Due before
          </label>
          <input
            id="due-before"
            type="date"
            value={filters.dueDateBefore ?? ''}
            onChange={(event) => updateFilters({ dueDateBefore: event.target.value || null })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="due-after" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Due after
          </label>
          <input
            id="due-after"
            type="date"
            value={filters.dueDateAfter ?? ''}
            onChange={(event) => updateFilters({ dueDateAfter: event.target.value || null })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label htmlFor="sort-by" className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sort by
            </label>
            <select
              id="sort-by"
              aria-label="Sort by"
              value={filters.sortBy}
              onChange={(event) => updateFilters({ sortBy: event.target.value as TaskFiltersState['sortBy'] })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => updateFilters({ sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' })}
            className="mt-5 inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            aria-label="Toggle sort direction"
          >
            {filters.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Clear filters
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskFilters;
