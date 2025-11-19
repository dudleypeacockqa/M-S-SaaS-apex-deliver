import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFlaggedContent,
  moderateContent,
  getCommunityAnalytics,
  type ModerationActionType,
  type TargetType,
} from '../../services/api/community'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const ModerationDashboard: React.FC = () => {
  const queryClient = useQueryClient()

  // Fetch flagged content
  const { data: flaggedData, isLoading: flaggedLoading } = useQuery({
    queryKey: ['flagged-content'],
    queryFn: getFlaggedContent,
  })

  // Fetch analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['community-analytics'],
    queryFn: getCommunityAnalytics,
  })

  // Moderation mutation
  const moderationMutation = useMutation({
    mutationFn: moderateContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-content'] })
    },
  })

  const handleModeration = (
    targetType: TargetType,
    targetId: string,
    actionType: ModerationActionType
  ) => {
    moderationMutation.mutate({
      target_type: targetType,
      target_id: targetId,
      action_type: actionType,
    })
  }

  return (
    <WorkspaceContainer maxWidth="6xl" className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6" data-testid="moderation-title">
        Moderation Dashboard
      </h1>

      {/* Analytics Summary */}
      {!analyticsLoading && analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" data-testid="analytics-summary">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Posts</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.total_posts}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Comments</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.total_comments}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Reactions</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.total_reactions}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData.active_users_count}</div>
          </div>
        </div>
      )}

      {/* Flagged Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Flagged Content</h2>
        {flaggedLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading flagged content...</p>
          </div>
        )}
        {!flaggedLoading && flaggedData && (
          <>
            {flaggedData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No flagged content to review.</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="flagged-content-list">
                {flaggedData.map((item) => (
                  <div
                    key={`${item.target_type}-${item.target_id}`}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.target_type}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          Flagged {item.flag_count} times
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{item.content_preview}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModeration(item.target_type, item.target_id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        data-testid={`approve-${item.target_id}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleModeration(item.target_type, item.target_id, 'delete')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        data-testid={`delete-${item.target_id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </WorkspaceContainer>
  )
}
