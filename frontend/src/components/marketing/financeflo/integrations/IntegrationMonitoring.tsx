import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { Progress } from '@/components/marketing/financeflo/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Database,
  Zap,
  RefreshCw,
  Download,
  Bell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { time: '00:00', throughput: 120, latency: 45, errors: 2 },
  { time: '04:00', throughput: 95, latency: 52, errors: 1 },
  { time: '08:00', throughput: 180, latency: 38, errors: 3 },
  { time: '12:00', throughput: 220, latency: 42, errors: 1 },
  { time: '16:00', throughput: 195, latency: 48, errors: 2 },
  { time: '20:00', throughput: 150, latency: 44, errors: 0 },
];

const errorData = [
  { time: '2024-01-01', count: 5, type: 'Authentication' },
  { time: '2024-01-02', count: 3, type: 'Rate Limit' },
  { time: '2024-01-03', count: 2, type: 'Timeout' },
  { time: '2024-01-04', count: 1, type: 'Validation' },
  { time: '2024-01-05', count: 4, type: 'Connection' },
];

export const IntegrationMonitoring: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [isLive, setIsLive] = useState(true);

  const metrics = [
    {
      title: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Throughput',
      value: '1,245/hr',
      change: '+12%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Avg Latency',
      value: '42ms',
      change: '-8ms',
      trend: 'down' as const,
      icon: Zap,
      color: 'text-warning'
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      change: '-0.01%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-destructive'
    }
  ];

  const recentEvents = [
    {
      time: '2 minutes ago',
      type: 'success',
      message: 'Salesforce contact sync completed',
      count: 45
    },
    {
      time: '8 minutes ago',
      type: 'warning',
      message: 'Rate limit approaching for QuickBooks API',
      count: 1
    },
    {
      time: '15 minutes ago',
      type: 'success',
      message: 'Bulk data transfer completed',
      count: 1250
    },
    {
      time: '23 minutes ago',
      type: 'error',
      message: 'Authentication failed for Salesforce',
      count: 1
    },
    {
      time: '1 hour ago',
      type: 'info',
      message: 'Scheduled maintenance window started',
      count: 0
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Monitoring</h2>
          <p className="text-muted-foreground">Real-time performance metrics and health monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={metric.trend === 'up' ? 'text-success' : 'text-destructive'}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors & Logs</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Metrics</CardTitle>
                <div className="flex items-center gap-2">
                  {['1h', '6h', '24h', '7d'].map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={selectedTimeframe === timeframe ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Throughput (Messages/Hour)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="throughput" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-3">Latency (ms)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="latency" 
                        stroke="hsl(var(--warning))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorData.slice(0, 5).map((error, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <div>
                        <p className="font-semibold">{error.type} Error</p>
                        <p className="text-sm text-muted-foreground">{error.time}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{error.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <p className="font-medium">{event.message}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{event.time}</span>
                        {event.count > 0 && (
                          <>
                            <span>•</span>
                            <span>{event.count.toLocaleString()} records</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'High Error Rate', threshold: '> 1%', enabled: true },
                  { name: 'Low Throughput', threshold: '< 100/hr', enabled: true },
                  { name: 'High Latency', threshold: '> 100ms', enabled: false },
                  { name: 'Connection Failure', threshold: '> 0', enabled: true },
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">Threshold: {alert.threshold}</p>
                    </div>
                    <Badge variant={alert.enabled ? "default" : "secondary"}>
                      {alert.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};