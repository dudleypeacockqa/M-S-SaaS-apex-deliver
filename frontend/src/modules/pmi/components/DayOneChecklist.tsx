import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmiApi, type PMIDayOneChecklist } from '../services/pmiApi';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';

interface DayOneChecklistProps {
  projectId: string;
}

export const DayOneChecklist: React.FC<DayOneChecklistProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['pmi', 'day-one-checklist', projectId],
    queryFn: () => pmiApi.listDayOneChecklist(projectId),
  });

  const completeMutation = useMutation({
    mutationFn: (itemId: string) => pmiApi.completeDayOneChecklistItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pmi', 'day-one-checklist', projectId] });
      queryClient.invalidateQueries({ queryKey: ['pmi', 'dashboard', projectId] });
    },
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading checklist...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading checklist</div>;
  }

  const checklistItems = data?.items || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'at_risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'it':
        return 'bg-blue-50 border-blue-200';
      case 'hr':
        return 'bg-purple-50 border-purple-200';
      case 'finance':
        return 'bg-green-50 border-green-200';
      case 'legal':
        return 'bg-red-50 border-red-200';
      case 'communications':
        return 'bg-yellow-50 border-yellow-200';
      case 'operations':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Group by category
  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PMIDayOneChecklist[]>);

  const completedCount = checklistItems.filter((item) => item.status === 'complete').length;
  const totalCount = checklistItems.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Day 1 Readiness Checklist</h2>
        <div className="text-sm text-gray-600">
          {completedCount} of {totalCount} complete ({completionRate.toFixed(0)}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-gray-900">{completionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Checklist by Category */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No checklist items yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div
              key={category}
              className={`bg-white rounded-lg border-2 p-6 ${getCategoryColor(category)}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{category}</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200"
                  >
                    <button
                      onClick={() => {
                        if (item.status !== 'complete') {
                          completeMutation.mutate(item.id);
                        }
                      }}
                      disabled={item.status === 'complete' || completeMutation.isPending}
                      className="mt-0.5"
                    >
                      {getStatusIcon(item.status)}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              item.status === 'complete' ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {item.item}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                        <span
                          className={`ml-3 px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      {item.due_date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Due: {new Date(item.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

