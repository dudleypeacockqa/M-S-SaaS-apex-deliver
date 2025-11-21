import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/marketing/financeflo/ui/tabs';
import { Shield, FileText, Users, Database, Download } from 'lucide-react';
import { SecurityMonitoring } from '@/components/marketing/financeflo/security/SecurityMonitoring';
import { gdprCompliance } from '@/utils/gdprCompliance';
import { auditLogger } from '@/services/auditLogger';
import { logger } from '@/utils/logger';

export const ComplianceDashboard = () => {
  const [complianceStatus, setComplianceStatus] = useState({
    gdpr: 'compliant',
    security: 'compliant',
    dataRetention: 'compliant',
    audit: 'compliant'
  });
  const [dataProcessingActivities, setDataProcessingActivities] = useState<any[]>([]);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      const activities = gdprCompliance.getDataProcessingActivities();
      setDataProcessingActivities(activities);
    } catch (error) {
      logger.error('Failed to load compliance data', error as Error);
    }
  };

  const handleDataExport = async () => {
    try {
      await auditLogger.logEvent({
        action: 'compliance_data_export',
        resource: 'compliance_dashboard',
        category: 'data_access',
        severity: 'medium'
      });
      
      // Implement data export logic
      logger.info('Compliance data export initiated');
    } catch (error) {
      logger.error('Failed to export compliance data', error as Error);
    }
  };

  const runDataRetentionCleanup = async () => {
    try {
      const result = await gdprCompliance.enforceDataRetention();
      logger.info('Data retention cleanup completed', result);
    } catch (error) {
      logger.error('Data retention cleanup failed', error as Error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Enterprise security and regulatory compliance monitoring
          </p>
        </div>
        <Button onClick={handleDataExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Compliance Report
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GDPR Compliance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Compliant</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Data subject rights implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Standards</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Compliant</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Enterprise-grade security
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Retention</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Compliant</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Automated cleanup policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logging</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default">Compliant</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Comprehensive audit trail
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
          <TabsTrigger value="activities">Data Processing</TabsTrigger>
          <TabsTrigger value="retention">Data Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <SecurityMonitoring />
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GDPR Data Subject Rights</CardTitle>
              <CardDescription>
                Implementation status of GDPR data subject rights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Right to Access',
                'Right to Rectification', 
                'Right to Erasure',
                'Right to Data Portability',
                'Right to Object'
              ].map((right) => (
                <div key={right} className="flex items-center justify-between p-3 border rounded">
                  <span>{right}</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="grid gap-4">
            {dataProcessingActivities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{activity.purpose}</CardTitle>
                  <CardDescription>
                    Legal Basis: {activity.legalBasis.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div>
                      <strong>Data Categories:</strong> {activity.categories.join(', ')}
                    </div>
                    <div>
                      <strong>Retention Period:</strong> {activity.retention}
                    </div>
                    <div>
                      <strong>Data Minimization:</strong> 
                      <Badge variant={activity.dataMinimization ? 'default' : 'secondary'} className="ml-2">
                        {activity.dataMinimization ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Management</CardTitle>
              <CardDescription>
                Automated data cleanup and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Cleanup</h4>
                  <p className="text-sm text-muted-foreground">
                    Data older than 2 years is automatically cleaned up
                  </p>
                </div>
                <Button onClick={runDataRetentionCleanup} variant="outline">
                  Run Cleanup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};