import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Activity,
  Target,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

const statsData = [
  {
    title: 'Active Integrations',
    value: '12',
    change: '+2 this month',
    icon: Zap,
    trend: 'up',
    color: 'text-blue-600'
  },
  {
    title: 'Data Processed',
    value: '2.4M',
    change: '+15% from last month',
    icon: BarChart3,
    trend: 'up',
    color: 'text-green-600'
  },
  {
    title: 'Team Members',
    value: '8',
    change: '+1 this week',
    icon: Users,
    trend: 'up',
    color: 'text-purple-600'
  },
  {
    title: 'Success Rate',
    value: '98.2%',
    change: '+0.5% improvement',
    icon: Target,
    trend: 'up',
    color: 'text-emerald-600'
  }
];

const recentActivities = [
  {
    id: 1,
    title: 'New integration activated',
    description: 'Sage Intacct integration is now live',
    time: '2 hours ago',
    type: 'success'
  },
  {
    id: 2,
    title: 'Data sync completed',
    description: 'Synced 1,247 records from CRM',
    time: '4 hours ago',
    type: 'info'
  },
  {
    id: 3,
    title: 'Team member added',
    description: 'Sarah Johnson joined the team',
    time: '1 day ago',
    type: 'success'
  },
  {
    id: 4,
    title: 'Alert resolved',
    description: 'API rate limit issue fixed',
    time: '2 days ago',
    type: 'warning'
  }
];

const upcomingTasks = [
  {
    title: 'Quarterly review preparation',
    deadline: 'Due in 3 days',
    priority: 'high',
    progress: 65
  },
  {
    title: 'Integration documentation update',
    deadline: 'Due in 1 week',
    priority: 'medium',
    progress: 30
  },
  {
    title: 'Team training session',
    deadline: 'Due in 2 weeks',
    priority: 'low',
    progress: 10
  }
];

export const DashboardOverview = () => {
  const { currentTenant } = useTenant();
  const { userProfile } = useAuth();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    return userProfile?.first_name || 'there';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getTimeGreeting()}, {getUserName()}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with {currentTenant?.name || 'your organization'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates and events from your integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Activity className="h-3 w-3" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Set Goals
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>
                Important deadlines and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{task.title}</p>
                    <Badge variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.deadline}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};