/**
 * NudgePanel Component
 *
 * Display unread nudges/notifications
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { Bell, X, ExternalLink } from '@/lib/icons'
import { useUnreadNudges, useMarkNudgeAsRead } from '@/hooks/master-admin'
import { NudgePriority } from '@/services/api/masterAdmin'

export const NudgePanel: React.FC = () => {
  const { data, isLoading } = useUnreadNudges()
  const markAsRead = useMarkNudgeAsRead()

  const handleDismiss = async (nudgeId: number) => {
    try {
      await markAsRead.mutateAsync(nudgeId)
    } catch (error) {
      console.error('Failed to mark nudge as read:', error)
    }
  }

  const getPriorityStyles = (priority: NudgePriority) => {
    switch (priority) {
      case NudgePriority.URGENT:
        return 'border-l-4 border-l-red-500 bg-red-50'
      case NudgePriority.HIGH:
        return 'border-l-4 border-l-orange-500 bg-orange-50'
      case NudgePriority.NORMAL:
        return 'border-l-4 border-l-blue-500 bg-blue-50'
      case NudgePriority.LOW:
        return 'border-l-4 border-l-gray-500 bg-gray-50'
      default:
        return 'border-l-4 border-l-gray-300 bg-white'
    }
  }

  const getPriorityIcon = (priority: NudgePriority) => {
    switch (priority) {
      case NudgePriority.URGENT:
        return '🔴'
      case NudgePriority.HIGH:
        return '🟠'
      case NudgePriority.NORMAL:
        return '🔵'
      case NudgePriority.LOW:
        return '⚪'
      default:
        return '📌'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const nudges = data?.items || []

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Nudges</h3>
        </div>
        {nudges.length > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {nudges.length} unread
          </span>
        )}
      </div>

      {/* Nudges List */}
      <div className="max-h-96 overflow-y-auto">
        {nudges.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {nudges.map((nudge) => (
              <div
                key={nudge.id}
                className={cn('p-4', getPriorityStyles(nudge.priority))}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getPriorityIcon(nudge.priority)}
                      </span>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {nudge.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{nudge.message}</p>
                    {nudge.action_url && (
                      <a
                        href={nudge.action_url}
                        className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Take Action
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(nudge.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismiss(nudge.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Dismiss nudge"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No new nudges</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
