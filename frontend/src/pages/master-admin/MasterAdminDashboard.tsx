/**
 * Master Admin Dashboard Page
 *
 * Overview dashboard with quick stats and actions
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  Target,
  Users,
  Briefcase,
  Bell,
  Plus,
  Clock,
} from 'lucide-react'
import { StatCard, StreakCounter, ScoreDisplay, QuickActionButton } from '@/components/master-admin/shared'
import { useDashboardStats, useTodayScore, useCurrentStreak } from '@/hooks/master-admin'

export const MasterAdminDashboard: React.FC = () => {
  const navigate = useNavigate()

  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: scoreData } = useTodayScore()
  const { data: streakData } = useCurrentStreak()

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const score = scoreData?.score ?? stats?.score ?? 0
  const streak = streakData?.streak_days ?? stats?.streak ?? 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Master Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Your personal productivity command center
        </p>
      </div>

      {/* Hero Section: Score & Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 flex items-center justify-center border border-blue-200">
          <ScoreDisplay score={score} size="lg" showLabel />
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 flex items-center justify-center border border-orange-200">
          <StreakCounter streakDays={streak} size="lg" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Activities Today"
          value={stats?.activities_today ?? 0}
          subtitle="Total logged today"
          icon={Activity}
          onClick={() => navigate('/master-admin/activity')}
        />
        <StatCard
          title="Active Prospects"
          value={stats?.prospects_active ?? 0}
          subtitle="In your pipeline"
          icon={Users}
          onClick={() => navigate('/master-admin/prospects')}
        />
        <StatCard
          title="Active Deals"
          value={stats?.deals_active ?? 0}
          subtitle="Currently open"
          icon={Briefcase}
          onClick={() => navigate('/master-admin/deals')}
        />
        <StatCard
          title="Unread Nudges"
          value={stats?.unread_nudges ?? 0}
          subtitle="Pending actions"
          icon={Bell}
          onClick={() => navigate('/master-admin/activity')}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            label="Log Activity"
            icon={Plus}
            variant="primary"
            onClick={() => navigate('/master-admin/activity')}
          />
          <QuickActionButton
            label="Start Focus"
            icon={Clock}
            variant="success"
            onClick={() => navigate('/master-admin/activity')}
          />
          <QuickActionButton
            label="Add Prospect"
            icon={Users}
            variant="secondary"
            onClick={() => navigate('/master-admin/prospects')}
          />
          <QuickActionButton
            label="Set Goals"
            icon={Target}
            variant="warning"
            onClick={() => navigate('/master-admin/activity')}
          />
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Last activity logged {stats?.activities_today ?? 0 > 0 ? 'today' : 'yesterday'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Current streak: {streak} days
              </span>
            </div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Score for today: {score}/100
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs improvement'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MasterAdminDashboard
