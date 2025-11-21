import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BarChart3 } from 'lucide-react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { AIAgentCard } from '@/components/marketing/financeflo/ai-agents/AIAgentCard';
import { AgentPerformanceMonitor } from '@/components/marketing/financeflo/ai-agents/AgentPerformanceMonitor';
import { AgentCommandInterface } from '@/components/marketing/financeflo/ai-agents/AgentCommandInterface';
import { AgentLearningInterface } from '@/components/marketing/financeflo/ai-agents/AgentLearningInterface';
import { CreateAgentDialog } from '@/components/marketing/financeflo/ai-agents/CreateAgentDialog';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';
import { AIAgent } from '@/types/saas';
import { useToast } from '@/components/marketing/financeflo/ui/use-toast';

const AIAgentsPage = () => {
  const { currentTenant } = useTenant();
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (currentTenant?.id) {
      fetchAgents();
    }
  }, [currentTenant?.id]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('tenant_id', currentTenant?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents((data || []).map(agent => ({
        ...agent,
        configuration: agent.configuration as Record<string, any>
      })));
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeAgents = filteredAgents.filter(agent => agent.status === 'active');
  const inactiveAgents = filteredAgents.filter(agent => agent.status !== 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your autonomous AI agents
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : activeAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAgents.map((agent) => (
                <AIAgentCard
                  key={agent.id}
                  agent={agent}
                  onUpdate={fetchAgents}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No active agents found</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create your first agent
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance">
          <AgentPerformanceMonitor agents={activeAgents} />
        </TabsContent>

        <TabsContent value="commands">
          <AgentCommandInterface agents={activeAgents} />
        </TabsContent>

        <TabsContent value="learning">
          <AgentLearningInterface agents={activeAgents} />
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveAgents.map((agent) => (
              <AIAgentCard
                key={agent.id}
                agent={agent}
                onUpdate={fetchAgents}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CreateAgentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchAgents}
      />
    </div>
  );
};

export default AIAgentsPage;