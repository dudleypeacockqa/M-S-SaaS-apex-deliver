/**
 * Dashboard Page - Tenant Dashboard
 * Main dashboard for M&A professionals with comprehensive overview widgets
 */

import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Handshake,
  Layers,
  LucideIcon,
  Plus,
  Search as SearchIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UploadCloud,
  XCircle,
} from '@/lib/icons'
import { Card, CardHeader, CardBody, Badge, Button, Spinner } from '../components/ui'
import { GridSystem } from '../components/layout'
import {
  listDeals,
  type DealStage,
  formatCurrency,
  getStageDisplayName,
  type Deal,
  type PaginatedDeals,
} from '../services/api/deals'
import { getUpcomingTasks, type UpcomingTasks } from '../services/api/dashboard'

const activePipelineStages: DealStage[] = ['sourcing', 'evaluation', 'due_diligence', 'negotiation', 'closing']

interface StageVisual {
  icon: LucideIcon
  iconBg: string
  indicator: string
  gradient: string
}

const stageVisuals: Record<DealStage, StageVisual> = {
  sourcing: {
    icon: Target,
    iconBg: 'bg-sky-50 text-sky-600',
    indicator: 'bg-sky-500',
    gradient: 'from-sky-500 via-sky-400 to-sky-300',
  },
  evaluation: {
    icon: SearchIcon,
    iconBg: 'bg-indigo-50 text-indigo-600',
    indicator: 'bg-indigo-500',
    gradient: 'from-indigo-500 via-indigo-400 to-indigo-300',
  },
  due_diligence: {
    icon: ShieldCheck,
    iconBg: 'bg-amber-50 text-amber-600',
    indicator: 'bg-amber-500',
    gradient: 'from-amber-500 via-amber-400 to-amber-300',
  },
  negotiation: {
    icon: Handshake,
    iconBg: 'bg-orange-50 text-orange-600',
    indicator: 'bg-orange-500',
    gradient: 'from-orange-500 via-orange-400 to-orange-300',
  },
  closing: {
    icon: Trophy,
    iconBg: 'bg-emerald-50 text-emerald-600',
    indicator: 'bg-emerald-500',
    gradient: 'from-emerald-500 via-emerald-400 to-emerald-300',
  },
  won: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50 text-emerald-600',
    indicator: 'bg-emerald-500',
    gradient: 'from-emerald-500 via-emerald-400 to-emerald-300',
  },
  lost: {
    icon: XCircle,
    iconBg: 'bg-rose-50 text-rose-600',
    indicator: 'bg-rose-500',
    gradient: 'from-rose-500 via-rose-400 to-rose-300',
  },
}

const toRelativeTimeLabel = (input?: string | Date | null): string => {
  if (!input) return '—'
  const value = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(value.getTime())) return '—'
  const diffMs = Date.now() - value.getTime()
  if (diffMs < 0) return 'just now'
  const diffMinutes = Math.floor(diffMs / 60000)
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return 
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return 
  const diffDays = Math.floor(diffHours / 24)
  return 
}

const toCompactDurationLabel = (hours?: number | null): string => {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return '—'
  if (hours < 1) return 
  if (hours < 24) return 
  return 
}

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
  dealsData?: PaginatedDeals
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
  dealsData?: PaginatedDeals
  dealsLoading: boolean
}

interface StageSummary {
  stage: DealStage
  label: string
  count: number
  value: string
  share: number
  avgAgeLabel: string
  lastTouchLabel: string
}

const PipelineSummaryWidget: React.FC<PipelineWidgetProps> = ({ dealsData, dealsLoading }) => {
  const isLoading = dealsLoading
  const error = null  // Error handled at parent level

  const totalDeals = dealsData?.items.length ?? 0

  const pipelineData = React.useMemo<StageSummary[]>(() => {
    if (!dealsData?.items?.length) return []

    const now = Date.now()

    return activePipelineStages
      .map((stage) => {
        const stageDeals = dealsData.items.filter((deal) => deal.stage === stage)
        if (stageDeals.length === 0) {
          return null
        }

        const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)
        const share = totalDeals > 0 ? stageDeals.length / totalDeals : 0
        const mostRecentUpdate = stageDeals.reduce((latest, deal) => {
          const updated = new Date(deal.updated_at).getTime()
          return updated > latest ? updated : latest
        }, 0)
        const avgAgeHours =
          stageDeals.reduce((sum, deal) => {
            const created = new Date(deal.created_at).getTime()
            return sum + (now - created) / (1000 * 60 * 60)
          }, 0) / stageDeals.length

        return {
          stage,
          label: getStageDisplayName(stage),
          count: stageDeals.length,
          value: formatCurrency(totalValue, stageDeals[0]?.currency || 'GBP'),
          share,
          avgAgeLabel: toCompactDurationLabel(avgAgeHours),
          lastTouchLabel: mostRecentUpdate ? toRelativeTimeLabel(new Date(mostRecentUpdate)) : '—',
        }
      })
      .filter(Boolean) as StageSummary[]
  }, [dealsData, totalDeals])

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Deal Pipeline</h2>
            <p className="text-sm text-gray-500">
              Coverage across {pipelineData.length || 0}/{activePipelineStages.length} stages
            </p>
          </div>
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
          <div className="py-8 px-6">
            {/* Welcome Guide for First-Time Users */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to M&A Intelligence Platform! ??</h3>
              <p className="text-gray-600">Let's get you started with your first deal to unlock all features.</p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-600 font-semibold mb-2">?? Valuation Suite</div>
                <p className="text-sm text-gray-700">DCF, Comparables, Precedent Transactions & Sensitivity Analysis</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-purple-600 font-semibold mb-2">?? Financial Intelligence</div>
                <p className="text-sm text-gray-700">47+ financial ratios with AI-generated insights (GPT-4)</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-600 font-semibold mb-2">?? Document Room</div>
                <p className="text-sm text-gray-700">Secure file storage with permissions & folder organization</p>
              </div>
            </div>

            {/* Quick Start Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">Quick Start (2 minutes):</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li><strong>Create your first deal</strong> - Click the button below to get started</li>
                <li><strong>Access FP&A tools</strong> - Open your deal and navigate to "Valuation" or "Financial" tabs</li>
                <li><strong>Upload documents</strong> - Use the "Documents" tab to securely store deal files</li>
              </ol>
              <p className="text-xs text-gray-600 mt-3 italic">
                ?? Pro Tip: All advanced features (Valuation Suite, Financial Dashboard) are accessed through deals!
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link to="/deals/new">
                <Button variant="primary" btnSize="md" className="px-8 py-3">
                  Create Your First Deal
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                Need help? Check the{' '}
                <a href="/docs/USER-QUICK-START.md" target="_blank" className="text-blue-600 hover:underline">
                  Quick Start Guide
                </a>
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && pipelineData.length > 0 && (
          <div className="space-y-4">
            {pipelineData.map((stage) => {
              const theme = stageVisuals[stage.stage] ?? stageVisuals.sourcing
              const Icon = theme.icon
              const progressWidth = stage.share > 0 ? Math.max(stage.share * 100, 6) : 6

              return (
                <div
                  key={stage.stage}
                  className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{stage.label}</p>
                        <p className="text-xs text-gray-500">{Math.round(stage.share * 100) || 0}% of pipeline</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{stage.value}</p>
                      <p className="text-xs text-gray-500">
                        {stage.count} {stage.count === 1 ? 'deal' : 'deals'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={}
                        style={{ width:  }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>Avg age {stage.avgAgeLabel}</span>
                      <span>Last touch {stage.lastTouchLabel}</span>
                    </div>
                  </div>
                </div>
              )
            })}
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
    {
      label: 'Capture new deal',
      description: 'Log thesis, owners, and starting valuation',
      href: '/deals/new',
      icon: Plus,
      accent: 'bg-sky-50 text-sky-600',
      shortcut: 'N',
    },
    {
      label: 'Upload diligence docs',
      description: 'Drop CIMs, NDAs, and models into the secure workspace',
      href: '/documents',
      icon: UploadCloud,
      accent: 'bg-amber-50 text-amber-600',
      shortcut: 'Shift + U',
    },
    {
      label: 'Run valuation suite',
      description: 'Kick off DCF, comps, and scenario modeling',
      href: '/deals',
      icon: TrendingUp,
      accent: 'bg-emerald-50 text-emerald-600',
      shortcut: 'V',
    },
    {
      label: 'Review task board',
      description: 'Unblock execution owners across functions',
      href: '/tasks',
      icon: CheckCircle2,
      accent: 'bg-indigo-50 text-indigo-600',
      shortcut: 'T',
    },
  ]

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Workflow Shortcuts</h2>
        <p className="text-sm text-gray-500">Launch high-leverage flows with one click</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                to={action.href}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                <div className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className={}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                      {action.shortcut}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * Activity Feed Widget
 */
interface ActivityFeedProps {
  dealsData?: PaginatedDeals
  dealsLoading: boolean
}

const ActivityFeedWidget: React.FC<ActivityFeedProps> = ({ dealsData, dealsLoading }) => {
  const activities = React.useMemo(() => {
    if (!dealsData?.items?.length) return []

    const sortedDeals = [...dealsData.items]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)

    return sortedDeals.map((deal) => {
      const metaParts: string[] = []
      if (deal.deal_size) {
        metaParts.push(formatCurrency(deal.deal_size, deal.currency))
      } else {
        metaParts.push('Value pending')
      }
      if (deal.target_company) {
        metaParts.push(deal.target_company)
      }

      return {
        id: deal.id,
        message: ,
        time: toRelativeTimeLabel(deal.updated_at),
        meta: metaParts.join(' • '),
        stage: deal.stage,
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
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-3 w-px bg-gray-200" aria-hidden="true" />
            {activities.map((activity) => {
              const theme = stageVisuals[activity.stage] ?? stageVisuals.sourcing
              const Icon = theme.icon

              return (
                <div key={activity.id} className="relative pb-6 last:pb-0">
                  <div className={}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{activity.meta}</p>
                </div>
              )
            })}
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'upcoming-tasks'],
    queryFn: () => getUpcomingTasks(),
  })

  const tasks = data?.items ?? []
  const badgeForPriority = (priority: string): 'danger' | 'warning' | 'neutral' => {
    if (priority === 'high') return 'danger'
    if (priority === 'medium') return 'warning'
    return 'neutral'
  }
  const accentForPriority: Record<string, string> = {
    high: 'bg-rose-50 text-rose-600',
    medium: 'bg-amber-50 text-amber-600',
    low: 'bg-emerald-50 text-emerald-600',
  }

  return (
    <Card variant="elevated" padding="lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
      </CardHeader>
      <CardBody>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-600">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p>Unable to load tasks right now.</p>
            <p className="text-sm text-gray-600 mt-2">Please retry in a few minutes.</p>
          </div>
        )}

        {!isLoading && !isError && tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CalendarClock className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tasks due this week</p>
            <p className="text-sm">Automation rules will surface new tasks as your deals progress.</p>
          </div>
        )}

        {!isLoading && !isError && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => {
              const dueDateLabel = task.due_date
                ? new Date(task.due_date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'No due date'
              const accentClass = accentForPriority[task.priority] || 'bg-slate-100 text-slate-600'
              const statusLabel = task.status.replace('_', ' ')
              return (
                <div
                  key={task.id}
                  className="rounded-2xl border border-gray-100 p-4 transition hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={}>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>Due {dueDateLabel}</span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 capitalize">
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                    <Badge variant={badgeForPriority(task.priority)} className="uppercase tracking-wide">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

/**
 * Financial Insights Widget
 */
interface FinancialInsightsProps {
  dealsData?: PaginatedDeals
  dealsLoading: boolean
}

const FinancialInsightsWidget: React.FC<FinancialInsightsProps> = ({ dealsData, dealsLoading }) => {
  const computed = React.useMemo(() => {
    const deals = dealsData?.items ?? []
    const totalValue = deals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)
    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0
    const stageCoverage = activePipelineStages.filter((stage) =>
      deals.some((deal) => deal.stage === stage)
    ).length

    return {
      totalValue: formatCurrency(totalValue, 'GBP'),
      avgDeal: formatCurrency(avgDealSize, 'GBP'),
      activeDeals: deals.length.toString(),
      stageCoverage: ,
    }
  }, [dealsData])

  const insightCards = [
    {
      id: 'totalValue',
      label: 'Pipeline value',
      description: 'Active across all deals',
      icon: TrendingUp,
      accent: 'bg-sky-50 text-sky-600',
      value: computed.totalValue,
    },
    {
      id: 'avgDeal',
      label: 'Avg deal size',
      description: 'Per live opportunity',
      icon: Briefcase,
      accent: 'bg-indigo-50 text-indigo-600',
      value: computed.avgDeal,
    },
    {
      id: 'activeDeals',
      label: 'Active deals',
      description: 'Owned by your org',
      icon: Layers,
      accent: 'bg-emerald-50 text-emerald-600',
      value: computed.activeDeals,
    },
    {
      id: 'stageCoverage',
      label: 'Stage coverage',
      description: 'Out of 5 key stages',
      icon: Sparkles,
      accent: 'bg-amber-50 text-amber-600',
      value: computed.stageCoverage,
    },
  ] as {
    id: string
    label: string
    description: string
    icon: LucideIcon
    accent: string
    value: string
  }[]

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
            {insightCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  className="rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-gray-500">{card.description}</span>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-gray-900">{card.value}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{card.label}</p>
                </div>
              )
            })}
          </GridSystem>
        )}
      </CardBody>
    </Card>
  )
}
