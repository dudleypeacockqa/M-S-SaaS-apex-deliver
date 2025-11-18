import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePMIDashboard } from '../hooks/usePMIDashboard';
import { usePMIProject } from '../hooks/usePMIProject';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, CheckCircle, List, Target, Shield, ClipboardCheck } from 'lucide-react';
import { WorkstreamBoard } from '../components/WorkstreamBoard';
import { SynergyTracker } from '../components/SynergyTracker';
import { RiskRegister } from '../components/RiskRegister';
import { DayOneChecklist } from '../components/DayOneChecklist';
import { TimelineView } from '../components/TimelineView';

export const PMIProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { data: dashboard, isLoading: dashboardLoading } = usePMIDashboard(projectId || null);
  const { data: project, isLoading: projectLoading } = usePMIProject(projectId || null);

  if (dashboardLoading || projectLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading PMI project...</div>
      </div>
    );
  }

  if (!dashboard || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">PMI project not found</div>
      </div>
    );
  }

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'stabilization':
        return 'bg-blue-100 text-blue-800';
      case 'integration':
        return 'bg-yellow-100 text-yellow-800';
      case 'optimization':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/pmi/projects')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-gray-600 mt-1">{project.description}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Synergy Realization</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard.synergy_realization_rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {dashboard.realized_synergies} of {dashboard.total_synergies} synergies
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Workstreams</h3>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard.completed_workstreams} / {dashboard.total_workstreams}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Critical Risks</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{dashboard.critical_risks}</p>
          <p className="text-xs text-gray-500 mt-1">of {dashboard.total_risks} total risks</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Day 1 Readiness</h3>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard.day_one_readiness_percentage.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Checklist completion</p>
        </div>
      </div>

      {/* Phase and Timeline */}
      {dashboard.current_phase && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">100-Day Timeline</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded ${getPhaseColor(dashboard.current_phase)}`}>
              {dashboard.current_phase.charAt(0).toUpperCase() + dashboard.current_phase.slice(1)} Phase
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {dashboard.days_since_day_one !== undefined && (
              <div>
                <span className="font-medium">Days since Day 1:</span> {dashboard.days_since_day_one}
              </div>
            )}
            {dashboard.days_remaining !== undefined && (
              <div>
                <span className="font-medium">Days remaining:</span> {dashboard.days_remaining}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'workstreams', label: 'Workstreams', icon: List },
            { id: 'synergies', label: 'Synergies', icon: Target },
            { id: 'risks', label: 'Risks', icon: Shield },
            { id: 'checklist', label: 'Day 1 Checklist', icon: ClipboardCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Workstreams Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Workstreams Summary</h2>
              <div className="space-y-3">
                {dashboard.workstreams_summary.map((workstream) => (
                  <div key={workstream.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{workstream.name}</h3>
                      <p className="text-sm text-gray-600">{workstream.workstream_type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{workstream.progress_percentage}%</p>
                        <p className="text-xs text-gray-500">Complete</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          workstream.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : workstream.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : workstream.status === 'at_risk'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {workstream.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && projectId && <TimelineView projectId={projectId} />}
        {activeTab === 'workstreams' && projectId && <WorkstreamBoard projectId={projectId} />}
        {activeTab === 'synergies' && projectId && <SynergyTracker projectId={projectId} />}
        {activeTab === 'risks' && projectId && <RiskRegister projectId={projectId} />}
        {activeTab === 'checklist' && projectId && <DayOneChecklist projectId={projectId} />}
      </div>
    </div>
  );
};

