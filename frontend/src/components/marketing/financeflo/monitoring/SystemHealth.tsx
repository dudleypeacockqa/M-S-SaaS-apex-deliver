import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/marketing/financeflo/use-toast';

interface HealthCheck {
  id: string;
  service_name: string;
  status: 'healthy' | 'degraded' | 'down';
  response_time_ms: number;
  error_message?: string;
  checked_at: string;
  metadata: any;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  errorMessage?: string;
  uptime: number;
}

export const SystemHealth: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHealthChecks();
    runHealthChecks();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('system-health')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_health'
        },
        (payload) => {
          fetchHealthChecks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchHealthChecks = async () => {
    try {
      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .order('checked_at', { ascending: false });

      if (error) throw error;
      
      setHealthChecks((data || []) as HealthCheck[]);
      processHealthData((data || []) as HealthCheck[]);
    } catch (error) {
      console.error('Error fetching health checks:', error);
    } finally {
      setLoading(false);
    }
  };

  const processHealthData = (data: HealthCheck[]) => {
    const serviceMap = new Map<string, HealthCheck[]>();
    
    data.forEach(check => {
      if (!serviceMap.has(check.service_name)) {
        serviceMap.set(check.service_name, []);
      }
      serviceMap.get(check.service_name)!.push(check);
    });

    const processedServices: ServiceStatus[] = Array.from(serviceMap.entries()).map(([serviceName, checks]) => {
      const latestCheck = checks[0];
      const healthyChecks = checks.filter(c => c.status === 'healthy').length;
      const uptime = (healthyChecks / checks.length) * 100;

      return {
        name: serviceName,
        status: latestCheck.status,
        responseTime: latestCheck.response_time_ms,
        lastCheck: latestCheck.checked_at,
        errorMessage: latestCheck.error_message,
        uptime: Math.round(uptime)
      };
    });

    setServices(processedServices);
  };

  const runHealthChecks = async () => {
    setChecking(true);
    
    try {
      // Invoke health check edge function
      const { data, error } = await supabase.functions.invoke('health-check');
      
      if (error) throw error;
      
      toast({
        title: "Health Check Complete",
        description: "All services have been checked",
      });
      
      // Refresh data after health check
      setTimeout(() => {
        fetchHealthChecks();
      }, 1000);
      
    } catch (error) {
      console.error('Error running health checks:', error);
      toast({
        title: "Health Check Failed",
        description: "Failed to run health checks",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-800">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const overallStatus = services.length > 0 ? 
    services.every(s => s.status === 'healthy') ? 'healthy' :
    services.some(s => s.status === 'down') ? 'down' : 'degraded'
    : 'unknown';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Health Overview</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runHealthChecks}
            disabled={checking}
          >
            {checking ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Check All Services
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {getStatusIcon(overallStatus)}
            <div>
              <h3 className="text-lg font-semibold">
                System Status: {getStatusBadge(overallStatus)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {services.filter(s => s.status === 'healthy').length} of {services.length} services healthy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Services */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No health check data available. Run a health check to see service status.
              </p>
            ) : (
              services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last checked: {new Date(service.lastCheck).toLocaleString()}
                      </p>
                      {service.errorMessage && (
                        <p className="text-sm text-red-500 mt-1">
                          {service.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(service.status)}
                    <div className="text-sm text-muted-foreground mt-1">
                      {service.responseTime}ms response
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.uptime}% uptime
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};