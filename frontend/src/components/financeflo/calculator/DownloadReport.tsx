'use client';

import React from 'react';
import { CalculatorButton as Button } from './CalculatorButton';
import { CalculatorResults, CalculatorInputs } from '@/lib/financeflo/calculator';
import { Download } from 'lucide-react';
import { track } from '@/lib/analytics';

interface DownloadReportProps {
  results: CalculatorResults | null;
  inputs: CalculatorInputs;
  onOpenLeadCapture: (inputs: CalculatorInputs, results: CalculatorResults) => void;
}

export const DownloadReport: React.FC<DownloadReportProps> = ({
  results,
  inputs,
  onOpenLeadCapture
}) => {
  const handleBoardReport = () => {
    if (!results) return;

    // Track download initiated
    track('download_initiated', {
      industry: inputs.industry,
      has_results: !!results
    });

    // Open lead capture modal with data
    onOpenLeadCapture(inputs, results);
  };

  return (
    <Button
      onClick={handleBoardReport}
      disabled={!results}
      variant="primary"
      size="lg"
      className="flex items-center gap-2 w-full"
      data-testid="download-report-button"
    >
      <Download className="w-5 h-5" />
      Download Board-Ready Report (PDF)
    </Button>
  );
};

export default DownloadReport;
