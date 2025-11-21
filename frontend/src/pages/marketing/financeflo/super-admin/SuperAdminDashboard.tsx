import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Users, 
  Building2, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Server,
  Shield,
  UserCheck,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const systemMetrics = {
    totalTenants: 1247,
    activeTenants: 1189,
    totalUsers: 18453,
    activeUsers: 12967,
    monthlyRevenue: 425000,
    systemHealth: 99.8,
    openTickets: 23,
    criticalIssues: 2
  };

  const recentActivity = [
    { type: 'tenant_created', tenant: 'Acme Corp', time: '2 minutes ago', status: 'success' },
    { type: 'billing_issue', tenant: 'TechFlow Inc', time: '5 minutes ago', status: 'warning' },
    { type: 'system_alert', message: 'High CPU usage on node-3', time: '8 minutes ago', status: 'error' },
    { type: 'user_impersonation', admin: 'John Doe', tenant: 'GlobalTech', time: '12 minutes ago', status: 'info' }
  ];

  const quickActions = [
    { title: 'Manage Tenants', icon: Building2, action: () => navigate('/super-admin/tenants'), color: 'bg-blue-500' },
    { title: 'System Health', icon: Activity, action: () => navigate('/super-admin/health'), color: 'bg-green-500' },
    { title: 'Billing Management', icon: DollarSign, action: () => navigate('/super-admin/billing'), color: 'bg-yellow-500' },
    { title: 'User Impersonation', icon: UserCheck, action: () => navigate('/super-admin/impersonate'), color: 'bg-purple-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management controls</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Shield className="w-3 h-3 mr-1" />
          Super Admin Access
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalTenants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Excellent</span> uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex flex-col items-center gap-2 hover:bg-muted/50"
                onClick={action.action}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.type === 'tenant_created' && `New tenant created: ${activity.tenant}`}
                      {activity.type === 'billing_issue' && `Billing issue for ${activity.tenant}`}
                      {activity.type === 'system_alert' && activity.message}
                      {activity.type === 'user_impersonation' && `${activity.admin} impersonated user in ${activity.tenant}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              System Alerts
            </CardTitle>
            <CardDescription>Critical issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Database Connection Pool Exhausted
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">Node: db-primary-1</p>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    High Memory Usage
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Node: worker-3 (87%)</p>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Scheduled Maintenance
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Tomorrow 2:00 AM UTC</p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;