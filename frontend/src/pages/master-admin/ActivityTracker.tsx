/**
 * Activity Tracker Page
 *
 * Complete activity tracking interface with goals, logging, scores, and focus sessions
 */

import React from 'react'
import { ArrowLeft } from '@/lib/icons'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ScoreDisplay, StreakCounter } from '@/components/master-admin/shared'
import {
  GoalCard,
  ActivityForm,
  ActivityList,
  FocusTimer,
  NudgePanel,
} from '@/components/master-admin/activity'
import { useTodayScore, useCurrentStreak } from '@/hooks/master-admin'

export const ActivityTracker: React.FC = () => {
  const navigate = useNavigate()

  const { data: scoreData } = useTodayScore()
  const { data: streakData } = useCurrentStreak()

  const score = scoreData?.score ?? 0
  const streak = streakData?.streak_days ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              btnSize="sm"
              onClick={() => navigate('/master-admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Tracker</h1>
          <p className="text-gray-600 mt-1">
            Log your daily activities and track your productivity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Goals, Score, Streak */}
          <div className="lg:col-span-3 space-y-6">
            {/* Goals */}
            <GoalCard />

            {/* Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex justify-center">
              <ScoreDisplay score={score} size="md" showLabel />
            </div>

            {/* Streak */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex justify-center">
              <StreakCounter streakDays={streak} size="md" />
            </div>
          </div>

          {/* Center: Activity Form & List */}
          <div className="lg:col-span-6 space-y-6">
            {/* Activity Form */}
            <ActivityForm />

            {/* Activity List */}
            <ActivityList />
          </div>

          {/* Right Sidebar: Focus Timer & Nudges */}
          <div className="lg:col-span-3 space-y-6">
            {/* Focus Timer */}
            <FocusTimer />

            {/* Nudges */}
            <NudgePanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityTracker
