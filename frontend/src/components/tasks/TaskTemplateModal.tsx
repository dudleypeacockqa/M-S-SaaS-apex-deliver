import React, { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskTemplate, type TaskTemplateTask, type TaskTemplateCreateInput } from '../../services/tasksService';
import { Spinner } from '../ui';
import type { TaskPriority } from '../../services/tasksService';

interface TaskTemplateModalProps {
  dealId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority | '';
  stage_gate: string;
}

const TaskTemplateModal: React.FC<TaskTemplateModalProps> = ({
  dealId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [errors, setErrors] = useState<{ name?: string; tasks?: string }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: TaskTemplateCreateInput) =>
      createTaskTemplate(dealId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTemplates', dealId] });
      onSuccess?.();
      handleClose();
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create template';
      setErrors({ name: errorMessage });
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const handleClose = () => {
    // Reset form on close
    setTemplateName('');
    setTemplateDescription('');
    setTasks([]);
    setErrors({});
    onClose();
  };

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isPending]);

  const handleAddTask = () => {
    setTasks([...tasks, { title: '', description: '', priority: '', stage_gate: '' }]);
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskChange = (index: number, field: keyof TaskFormData, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    if (!templateName.trim()) {
      setErrors({ name: 'Template name is required' });
      return;
    }

    if (tasks.length === 0) {
      setErrors({ tasks: 'At least one task is required' });
      return;
    }

    // Validate all tasks have titles
    const invalidTasks = tasks.some((task) => !task.title.trim());
    if (invalidTasks) {
      setErrors({ tasks: 'All tasks must have a title' });
      return;
    }

    // Convert form data to API format
    const templateTasks: TaskTemplateTask[] = tasks.map((task) => ({
      title: task.title.trim(),
      description: task.description.trim() || null,
      priority: task.priority || undefined,
      stage_gate: task.stage_gate.trim() || null,
    }));

    mutate({
      name: templateName.trim(),
      description: templateDescription.trim() || null,
      tasks: templateTasks,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-modal-title"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget && !isPending) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 id="template-modal-title" className="text-lg font-semibold text-gray-900">
            Create Task Template
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Template Name */}
            <div>
              <label
                htmlFor="template-name"
                className="block text-sm font-medium text-gray-700"
              >
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                id="template-name"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="e.g., Due Diligence Checklist"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Template Description */}
            <div>
              <label
                htmlFor="template-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Optional description for this template"
              />
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Tasks <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Add new task to template"
                >
                  + Add Task
                </button>
              </div>

              {tasks.length === 0 && (
                <p className="text-sm text-gray-500 mb-3">
                  Click "Add Task" to add tasks to this template
                </p>
              )}

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Task {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(index)}
                        className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
                        aria-label={`Remove task ${index + 1}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor={`task-title-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`task-title-${index}`}
                          type="text"
                          value={task.title}
                          onChange={(e) =>
                            handleTaskChange(index, 'title', e.target.value)
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          placeholder="e.g., Financial Review"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`task-description-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id={`task-description-${index}`}
                          value={task.description}
                          onChange={(e) =>
                            handleTaskChange(index, 'description', e.target.value)
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          placeholder="Optional task description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor={`task-priority-${index}`}
                            className="block text-xs font-medium text-gray-700"
                          >
                            Priority
                          </label>
                          <select
                            id={`task-priority-${index}`}
                            value={task.priority}
                            onChange={(e) =>
                              handleTaskChange(
                                index,
                                'priority',
                                e.target.value as TaskPriority | ''
                              )
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          >
                            <option value="">Select priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`task-stage-gate-${index}`}
                            className="block text-xs font-medium text-gray-700"
                          >
                            Stage Gate
                          </label>
                          <input
                            id={`task-stage-gate-${index}`}
                            type="text"
                            value={task.stage_gate}
                            onChange={(e) =>
                              handleTaskChange(index, 'stage_gate', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="e.g., DD-Phase-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.tasks && (
                <p className="mt-2 text-sm text-red-600">{errors.tasks}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isPending}
              aria-label="Cancel template creation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Spinner className="h-4 w-4" />}
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskTemplateModal;

