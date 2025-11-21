import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Brain, 
  Zap,
  BarChart3,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
  prediction: string;
}

interface Alert {
  id: string;
  type: 'performance' | 'security' | 'capacity' | 'integration';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  prediction: string;
  action: string;
}

const initialMetrics: Metric[] = [
  {
    label: "API Response Time",
    value: "127ms",
    change: -12,
    trend: 'down',
    status: 'healthy',
    prediction: "Expected to decrease 8% next hour"
  },
  {
    label: "Integration Success Rate",
    value: "99.7%",
    change: 0.3,
    trend: 'up',
    status: 'healthy',
    prediction: "Maintaining optimal levels"
  },
  {
    label: "Data Processing Volume",
    value: "2.4M records/hr",
    change: 15,
    trend: 'up',
    status: 'warning',
    prediction: "Peak expected in 2 hours"
  },
  {
    label: "System Resource Usage",
    value: "67%",
    change: 8,
    trend: 'up',
    status: 'healthy',
    prediction: "Auto-scaling will trigger at 75%"
  }
];

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'capacity',
    severity: 'medium',
    title: 'Predicted Capacity Threshold',
    description: 'Salesforce integration likely to reach rate limits',
    prediction: 'In 3.2 hours based on current growth pattern',
    action: 'Auto-scaling prepared'
  },
  {
    id: '2',
    type: 'performance',
    severity: 'low',
    title: 'API Latency Optimization',
    description: 'QuickBooks connector showing minor delays',
    prediction: 'Performance will improve after database optimization',
    action: 'Scheduled maintenance at 2 AM'
  },
  {
    id: '3',
    type: 'integration',
    severity: 'high',
    title: 'Connector Health Alert',
    description: 'Azure AD authentication may experience issues',
    prediction: 'Service degradation possible in next 6 hours',
    action: 'Failover to backup auth ready'
  }
];

export function PredictiveAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        change: metric.change + (Math.random() - 0.5) * 2,
        value: updateMetricValue(metric)
      })));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const updateMetricValue = (metric: Metric): string => {
    const variation = (Math.random() - 0.5) * 0.1;
    
    switch (metric.label) {
      case "API Response Time": {
        const newTime = Math.max(50, parseInt(metric.value) + Math.floor(variation * 20));
        return `${newTime}ms`;
      }
      case "Integration Success Rate": {
        const newRate = Math.min(100, Math.max(95, parseFloat(metric.value) + variation));
        return `${newRate.toFixed(1)}%`;
      }
      case "Data Processing Volume": {
        const newVolume = Math.max(1, parseFloat(metric.value) + variation * 0.5);
        return `${newVolume.toFixed(1)}M records/hr`;
      }
      case "System Resource Usage": {
        const newUsage = Math.min(85, Math.max(40, parseInt(metric.value) + Math.floor(variation * 10)));
        return `${newUsage}%`;
      }
      default:
        return metric.value;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
          <Brain className="w-4 h-4 mr-2" />
          Predictive Analytics Engine
        </Badge>
        <h3 className="text-2xl font-bold text-gray-900">
          AI-Powered Integration Intelligence
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Watch IntelliFlow's predictive AI analyze integration patterns, forecast potential issues, and automatically optimize performance in real-time.
        </p>
      </div>

      {/* Control Panel */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-1">
            {isLive ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Data
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                Paused
              </>
            )}
          </Badge>
          <span className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
          {isLive ? 'Pause' : 'Resume'} Live Feed
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-3 h-3" />
                {metric.prediction}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predictive Alerts */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="w-5 h-5" />
            AI Predictive Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-gray-700 mb-2">{alert.description}</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1 text-purple-600">
                  <Brain className="w-3 h-3" />
                  <span className="font-medium">AI Prediction:</span> {alert.prediction}
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Zap className="w-3 h-3" />
                  <span className="font-medium">Auto-Action:</span> {alert.action}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="w-5 h-5" />
            AI Integration Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Optimization Score</h4>
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-xs text-gray-600">AI continuously optimizing</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Auto-Fixes Applied</h4>
              <p className="text-2xl font-bold text-blue-600">23</p>
              <p className="text-xs text-gray-600">Issues resolved automatically</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Learning Patterns</h4>
              <p className="text-2xl font-bold text-purple-600">12K+</p>
              <p className="text-xs text-gray-600">Data points analyzed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}