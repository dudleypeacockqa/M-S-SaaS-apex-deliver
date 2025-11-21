'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { CalculatorResults, CalculatorInputs } from './lib/calculator';
import { Download } from 'lucide-react';
import { generateBoardReport } from './BoardReport';

interface DownloadReportProps {
  results: CalculatorResults | null;
  inputs: CalculatorInputs;
  companyName?: string;
}

export const DownloadReport: React.FC<DownloadReportProps> = ({ results, inputs, companyName = 'Your Company' }) => {
  const handleBoardReport = () => {
    if (!results) return;

    const reportHTML = generateBoardReport(results, inputs, companyName);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to view the report');
      return;
    }
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  return (
    <Button
      onClick={handleBoardReport}
      disabled={!results}
      variant="primary"
      size="lg"
      className="flex items-center gap-2 w-full"
    >
      <Download className="w-5 h-5" />
      Board-Ready Report (PDF)
    </Button>
  );
};

export default DownloadReport;

