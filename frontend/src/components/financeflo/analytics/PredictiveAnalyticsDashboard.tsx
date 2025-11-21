import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, 
  Users, DollarSign, Calendar, Phone, Mail, Star 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface LeadPrediction {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  conversionProbability: number;
  predictedValue: number;
  timeToConversion: number;
  riskFactors: string[];
  nextBestAction: {
    type: 'call' | 'email' | 'demo' | 'proposal';
    priority: 'high' | 'medium' | 'low';
    description: string;
    deadline: string;
  };
  leadScore: number;
  industry: string;
  source: string;
  lastActivity: string;
}

interface PipelineMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageDealSize: number;
  salesCycleLength: number;
  churnRisk: number;
  monthlyRecurringRevenue: number;
  predictedRevenue: {
    month: number;
    revenue: number;
    confidence: number;
  }[];
}

export const PredictiveAnalyticsDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadPrediction[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch real data from your analytics service
    const fetchPredictiveData = async () => {
      setIsLoading(true);
      
      // Mock data for demonstration
      const mockLeads: LeadPrediction[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          company: 'TechFlow Solutions',
          email: 'sarah@techflow.com',
          phone: '+1-555-0123',
          conversionProbability: 87,
          predictedValue: 45000,
          timeToConversion: 14,
          riskFactors: ['No recent activity', 'Competitor evaluation'],
          nextBestAction: {
            type: 'call',
            priority: 'high',
            description: 'Schedule final decision call',
            deadline: '2024-01-15'
          },
          leadScore: 92,
          industry: 'Technology',
          source: 'Website Chat',
          lastActivity: '2024-01-08'
        },
        {
          id: '2',
          name: 'Michael Chen',
          company: 'Global Manufacturing Inc',
          email: 'mchen@globalmanuf.com',
          conversionProbability: 73,
          predictedValue: 125000,
          timeToConversion: 28,
          riskFactors: ['Budget approval pending'],
          nextBestAction: {
            type: 'proposal',
            priority: 'high',
            description: 'Send detailed implementation proposal',
            deadline: '2024-01-12'
          },
          leadScore: 85,
          industry: 'Manufacturing',
          source: 'VSL Funnel',
          lastActivity: '2024-01-07'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          company: 'HealthCare Partners',
          email: 'emily@healthpartners.com',
          conversionProbability: 65,
          predictedValue: 78000,
          timeToConversion: 35,
          riskFactors: ['Multiple stakeholders', 'Compliance concerns'],
          nextBestAction: {
            type: 'demo',
            priority: 'medium',
            description: 'Schedule compliance-focused demo',
            deadline: '2024-01-18'
          },
          leadScore: 78,
          industry: 'Healthcare',
          source: 'LinkedIn',
          lastActivity: '2024-01-06'
        }
      ];

      const mockMetrics: PipelineMetrics = {
        totalLeads: 247,
        qualifiedLeads: 89,
        conversionRate: 18.5,
        averageDealSize: 67500,
        salesCycleLength: 42,
        churnRisk: 12,
        monthlyRecurringRevenue: 45000,
        predictedRevenue: [
          { month: 1, revenue: 180000, confidence: 85 },
          { month: 2, revenue: 220000, confidence: 78 },
          { month: 3, revenue: 195000, confidence: 72 },
          { month: 4, revenue: 245000, confidence: 68 },
          { month: 5, revenue: 290000, confidence: 65 },
          { month: 6, revenue: 315000, confidence: 62 }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLeads(mockLeads);
      setMetrics(mockMetrics);
      setIsLoading(false);
    };

    fetchPredictiveData();
  }, [selectedTimeframe]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'demo': return <Calendar className="h-4 w-4" />;
      case 'proposal': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing predictive data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Predictive Analytics</h1>
          <p className="text-muted-foreground">AI-powered insights and predictions for your sales pipeline</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{metrics.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                  <p className="text-2xl font-bold">${(metrics.averageDealSize / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Churn Risk</p>
                  <p className="text-2xl font-bold">{metrics.churnRisk}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Forecast (Next 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.predictedRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => `Month ${value}`}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${(value / 1000).toFixed(0)}K`,
                      name === 'revenue' ? 'Predicted Revenue' : name
                    ]}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* High-Priority Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            High-Priority Lead Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <Badge variant="secondary">{lead.company}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.industry} • {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${(lead.predictedValue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">{lead.conversionProbability}% likely</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conversion Probability */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Probability</span>
                      <span className="font-medium">{lead.conversionProbability}%</span>
                    </div>
                    <Progress value={lead.conversionProbability} className="h-2" />
                  </div>

                  {/* Time to Conversion */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Est. Time to Close</span>
                      <span className="font-medium">{lead.timeToConversion} days</span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - (lead.timeToConversion / 60) * 100)} 
                      className="h-2" 
                    />
                  </div>

                  {/* Lead Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lead Score</span>
                      <span className="font-medium">{lead.leadScore}/100</span>
                    </div>
                    <Progress value={lead.leadScore} className="h-2" />
                  </div>
                </div>

                {/* Next Best Action */}
                <div className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-primary/10`}>
                      {getActionIcon(lead.nextBestAction.type)}
                    </div>
                    <div>
                      <p className="font-medium">Next Best Action</p>
                      <p className="text-sm text-muted-foreground">{lead.nextBestAction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(lead.nextBestAction.priority)}>
                      {lead.nextBestAction.priority} priority
                    </Badge>
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  </div>
                </div>

                {/* Risk Factors */}
                {lead.riskFactors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Risk factors:</span>
                    <div className="flex gap-1">
                      {lead.riskFactors.map((risk, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {risk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};