import React from 'react';
import { usePMIDashboard } from '../hooks/usePMIDashboard';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

interface TimelineViewProps {
  projectId: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ projectId }) => {
  const { data: dashboard, isLoading } = usePMIDashboard(projectId);

  if (isLoading) {
    return <div className="text-gray-500">Loading timeline...</div>;
  }

  if (!dashboard) {
    return <div className="text-red-500">Error loading timeline</div>;
  }

  const phases = [
    {
      name: 'Stabilization',
      phase: 'stabilization' as const,
      days: 'Day 1-30',
      description: 'Establish control, ensure operational continuity, and secure quick wins',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      name: 'Integration',
      phase: 'integration' as const,
      days: 'Day 31-60',
      description: 'Merge core processes and address cultural differences',
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
    },
    {
      name: 'Optimization',
      phase: 'optimization' as const,
      days: 'Day 61-100',
      description: 'Performance tracking and synergy realization',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
    },
  ];

  const getPhaseStatus = (phase: string) => {
    if (!dashboard.current_phase) return 'upcoming';
    if (dashboard.current_phase === phase) return 'current';
    const phaseOrder = ['stabilization', 'integration', 'optimization'];
    const currentIndex = phaseOrder.indexOf(dashboard.current_phase);
    const phaseIndex = phaseOrder.indexOf(phase);
    return phaseIndex < currentIndex ? 'completed' : 'upcoming';
  };

  const getPhaseDays = (phase: string) => {
    if (!dashboard.days_since_day_one) return null;
    switch (phase) {
      case 'stabilization':
        return Math.max(0, Math.min(30, dashboard.days_since_day_one));
      case 'integration':
        return dashboard.days_since_day_one > 30
          ? Math.max(0, Math.min(30, dashboard.days_since_day_one - 30))
          : 0;
      case 'optimization':
        return dashboard.days_since_day_one > 60
          ? Math.max(0, Math.min(40, dashboard.days_since_day_one - 60))
          : 0;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">100-Day Timeline</h2>
        {dashboard.days_since_day_one !== undefined && (
          <div className="text-sm text-gray-600">
            <Calendar className="w-4 h-4 inline mr-1" />
            Day {dashboard.days_since_day_one} of 100
          </div>
        )}
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Phases */}
        <div className="space-y-8">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.phase);
            const phaseDays = getPhaseDays(phase.phase);
            const isActive = status === 'current';
            const isCompleted = status === 'completed';

            return (
              <div key={phase.phase} className="relative flex items-start gap-6">
                {/* Phase Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                    isActive
                      ? `${phase.borderColor} ${phase.color} text-white`
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : isActive ? (
                    <Clock className="w-8 h-8" />
                  ) : (
                    <Calendar className="w-8 h-8" />
                  )}
                </div>

                {/* Phase Content */}
                <div className="flex-1 pt-2">
                  <div
                    className={`bg-white rounded-lg border-2 p-6 ${
                      isActive ? phase.borderColor : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                        <p className="text-sm text-gray-600">{phase.days}</p>
                      </div>
                      {phaseDays !== null && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{phaseDays} days</p>
                          <p className="text-xs text-gray-500">
                            {phase.phase === 'stabilization'
                              ? `${phaseDays}/30`
                              : phase.phase === 'integration'
                              ? `${phaseDays}/30`
                              : `${phaseDays}/40`}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{phase.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      {dashboard.days_remaining !== undefined && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard.days_since_day_one}</p>
              <p className="text-sm text-gray-600">Days Since Day 1</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dashboard.days_remaining}</p>
              <p className="text-sm text-gray-600">Days Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {dashboard.current_phase
                  ? dashboard.current_phase.charAt(0).toUpperCase() + dashboard.current_phase.slice(1)
                  : '-'}
              </p>
              <p className="text-sm text-gray-600">Current Phase</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

