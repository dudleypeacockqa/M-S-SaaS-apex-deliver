import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { Plus, Brain, Activity, Workflow, Settings } from 'lucide-react';
import { IntegrationCard, Integration } from '@/components/marketing/financeflo/integrations/IntegrationCard';
import { AIIntegrationBuilder } from '@/components/marketing/financeflo/integrations/AIIntegrationBuilder';
import { WorkflowDesigner } from '@/components/marketing/financeflo/integrations/WorkflowDesigner';
import { IntegrationMonitoring } from '@/components/marketing/financeflo/integrations/IntegrationMonitoring';

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Sage Intacct',
      description: 'Financial management and accounting',
      category: 'Finance',
      status: 'active',
      lastSync: '2 minutes ago',
      syncRate: 45,
      dataPoints: 12450,
      errorCount: 0,
      uptime: 99.9,
      logo: '/api/placeholder/32/32',
      aiGenerated: false
    },
    {
      id: '2',
      name: 'Salesforce CRM',
      description: 'Customer relationship management',
      category: 'Sales',
      status: 'active',
      lastSync: '5 minutes ago',
      syncRate: 32,
      dataPoints: 8920,
      errorCount: 2,
      uptime: 98.5,
      logo: '/api/placeholder/32/32',
      aiGenerated: true
    },
    {
      id: '3',
      name: 'QuickBooks',
      description: 'Accounting and bookkeeping',
      category: 'Finance',
      status: 'pending',
      lastSync: 'Setup required',
      syncRate: 0,
      dataPoints: 0,
      errorCount: 0,
      uptime: 0,
      logo: '/api/placeholder/32/32',
      aiGenerated: false
    },
    {
      id: '4',
      name: 'Shopify Store',
      description: 'E-commerce platform integration',
      category: 'E-commerce',
      status: 'active',
      lastSync: '1 minute ago',
      syncRate: 68,
      dataPoints: 15780,
      errorCount: 1,
      uptime: 99.2,
      logo: '/api/placeholder/32/32',
      aiGenerated: true
    }
  ];

  const handleConfigure = (id: string) => {
    console.log('Configure integration:', id);
  };

  const handleMonitor = (id: string) => {
    setActiveTab('monitoring');
  };

  const handleToggle = (id: string) => {
    console.log('Toggle integration:', id);
  };

  const handleCreateIntegration = () => {
    setActiveTab('builder');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Manage your system integrations with AI-powered configuration and monitoring.
          </p>
        </div>
        <Button onClick={handleCreateIntegration}>
          <Plus className="mr-2 h-4 w-4" />
          Create Integration
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Builder
          </TabsTrigger>
          <TabsTrigger value="designer" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflow Designer
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{integrations.filter(i => i.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{integrations.filter(i => i.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{integrations.filter(i => i.aiGenerated).length}</p>
                  <p className="text-sm text-muted-foreground">AI Generated</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {integrations.reduce((sum, i) => sum + i.dataPoints, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConfigure={handleConfigure}
                onMonitor={handleMonitor}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Integration Marketplace */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Marketplace</CardTitle>
              <CardDescription>
                Browse and connect with popular business applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  'Microsoft 365',
                  'Google Workspace',
                  'Slack',
                  'HubSpot',
                  'Zendesk',
                  'Stripe',
                  'PayPal',
                  'Mailchimp',
                  'Trello',
                  'Asana',
                  'Jira',
                  'GitHub'
                ].map((app) => (
                  <Card key={app} className="p-3 hover:border-primary/50 cursor-pointer transition-colors">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded mx-auto"></div>
                      <p className="text-xs font-medium">{app}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <AIIntegrationBuilder />
        </TabsContent>

        <TabsContent value="designer">
          <WorkflowDesigner />
        </TabsContent>

        <TabsContent value="monitoring">
          <IntegrationMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;