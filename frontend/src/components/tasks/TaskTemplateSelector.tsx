import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listTaskTemplates, type TaskTemplate } from '../../services/tasksService';
import { Spinner } from '../ui';

interface TaskTemplateSelectorProps {
  dealId: string;
  onTemplateSelect: (templateId: string) => void;
  onClose: () => void;
}

const TaskTemplateSelector: React.FC<TaskTemplateSelectorProps> = ({
  dealId,
  onTemplateSelect,
  onClose,
}) => {
  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery<TaskTemplate[]>({
    queryKey: ['taskTemplates', dealId],
    queryFn: () => listTaskTemplates(dealId),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Spinner className="h-8 w-8" />
          <span className="ml-3 text-sm text-gray-600">Loading templates...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-medium text-red-800">
            Failed to load templates
          </p>
          {error instanceof Error && (
            <p className="mt-1 text-xs text-red-600">{error.message}</p>
          )}
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">No templates available</p>
          <p className="mt-1 text-xs text-gray-500">
            Create a template to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Task Template
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateSelect(template.id)}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="mt-1 text-xs text-gray-600">
                      {template.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-xs text-gray-500">
                  {template.tasks.length} {template.tasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskTemplateSelector;

