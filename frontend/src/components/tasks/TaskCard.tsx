import React from 'react';
import type { Task, TaskPriority } from '../../services/tasksService';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const formatDate = (value: string | null): string => {
  if (!value) return 'No due date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] ?? '').toUpperCase() + (parts[parts.length - 1][0] ?? '').toUpperCase();
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      data-testid={'task-card-' + task.id}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
        <span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + priorityStyles[task.priority]}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Due {formatDate(task.dueDate)}</span>
        {task.assignee ? (
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
            {getInitials(task.assignee.name)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Unassigned</span>
        )}
      </div>

      {task.deal && (
        <div className="mt-3 rounded bg-gray-50 px-3 py-2 text-xs text-gray-500">
          Linked deal: <span className="font-medium text-gray-700">{task.deal.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
