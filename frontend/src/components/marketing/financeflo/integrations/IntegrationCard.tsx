import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Progress } from '@/components/marketing/financeflo/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  Settings, 
  Activity, 
  TrendingUp,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'pending' | 'error' | 'paused';
  lastSync: string;
  syncRate: number;
  dataPoints: number;
  errorCount: number;
  uptime: number;
  logo?: string;
  aiGenerated?: boolean;
}

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (id: string) => void;
  onMonitor: (id: string) => void;
  onToggle: (id: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConfigure,
  onMonitor,
  onToggle
}) => {
  const getStatusIcon = () => {
    switch (integration.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = () => {
    switch (integration.status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'paused':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getUptimeColor = () => {
    if (integration.uptime >= 99) return 'text-success';
    if (integration.uptime >= 95) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {integration.logo ? (
              <img src={integration.logo} alt={integration.name} className="w-8 h-8 rounded" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {integration.name}
                {integration.aiGenerated && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700">
                    AI Generated
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                {integration.category} • {integration.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{integration.dataPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Data Points</p>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${getUptimeColor()}`}>{integration.uptime}%</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{integration.syncRate}/min</p>
            <p className="text-xs text-muted-foreground">Sync Rate</p>
          </div>
        </div>

        {/* Sync Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last sync: {integration.lastSync}</span>
            {integration.errorCount > 0 && (
              <span className="text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {integration.errorCount} errors
              </span>
            )}
          </div>
          {integration.status === 'active' && (
            <Progress value={85} className="h-2" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onConfigure(integration.id)}
            className="flex-1"
          >
            <Settings className="mr-2 h-3 w-3" />
            Configure
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMonitor(integration.id)}
            className="flex-1"
          >
            <Activity className="mr-2 h-3 w-3" />
            Monitor
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onToggle(integration.id)}
          >
            {integration.status === 'active' ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};