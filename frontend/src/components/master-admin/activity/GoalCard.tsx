/**
 * GoalCard Component
 *
 * Display and edit weekly goals for activity tracking
 */

import React, { useState } from 'react'
import { cn } from '@/styles/design-tokens'
import { Target, Edit2, Check, X } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { useCurrentGoal, useCreateGoal, useUpdateGoal } from '@/hooks/master-admin'
import type { AdminGoalCreate, AdminGoalUpdate } from '@/services/api/masterAdmin'

export const GoalCard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    target_discoveries: 0,
    target_emails: 0,
    target_videos: 0,
    target_calls: 0,
  })

  const { data: goal, isLoading } = useCurrentGoal()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()

  // Initialize form when editing starts
  const handleStartEdit = () => {
    if (goal) {
      setFormData({
        target_discoveries: goal.target_discoveries,
        target_emails: goal.target_emails,
        target_videos: goal.target_videos,
        target_calls: goal.target_calls,
      })
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      if (goal) {
        // Update existing goal
        await updateGoal.mutateAsync({
          goalId: goal.id,
          update: formData,
        })
      } else {
        // Create new goal
        const weekStart = getMonday(new Date()).toISOString().split('T')[0]
        const createData: AdminGoalCreate = {
          week_start: weekStart,
          ...formData,
        }
        await createGoal.mutateAsync(createData)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save goal:', error)
    }
  }

  const handleChange = (field: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse" data-testid="goal-card-loading">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Goals</h3>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label="Edit goals"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Goal Items */}
      <div className="space-y-3">
        {[
          { label: 'Discoveries', field: 'target_discoveries' as const, icon: '🔍' },
          { label: 'Emails', field: 'target_emails' as const, icon: '📧' },
          { label: 'Videos', field: 'target_videos' as const, icon: '🎥' },
          { label: 'Calls', field: 'target_calls' as const, icon: '📞' },
        ].map(({ label, field, icon }) => (
          <div key={field} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {icon} {label}
            </span>
            {isEditing ? (
              <input
                type="number"
                min="0"
                value={formData[field]}
                onChange={(e) => handleChange(field, parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-sm font-bold text-gray-900">
                {goal?.[field] ?? 0}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons (Edit Mode) */}
      {isEditing && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            btnSize="sm"
            onClick={handleSave}
            loading={createGoal.isPending || updateGoal.isPending}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            btnSize="sm"
            onClick={handleCancel}
            disabled={createGoal.isPending || updateGoal.isPending}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}

      {/* No Goal Message */}
      {!goal && !isEditing && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No goals set for this week</p>
          <Button variant="primary" btnSize="sm" onClick={handleStartEdit}>
            Set Weekly Goals
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to get Monday of current week
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}
