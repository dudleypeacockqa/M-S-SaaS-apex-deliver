/**
 * RecipientList Component
 *
 * Display list of campaign recipients with status
 */

import React from 'react'
import { useCampaignRecipients, useRemoveCampaignRecipient } from '@/hooks/master-admin'
import { Mail, X, CheckCircle, XCircle, Clock } from 'lucide-react'

export interface RecipientListProps {
  campaignId: number
}

export const RecipientList: React.FC<RecipientListProps> = ({ campaignId }) => {
  const { data, isLoading } = useCampaignRecipients(campaignId)
  const removeRecipient = useRemoveCampaignRecipient()

  const handleRemove = async (recipientId: number) => {
    if (confirm('Remove this recipient from the campaign?')) {
      try {
        await removeRecipient.mutateAsync({ recipientId, campaignId })
      } catch (error) {
        console.error('Failed to remove recipient:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  const recipients = data?.items || []

  if (recipients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        <Mail className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">No recipients yet</p>
        <p className="text-sm mt-1">Add recipients to send this campaign</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {recipients.map((recipient) => {
        const statusIcon = recipient.sent_at ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : recipient.failed_at ? (
          <XCircle className="h-5 w-5 text-red-600" />
        ) : (
          <Clock className="h-5 w-5 text-gray-400" />
        )

        const statusText = recipient.sent_at
          ? `Sent ${new Date(recipient.sent_at).toLocaleDateString()}`
          : recipient.failed_at
          ? `Failed ${new Date(recipient.failed_at).toLocaleDateString()}`
          : 'Pending'

        return (
          <div
            key={recipient.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Status Icon */}
              {statusIcon}

              {/* Recipient Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{recipient.prospect_name || 'Unknown'}</p>
                {recipient.prospect_email && (
                  <p className="text-sm text-gray-600 truncate">{recipient.prospect_email}</p>
                )}
              </div>

              {/* Status Text */}
              <div className="text-sm text-gray-500 hidden md:block">{statusText}</div>

              {/* Engagement Stats (if sent) */}
              {recipient.sent_at && (
                <div className="flex items-center gap-4 text-sm text-gray-600 hidden lg:flex">
                  {recipient.opened_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Opened</span>
                    </div>
                  )}
                  {recipient.clicked_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Clicked</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remove Button (only if not sent) */}
            {!recipient.sent_at && (
              <button
                onClick={() => handleRemove(recipient.id)}
                className="ml-4 text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                aria-label="Remove recipient"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )
      })}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>
          Total: {recipients.length} recipients
          {recipients.some((r) => r.sent_at) && (
            <>
              {' • '}
              {recipients.filter((r) => r.sent_at).length} sent
            </>
          )}
          {recipients.some((r) => r.opened_at) && (
            <>
              {' • '}
              {recipients.filter((r) => r.opened_at).length} opened
            </>
          )}
          {recipients.some((r) => r.clicked_at) && (
            <>
              {' • '}
              {recipients.filter((r) => r.clicked_at).length} clicked
            </>
          )}
        </p>
      </div>
    </div>
  )
}
