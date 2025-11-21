import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, Clock, Users } from "lucide-react";

const ROICalculatorPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companySize: "",
    currentRevenue: "",
    industryType: "",
    currentERPCost: "",
    manualProcessHours: "",
    employeeCount: "",
    errorRate: ""
  });

  const [results, setResults] = useState({
    annualSavings: 0,
    roiPercentage: 0,
    paybackPeriod: 0,
    productivityGain: 0,
    errorReduction: 0
  });

  const [showResults, setShowResults] = useState(false);

  const companySizes = [
    { value: "startup", label: "Startup (1-10 employees)", multiplier: 1.2 },
    { value: "small", label: "Small Business (11-50 employees)", multiplier: 1.5 },
    { value: "medium", label: "Medium Business (51-200 employees)", multiplier: 2.0 },
    { value: "large", label: "Large Enterprise (200+ employees)", multiplier: 3.0 }
  ];

  const industries = [
    { value: "construction", label: "Construction", efficiencyGain: 0.45 },
    { value: "financial", label: "Financial Services", efficiencyGain: 0.60 },
    { value: "manufacturing", label: "Manufacturing", efficiencyGain: 0.50 },
    { value: "healthcare", label: "Healthcare", efficiencyGain: 0.40 },
    { value: "retail", label: "Retail/Ecommerce", efficiencyGain: 0.55 },
    { value: "professional", label: "Professional Services", efficiencyGain: 0.35 }
  ];

  const calculateROI = () => {
    const revenue = parseFloat(formData.currentRevenue) || 0;
    const manualHours = parseFloat(formData.manualProcessHours) || 0;
    const employees = parseFloat(formData.employeeCount) || 0;
    const currentCost = parseFloat(formData.currentERPCost) || 0;
    const errorRate = parseFloat(formData.errorRate) || 0;

    // Get multipliers
    const sizeMultiplier = companySizes.find(s => s.value === formData.companySize)?.multiplier || 1;
    const industryGain = industries.find(i => i.value === formData.industryType)?.efficiencyGain || 0.4;

    // Calculate savings
    const hourlyRate = 35; // Average UK hourly rate
    const manualProcessSavings = manualHours * 52 * hourlyRate * industryGain; // Weekly hours * 52 weeks
    const errorCostSavings = (revenue * (errorRate / 100) * 0.7); // 70% of error costs saved
    const efficiencyGains = revenue * 0.15 * industryGain; // Revenue efficiency improvement
    
    const totalAnnualSavings = (manualProcessSavings + errorCostSavings + efficiencyGains) * sizeMultiplier;
    
    // FinanceFlo implementation cost estimate
    const implementationCost = 25000 + (employees * 150); // Base cost + per employee
    
    const roiPercentage = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = implementationCost / (totalAnnualSavings / 12);
    const productivityGain = industryGain * 100;
    const errorReduction = Math.min(errorRate * 0.8, 95); // Up to 95% error reduction

    setResults({
      annualSavings: Math.round(totalAnnualSavings),
      roiPercentage: Math.round(roiPercentage),
      paybackPeriod: Math.round(paybackMonths * 10) / 10,
      productivityGain: Math.round(productivityGain),
      errorReduction: Math.round(errorReduction)
    });

    setShowResults(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calculator className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Calculate your potential return on investment with FinanceFlo.ai's AI-powered automation
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            
            <div className="space-y-6">
              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select company size</option>
                  {companySizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Type
                </label>
                <select
                  value={formData.industryType}
                  onChange={(e) => handleInputChange('industryType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>

              {/* Annual Revenue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Revenue (£)
                </label>
                <input
                  type="number"
                  value={formData.currentRevenue}
                  onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                  placeholder="e.g., 2000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Employee Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Manual Process Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manual Process Hours per Week
                </label>
                <input
                  type="number"
                  value={formData.manualProcessHours}
                  onChange={(e) => handleInputChange('manualProcessHours', e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Current ERP Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current ERP/Software Costs (Annual £)
                </label>
                <input
                  type="number"
                  value={formData.currentERPCost}
                  onChange={(e) => handleInputChange('currentERPCost', e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Error Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.errorRate}
                  onChange={(e) => handleInputChange('errorRate', e.target.value)}
                  placeholder="e.g., 5"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={calculateROI}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Calculate ROI
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your ROI Projection</h2>
            
            {!showResults ? (
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Fill out the form to see your ROI calculation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Annual Savings */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Annual Savings</h3>
                        <p className="text-sm text-gray-600">Total cost savings per year</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.annualSavings)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI Percentage */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">ROI Percentage</h3>
                        <p className="text-sm text-gray-600">Return on investment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.roiPercentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payback Period */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Payback Period</h3>
                        <p className="text-sm text-gray-600">Time to recover investment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.paybackPeriod} months
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {results.productivityGain}%
                      </div>
                      <div className="text-sm text-gray-600">Productivity Gain</div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">
                        {results.errorReduction}%
                      </div>
                      <div className="text-sm text-gray-600">Error Reduction</div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Ready to Achieve These Results?</h3>
                  <p className="text-blue-100 mb-4">Get a personalized implementation plan</p>
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Schedule Free Consultation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            * ROI calculations are estimates based on industry averages and typical implementation results. 
            Actual results may vary depending on specific business circumstances and implementation scope.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ROICalculatorPage;

