import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/marketing/financeflo/ui/dialog';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Label } from '@/components/marketing/financeflo/ui/label';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Switch } from '@/components/marketing/financeflo/ui/switch';
import { Bot, Workflow, MessageCircle, BarChart3, Monitor } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/marketing/financeflo/ui/use-toast';

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AGENT_TYPES = [
  {
    value: 'workflow',
    label: 'Workflow Agent',
    description: 'Automates business processes and workflows',
    icon: Workflow,
    features: ['Process Automation', 'Task Orchestration', 'Event Handling']
  },
  {
    value: 'conversation',
    label: 'Conversation Agent',
    description: 'Handles customer interactions and support',
    icon: MessageCircle,
    features: ['Natural Language Processing', 'Context Awareness', 'Multi-turn Conversations']
  },
  {
    value: 'data_analysis',
    label: 'Data Analysis Agent',
    description: 'Analyzes data and generates insights',
    icon: BarChart3,
    features: ['Pattern Recognition', 'Predictive Analytics', 'Report Generation']
  },
  {
    value: 'monitoring',
    label: 'Monitoring Agent',
    description: 'Monitors systems and alerts on issues',
    icon: Monitor,
    features: ['Real-time Monitoring', 'Alert Management', 'Performance Tracking']
  }
];

export const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    autonomous: false,
    confidenceThreshold: 0.8,
    learningRate: 'medium',
    maxConcurrentTasks: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id || !user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ai_agents')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type as any,
          tenant_id: currentTenant.id,
          created_by: user.id,
          configuration: {
            autonomous: formData.autonomous,
            confidenceThreshold: formData.confidenceThreshold,
            learningRate: formData.learningRate,
            maxConcurrentTasks: formData.maxConcurrentTasks,
          },
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI agent created successfully",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        type: '',
        autonomous: false,
        confidenceThreshold: 0.8,
        learningRate: 'medium',
        maxConcurrentTasks: 3,
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create AI agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAgentType = AGENT_TYPES.find(type => type.value === formData.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Create New AI Agent
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Type Selection */}
          <div className="space-y-4">
            <Label>Agent Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all border-2 ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <IconComponent className="w-4 h-4" />
                        {type.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {type.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter agent name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learning-rate">Learning Rate</Label>
              <Select
                value={formData.learningRate}
                onValueChange={(value) => setFormData(prev => ({ ...prev, learningRate: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Conservative</SelectItem>
                  <SelectItem value="medium">Balanced</SelectItem>
                  <SelectItem value="high">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this agent will do..."
              rows={3}
            />
          </div>

          {/* Configuration */}
          {selectedAgentType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Agent Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Autonomous Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow independent decision making
                        </p>
                      </div>
                      <Switch
                        checked={formData.autonomous}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, autonomous: checked }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence">Confidence Threshold</Label>
                      <Input
                        id="confidence"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={formData.confidenceThreshold}
                        onChange={(e) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            confidenceThreshold: parseFloat(e.target.value) 
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum confidence for autonomous actions (0.0 - 1.0)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-tasks">Max Concurrent Tasks</Label>
                      <Input
                        id="max-tasks"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.maxConcurrentTasks}
                        onChange={(e) => 
                          setFormData(prev => ({ 
                            ...prev, 
                            maxConcurrentTasks: parseInt(e.target.value) 
                          }))
                        }
                      />
                    </div>

                    {/* Type-specific configuration hints */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        {selectedAgentType.label} Features:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {selectedAgentType.features.map((feature) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.name.trim() || !formData.type}
            >
              {loading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};