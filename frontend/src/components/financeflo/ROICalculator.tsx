import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  ArrowRight,
  Download,
  Share,
  Zap,
  Building,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useAnalytics } from './AnalyticsTracker';
import { useZoomInfoTracking } from './ZoomInfoTrackerDisabled';

interface ROIInputs {
  industry: string;
  companySize: string;
  currentSystem: string;
  annualRevenue: number;
  employeeCount: number;
  monthEndDays: number;
  manualProcessHours: number;
  errorRate: number;
  complianceCost: number;
  itMaintenanceCost: number;
  reportingTime: number;
  decisionDelay: number;
}

interface ROIResults {
  totalSavings: number;
  implementationCost: number;
  netROI: number;
  roiPercentage: number;
  paybackPeriod: number;
  yearOneROI: number;
  yearTwoROI: number;
  yearThreeROI: number;
  timeSavings: number;
  efficiencyGain: number;
  errorReduction: number;
  complianceImprovement: number;
}

interface ROICalculatorProps {
  onCalculationComplete?: (inputs: ROIInputs, results: ROIResults) => void;
  showDetailedBreakdown?: boolean;
  industry?: string;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({
  onCalculationComplete,
  showDetailedBreakdown = true,
  industry
}) => {
  const [inputs, setInputs] = useState<ROIInputs>({
    industry: industry || '',
    companySize: '',
    currentSystem: '',
    annualRevenue: 0,
    employeeCount: 0,
    monthEndDays: 15,
    manualProcessHours: 40,
    errorRate: 5,
    complianceCost: 0,
    itMaintenanceCost: 0,
    reportingTime: 20,
    decisionDelay: 7
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const { trackEvent } = useAnalytics();
  const { trackEvent: trackZoomInfo } = useZoomInfoTracking();

  const industryMultipliers = {
    'manufacturing': {
      efficiency: 1.3,
      compliance: 1.1,
      integration: 1.2
    },
    'financial-services': {
      efficiency: 1.1,
      compliance: 1.5,
      integration: 1.1
    },
    'construction': {
      efficiency: 1.4,
      compliance: 1.2,
      integration: 1.3
    },
    'healthcare': {
      efficiency: 1.2,
      compliance: 1.4,
      integration: 1.2
    },
    'professional-services': {
      efficiency: 1.2,
      compliance: 1.1,
      integration: 1.1
    },
    'ecommerce': {
      efficiency: 1.3,
      compliance: 1.0,
      integration: 1.4
    }
  };

  const calculateROI = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const multiplier = industryMultipliers[inputs.industry as keyof typeof industryMultipliers] || {
        efficiency: 1.0,
        compliance: 1.0,
        integration: 1.0
      };

      // Calculate annual costs of current inefficiencies
      const avgSalary = 45000; // Average UK salary
      const hourlyRate = avgSalary / (52 * 40);
      
      // Time-based savings
      const monthEndTimeSavings = (inputs.monthEndDays - 3) * 12 * hourlyRate * 2; // 2 people involved
      const manualProcessSavings = inputs.manualProcessHours * 52 * hourlyRate * multiplier.efficiency;
      const reportingTimeSavings = inputs.reportingTime * 12 * hourlyRate * 3; // 3 people involved
      
      // Error-based savings
      const errorCostReduction = (inputs.annualRevenue * (inputs.errorRate / 100) * 0.02) * 0.8; // 80% error reduction
      
      // Compliance and maintenance savings
      const complianceSavings = inputs.complianceCost * 0.6 * multiplier.compliance; // 60% reduction
      const maintenanceSavings = inputs.itMaintenanceCost * 0.4; // 40% reduction
      
      // Decision speed improvement value
      const decisionSpeedValue = (inputs.annualRevenue * 0.05) * (inputs.decisionDelay / 30) * 0.7; // 70% improvement
      
      const totalSavings = 
        monthEndTimeSavings + 
        manualProcessSavings + 
        reportingTimeSavings + 
        errorCostReduction + 
        complianceSavings + 
        maintenanceSavings + 
        decisionSpeedValue;

      // Implementation cost calculation
      const baseCost = inputs.employeeCount < 50 ? 25000 : 
                      inputs.employeeCount < 200 ? 45000 : 
                      inputs.employeeCount < 500 ? 75000 : 125000;
      
      const implementationCost = baseCost * multiplier.integration;
      
      // ROI calculations
      const netROI = totalSavings - implementationCost;
      const roiPercentage = (netROI / implementationCost) * 100;
      const paybackPeriod = implementationCost / (totalSavings / 12);
      
      // Multi-year projections
      const yearOneROI = totalSavings - implementationCost;
      const yearTwoROI = totalSavings * 1.1; // 10% improvement in year 2
      const yearThreeROI = totalSavings * 1.2; // 20% improvement in year 3
      
      // Additional metrics
      const timeSavings = ((inputs.monthEndDays - 3) / inputs.monthEndDays) * 100;
      const efficiencyGain = multiplier.efficiency * 25; // Base 25% efficiency gain
      const errorReduction = 80; // 80% error reduction
      const complianceImprovement = multiplier.compliance * 60; // Base 60% compliance improvement

      const calculatedResults: ROIResults = {
        totalSavings: Math.round(totalSavings),
        implementationCost: Math.round(implementationCost),
        netROI: Math.round(netROI),
        roiPercentage: Math.round(roiPercentage),
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
        yearOneROI: Math.round(yearOneROI),
        yearTwoROI: Math.round(yearTwoROI),
        yearThreeROI: Math.round(yearThreeROI),
        timeSavings: Math.round(timeSavings),
        efficiencyGain: Math.round(efficiencyGain),
        errorReduction,
        complianceImprovement: Math.round(complianceImprovement)
      };

      setResults(calculatedResults);
      setIsCalculating(false);

      if (onCalculationComplete) {
        onCalculationComplete(inputs, calculatedResults);
      }

      // Track calculation event
      trackEvent('roi_calculated', {
        category: 'tools',
        label: 'roi_calculator',
        industry: inputs.industry,
        company_size: inputs.companySize,
        roi_percentage: calculatedResults.roiPercentage,
        payback_period: calculatedResults.paybackPeriod
      });

      trackZoomInfo('roi_calculated', {
        industry: inputs.industry,
        company_size: inputs.companySize,
        annual_revenue: inputs.annualRevenue,
        roi_percentage: calculatedResults.roiPercentage,
        total_savings: calculatedResults.totalSavings
      });
    }, 2000);
  };

  const updateInput = (field: keyof ROIInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const downloadReport = () => {
    trackEvent('roi_report_downloaded', {
      category: 'tools',
      label: 'download_report',
      industry: inputs.industry
    });
    
    // Generate and download PDF report
    import('@/utils/logger').then(({ logger }) => {
      logger.info('Downloading ROI report', { inputs, results });
    });
  };

  const shareResults = () => {
    trackEvent('roi_results_shared', {
      category: 'tools',
      label: 'share_results',
      industry: inputs.industry
    });
    
    // Share functionality
    import('@/utils/logger').then(({ logger }) => {
      logger.info('Sharing ROI results', { inputs, results });
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select value={inputs.industry} onValueChange={(value) => updateInput('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="financial-services">Financial Services</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="professional-services">Professional Services</SelectItem>
            <SelectItem value="ecommerce">E-commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="companySize">Company Size</Label>
        <Select value={inputs.companySize} onValueChange={(value) => updateInput('companySize', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (1-50 employees)</SelectItem>
            <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
            <SelectItem value="large">Large (201-500 employees)</SelectItem>
            <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="currentSystem">Current ERP/Financial System</Label>
        <Select value={inputs.currentSystem} onValueChange={(value) => updateInput('currentSystem', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select current system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quickbooks">QuickBooks</SelectItem>
            <SelectItem value="xero">Xero</SelectItem>
            <SelectItem value="sage50">Sage 50</SelectItem>
            <SelectItem value="excel">Excel/Spreadsheets</SelectItem>
            <SelectItem value="legacy">Legacy System</SelectItem>
            <SelectItem value="multiple">Multiple Systems</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="annualRevenue">Annual Revenue (£)</Label>
          <Input
            type="number"
            value={inputs.annualRevenue || ''}
            onChange={(e) => updateInput('annualRevenue', parseInt(e.target.value) || 0)}
            placeholder="e.g., 5000000"
          />
        </div>
        <div>
          <Label htmlFor="employeeCount">Number of Employees</Label>
          <Input
            type="number"
            value={inputs.employeeCount || ''}
            onChange={(e) => updateInput('employeeCount', parseInt(e.target.value) || 0)}
            placeholder="e.g., 150"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label>Month-end Close Time (days)</Label>
        <div className="mt-2">
          <Slider
            value={[inputs.monthEndDays]}
            onValueChange={(value) => updateInput('monthEndDays', value[0])}
            max={30}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 day</span>
            <span className="font-semibold">{inputs.monthEndDays} days</span>
            <span>30 days</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Manual Process Hours per Week</Label>
        <div className="mt-2">
          <Slider
            value={[inputs.manualProcessHours]}
            onValueChange={(value) => updateInput('manualProcessHours', value[0])}
            max={80}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0 hours</span>
            <span className="font-semibold">{inputs.manualProcessHours} hours</span>
            <span>80 hours</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Error Rate (%)</Label>
        <div className="mt-2">
          <Slider
            value={[inputs.errorRate]}
            onValueChange={(value) => updateInput('errorRate', value[0])}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0%</span>
            <span className="font-semibold">{inputs.errorRate}%</span>
            <span>20%</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Financial Reporting Time (hours per month)</Label>
        <div className="mt-2">
          <Slider
            value={[inputs.reportingTime]}
            onValueChange={(value) => updateInput('reportingTime', value[0])}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0 hours</span>
            <span className="font-semibold">{inputs.reportingTime} hours</span>
            <span>100 hours</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="complianceCost">Annual Compliance Cost (£)</Label>
          <Input
            type="number"
            value={inputs.complianceCost || ''}
            onChange={(e) => updateInput('complianceCost', parseInt(e.target.value) || 0)}
            placeholder="e.g., 25000"
          />
        </div>
        <div>
          <Label htmlFor="itMaintenanceCost">Annual IT Maintenance Cost (£)</Label>
          <Input
            type="number"
            value={inputs.itMaintenanceCost || ''}
            onChange={(e) => updateInput('itMaintenanceCost', parseInt(e.target.value) || 0)}
            placeholder="e.g., 15000"
          />
        </div>
      </div>

      <div>
        <Label>Decision Making Delay (days)</Label>
        <div className="mt-2">
          <Slider
            value={[inputs.decisionDelay]}
            onValueChange={(value) => updateInput('decisionDelay', value[0])}
            max={30}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0 days</span>
            <span className="font-semibold">{inputs.decisionDelay} days</span>
            <span>30 days</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          How long does it typically take to get financial data for business decisions?
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Ready to Calculate</h3>
        <p className="text-blue-800 text-sm">
          We have all the information needed to calculate your potential ROI with our Adaptive Intelligence Framework™.
        </p>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Annual Savings</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.totalSavings)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">ROI Percentage</p>
                  <p className="text-2xl font-bold">{results.roiPercentage}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Payback Period</p>
                  <p className="text-2xl font-bold">{results.paybackPeriod} months</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Time Savings</p>
                  <p className="text-2xl font-bold">{results.timeSavings}%</p>
                </div>
                <Zap className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3-Year Projection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              3-Year Financial Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.yearOneROI)}</div>
                <div className="text-sm text-gray-600">Year 1 Net ROI</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.yearTwoROI)}</div>
                <div className="text-sm text-gray-600">Year 2 Savings</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(results.yearThreeROI)}</div>
                <div className="text-sm text-gray-600">Year 3 Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operational Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Operational Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Efficiency Gain</span>
                  <span className="font-semibold">{results.efficiencyGain}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Error Reduction</span>
                  <span className="font-semibold">{results.errorReduction}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Savings</span>
                  <span className="font-semibold">{results.timeSavings}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compliance Improvement</span>
                  <span className="font-semibold">{results.complianceImprovement}%</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Key Benefits</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Real-time financial visibility</li>
                  <li>• Automated compliance reporting</li>
                  <li>• Predictive analytics and insights</li>
                  <li>• Streamlined workflows</li>
                  <li>• Enhanced decision-making speed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={downloadReport} className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
          <Button variant="outline" onClick={shareResults} className="flex items-center">
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" onClick={() => window.open('/contact', '_blank')} className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Consultation
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center text-xl">
          <Calculator className="w-6 h-6 mr-2" />
          ERP ROI Calculator
        </CardTitle>
        <p className="text-blue-100">
          Calculate your potential return on investment with our Adaptive Intelligence Framework™
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {!results && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Step {currentStep} of 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {!results && currentStep === 1 && renderStep1()}
        {!results && currentStep === 2 && renderStep2()}
        {!results && currentStep === 3 && renderStep3()}
        {results && renderResults()}

        {!results && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!inputs.industry || !inputs.companySize || !inputs.currentSystem)) ||
                  (currentStep === 2 && (!inputs.annualRevenue || !inputs.employeeCount))
                }
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={calculateROI}
                disabled={isCalculating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCalculating ? 'Calculating...' : 'Calculate ROI'}
                <Calculator className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {results && (
          <div className="mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setResults(null);
                setCurrentStep(1);
              }}
            >
              Calculate Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ROICalculator;

