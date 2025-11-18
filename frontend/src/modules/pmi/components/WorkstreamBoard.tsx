import React from 'react';
import { useWorkstreams } from '../hooks/useWorkstreams';
import { CheckCircle, Clock, AlertTriangle, XCircle, User } from 'lucide-react';

interface WorkstreamBoardProps {
  projectId: string;
}

export const WorkstreamBoard: React.FC<WorkstreamBoardProps> = ({ projectId }) => {
  const { data, isLoading, error } = useWorkstreams(projectId);

  if (isLoading) {
    return <div className="text-gray-500">Loading workstreams...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading workstreams</div>;
  }

  const workstreams = data?.items || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'at_risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'blocked':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'stabilization':
        return 'bg-blue-50 border-blue-200';
      case 'integration':
        return 'bg-yellow-50 border-yellow-200';
      case 'optimization':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Workstreams</h2>
      </div>

      {workstreams.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No workstreams yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workstreams.map((workstream) => (
            <div
              key={workstream.id}
              className={`bg-white rounded-lg border-2 p-6 ${getPhaseColor(workstream.phase)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{workstream.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{workstream.workstream_type}</p>
                </div>
                {getStatusIcon(workstream.status)}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{workstream.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${workstream.progress_percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-2 py-1 rounded font-medium ${getStatusColor(workstream.status)}`}
                >
                  {workstream.status.replace('_', ' ')}
                </span>
                {workstream.phase && (
                  <span className="text-gray-600 capitalize">{workstream.phase}</span>
                )}
              </div>

              {workstream.owner_id && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Owner assigned</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

