import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Activity,
  Zap,
  Shield
} from 'lucide-react';

interface SystemNode {
  id: string;
  name: string;
  type: 'web' | 'api' | 'database' | 'cache' | 'queue';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  cpu: number;
  memory: number;
  disk: number;
  load: number;
  lastCheck: string;
}

const SystemHealth = () => {
  const [refreshing, setRefreshing] = useState(false);

  const systemNodes: SystemNode[] = [
    {
      id: 'web-1',
      name: 'Web Server 1',
      type: 'web',
      status: 'healthy',
      uptime: 99.9,
      cpu: 45,
      memory: 62,
      disk: 34,
      load: 1.2,
      lastCheck: '30 seconds ago'
    },
    {
      id: 'web-2',
      name: 'Web Server 2',
      type: 'web',
      status: 'healthy',
      uptime: 99.8,
      cpu: 38,
      memory: 58,
      disk: 36,
      load: 0.9,
      lastCheck: '30 seconds ago'
    },
    {
      id: 'api-1',
      name: 'API Server 1',
      type: 'api',
      status: 'warning',
      uptime: 98.7,
      cpu: 78,
      memory: 89,
      disk: 45,
      load: 2.1,
      lastCheck: '1 minute ago'
    },
    {
      id: 'db-primary',
      name: 'Database Primary',
      type: 'database',
      status: 'critical',
      uptime: 99.2,
      cpu: 67,
      memory: 95,
      disk: 78,
      load: 3.2,
      lastCheck: '45 seconds ago'
    },
    {
      id: 'cache-1',
      name: 'Redis Cache',
      type: 'cache',
      status: 'healthy',
      uptime: 99.9,
      cpu: 23,
      memory: 34,
      disk: 12,
      load: 0.4,
      lastCheck: '30 seconds ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'offline':
        return <Server className="w-4 h-4 text-gray-500" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Critical</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'web':
        return <Globe className="w-5 h-5" />;
      case 'api':
        return <Zap className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'cache':
        return <MemoryStick className="w-5 h-5" />;
      case 'queue':
        return <Activity className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const overallHealth = {
    status: 'warning',
    uptime: 99.3,
    totalNodes: systemNodes.length,
    healthyNodes: systemNodes.filter(n => n.status === 'healthy').length,
    warningNodes: systemNodes.filter(n => n.status === 'warning').length,
    criticalNodes: systemNodes.filter(n => n.status === 'critical').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Health Monitoring</h2>
          <p className="text-muted-foreground">Real-time infrastructure status and performance metrics</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Overall Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(overallHealth.status)}
              {getStatusBadge(overallHealth.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              System operational with minor issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Nodes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth.healthyNodes}/{overallHealth.totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              Active and responding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth.warningNodes + overallHealth.criticalNodes}</div>
            <p className="text-xs text-muted-foreground">
              {overallHealth.warningNodes} warnings, {overallHealth.criticalNodes} critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Node Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemNodes.map((node) => (
              <Card key={node.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getNodeIcon(node.type)}
                      <CardTitle className="text-lg">{node.name}</CardTitle>
                    </div>
                    {getStatusBadge(node.status)}
                  </div>
                  <CardDescription>
                    Uptime: {node.uptime}% • Last check: {node.lastCheck}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        CPU
                      </span>
                      <span>{node.cpu}%</span>
                    </div>
                    <Progress value={node.cpu} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <MemoryStick className="w-3 h-3" />
                        Memory
                      </span>
                      <span>{node.memory}%</span>
                    </div>
                    <Progress value={node.memory} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        Disk
                      </span>
                      <span>{node.disk}%</span>
                    </div>
                    <Progress value={node.disk} className="h-2" />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Load Average</span>
                      <span className={node.load > 2 ? 'text-red-500' : node.load > 1 ? 'text-yellow-500' : 'text-green-500'}>
                        {node.load}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-2" />
                  <p>Performance charts would be displayed here</p>
                  <p className="text-sm">Real-time metrics and historical data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div className="p-3 bg-muted rounded border-l-4 border-l-green-500">
                  <span className="text-muted-foreground">[2024-01-28 10:15:32]</span> INFO: System health check completed successfully
                </div>
                <div className="p-3 bg-muted rounded border-l-4 border-l-yellow-500">
                  <span className="text-muted-foreground">[2024-01-28 10:14:45]</span> WARN: High memory usage detected on api-1 (89%)
                </div>
                <div className="p-3 bg-muted rounded border-l-4 border-l-red-500">
                  <span className="text-muted-foreground">[2024-01-28 10:12:18]</span> ERROR: Database connection pool exhausted on db-primary
                </div>
                <div className="p-3 bg-muted rounded border-l-4 border-l-blue-500">
                  <span className="text-muted-foreground">[2024-01-28 10:10:02]</span> INFO: Backup completed for tenant data
                </div>
                <div className="p-3 bg-muted rounded border-l-4 border-l-green-500">
                  <span className="text-muted-foreground">[2024-01-28 10:08:15]</span> INFO: Cache refresh completed successfully
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;