import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Clock, PoundSterling, Users, Building } from "lucide-react";

interface ROICalculation {
  currentCosts: number;
  implementationCost: number;
  annualSavings: number;
  paybackPeriod: number;
  threeYearROI: number;
  fiveYearROI: number;
  netPresentValue: number;
}

const ERPROICalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    employees: "",
    annualRevenue: "",
    industry: "",
    currentSystems: "",
    monthlyITCosts: "",
    adminHours: "",
    reportingHours: "",
    inventoryValue: "",
    email: "",
    companyName: "",
    phone: ""
  });

  const [calculation, setCalculation] = useState<ROICalculation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const industryMultipliers = {
    manufacturing: { complexity: 1.3, savings: 1.4 },
    construction: { complexity: 1.2, savings: 1.3 },
    professional_services: { complexity: 1.0, savings: 1.2 },
    financial_services: { complexity: 1.4, savings: 1.5 },
    healthcare: { complexity: 1.3, savings: 1.3 },
    retail: { complexity: 1.1, savings: 1.2 },
    other: { complexity: 1.0, savings: 1.0 }
  };

  const calculateROI = () => {
    const employees = parseInt(formData.employees) || 0;
    const revenue = parseFloat(formData.annualRevenue) || 0;
    const monthlyIT = parseFloat(formData.monthlyITCosts) || 0;
    const adminHours = parseFloat(formData.adminHours) || 0;
    const reportingHours = parseFloat(formData.reportingHours) || 0;
    const inventoryValue = parseFloat(formData.inventoryValue) || 0;

    if (employees === 0 || revenue === 0) return;

    const industry = formData.industry as keyof typeof industryMultipliers || 'other';
    const multiplier = industryMultipliers[industry];

    // Calculate implementation costs
    let baseCost = 0;
    if (employees <= 25) baseCost = 75000;
    else if (employees <= 100) baseCost = 150000;
    else if (employees <= 250) baseCost = 300000;
    else baseCost = 500000;

    const implementationCost = baseCost * multiplier.complexity;

    // Calculate current inefficiency costs
    const avgSalary = 35000; // UK average
    const adminCostPerHour = avgSalary / 1800; // Annual hours
    const currentAdminCosts = (adminHours + reportingHours) * 52 * adminCostPerHour;
    const currentITCosts = monthlyIT * 12;
    const inventoryCarryingCost = inventoryValue * 0.25; // 25% carrying cost
    const currentCosts = currentAdminCosts + currentITCosts + inventoryCarryingCost;

    // Calculate annual savings
    const adminSavings = currentAdminCosts * 0.4; // 40% reduction
    const itSavings = currentITCosts * 0.3; // 30% reduction
    const inventorySavings = inventoryCarryingCost * 0.2; // 20% reduction
    const processEfficiencySavings = revenue * 0.02; // 2% of revenue
    const annualSavings = (adminSavings + itSavings + inventorySavings + processEfficiencySavings) * multiplier.savings;

    // Calculate ROI metrics
    const paybackPeriod = implementationCost / annualSavings;
    const threeYearSavings = annualSavings * 3;
    const fiveYearSavings = annualSavings * 5;
    const threeYearROI = ((threeYearSavings - implementationCost) / implementationCost) * 100;
    const fiveYearROI = ((fiveYearSavings - implementationCost) / implementationCost) * 100;

    // NPV calculation (10% discount rate)
    const discountRate = 0.10;
    let npv = -implementationCost;
    for (let year = 1; year <= 5; year++) {
      npv += annualSavings / Math.pow(1 + discountRate, year);
    }

    setCalculation({
      currentCosts,
      implementationCost,
      annualSavings,
      paybackPeriod,
      threeYearROI,
      fiveYearROI,
      netPresentValue: npv
    });

    setShowResults(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetDetailedReport = () => {
    setShowLeadForm(true);
  };

  const submitLeadForm = async () => {
    // Here you would typically send the data to your CRM or database
    import('@/utils/logger').then(({ logger }) => {
      logger.info('Lead form submitted', { formData: { ...formData, calculation } });
    });
    
    // For demo purposes, we'll just show an alert
    alert('Thank you! Your detailed ERP ROI report will be sent to your email within 24 hours.');
    
    // Reset form
    setShowLeadForm(false);
    setShowResults(false);
    setFormData({
      employees: "",
      annualRevenue: "",
      industry: "",
      currentSystems: "",
      monthlyITCosts: "",
      adminHours: "",
      reportingHours: "",
      inventoryValue: "",
      email: "",
      companyName: "",
      phone: ""
    });
    setCalculation(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatYears = (years: number) => {
    const months = Math.round(years * 12);
    if (months < 12) return `${months} months`;
    return `${years.toFixed(1)} years`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">ERP ROI Calculator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate the potential return on investment for your ERP implementation. 
          Get instant estimates based on your business metrics.
        </p>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Used by 450+ UK businesses
        </Badge>
      </div>

      {!showResults && !showLeadForm && (
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Business Information</span>
            </CardTitle>
            <CardDescription>
              Provide your business details to calculate your ERP ROI potential
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue (£)</Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={formData.annualRevenue}
                  onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                    <SelectItem value="financial_services">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail/E-commerce</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIT">Monthly IT Costs (£)</Label>
                <Input
                  id="monthlyIT"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.monthlyITCosts}
                  onChange={(e) => handleInputChange('monthlyITCosts', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminHours">Weekly Admin Hours</Label>
                <Input
                  id="adminHours"
                  type="number"
                  placeholder="e.g., 20"
                  value={formData.adminHours}
                  onChange={(e) => handleInputChange('adminHours', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportingHours">Weekly Reporting Hours</Label>
                <Input
                  id="reportingHours"
                  type="number"
                  placeholder="e.g., 15"
                  value={formData.reportingHours}
                  onChange={(e) => handleInputChange('reportingHours', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="inventory">Inventory Value (£)</Label>
                <Input
                  id="inventory"
                  type="number"
                  placeholder="e.g., 500000"
                  value={formData.inventoryValue}
                  onChange={(e) => handleInputChange('inventoryValue', e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={calculateROI} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              disabled={!formData.employees || !formData.annualRevenue}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate My ERP ROI
            </Button>
          </CardContent>
        </Card>
      )}

      {showResults && calculation && !showLeadForm && (
        <div className="space-y-6">
          <Card className="border-2 border-green-100">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <TrendingUp className="w-5 h-5" />
                <span>Your ERP ROI Analysis</span>
              </CardTitle>
              <CardDescription>
                Based on your business metrics and industry benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <PoundSterling className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">Implementation Cost</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(calculation.implementationCost)}
                  </p>
                  <p className="text-sm text-blue-600">One-time investment</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Annual Savings</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(calculation.annualSavings)}
                  </p>
                  <p className="text-sm text-green-600">Year-over-year benefit</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Payback Period</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatYears(calculation.paybackPeriod)}
                  </p>
                  <p className="text-sm text-purple-600">Break-even timeline</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">3-Year ROI</h3>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatPercentage(calculation.threeYearROI)}
                  </p>
                  <p className="text-sm text-orange-600">Return on investment</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-800">5-Year ROI</h3>
                  </div>
                  <p className="text-2xl font-bold text-indigo-900">
                    {formatPercentage(calculation.fiveYearROI)}
                  </p>
                  <p className="text-sm text-indigo-600">Long-term return</p>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <PoundSterling className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-teal-800">Net Present Value</h3>
                  </div>
                  <p className="text-2xl font-bold text-teal-900">
                    {formatCurrency(calculation.netPresentValue)}
                  </p>
                  <p className="text-sm text-teal-600">5-year NPV (10% discount)</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Calculations based on industry benchmarks and typical implementation patterns</li>
                  <li>• Actual results may vary based on specific business requirements and implementation approach</li>
                  <li>• Additional benefits like improved decision-making and compliance are not quantified</li>
                  <li>• Costs include software, implementation, training, and first-year support</li>
                </ul>
              </div>

              <div className="mt-6 text-center">
                <Button 
                  onClick={handleGetDetailedReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  Get Detailed ROI Report & Implementation Roadmap
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Receive a comprehensive 15-page report with implementation timeline and cost breakdown
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showLeadForm && (
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Get Your Detailed ERP ROI Report</span>
            </CardTitle>
            <CardDescription>
              Receive a comprehensive analysis tailored to your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company Ltd"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 7XXX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Your Detailed Report Will Include:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Industry-specific ROI analysis and benchmarks</li>
                <li>✓ Detailed implementation timeline and milestones</li>
                <li>✓ Cost breakdown by phase and module</li>
                <li>✓ Risk assessment and mitigation strategies</li>
                <li>✓ Vendor comparison and recommendations</li>
                <li>✓ 30-minute consultation with our ERP experts</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={submitLeadForm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                disabled={!formData.companyName || !formData.email}
              >
                Send My Detailed Report
              </Button>
              <Button 
                onClick={() => setShowLeadForm(false)}
                variant="outline"
                className="px-6"
              >
                Back
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. Your information will only be used to send your report and relevant ERP insights. 
              You can unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ERPROICalculator;

