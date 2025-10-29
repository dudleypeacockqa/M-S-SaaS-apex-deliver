import React, { useEffect, useState } from 'react';
import type { TaskAssignee, TaskCreateInput, TaskDealSummary, TaskPriority, TaskStatus } from '../../services/tasksService';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TaskCreateInput) => Promise<void> | void;
  assignees: TaskAssignee[];
  deals?: TaskDealSummary[];
  isSubmitting?: boolean;
  defaultValues?: Partial<TaskCreateInput>;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const getDateValue = (value?: string | null): string => {
  if (!value) return '';
  if (value.length === 10 && value.includes('-')) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  assignees,
  deals = [],
  isSubmitting = false,
  defaultValues,
}) => {
  const [title, setTitle] = useState(defaultValues?.title ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(defaultValues?.status ?? 'todo');
  const [priority, setPriority] = useState<TaskPriority>(defaultValues?.priority ?? 'medium');
  const [assigneeId, setAssigneeId] = useState<string>(defaultValues?.assigneeId ?? '');
  const [dueDate, setDueDate] = useState<string>(getDateValue(defaultValues?.dueDate ?? null));
  const [dealId, setDealId] = useState<string>(defaultValues?.dealId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultValues?.title ?? '');
      setDescription(defaultValues?.description ?? '');
      setStatus(defaultValues?.status ?? 'todo');
      setPriority(defaultValues?.priority ?? 'medium');
      setAssigneeId(defaultValues?.assigneeId ?? '');
      setDueDate(getDateValue(defaultValues?.dueDate ?? null));
      setDealId(defaultValues?.dealId ?? '');
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen, defaultValues]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const payload: TaskCreateInput = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      status,
      priority,
      assigneeId: assigneeId || null,
      dueDate: dueDate || null,
      dealId: dealId || null,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setSubmitting(false);
      onClose();
    } catch (submitError) {
      console.error('Failed to submit task form', submitError);
      setSubmitting(false);
      setError(submitError instanceof Error ? submitError.message : 'Failed to create task');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-heading"
        className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="create-task-heading" className="text-lg font-semibold text-gray-900">Create task</h2>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Add helpful context for the assignee"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label htmlFor="task-status" className="mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                id="task-status"
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
              <label htmlFor="task-priority" className="mb-1 text-sm font-medium text-gray-700">Priority</label>
              <select
                id="task-priority"
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
              <label htmlFor="task-assignee" className="mb-1 text-sm font-medium text-gray-700">Assignee</label>
              <select
                id="task-assignee"
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
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
              <label htmlFor="task-due-date" className="mb-1 text-sm font-medium text-gray-700">Due date</label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="task-deal" className="mb-1 text-sm font-medium text-gray-700">Deal association (optional)</label>
            <select
              id="task-deal"
              value={dealId}
              onChange={(event) => setDealId(event.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">No deal</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              disabled={isSubmitting || submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
              disabled={isSubmitting || submitting}
            >
              {isSubmitting || submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
