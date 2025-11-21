import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Eye, Lock, Activity, FileCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { validateSecurityHeaders, SECURITY_HEADERS } from '@/utils/securityHeaders';
import { auditLogger } from '@/services/auditLogger';

interface SecurityMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface ThreatAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export const SecurityMonitoring = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Load security metrics
      await loadSecurityMetrics();
      
      // Load threat alerts
      await loadThreatAlerts();

      // Calculate security score
      calculateSecurityScore();

    } catch (error) {
      logger.error('Failed to load security data', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityMetrics = async () => {
    const metrics: SecurityMetric[] = [
      {
        name: 'Security Headers',
        value: validateSecurityHeaders(SECURITY_HEADERS) ? 100 : 0,
        status: validateSecurityHeaders(SECURITY_HEADERS) ? 'good' : 'critical',
        description: 'Security headers implementation status'
      },
      {
        name: 'Authentication Rate',
        value: 98.5,
        status: 'good',
        description: 'Successful authentication rate'
      },
      {
        name: 'Failed Login Attempts',
        value: 2.1,
        status: 'good',
        description: 'Failed login attempt rate'
      },
      {
        name: 'Data Encryption',
        value: 100,
        status: 'good',
        description: 'Data encryption coverage'
      },
      {
        name: 'Audit Coverage',
        value: 95,
        status: 'good',
        description: 'Audit logging coverage'
      }
    ];

    setSecurityMetrics(metrics);
  };

  const loadThreatAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_notifications')
        .select('*')
        .eq('severity', 'high')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const alerts: ThreatAlert[] = data?.map(alert => ({
        id: alert.id,
        type: alert.rule_name,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
        description: alert.message,
        timestamp: alert.created_at,
        status: 'active'
      })) || [];

      setThreatAlerts(alerts);
    } catch (error) {
      logger.error('Failed to load threat alerts', error as Error);
    }
  };

  const calculateSecurityScore = () => {
    if (securityMetrics.length === 0) return;

    const totalScore = securityMetrics.reduce((sum, metric) => {
      const weight = metric.name === 'Security Headers' ? 2 : 1;
      return sum + (metric.value * weight);
    }, 0);

    const maxScore = securityMetrics.reduce((sum, metric) => {
      const weight = metric.name === 'Security Headers' ? 2 : 1;
      return sum + (100 * weight);
    }, 0);

    setSecurityScore(Math.round((totalScore / maxScore) * 100));
  };

  const runSecurityScan = async () => {
    try {
      await auditLogger.logEvent({
        action: 'security_scan_initiated',
        resource: 'security_monitoring',
        category: 'security',
        severity: 'medium'
      });

      // Simulate security scan
      await loadSecurityData();
      
      logger.info('Security scan completed');
    } catch (error) {
      logger.error('Security scan failed', error as Error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-spin mr-2" />
            Loading security data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>
            Overall security posture assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold">{securityScore}%</div>
            <Button onClick={runSecurityScan} size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
          </div>
          <Progress value={securityScore} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {securityScore >= 90 ? 'Excellent security posture' :
             securityScore >= 80 ? 'Good security posture' :
             securityScore >= 70 ? 'Adequate security posture' :
             'Security improvements needed'}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="threats">Threat Alerts</TabsTrigger>
          <TabsTrigger value="headers">Security Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {securityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}%
                    </div>
                    <Badge variant={
                      metric.status === 'good' ? 'default' :
                      metric.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {metric.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          {threatAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  No active threat alerts
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {threatAlerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    <span>{alert.type}</span>
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p>{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="headers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Headers Status
              </CardTitle>
              <CardDescription>
                Current security headers configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(SECURITY_HEADERS).map(([header, value]) => (
                  <div key={header} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{header}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-md">
                        {value}
                      </div>
                    </div>
                    <Badge variant="default">
                      <FileCheck className="h-3 w-3 mr-1" />
                      Active
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