/**
 * Dashboard Page - Tenant Dashboard
 * Main dashboard for M&A professionals with comprehensive overview widgets
 */

import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, Badge, Button } from '../components/ui'
import { GridSystem } from '../components/layout'

export const DashboardPage: React.FC = () => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={user?.firstName || 'User'} />

        {/* Main Dashboard Grid */}
        <GridSystem cols={3} gap="lg" responsive>
          <div className="col-span-3 lg:col-span-2">
            <PipelineSummaryWidget />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <QuickActionsWidget />
          </div>
        </GridSystem>

        <GridSystem cols={2} gap="lg" responsive>
          <ActivityFeedWidget />
          <UpcomingTasksWidget />
        </GridSystem>

        <FinancialInsightsWidget />
      </div>
    </div>
  )
}

/**
 * Welcome Section Widget
 */
const WelcomeSection: React.FC<{ userName: string }> = ({ userName }) => {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {userName}
          </h1>
          <p className="text-blue-100 text-lg">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <QuickStat label="Active Deals" value="12" />
          <QuickStat label="This Month" value="£2.4M" />
          <QuickStat label="Avg. Deal Size" value="£200K" />
        </div>
      </div>
    </div>
  )
}

const QuickStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-blue-100">{label}</div>
  </div>
)

/**
 * Pipeline Summary Widget
 */
const PipelineSummaryWidget: React.FC = () => {
  // Mock data - will be replaced with real API call
  const pipelineData = [
    { stage: 'Sourcing', count: 8, value: '£1.2M', color: 'bg-blue-500' },
    { stage: 'Evaluation', count: 5, value: '£800K', color: 'bg-purple-500' },
    { stage: 'Due Diligence', count: 3, value: '£600K', color: 'bg-yellow-500' },
    { stage: 'Negotiation', count: 2, value: '£400K', color: 'bg-orange-500' },
    { stage: 'Closing', count: 1, value: '£200K', color: 'bg-green-500' },
  ]

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Deal Pipeline</h2>
          <Link to="/deals">
            <Button variant="outline" btnSize="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {pipelineData.map((stage) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className={`w-2 h-12 ${stage.color} rounded-full`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                  <Badge variant="neutral">{stage.count} deals</Badge>
                </div>
                <div className="text-sm text-gray-600">{stage.value} total value</div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Quick Actions Widget
 */
const QuickActionsWidget: React.FC = () => {
  const actions = [
    { label: 'New Deal', href: '/deals/new', icon: '📋', variant: 'primary' as const },
    { label: 'Upload Document', href: '/deals', icon: '📄', variant: 'secondary' as const },
    { label: 'Run Valuation', href: '/deals', icon: '💰', variant: 'outline' as const },
    { label: 'View Reports', href: '/deals', icon: '📊', variant: 'outline' as const },
  ]

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.label} to={action.href} className="block">
              <Button variant={action.variant} btnSize="md" fullWidth className="justify-start gap-3">
                <span className="text-xl">{action.icon}</span>
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Activity Feed Widget
 */
const ActivityFeedWidget: React.FC = () => {
  // Mock data - will be replaced with real API call
  const activities = [
    { id: 1, type: 'deal_created', message: 'New deal "Acme Corp Acquisition" created', time: '2 hours ago', icon: '🎯' },
    { id: 2, type: 'document_uploaded', message: 'Financial statements uploaded to DataRoom', time: '5 hours ago', icon: '📄' },
    { id: 3, type: 'valuation_completed', message: 'DCF valuation completed for Target Co.', time: '1 day ago', icon: '💰' },
    { id: 4, type: 'task_completed', message: 'Due diligence checklist completed', time: '2 days ago', icon: '✅' },
    { id: 5, type: 'deal_updated', message: 'Deal stage updated to "Negotiation"', time: '3 days ago', icon: '🔄' },
  ]

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Upcoming Tasks Widget
 */
const UpcomingTasksWidget: React.FC = () => {
  // Mock data - will be replaced with real API call
  const tasks = [
    { id: 1, title: 'Review financial statements', deadline: 'Today', priority: 'high' },
    { id: 2, title: 'Schedule management meeting', deadline: 'Tomorrow', priority: 'medium' },
    { id: 3, title: 'Update valuation model', deadline: 'Dec 1', priority: 'medium' },
    { id: 4, title: 'Prepare investor deck', deadline: 'Dec 5', priority: 'low' },
    { id: 5, title: 'Finalize term sheet', deadline: 'Dec 10', priority: 'high' },
  ]

  const priorityBadge = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  }

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500 mt-1">Due: {task.deadline}</p>
              </div>
              <Badge variant={priorityBadge[task.priority as keyof typeof priorityBadge]}>
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Financial Insights Widget
 */
const FinancialInsightsWidget: React.FC = () => {
  // Mock data - will be replaced with real API call
  const insights = [
    { metric: 'Total Pipeline Value', value: '£3.2M', change: '+12%', trend: 'up' },
    { metric: 'Avg. Deal Size', value: '£267K', change: '+8%', trend: 'up' },
    { metric: 'Close Rate', value: '32%', change: '-2%', trend: 'down' },
    { metric: 'Avg. Deal Cycle', value: '45 days', change: '+5%', trend: 'down' },
  ]

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Financial Insights</h2>
      </CardHeader>
      <CardBody>
        <GridSystem cols={4} gap="md" responsive>
          {insights.map((insight) => (
            <div key={insight.metric} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
              <div className="text-sm text-gray-600 mb-2">{insight.metric}</div>
              <div className={`text-xs font-medium ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {insight.trend === 'up' ? '↑' : '↓'} {insight.change}
              </div>
            </div>
          ))}
        </GridSystem>
      </CardBody>
    </Card>
  )
}
