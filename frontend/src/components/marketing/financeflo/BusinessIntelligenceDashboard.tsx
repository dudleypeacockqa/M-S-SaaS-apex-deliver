import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'financial' | 'operational' | 'customer' | 'growth';
  status: 'good' | 'warning' | 'critical';
}

interface ChartData {
  name: string;
  value: number;
  previous?: number;
  target?: number;
}

interface BusinessIntelligenceDashboardProps {
  industry?: string;
  timeRange?: string;
  onMetricClick?: (metric: KPIMetric) => void;
  showPredictive?: boolean;
}

export const BusinessIntelligenceDashboard: React.FC<BusinessIntelligenceDashboardProps> = ({
  industry = 'manufacturing',
  timeRange = '30d',
  onMetricClick,
  showPredictive = true
}) => {
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Sample data - in real implementation, this would come from APIs
  const revenueData: ChartData[] = [
    { name: 'Jan', value: 420000, previous: 380000, target: 450000 },
    { name: 'Feb', value: 445000, previous: 395000, target: 460000 },
    { name: 'Mar', value: 478000, previous: 420000, target: 470000 },
    { name: 'Apr', value: 502000, previous: 445000, target: 480000 },
    { name: 'May', value: 525000, previous: 478000, target: 490000 },
    { name: 'Jun', value: 548000, previous: 502000, target: 500000 }
  ];

  const profitabilityData: ChartData[] = [
    { name: 'Q1', value: 18.5, previous: 16.2, target: 20 },
    { name: 'Q2', value: 21.3, previous: 18.5, target: 22 },
    { name: 'Q3', value: 23.7, previous: 21.3, target: 24 },
    { name: 'Q4', value: 25.1, previous: 23.7, target: 26 }
  ];

  const departmentPerformance: ChartData[] = [
    { name: 'Sales', value: 92 },
    { name: 'Operations', value: 87 },
    { name: 'Finance', value: 94 },
    { name: 'HR', value: 89 },
    { name: 'IT', value: 91 }
  ];

  const industryBenchmarks: ChartData[] = [
    { name: 'Revenue Growth', value: 15.2, target: 12.5 },
    { name: 'Profit Margin', value: 23.7, target: 18.3 },
    { name: 'Efficiency', value: 89.4, target: 82.1 },
    { name: 'Customer Satisfaction', value: 94.2, target: 87.6 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    loadMetrics();
  }, [industry, selectedTimeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMetrics: KPIMetric[] = [
      {
        id: '1',
        name: 'Monthly Recurring Revenue',
        value: 548000,
        previousValue: 525000,
        target: 600000,
        unit: '£',
        trend: 'up',
        category: 'financial',
        status: 'good'
      },
      {
        id: '2',
        name: 'Gross Profit Margin',
        value: 25.1,
        previousValue: 23.7,
        target: 28.0,
        unit: '%',
        trend: 'up',
        category: 'financial',
        status: 'good'
      },
      {
        id: '3',
        name: 'Customer Acquisition Cost',
        value: 1250,
        previousValue: 1380,
        target: 1000,
        unit: '£',
        trend: 'down',
        category: 'customer',
        status: 'warning'
      },
      {
        id: '4',
        name: 'Customer Lifetime Value',
        value: 15600,
        previousValue: 14200,
        target: 18000,
        unit: '£',
        trend: 'up',
        category: 'customer',
        status: 'good'
      },
      {
        id: '5',
        name: 'Operational Efficiency',
        value: 89.4,
        previousValue: 87.1,
        target: 92.0,
        unit: '%',
        trend: 'up',
        category: 'operational',
        status: 'good'
      },
      {
        id: '6',
        name: 'Employee Productivity',
        value: 94.2,
        previousValue: 91.8,
        target: 95.0,
        unit: '%',
        trend: 'up',
        category: 'operational',
        status: 'good'
      },
      {
        id: '7',
        name: 'Cash Flow',
        value: 125000,
        previousValue: 98000,
        target: 150000,
        unit: '£',
        trend: 'up',
        category: 'financial',
        status: 'good'
      },
      {
        id: '8',
        name: 'Market Share Growth',
        value: 2.3,
        previousValue: 1.8,
        target: 3.0,
        unit: '%',
        trend: 'up',
        category: 'growth',
        status: 'good'
      },
      {
        id: '9',
        name: 'Customer Satisfaction',
        value: 4.6,
        previousValue: 4.4,
        target: 4.8,
        unit: '/5',
        trend: 'up',
        category: 'customer',
        status: 'good'
      },
      {
        id: '10',
        name: 'Time to Market',
        value: 45,
        previousValue: 52,
        target: 40,
        unit: 'days',
        trend: 'down',
        category: 'operational',
        status: 'warning'
      }
    ];
    
    setMetrics(mockMetrics);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const getFilteredMetrics = () => {
    if (selectedCategory === 'all') {
      return metrics;
    }
    return metrics.filter(metric => metric.category === selectedCategory);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '£') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === '/5') {
      return `${value.toFixed(1)}/5`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h2>
          <p className="text-gray-600">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadMetrics} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {getFilteredMetrics().map((metric) => {
          const percentageChange = calculatePercentageChange(metric.value, metric.previousValue);
          
          return (
            <Card 
              key={metric.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onMetricClick && onMetricClick(metric)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(metric.status)} variant="secondary">
                    {metric.status.toUpperCase()}
                  </Badge>
                  {getTrendIcon(metric.trend)}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-medium">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatValue(metric.value, metric.unit)}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center ${
                      percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {percentageChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(percentageChange).toFixed(1)}%
                    </span>
                    <span className="text-gray-500">
                      Target: {formatValue(metric.target, metric.unit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`£${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} name="Current" />
                <Line type="monotone" dataKey="previous" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" name="Previous" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Target" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profitability Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Profitability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Bar dataKey="value" fill="#3B82F6" name="Current" />
                <Bar dataKey="target" fill="#10B981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Industry Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {industryBenchmarks.map((benchmark, index) => {
                const performance = (benchmark.value / benchmark.target!) * 100;
                const isAboveTarget = benchmark.value > benchmark.target!;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{benchmark.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {benchmark.value}% vs {benchmark.target}%
                        </span>
                        {isAboveTarget ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isAboveTarget ? 'bg-green-600' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${Math.min(performance, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics Section */}
      {showPredictive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              AI-Powered Insights & Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Revenue Forecast</h3>
                </div>
                <p className="text-sm text-blue-800">
                  Based on current trends, revenue is projected to reach £650K by Q4, 
                  representing a 18.6% growth over last year.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Optimization Opportunity</h3>
                </div>
                <p className="text-sm text-green-800">
                  Implementing automated workflows could reduce operational costs by 
                  £45K annually and improve efficiency by 23%.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-yellow-900">Risk Alert</h3>
                </div>
                <p className="text-sm text-yellow-800">
                  Customer acquisition costs are trending upward. Consider reviewing 
                  marketing strategies to maintain healthy unit economics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessIntelligenceDashboard;

