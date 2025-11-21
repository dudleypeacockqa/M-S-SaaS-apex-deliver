import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AIAgent } from '@/types/saas';
import { cn } from '@/lib/utils';
import { AgentConfigDialog } from './AgentConfigDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIAgentCardProps {
  agent: AIAgent;
  onUpdate: () => void;
}

export const AIAgentCard: React.FC<AIAgentCardProps> = ({ agent, onUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const getStatusIcon = () => {
    switch (agent.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'error':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const toggleAgentStatus = async () => {
    setLoading(true);
    try {
      const newStatus = agent.status === 'active' ? 'paused' : 'active';
      
      const { error } = await supabase
        .from('ai_agents')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', agent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Agent ${newStatus === 'active' ? 'activated' : 'paused'}`,
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error toggling agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatExecutionCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-border">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon()}
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getStatusColor())}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfig(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description || 'No description provided'}
          </p>

          {/* Agent Type */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {agent.type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-border/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-medium">
                <Activity className="w-3 h-3" />
                {formatExecutionCount(agent.execution_count || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Executions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                {(agent.success_rate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>

          {/* Last Execution */}
          {agent.last_execution_at && (
            <div className="text-xs text-muted-foreground">
              Last run: {new Date(agent.last_execution_at).toLocaleDateString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant={agent.status === 'active' ? 'secondary' : 'default'}
              size="sm"
              onClick={toggleAgentStatus}
              disabled={loading}
              className="flex-1"
            >
              {agent.status === 'active' ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(true)}
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AgentConfigDialog
        agent={agent}
        open={showConfig}
        onOpenChange={setShowConfig}
        onUpdate={onUpdate}
      />
    </>
  );
};