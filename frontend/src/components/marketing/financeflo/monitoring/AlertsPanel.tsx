import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Alert, AlertDescription } from '@/components/marketing/financeflo/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/marketing/financeflo/use-toast';

interface AlertNotification {
  id: string;
  rule_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  current_value: number;
  threshold: number;
  created_at: string;
  metadata: any;
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    
    // Set up real-time subscription for new alerts
    const channel = supabase
      .channel('alert-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alert_notifications'
        },
        (payload) => {
          setAlerts(prev => [payload.new as AlertNotification, ...prev]);
          
          // Show toast for critical alerts
          if (payload.new.severity === 'critical') {
            toast({
              title: "Critical Alert",
              description: payload.new.message,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts((data || []) as AlertNotification[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Alerts</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchAlerts}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No active alerts. All systems are running normally.
              </AlertDescription>
            </Alert>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className="border-l-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alert.rule_name}</h4>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <span>Current: {alert.current_value}</span>
                        <span className="mx-2">•</span>
                        <span>Threshold: {alert.threshold}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(alert.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};