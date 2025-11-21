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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { Switch } from '@/components/marketing/financeflo/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/marketing/financeflo/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { AIAgent } from '@/types/saas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/marketing/financeflo/ui/use-toast';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Bot, Brain, Zap, Clock, Target } from 'lucide-react';

interface AgentConfigDialogProps {
  agent: AIAgent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const AgentConfigDialog: React.FC<AgentConfigDialogProps> = ({
  agent,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description || '',
    type: agent.type,
    configuration: agent.configuration,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          configuration: formData.configuration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', agent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent configuration updated successfully",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfiguration = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Configure {agent.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Agent Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workflow">Workflow Agent</SelectItem>
                    <SelectItem value="conversation">Conversation Agent</SelectItem>
                    <SelectItem value="data_analysis">Data Analysis Agent</SelectItem>
                    <SelectItem value="monitoring">Monitoring Agent</SelectItem>
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
                rows={3}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  Agent Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Status</p>
                    <p className="text-sm text-muted-foreground">
                      Agent is currently {agent.status}
                    </p>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4" />
                  AI Behavior Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autonomous Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow agent to make decisions independently
                    </p>
                  </div>
                  <Switch
                    checked={formData.configuration.autonomous || false}
                    onCheckedChange={(checked) => updateConfiguration('autonomous', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confidence Threshold</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.configuration.confidenceThreshold || 0.8}
                    onChange={(e) => updateConfiguration('confidenceThreshold', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum confidence level for autonomous actions (0.0 - 1.0)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Learning Rate</Label>
                  <Select
                    value={formData.configuration.learningRate || 'medium'}
                    onValueChange={(value) => updateConfiguration('learningRate', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Conservative learning</SelectItem>
                      <SelectItem value="medium">Medium - Balanced learning</SelectItem>
                      <SelectItem value="high">High - Aggressive learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4" />
                  Performance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Concurrent Tasks</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.configuration.maxConcurrentTasks || 3}
                    onChange={(e) => updateConfiguration('maxConcurrentTasks', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Execution Timeout (seconds)</Label>
                  <Input
                    type="number"
                    min="30"
                    max="3600"
                    value={formData.configuration.timeoutSeconds || 300}
                    onChange={(e) => updateConfiguration('timeoutSeconds', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-scaling</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust resources based on workload
                    </p>
                  </div>
                  <Switch
                    checked={formData.configuration.autoScaling || false}
                    onCheckedChange={(checked) => updateConfiguration('autoScaling', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  Advanced Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom Instructions</Label>
                  <Textarea
                    value={formData.configuration.customInstructions || ''}
                    onChange={(e) => updateConfiguration('customInstructions', e.target.value)}
                    rows={4}
                    placeholder="Enter custom instructions for the agent..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Endpoints</Label>
                  <Textarea
                    value={JSON.stringify(formData.configuration.apiEndpoints || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const endpoints = JSON.parse(e.target.value);
                        updateConfiguration('apiEndpoints', endpoints);
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    rows={6}
                    placeholder='{"endpoint1": "https://api.example.com"}'
                  />
                  <p className="text-xs text-muted-foreground">
                    JSON configuration for external API endpoints
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and debugging
                    </p>
                  </div>
                  <Switch
                    checked={formData.configuration.debugMode || false}
                    onCheckedChange={(checked) => updateConfiguration('debugMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};