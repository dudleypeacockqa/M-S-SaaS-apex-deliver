import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { AlertsPanel } from '@/components/marketing/financeflo/monitoring/AlertsPanel';
import { PerformanceMetrics } from '@/components/marketing/financeflo/monitoring/PerformanceMetrics';
import { SystemHealth } from '@/components/marketing/financeflo/monitoring/SystemHealth';

export const MonitoringDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and alerting dashboard for IntelliFlow
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SystemHealth />
            <AlertsPanel />
          </div>
          <PerformanceMetrics />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMetrics />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealth />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;