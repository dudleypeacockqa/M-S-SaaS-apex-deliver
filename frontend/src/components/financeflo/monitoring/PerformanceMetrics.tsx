import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Zap, Database, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { productionErrorHandler } from '@/services/productionErrorHandler';

interface PerformanceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  component: string;
  recorded_at: string;
  metadata: any;
}

interface MetricSummary {
  name: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  change: number;
}

export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<MetricSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    generateSampleMetrics();
    
    // Set up real-time subscription for new metrics
    const channel = supabase
      .channel('performance-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'performance_metrics'
        },
        (payload) => {
          setMetrics(prev => [payload.new as PerformanceMetric, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
      calculateSummaryMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleMetrics = async () => {
    // Generate some sample performance metrics for demonstration
    const sampleMetrics = [
      { name: 'page_load_time', value: Math.random() * 2000 + 500, unit: 'ms', component: 'frontend' },
      { name: 'api_response_time', value: Math.random() * 500 + 100, unit: 'ms', component: 'backend' },
      { name: 'database_query_time', value: Math.random() * 200 + 50, unit: 'ms', component: 'database' },
      { name: 'memory_usage', value: Math.random() * 80 + 20, unit: '%', component: 'system' },
    ];

    for (const metric of sampleMetrics) {
      await productionErrorHandler.capturePerformanceMetric(
        metric.name,
        metric.value,
        metric.unit,
        metric.component
      );
    }
  };

  const calculateSummaryMetrics = (data: PerformanceMetric[]) => {
    const summary: MetricSummary[] = [
      {
        name: 'Avg Response Time',
        value: calculateAverage(data.filter(m => m.metric_name.includes('response_time')), 'metric_value'),
        unit: 'ms',
        icon: <Zap className="w-4 h-4" />,
        change: Math.random() * 20 - 10 // Random change for demo
      },
      {
        name: 'Page Load Time',
        value: calculateAverage(data.filter(m => m.metric_name.includes('load_time')), 'metric_value'),
        unit: 'ms',
        icon: <Globe className="w-4 h-4" />,
        change: Math.random() * 20 - 10
      },
      {
        name: 'DB Query Time',
        value: calculateAverage(data.filter(m => m.metric_name.includes('database')), 'metric_value'),
        unit: 'ms',
        icon: <Database className="w-4 h-4" />,
        change: Math.random() * 20 - 10
      },
      {
        name: 'Error Rate',
        value: Math.random() * 5, // Random for demo
        unit: '%',
        icon: <Activity className="w-4 h-4" />,
        change: Math.random() * 10 - 5
      }
    ];

    setSummaryMetrics(summary);
  };

  const calculateAverage = (data: PerformanceMetric[], field: keyof PerformanceMetric): number => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + Number(item[field]), 0);
    return Math.round(sum / data.length);
  };

  const formatChartData = () => {
    return metrics
      .slice(0, 20)
      .reverse()
      .map((metric, index) => ({
        time: new Date(metric.recorded_at).toLocaleTimeString(),
        value: metric.metric_value,
        name: metric.metric_name
      }));
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold">
                    {metric.value.toFixed(0)}{metric.unit}
                  </p>
                  <p className={`text-xs ${metric.change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}% from last hour
                  </p>
                </div>
                <div className="text-muted-foreground">
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formatChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Component Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Component Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { component: 'Frontend', avgTime: 850 },
                { component: 'Backend API', avgTime: 320 },
                { component: 'Database', avgTime: 120 },
                { component: 'External APIs', avgTime: 450 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="component" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};