import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { AIAgent } from '@/types/saas';
import { cn } from '@/lib/utils';

interface AgentPerformanceMonitorProps {
  agents: AIAgent[];
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

// Mock performance data - in real app, this would come from your analytics system
const generateMockPerformanceData = (agents: AIAgent[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    dailyExecutions: last7Days.map(date => ({
      date,
      ...agents.reduce((acc, agent) => ({
        ...acc,
        [agent.name]: Math.floor(Math.random() * 50) + 10
      }), {})
    })),
    successRates: agents.map(agent => ({
      name: agent.name,
      successRate: agent.success_rate || Math.random() * 30 + 70,
      executions: agent.execution_count || Math.floor(Math.random() * 1000) + 100
    })),
    responseTime: last7Days.map(date => ({
      date,
      avgResponseTime: Math.random() * 1000 + 200
    })),
    agentDistribution: agents.map(agent => ({
      name: agent.name,
      value: agent.execution_count || Math.floor(Math.random() * 100) + 50,
      type: agent.type
    }))
  };
};

export const AgentPerformanceMonitor: React.FC<AgentPerformanceMonitorProps> = ({ agents }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('executions');
  const [performanceData, setPerformanceData] = useState(generateMockPerformanceData(agents));

  useEffect(() => {
    setPerformanceData(generateMockPerformanceData(agents));
  }, [agents, timeRange]);

  const totalExecutions = agents.reduce((sum, agent) => sum + (agent.execution_count || 0), 0);
  const avgSuccessRate = agents.length > 0 ? 
    agents.reduce((sum, agent) => sum + (agent.success_rate || 0), 0) / agents.length : 0;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const errorAgents = agents.filter(agent => agent.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{totalExecutions.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+2.3% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{activeAgents}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Zap className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-blue-600">{agents.length} total agents</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">{errorAgents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Clock className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">Last 24 hours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executions">Executions</SelectItem>
            <SelectItem value="success_rate">Success Rate</SelectItem>
            <SelectItem value="response_time">Response Time</SelectItem>
            <SelectItem value="errors">Error Rate</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto">
          Export Data
        </Button>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData.dailyExecutions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {agents.map((agent, index) => (
                      <Area
                        key={agent.id}
                        type="monotone"
                        dataKey={agent.name}
                        stackId="1"
                        stroke={CHART_COLORS[index % CHART_COLORS.length]}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        fillOpacity={0.6}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Success Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData.successRates}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData.responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgResponseTime" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{agent.execution_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Executions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{(agent.success_rate || 0).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Success</p>
                      </div>
                      <div className="text-center">
                        <Badge 
                          variant={agent.status === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            agent.status === 'active' && 'bg-green-500/10 text-green-700',
                            agent.status === 'error' && 'bg-red-500/10 text-red-700'
                          )}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Agent Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={performanceData.agentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.agentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData.dailyExecutions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  {agents.map((agent, index) => (
                    <Line
                      key={agent.id}
                      type="monotone"
                      dataKey={agent.name}
                      stroke={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};