import React, { useState, useEffect } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Label } from "@/components/marketing/financeflo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/marketing/financeflo/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/marketing/financeflo/ui/tabs";
import { Progress } from "@/components/marketing/financeflo/ui/progress";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Building, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

interface ROIInputs {
  industry: string;
  companySize: string;
  annualRevenue: number;
  operatingCosts: number;
  manualProcessHours: number;
  employeeCount: number;
  averageHourlyRate: number;
  errorRate: number;
  complianceCosts: number;
  systemMaintenanceCosts: number;
  implementationBudget: number;
}

interface ROIResults {
  yearOneROI: number;
  threeYearROI: number;
  fiveYearROI: number;
  paybackPeriod: number;
  annualSavings: number;
  productivityGains: number;
  errorReduction: number;
  complianceSavings: number;
  totalBenefits: number;
  netPresentValue: number;
  riskAdjustedROI: number;
}

const EnterpriseROICalculatorPage = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    industry: '',
    companySize: '',
    annualRevenue: 0,
    operatingCosts: 0,
    manualProcessHours: 0,
    employeeCount: 0,
    averageHourlyRate: 45,
    errorRate: 5,
    complianceCosts: 0,
    systemMaintenanceCosts: 0,
    implementationBudget: 0
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [activeTab, setActiveTab] = useState('inputs');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const industryMultipliers = {
    'financial-services': { efficiency: 1.4, compliance: 1.6, risk: 0.8 },
    'private-equity': { efficiency: 1.5, compliance: 1.4, risk: 0.7 },
    'healthcare': { efficiency: 1.3, compliance: 1.8, risk: 0.9 },
    'manufacturing': { efficiency: 1.2, compliance: 1.2, risk: 0.8 },
    'construction': { efficiency: 1.1, compliance: 1.3, risk: 0.9 },
    'professional-services': { efficiency: 1.3, compliance: 1.1, risk: 0.8 },
    'ecommerce': { efficiency: 1.4, compliance: 1.0, risk: 0.7 },
    'other': { efficiency: 1.0, compliance: 1.0, risk: 1.0 }
  };

  const companySizeMultipliers = {
    'startup': { complexity: 0.8, scale: 0.7, implementation: 1.2 },
    'small': { complexity: 1.0, scale: 0.9, implementation: 1.0 },
    'medium': { complexity: 1.2, scale: 1.1, implementation: 0.9 },
    'large': { complexity: 1.4, scale: 1.3, implementation: 0.8 },
    'enterprise': { complexity: 1.6, scale: 1.5, implementation: 0.7 }
  };

  const calculateROI = (): ROIResults => {
    const industryMult = industryMultipliers[inputs.industry as keyof typeof industryMultipliers] || industryMultipliers.other;
    const sizeMult = companySizeMultipliers[inputs.companySize as keyof typeof companySizeMultipliers] || companySizeMultipliers.medium;

    // Base calculations
    const annualLaborCosts = inputs.manualProcessHours * 52 * inputs.averageHourlyRate;
    const errorCosts = inputs.annualRevenue * (inputs.errorRate / 100) * 0.1;
    const inefficiencyCosts = inputs.operatingCosts * 0.15;

    // Efficiency gains (industry-specific)
    const laborSavings = annualLaborCosts * 0.6 * industryMult.efficiency;
    const errorReduction = errorCosts * 0.8 * industryMult.compliance;
    const operationalEfficiency = inefficiencyCosts * 0.4 * sizeMult.scale;
    const complianceSavings = inputs.complianceCosts * 0.5 * industryMult.compliance;
    const maintenanceSavings = inputs.systemMaintenanceCosts * 0.3;

    // Total annual benefits
    const annualSavings = laborSavings + errorReduction + operationalEfficiency + complianceSavings + maintenanceSavings;
    
    // Implementation costs (size-adjusted)
    const implementationCost = inputs.implementationBudget || (inputs.annualRevenue * 0.02 * sizeMult.implementation);
    const annualLicenseCost = implementationCost * 0.2; // 20% of implementation cost annually

    // Multi-year projections
    const year1Benefits = annualSavings * 0.7; // Ramp-up period
    const year2Benefits = annualSavings * 1.0;
    const year3Benefits = annualSavings * 1.1; // Optimization gains
    const year4Benefits = annualSavings * 1.15;
    const year5Benefits = annualSavings * 1.2;

    const year1Costs = implementationCost + annualLicenseCost;
    const yearlyOngoingCosts = annualLicenseCost;

    // ROI calculations
    const yearOneROI = ((year1Benefits - year1Costs) / year1Costs) * 100;
    const threeYearTotalBenefits = year1Benefits + year2Benefits + year3Benefits;
    const threeYearTotalCosts = year1Costs + (yearlyOngoingCosts * 2);
    const threeYearROI = ((threeYearTotalBenefits - threeYearTotalCosts) / threeYearTotalCosts) * 100;

    const fiveYearTotalBenefits = threeYearTotalBenefits + year4Benefits + year5Benefits;
    const fiveYearTotalCosts = threeYearTotalCosts + (yearlyOngoingCosts * 2);
    const fiveYearROI = ((fiveYearTotalBenefits - fiveYearTotalCosts) / fiveYearTotalCosts) * 100;

    // Payback period (months)
    const monthlyBenefits = annualSavings / 12;
    const paybackPeriod = implementationCost / monthlyBenefits;

    // NPV calculation (10% discount rate)
    const discountRate = 0.10;
    const npv = [year1Benefits, year2Benefits, year3Benefits, year4Benefits, year5Benefits]
      .reduce((acc, benefit, index) => {
        return acc + (benefit / Math.pow(1 + discountRate, index + 1));
      }, 0) - implementationCost;

    // Risk-adjusted ROI (based on industry risk factors)
    const riskAdjustedROI = fiveYearROI * industryMult.risk;

    return {
      yearOneROI: Math.round(yearOneROI),
      threeYearROI: Math.round(threeYearROI),
      fiveYearROI: Math.round(fiveYearROI),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      annualSavings: Math.round(annualSavings),
      productivityGains: Math.round(laborSavings),
      errorReduction: Math.round(errorReduction),
      complianceSavings: Math.round(complianceSavings),
      totalBenefits: Math.round(fiveYearTotalBenefits),
      netPresentValue: Math.round(npv),
      riskAdjustedROI: Math.round(riskAdjustedROI)
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateROI();
    setResults(calculatedResults);
    setActiveTab('results');
  };

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getROIColor = (roi: number) => {
    if (roi >= 300) return 'text-green-600';
    if (roi >= 200) return 'text-blue-600';
    if (roi >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 400) return { label: 'Exceptional', color: 'bg-green-600' };
    if (roi >= 300) return { label: 'Excellent', color: 'bg-green-500' };
    if (roi >= 200) return { label: 'Very Good', color: 'bg-blue-500' };
    if (roi >= 100) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Needs Review', color: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Enterprise ROI Calculator
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Calculate the financial impact of AI automation for your business
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Industry-specific models
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                5-year projections
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Risk-adjusted returns
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inputs">Business Inputs</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>ROI Analysis</TabsTrigger>
              <TabsTrigger value="report" disabled={!results}>Executive Report</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Company Profile
                    </CardTitle>
                    <CardDescription>
                      Tell us about your business to customize calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={inputs.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial-services">Financial Services</SelectItem>
                          <SelectItem value="private-equity">Private Equity</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="professional-services">Professional Services</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select value={inputs.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                          <SelectItem value="small">Small (11-50 employees)</SelectItem>
                          <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                          <SelectItem value="large">Large (251-1000 employees)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="annualRevenue">Annual Revenue (£)</Label>
                      <Input
                        id="annualRevenue"
                        type="number"
                        placeholder="e.g., 5000000"
                        value={inputs.annualRevenue || ''}
                        onChange={(e) => handleInputChange('annualRevenue', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="employeeCount">Number of Employees</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        placeholder="e.g., 50"
                        value={inputs.employeeCount || ''}
                        onChange={(e) => handleInputChange('employeeCount', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial Metrics
                    </CardTitle>
                    <CardDescription>
                      Current costs and operational metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="operatingCosts">Annual Operating Costs (£)</Label>
                      <Input
                        id="operatingCosts"
                        type="number"
                        placeholder="e.g., 2000000"
                        value={inputs.operatingCosts || ''}
                        onChange={(e) => handleInputChange('operatingCosts', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="manualProcessHours">Manual Process Hours/Week</Label>
                      <Input
                        id="manualProcessHours"
                        type="number"
                        placeholder="e.g., 40"
                        value={inputs.manualProcessHours || ''}
                        onChange={(e) => handleInputChange('manualProcessHours', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="averageHourlyRate">Average Hourly Rate (£)</Label>
                      <Input
                        id="averageHourlyRate"
                        type="number"
                        placeholder="e.g., 45"
                        value={inputs.averageHourlyRate || ''}
                        onChange={(e) => handleInputChange('averageHourlyRate', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="errorRate">Current Error Rate (%)</Label>
                      <Input
                        id="errorRate"
                        type="number"
                        placeholder="e.g., 5"
                        value={inputs.errorRate || ''}
                        onChange={(e) => handleInputChange('errorRate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Options */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Advanced Parameters
                        </CardTitle>
                        <CardDescription>
                          Optional: Customize for more accurate calculations
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        {showAdvanced ? 'Hide' : 'Show'} Advanced
                      </Button>
                    </div>
                  </CardHeader>
                  {showAdvanced && (
                    <CardContent className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="complianceCosts">Annual Compliance Costs (£)</Label>
                        <Input
                          id="complianceCosts"
                          type="number"
                          placeholder="e.g., 100000"
                          value={inputs.complianceCosts || ''}
                          onChange={(e) => handleInputChange('complianceCosts', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="systemMaintenanceCosts">System Maintenance Costs (£)</Label>
                        <Input
                          id="systemMaintenanceCosts"
                          type="number"
                          placeholder="e.g., 50000"
                          value={inputs.systemMaintenanceCosts || ''}
                          onChange={(e) => handleInputChange('systemMaintenanceCosts', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="implementationBudget">Implementation Budget (£)</Label>
                        <Input
                          id="implementationBudget"
                          type="number"
                          placeholder="Auto-calculated if empty"
                          value={inputs.implementationBudget || ''}
                          onChange={(e) => handleInputChange('implementationBudget', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleCalculate}
                  disabled={!inputs.industry || !inputs.companySize || !inputs.annualRevenue}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate ROI
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {results && (
                <>
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className={`text-3xl font-bold ${getROIColor(results.fiveYearROI)}`}>
                          {results.fiveYearROI}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">5-Year ROI</div>
                        <Badge className={`mt-2 ${getROIBadge(results.fiveYearROI).color} text-white`}>
                          {getROIBadge(results.fiveYearROI).label}
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {results.paybackPeriod}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Payback (Months)</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {results.paybackPeriod <= 12 ? 'Excellent' : results.paybackPeriod <= 24 ? 'Good' : 'Acceptable'}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          £{(results.annualSavings / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Annual Savings</div>
                        <div className="text-xs text-gray-500 mt-2">
                          Year 1 onwards
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          £{(results.netPresentValue / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Net Present Value</div>
                        <div className="text-xs text-gray-500 mt-2">
                          5-year NPV
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          ROI Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Year 1 ROI</span>
                          <span className={`font-bold ${getROIColor(results.yearOneROI)}`}>
                            {results.yearOneROI}%
                          </span>
                        </div>
                        <Progress value={Math.min(results.yearOneROI / 5, 100)} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span>3-Year ROI</span>
                          <span className={`font-bold ${getROIColor(results.threeYearROI)}`}>
                            {results.threeYearROI}%
                          </span>
                        </div>
                        <Progress value={Math.min(results.threeYearROI / 5, 100)} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span>5-Year ROI</span>
                          <span className={`font-bold ${getROIColor(results.fiveYearROI)}`}>
                            {results.fiveYearROI}%
                          </span>
                        </div>
                        <Progress value={Math.min(results.fiveYearROI / 5, 100)} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span>Risk-Adjusted ROI</span>
                          <span className={`font-bold ${getROIColor(results.riskAdjustedROI)}`}>
                            {results.riskAdjustedROI}%
                          </span>
                        </div>
                        <Progress value={Math.min(results.riskAdjustedROI / 5, 100)} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Savings Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Productivity Gains</span>
                          <span className="font-bold text-green-600">
                            £{(results.productivityGains / 1000).toFixed(0)}K
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Error Reduction</span>
                          <span className="font-bold text-blue-600">
                            £{(results.errorReduction / 1000).toFixed(0)}K
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Compliance Savings</span>
                          <span className="font-bold text-purple-600">
                            £{(results.complianceSavings / 1000).toFixed(0)}K
                          </span>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total 5-Year Benefits</span>
                            <span className="text-green-600">
                              £{(results.totalBenefits / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Risk Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risk Assessment & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">Low</div>
                          <div className="text-sm text-gray-600">Implementation Risk</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Proven technology with established ROI
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">High</div>
                          <div className="text-sm text-gray-600">Success Probability</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Based on industry benchmarks
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">Excellent</div>
                          <div className="text-sm text-gray-600">Strategic Fit</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Aligned with business objectives
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-blue-600">1</span>
                          </div>
                          <div>
                            <div className="font-medium">Schedule Executive Consultation</div>
                            <div className="text-sm text-gray-600">
                              Discuss your specific requirements and customize the implementation plan
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-blue-600">2</span>
                          </div>
                          <div>
                            <div className="font-medium">Conduct Technical Assessment</div>
                            <div className="text-sm text-gray-600">
                              Evaluate your current systems and integration requirements
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-blue-600">3</span>
                          </div>
                          <div>
                            <div className="font-medium">Develop Implementation Roadmap</div>
                            <div className="text-sm text-gray-600">
                              Create a detailed plan with timelines and success metrics
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">
                        Ready to Achieve {results.fiveYearROI}% ROI?
                      </h3>
                      <p className="text-blue-100 mb-6">
                        Based on your analysis, you could save £{(results.annualSavings / 1000).toFixed(0)}K annually 
                        and achieve payback in just {results.paybackPeriod} months.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                          size="lg" 
                          className="bg-white text-blue-600 hover:bg-blue-50"
                          onClick={() => window.location.href = '/contact'}
                        >
                          <Building className="w-5 h-5 mr-2" />
                          Book Executive Consultation
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-blue-600"
                          onClick={() => setActiveTab('report')}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              {results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Executive Summary Report
                    </CardTitle>
                    <CardDescription>
                      Comprehensive ROI analysis for stakeholder presentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">
                        AI Automation ROI Analysis
                      </h2>
                      <p className="text-gray-600">
                        Financial Impact Assessment for {inputs.industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Industry
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold mb-3">Investment Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Implementation Investment:</span>
                            <span>£{((inputs.implementationBudget || inputs.annualRevenue * 0.02) / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Savings:</span>
                            <span>£{(results.annualSavings / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payback Period:</span>
                            <span>{results.paybackPeriod} months</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>5-Year ROI:</span>
                            <span className={getROIColor(results.fiveYearROI)}>
                              {results.fiveYearROI}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold mb-3">Key Benefits</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>60% reduction in manual processes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>80% improvement in accuracy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>50% faster compliance reporting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Real-time business insights</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-4">
                        This analysis is based on industry benchmarks and your specific business parameters. 
                        Actual results may vary based on implementation approach and organizational factors.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EnterpriseROICalculatorPage;

