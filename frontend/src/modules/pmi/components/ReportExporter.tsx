import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { pmiApi } from '../services/pmiApi';
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react';

interface ReportExporterProps {
  projectId: string;
}

type ReportType = 'status' | 'synergy' | 'risk' | '100day';

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  {
    value: 'status',
    label: 'Status Report',
    description: 'Comprehensive PMI status with workstreams, synergies, risks, and Day 1 checklist',
  },
  {
    value: 'synergy',
    label: 'Synergy Report',
    description: 'Detailed synergy realization tracking and metrics',
  },
  {
    value: 'risk',
    label: 'Risk Assessment Report',
    description: 'Comprehensive risk analysis with mitigation plans',
  },
  {
    value: '100day',
    label: '100-Day Completion Report',
    description: 'Post-completion analysis and lessons learned',
  },
];

export const ReportExporter: React.FC<ReportExporterProps> = ({ projectId }) => {
  const [selectedType, setSelectedType] = useState<ReportType>('status');
  const [lastGenerated, setLastGenerated] = useState<{ type: ReportType; url: string } | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (type: ReportType) => {
      switch (type) {
        case 'status':
          return await pmiApi.generateStatusReport(projectId);
        case 'synergy':
          return await pmiApi.generateSynergyReport(projectId);
        case 'risk':
          return await pmiApi.generateRiskReport(projectId);
        case '100day':
          return await pmiApi.generate100DayReport(projectId);
        default:
          throw new Error('Invalid report type');
      }
    },
    onSuccess: (data, type) => {
      setLastGenerated({ type, url: data.download_url });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate(selectedType);
  };

  const handleDownload = () => {
    if (lastGenerated?.url) {
      window.open(lastGenerated.url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Export Reports</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Report Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {REPORT_TYPES.find((t) => t.value === selectedType)?.description}
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate PDF Report
              </>
            )}
          </button>

          {generateMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Error generating report: {generateMutation.error?.message || 'Unknown error'}
            </div>
          )}

          {generateMutation.isSuccess && lastGenerated && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">
                    {REPORT_TYPES.find((t) => t.value === lastGenerated.type)?.label} generated successfully!
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Report Features</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Professional PDF formatting</li>
          <li>AI-generated executive summaries</li>
          <li>Comprehensive data visualization</li>
          <li>Ready for stakeholder presentation</li>
        </ul>
      </div>
    </div>
  );
};

