import React, { useEffect, useMemo, useState } from 'react';
import type { Task, TaskAssignee, TaskPriority, TaskStatus, TaskUpdateInput } from '../../services/tasksService';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  loading: boolean;
  assignees: TaskAssignee[];
  onSave: (updates: TaskUpdateInput) => Promise<void> | void;
  onAssign: (assigneeId: string | null) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDateInputValue = (value: string | null): string => {
  if (!value) return '';
  if (value.length === 10 && value.includes('-')) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  loading,
  assignees,
  onSave,
  onAssign,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(getDateInputValue(task.dueDate));
      setAssigneeId(task.assignee?.id ?? '');
      setLocalError(null);
      setSaving(false);
      setDeleting(false);
    }
  }, [task, isOpen]);

  const handleAssignChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setAssigneeId(value);
    try {
      await onAssign(value || null);
    } catch (error) {
      console.error('Failed to assign task', error);
      setLocalError('Failed to update assignee');
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!task) return;

    const updates: TaskUpdateInput = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      status,
      priority,
      dueDate: dueDate || null,
      assigneeId: assigneeId || null,
      dealId: task.deal?.id ?? null,
    };

    try {
      setSaving(true);
      await onSave(updates);
      setSaving(false);
      setLocalError(null);
    } catch (error) {
      console.error('Failed to save task', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to save task');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      setDeleting(true);
      await onDelete();
      setDeleting(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete task', error);
      setLocalError(error instanceof Error ? error.message : 'Failed to delete task');
      setDeleting(false);
    }
  };

  const activityEntries = useMemo(() => task?.activity ?? [], [task]);
  const comments = useMemo(() => task?.comments ?? [], [task]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-heading"
        className="h-full w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl md:h-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="task-details-heading" className="text-lg font-semibold text-gray-900">Task details</h2>
            {task && (
              <p className="text-base font-semibold text-gray-900">{task.title}</p>
            )}
            {task?.deal && (
              <p className="text-sm text-gray-500">Linked deal: <span className="font-medium text-gray-700">{task.deal.name}</span></p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-50"
          >
            Close
          </button>
        </header>

        {loading && (
          <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Loading task details...
          </div>
        )}

        {localError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {localError}
          </div>
        )}

        {task && (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="task-detail-title" className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                id="task-detail-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="task-detail-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="task-detail-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="task-detail-status" className="mb-1 text-sm font-medium text-gray-700">Status</label>
                <select
                  id="task-detail-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as TaskStatus)}
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
                <label htmlFor="task-detail-priority" className="mb-1 text-sm font-medium text-gray-700">Priority</label>
                <select
                  id="task-detail-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as TaskPriority)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="task-detail-assignee" className="mb-1 text-sm font-medium text-gray-700">Assignee</label>
                <select
                  id="task-detail-assignee"
                  value={assigneeId}
                  onChange={handleAssignChange}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {assignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="task-detail-due-date" className="mb-1 text-sm font-medium text-gray-700">Due date</label>
                <input
                  id="task-detail-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  disabled={isDeleting || deleting}
                >
                  {isDeleting || deleting ? 'Deleting...' : 'Delete task'}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
                  disabled={isSaving || saving}
                >
                  {isSaving || saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </form>
        )}

        <section className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-800">Activity log</h3>
          {activityEntries.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No recent activity recorded.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {activityEntries.map((entry) => (
                <li key={entry.id} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                  <div className="flex justify-between">
                    <span>{entry.message}</span>
                    <span className="text-xs text-gray-400">{formatDateTime(entry.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-800">Comments</h3>
          {comments.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">No comments yet.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-md border border-gray-100 bg-white px-3 py-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{comment.author?.name ?? 'Team member'}</span>
                    <span className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{comment.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default TaskDetailModal;
