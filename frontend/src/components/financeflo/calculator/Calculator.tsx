'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalculatorInput as Input } from './CalculatorInput';
import { CalculatorSelect as Select } from './CalculatorSelect';
import { CalculatorButton as Button } from './CalculatorButton';
import { CalculatorAccordion as Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './CalculatorAccordion';
import { compute, formatCurrency, formatNumber, type CalculatorInputs, type CalculatorResults } from '@/lib/financeflo/calculator';
import { track, trackCalculatorView, Events } from '@/lib/analytics';
import { Lock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import DownloadReport from './DownloadReport';
import { SectionHeading } from './SectionHeading';

// Number formatting helpers
const nf = new Intl.NumberFormat('en-GB');
const parseNumber = (s: string) => Number(String(s).replace(/[, ]+/g, '')) || 0;
const formatNumberDisplay = (n: number) => nf.format(isNaN(n) ? 0 : n);
const formatCurrencyDisplay = (n: number) => '£' + formatNumberDisplay(n);

const industries = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'tech', label: 'Technology (SaaS)' },
  { value: 'construction', label: 'Construction' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
];

interface CalculatorProps {
  debounceMs?: number;
  onOpenLeadCapture?: (inputs: CalculatorInputs, results: CalculatorResults) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  debounceMs = 200,
  onOpenLeadCapture = () => {}
}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    annualRevenue: 2000000,
    debtorDays: 45,
    creditorDays: 30,
    employees: 25,
    cashOnHand: 100000,
    averageBankBalance: 50000,
    currentDebtors: 250000,
    currentCreditors: 150000,
    industry: 'manufacturing',
    grossMargin: 25,
    netMargin: 10,
    ebitda: 300000,
    debtorDaysDelta: 0,
    creditorDaysDelta: 0,
    revenueGrowth: 0,
    inventoryTurns: 6,
    benchmarkMode: 'sme',
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Internal function to recompute results
  const recompute = useCallback((newInputs: CalculatorInputs) => {
    const newResults = compute(newInputs);
    setResults(newResults);
  }, []);

  // Debounced computation
  const debouncedCompute = useCallback(
    debounce((newInputs: CalculatorInputs) => {
      recompute(newInputs);
    }, debounceMs),
    [debounceMs, recompute]
  );

  // Compute results when inputs change
  useEffect(() => {
    if (debounceMs > 0) {
      debouncedCompute(inputs);
    } else {
      // For debounceMs === 0, only compute if results are null (initial mount)
      if (results === null) {
        recompute(inputs);
      }
    }
  }, [inputs, debouncedCompute, debounceMs, recompute, results]);

  // Track calculator view on mount
  useEffect(() => {
    trackCalculatorView();
  }, []);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    // Only convert to number for numeric fields, keep strings for industry
    const processedValue = field === 'industry' ? value : (typeof value === 'string' ? parseNumber(value) : value);
    setInputs(prev => {
      const merged = { ...prev, [field]: processedValue };
      if (debounceMs === 0) {
        // immediate recompute in tests
        const computed = compute(merged);
        setResults(computed);
      } else {
        // debounced path
        if (timer) clearTimeout(timer);
        const t = setTimeout(() => {
          setResults(compute(merged));
        }, debounceMs);
        setTimer(t);
      }
      return merged;
    });
  };

  const handleRecalculate = () => {
    track('CalculatorSubmit', {
      industry: inputs.industry,
      growth: inputs.annualRevenue > 1000000 ? 'high' : 'low',
      sourcePage: '/calculator'
    });
    recompute(inputs);
  };

  const handleResetDemo = () => {
    const demoInputs: CalculatorInputs = {
      annualRevenue: 2000000,
      debtorDays: 45,
      creditorDays: 30,
      employees: 25,
      cashOnHand: 100000,
      averageBankBalance: 50000,
      currentDebtors: 250000,
      currentCreditors: 150000,
      industry: 'manufacturing',
      grossMargin: 25,
      netMargin: 10,
      ebitda: 300000,
      debtorDaysDelta: 0,
      creditorDaysDelta: 0,
      revenueGrowth: 0,
      inventoryTurns: 6,
      benchmarkMode: 'sme',
    };
    setInputs(demoInputs);
    if (debounceMs === 0) {
      recompute(demoInputs);
    }
  };

  const handleClearAll = () => {
    const emptyInputs: CalculatorInputs = {
      annualRevenue: 0,
      debtorDays: 0,
      creditorDays: 0,
      employees: 0,
      cashOnHand: 0,
      averageBankBalance: 0,
      currentDebtors: 0,
      currentCreditors: 0,
      industry: 'manufacturing',
      grossMargin: 0,
      netMargin: 0,
      ebitda: 0,
      debtorDaysDelta: 0,
      creditorDaysDelta: 0,
      revenueGrowth: 0,
      inventoryTurns: 0,
      benchmarkMode: 'sme',
    };
    setInputs(emptyInputs);
    if (debounceMs === 0) {
      recompute(emptyInputs);
    }
  };

  const handleSliderKeyDown = (field: keyof CalculatorInputs, event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const currentValue = inputs[field] as number;
      const step = event.key === 'ArrowLeft' ? -1 : 1;
      const newValue = Math.max(0, currentValue + step);
      handleInputChange(field, newValue);
    }
  };


  const supportsInventory = ['manufacturing', 'wholesale', 'tech'].includes(inputs.industry);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="calculator">
      {/* Inputs Panel */}
      <Card className="h-fit">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-brand-navy mb-6">Your Business Details</h2>

          {/* Controls Row */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              onClick={handleResetDemo}
              variant="outline"
              size="sm"
              data-testid="resetDemoButton"
            >
              Reset demo data
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              data-testid="clearAllButton"
            >
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue (£)
              </label>
              <Input
                id="annualRevenue"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.annualRevenue)}
                onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                placeholder="2,000,000"
                className="w-full"
                data-testid="annualRevenueInput"
              />
            </div>

            <div>
              <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <Input
                id="employees"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.employees)}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                placeholder="25"
                className="w-full"
                data-testid="employeesInput"
              />
            </div>

            <div>
              <label htmlFor="debtorDays" className="block text-sm font-medium text-gray-700 mb-2">
                Average Debtor Days (DSO)
              </label>
              <Input
                id="debtorDays"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.debtorDays)}
                onChange={(e) => handleInputChange('debtorDays', e.target.value)}
                placeholder="45"
                className="w-full"
                data-testid="debtorDaysInput"
              />
            </div>

            <div>
              <label htmlFor="creditorDays" className="block text-sm font-medium text-gray-700 mb-2">
                Average Creditor Days (DPO)
              </label>
              <Input
                id="creditorDays"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.creditorDays)}
                onChange={(e) => handleInputChange('creditorDays', e.target.value)}
                placeholder="30"
                className="w-full"
                data-testid="creditorDaysInput"
              />
            </div>

            <div>
              <label htmlFor="currentDebtors" className="block text-sm font-medium text-gray-700 mb-2">
                Current Debtors (£)
              </label>
              <Input
                id="currentDebtors"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.currentDebtors)}
                onChange={(e) => handleInputChange('currentDebtors', e.target.value)}
                placeholder="250,000"
                className="w-full"
                data-testid="currentDebtorsInput"
              />
            </div>

            <div>
              <label htmlFor="currentCreditors" className="block text-sm font-medium text-gray-700 mb-2">
                Current Creditors (£)
              </label>
              <Input
                id="currentCreditors"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.currentCreditors)}
                onChange={(e) => handleInputChange('currentCreditors', e.target.value)}
                placeholder="150,000"
                className="w-full"
                data-testid="currentCreditorsInput"
              />
            </div>

            <div>
              <label htmlFor="cashOnHand" className="block text-sm font-medium text-gray-700 mb-2">
                Current Cash on Hand (£)
              </label>
              <Input
                id="cashOnHand"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.cashOnHand)}
                onChange={(e) => handleInputChange('cashOnHand', e.target.value)}
                placeholder="100,000"
                className="w-full"
                data-testid="cashOnHandInput"
              />
            </div>

            <div>
              <label htmlFor="averageBankBalance" className="block text-sm font-medium text-gray-700 mb-2">
                Average Bank Balance (£)
              </label>
              <Input
                id="averageBankBalance"
                type="text"
                inputMode="numeric"
                pattern="[0-9,]*"
                value={formatNumberDisplay(inputs.averageBankBalance)}
                onChange={(e) => handleInputChange('averageBankBalance', e.target.value)}
                placeholder="50,000"
                className="w-full"
                data-testid="averageBankBalanceInput"
              />
            </div>

            <div>
              <Select
                label="Industry"
                options={industries}
                value={inputs.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full"
                data-testid="industrySelect"
              />
            </div>
          </div>

          {/* Advanced Section */}
          <Accordion data-testid="advanced">
            <AccordionItem>
              <AccordionTrigger className="text-brand-navy hover:text-brand-blue" data-testid="advancedTrigger">
                Advanced Settings
              </AccordionTrigger>
              <AccordionContent data-testid="advancedContent">
                <div className="space-y-6 pt-4">
                  {/* Financial Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="grossMargin" className="block text-sm font-medium text-gray-700 mb-2">
                        Gross Margin (%)
                      </label>
                      <Input
                        id="grossMargin"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        value={inputs.grossMargin ? formatNumberDisplay(inputs.grossMargin) : ''}
                        onChange={(e) => handleInputChange('grossMargin', e.target.value)}
                        placeholder="25"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="netMargin" className="block text-sm font-medium text-gray-700 mb-2">
                        Net Margin (%)
                      </label>
                      <Input
                        id="netMargin"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        value={inputs.netMargin ? formatNumberDisplay(inputs.netMargin) : ''}
                        onChange={(e) => handleInputChange('netMargin', e.target.value)}
                        placeholder="10"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="ebitda" className="block text-sm font-medium text-gray-700 mb-2">
                        EBITDA (£)
                        <span className="text-xs text-gray-500 ml-1" title="EBITDA approximates operating cash flow excluding non-cash items: Earnings Before Interest, Tax, Depreciation, Amortisation.">
                          ℹ️
                        </span>
                      </label>
                      <Input
                        id="ebitda"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        value={inputs.ebitda ? formatNumberDisplay(inputs.ebitda) : ''}
                        onChange={(e) => handleInputChange('ebitda', e.target.value)}
                        placeholder="300,000"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="benchmarkMode" className="block text-sm font-medium text-gray-700 mb-2">
                        Benchmark Mode
                      </label>
                      <Select
                        id="benchmarkMode"
                        options={[
                          { value: 'sme', label: 'SME' },
                          { value: 'listed', label: 'Listed' }
                        ]}
                        value={inputs.benchmarkMode || 'sme'}
                        onChange={(e) => handleInputChange('benchmarkMode', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Working Capital Levers */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-brand-navy mb-4">Working Capital Levers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="revenueGrowth" className="block text-sm font-medium text-gray-700 mb-2">
                          Revenue Growth (%)
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {inputs.revenueGrowth || 0}%
                          </span>
                        </label>
                        <Input
                          id="revenueGrowth"
                          type="range"
                          min="-20"
                          max="50"
                          value={inputs.revenueGrowth || 0}
                          onChange={(e) => handleInputChange('revenueGrowth', e.target.value)}
                          onKeyDown={(e) => handleSliderKeyDown('revenueGrowth', e)}
                          className="w-full"
                          data-testid="revenueGrowthSlider"
                        />
                      </div>

                      <div>
                        <label htmlFor="debtorDaysDelta" className="block text-sm font-medium text-gray-700 mb-2">
                          Reduce Debtor Days By
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {inputs.debtorDaysDelta || 0} days
                          </span>
                        </label>
                        <Input
                          id="debtorDaysDelta"
                          type="range"
                          min="-90"
                          max="0"
                          value={inputs.debtorDaysDelta || 0}
                          onChange={(e) => handleInputChange('debtorDaysDelta', e.target.value)}
                          onKeyDown={(e) => handleSliderKeyDown('debtorDaysDelta', e)}
                          className="w-full"
                          data-testid="debtorDaysDeltaSlider"
                        />
                      </div>

                      <div>
                        <label htmlFor="creditorDaysDelta" className="block text-sm font-medium text-gray-700 mb-2">
                          Extend Creditor Days By
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            +{inputs.creditorDaysDelta || 0} days
                          </span>
                        </label>
                        <Input
                          id="creditorDaysDelta"
                          type="range"
                          min="0"
                          max="90"
                          value={inputs.creditorDaysDelta || 0}
                          onChange={(e) => handleInputChange('creditorDaysDelta', e.target.value)}
                          onKeyDown={(e) => handleSliderKeyDown('creditorDaysDelta', e)}
                          className="w-full"
                          data-testid="creditorDaysDeltaSlider"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory (conditional) */}
                  {supportsInventory && (
                    <div className="border-t pt-4">
                      <div>
                        <label htmlFor="inventoryTurns" className="block text-sm font-medium text-gray-700 mb-2">
                          Inventory Turns per Year
                        </label>
                        <Input
                          data-testid="inventoryTurnsInput"
                          id="inventoryTurns"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9,.]*"
                          value={inputs.inventoryTurns ? formatNumberDisplay(inputs.inventoryTurns) : ''}
                          onChange={(e) => handleInputChange('inventoryTurns', e.target.value)}
                          placeholder="6"
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Lock className="w-4 h-4 mr-2" />
              Your inputs are processed in your browser and are not stored.
            </div>
            <Button onClick={handleRecalculate} className="w-full" data-testid="recalcButton">
              Recalculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="h-fit shadow-md border-slate-200 bg-white lg:sticky lg:top-4">
        <CardContent className="p-6">
          <SectionHeading title="Your Results" className="mb-8" />

          {results ? (
            <div className="space-y-8 py-12">
              {/* Cash Coverage Table */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-brand-navy mb-6">Cash Coverage</h3>
                <div className="space-y-2">
                  {results.coverage.map((item) => (
                    <div key={item.days} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm font-medium text-gray-700">{item.days} days</span>
                      <span className={`text-sm font-medium ${
                        item.covered ? 'text-brand-teal-600' : 'text-red-500'
                      }`}>
                        {item.covered ? 'Covered' : `£${formatNumberDisplay(item.gap)} gap`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cash Injection Needed */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-brand-navy mb-6">Cash Injection Needed</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">To sustain current operations:</span>
                    <span className="text-lg font-bold text-brand-navy">
                      {formatCurrencyDisplay(results.cashNeedForOps)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">To fund growth at {inputs.revenueGrowth || 0}%:</span>
                    <span className="text-lg font-bold text-brand-navy">
                      {formatCurrencyDisplay(results.cashNeedForGrowth)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated Cash Unlock */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-brand-navy mb-6">Estimated Cash Unlock</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">90 days:</span>
                    <span className="text-lg font-bold text-brand-teal-600">
                      {formatCurrencyDisplay(results.unlock90)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">12 months:</span>
                    <span className="text-lg font-bold text-brand-teal-600">
                      {formatCurrencyDisplay(results.unlock12m)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue per Employee */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-brand-navy">Revenue per Employee</h3>
                  <div className="flex items-center">
                    {results.benchmarkDelta > 0 ? (
                      <TrendingUp className="w-4 h-4 text-brand-teal-600 mr-1" />
                    ) : results.benchmarkDelta < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      results.benchmarkDelta > 0 ? 'text-brand-teal-600' :
                      results.benchmarkDelta < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {results.benchmarkDelta > 0 ? '↑' : results.benchmarkDelta < 0 ? '↓' : '='}
                      {Math.abs(results.benchmarkDelta).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-brand-navy mb-1" data-testid="rpe-value">
                  {formatCurrencyDisplay(results.revenuePerEmployee)}
                </div>
                <div className="text-sm text-gray-600">
                  vs {formatCurrencyDisplay(results.industryBenchmark)} industry average
                </div>
              </div>

              {/* Board-Ready Talking Points */}
              {results.talkingPoints.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                  <h3 className="text-xl font-semibold text-brand-navy mb-6">Board-Ready Talking Points</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {results.talkingPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-brand-teal-600 mr-2">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Download Report */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-brand-navy mb-6">Download Results</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get your personalized Board-Ready Report with detailed analysis and actionable recommendations.
                </p>
                <DownloadReport
                  results={results}
                  inputs={inputs}
                  onOpenLeadCapture={onOpenLeadCapture}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Enter your business details to see results
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Button
          onClick={handleRecalculate}
          className="w-full"
          data-testid="mobileRecalcButton"
        >
          Recalculate
        </Button>
      </div>
    </div>
  );
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default Calculator;
