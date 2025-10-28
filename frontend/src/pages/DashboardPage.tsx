/**
 * Dashboard Page - Tenant Dashboard
 * Main dashboard for M&A professionals with comprehensive overview widgets
 */

import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardBody, Badge, Button, Spinner } from '../components/ui'
import { GridSystem } from '../components/layout'
import { listDeals, type DealStage, formatCurrency, getStageDisplayName } from '../services/api/deals'

export const DashboardPage: React.FC = () => {
  const { user } = useUser()

  // Fetch deals data once for all widgets
  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals', 'all'],
    queryFn: () => listDeals({ include_archived: false }),
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={user?.firstName || 'User'} dealsData={dealsData} dealsLoading={dealsLoading} />

        {/* Main Dashboard Grid */}
        <GridSystem cols={3} gap="lg" responsive>
          <div className="col-span-3 lg:col-span-2">
            <PipelineSummaryWidget dealsData={dealsData} dealsLoading={dealsLoading} />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <QuickActionsWidget />
          </div>
        </GridSystem>

        <GridSystem cols={2} gap="lg" responsive>
          <ActivityFeedWidget dealsData={dealsData} dealsLoading={dealsLoading} />
          <UpcomingTasksWidget />
        </GridSystem>

        <FinancialInsightsWidget dealsData={dealsData} dealsLoading={dealsLoading} />
      </div>
    </div>
  )
}

/**
 * Welcome Section Widget
 */
interface WelcomeSectionProps {
  userName: string
  dealsData?: { items: any[]; total: number }
  dealsLoading: boolean
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, dealsData, dealsLoading }) => {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Calculate real metrics from deals data
  const activeDeals = dealsData?.items.length || 0
  const totalValue = dealsData?.items.reduce((sum, deal) => sum + (deal.deal_size || 0), 0) || 0
  const avgDealSize = activeDeals > 0 ? totalValue / activeDeals : 0

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
        {!dealsLoading && (
          <div className="hidden md:flex items-center gap-6">
            <QuickStat label="Active Deals" value={activeDeals.toString()} />
            <QuickStat label="Total Pipeline" value={formatCurrency(totalValue, 'GBP')} />
            <QuickStat label="Avg. Deal Size" value={formatCurrency(avgDealSize, 'GBP')} />
          </div>
        )}
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
interface PipelineWidgetProps {
  dealsData?: { items: any[]; total: number }
  dealsLoading: boolean
}

const PipelineSummaryWidget: React.FC<PipelineWidgetProps> = ({ dealsData, dealsLoading }) => {
  const isLoading = dealsLoading
  const error = null  // Error handled at parent level

  // Aggregate deals by stage
  const pipelineData = React.useMemo(() => {
    if (!dealsData?.items) return []

    const stageColors: Record<DealStage, string> = {
      sourcing: 'bg-blue-500',
      evaluation: 'bg-purple-500',
      due_diligence: 'bg-yellow-500',
      negotiation: 'bg-orange-500',
      closing: 'bg-green-500',
      won: 'bg-emerald-600',
      lost: 'bg-red-500',
    }

    const stages: DealStage[] = ['sourcing', 'evaluation', 'due_diligence', 'negotiation', 'closing']

    return stages.map(stage => {
      const stageDeals = dealsData.items.filter(deal => deal.stage === stage)
      const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)

      return {
        stage: getStageDisplayName(stage),
        count: stageDeals.length,
        value: formatCurrency(totalValue, stageDeals[0]?.currency || 'GBP'),
        color: stageColors[stage],
      }
    }).filter(s => s.count > 0) // Only show stages with deals
  }, [dealsData])

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
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load pipeline data</p>
            <p className="text-sm text-gray-600 mt-2">Unknown error</p>
          </div>
        )}

        {!isLoading && !error && pipelineData.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p className="text-lg font-medium mb-2">No deals yet</p>
            <p className="text-sm mb-4">Create your first deal to get started</p>
            <Link to="/deals/new">
              <Button variant="primary" btnSize="sm">Create Deal</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && pipelineData.length > 0 && (
          <div className="space-y-4">
            {pipelineData.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-4">
                <div className={`w-2 h-12 ${stage.color} rounded-full`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{stage.stage}</span>
                    <Badge variant="neutral">{stage.count} {stage.count === 1 ? 'deal' : 'deals'}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">{stage.value} total value</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
interface ActivityFeedProps {
  dealsData?: { items: any[]; total: number }
  dealsLoading: boolean
}

const ActivityFeedWidget: React.FC<ActivityFeedProps> = ({ dealsData, dealsLoading }) => {
  // Generate activities from deals data
  const activities = React.useMemo(() => {
    if (!dealsData?.items.length) return []

    // Sort deals by updated_at (most recent first)
    const sortedDeals = [...dealsData.items]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5) // Get 5 most recent

    return sortedDeals.map((deal) => {
      const updatedAt = new Date(deal.updated_at)
      const now = new Date()
      const diffMs = now.getTime() - updatedAt.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffHours < 1) timeAgo = 'Just now'
      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      else timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

      return {
        id: deal.id,
        message: `Deal "${deal.name}" updated to ${getStageDisplayName(deal.stage)}`,
        time: timeAgo,
        icon: '🎯',
      }
    })
  }, [dealsData])

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        {dealsLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {!dealsLoading && activities.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>No recent activity yet</p>
            <p className="text-sm mt-2">Create your first deal to see activity</p>
          </div>
        )}

        {!dealsLoading && activities.length > 0 && (
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
        )}
      </CardBody>
    </Card>
  )
}

/**
 * Upcoming Tasks Widget
 * TODO: Replace with real task API when backend endpoint is ready
 */
const UpcomingTasksWidget: React.FC = () => {
  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
      </CardHeader>
      <CardBody>
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg font-medium mb-2">Task Management Coming Soon</p>
          <p className="text-sm">Automated task workflows will be available in the next update</p>
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Financial Insights Widget
 */
interface FinancialInsightsProps {
  dealsData?: { items: any[]; total: number }
  dealsLoading: boolean
}

const FinancialInsightsWidget: React.FC<FinancialInsightsProps> = ({ dealsData, dealsLoading }) => {
  // Calculate real metrics from deals data
  const insights = React.useMemo(() => {
    if (!dealsData?.items.length) {
      return [
        { metric: 'Total Pipeline Value', value: formatCurrency(0, 'GBP') },
        { metric: 'Avg. Deal Size', value: formatCurrency(0, 'GBP') },
        { metric: 'Active Deals', value: '0' },
        { metric: 'Stages Covered', value: '0' },
      ]
    }

    const deals = dealsData.items
    const totalValue = deals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0
    const uniqueStages = new Set(deals.map(d => d.stage)).size

    return [
      { metric: 'Total Pipeline Value', value: formatCurrency(totalValue, 'GBP') },
      { metric: 'Avg. Deal Size', value: formatCurrency(avgDealSize, 'GBP') },
      { metric: 'Active Deals', value: deals.length.toString() },
      { metric: 'Stages Covered', value: `${uniqueStages}/5` },
    ]
  }, [dealsData])

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Financial Insights</h2>
      </CardHeader>
      <CardBody>
        {dealsLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {!dealsLoading && (
          <GridSystem cols={4} gap="md" responsive>
            {insights.map((insight) => (
              <div key={insight.metric} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</div>
                <div className="text-sm text-gray-600">{insight.metric}</div>
              </div>
            ))}
          </GridSystem>
        )}
      </CardBody>
    </Card>
  )
}
