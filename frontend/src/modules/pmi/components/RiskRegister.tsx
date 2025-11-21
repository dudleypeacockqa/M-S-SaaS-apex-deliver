import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { pmiApi, type PMIRisk } from '../services/pmiApi';
import { AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { HelpTooltip } from '../../../components/common/HelpTooltip';

interface RiskRegisterProps {
  projectId: string;
}

export const RiskRegister: React.FC<RiskRegisterProps> = ({ projectId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pmi', 'risks', projectId],
    queryFn: () => pmiApi.listRisks(projectId),
  });

  if (isLoading) {
    return <div className="text-gray-500">Loading risks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading risks</div>;
  }

  const risks = data?.items || [];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Shield className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'mitigated':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalRisks = risks.filter((r) => r.severity === 'critical' && r.status === 'open');
  const openRisks = risks.filter((r) => r.status === 'open');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Risk Register</h2>
        <HelpTooltip
          label="Risk register help"
          content={
            <div>
              <p className="font-semibold text-slate-800">Risk management tips</p>
              <ul className="mt-1 list-disc pl-4 text-slate-600">
                <li>Log mitigation owners and review dates in each risk card.</li>
                <li>Escalate critical open risks during the weekly steering call.</li>
                <li>Export the register before major board updates for documentation.</li>
              </ul>
            </div>
          }
        />
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-medium text-gray-600">Critical Risks</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{criticalRisks.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-medium text-gray-600">Open Risks</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{openRisks.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-sm font-medium text-gray-600">Total Risks</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{risks.length}</p>
        </div>
      </div>

      {/* Risks List */}
      {risks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No risks registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className={`bg-white rounded-lg border-2 p-6 ${getSeverityColor(risk.severity)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(risk.severity)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{risk.title}</h3>
                    {risk.description && (
                      <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                    )}
                    {risk.mitigation_plan && (
                      <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-1">Mitigation Plan:</p>
                        <p className="text-sm text-gray-700">{risk.mitigation_plan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(risk.severity)}`}
                  >
                    {risk.severity.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(risk.status)}`}
                  >
                    {risk.status}
                  </span>
                </div>
                {risk.workstream_id && (
                  <span className="text-xs text-gray-600">Workstream: {risk.workstream_id}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

