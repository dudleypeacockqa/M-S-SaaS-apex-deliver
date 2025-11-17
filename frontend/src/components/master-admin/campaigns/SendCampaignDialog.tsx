/**
 * SendCampaignDialog Component
 *
 * Dialog for confirming and sending a campaign
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useSendCampaign } from '@/hooks/master-admin'
import { Send, AlertCircle } from '@/lib/icons'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export interface SendCampaignDialogProps {
  campaign: AdminCampaign
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const SendCampaignDialog: React.FC<SendCampaignDialogProps> = ({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [sendNow, setSendNow] = useState(true)
  const [scheduledTime, setScheduledTime] = useState('')

  const sendCampaign = useSendCampaign()

  const handleSend = async () => {
    try {
      await sendCampaign.mutateAsync({
        campaignId: campaign.id,
        request: {
          send_now: sendNow,
          scheduled_for: sendNow ? null : scheduledTime || null,
        },
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to send campaign:', error)
    }
  }

  const hasRecipients = campaign.total_recipients && campaign.total_recipients > 0
  const hasContent = campaign.body_html || campaign.body_text
  const hasSubject = !!campaign.subject_line

  const canSend = hasRecipients && hasContent && hasSubject

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Campaign
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Campaign Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{campaign.name}</p>
              <p className="text-sm text-gray-600 mt-1">Subject: {campaign.subject_line || '(No subject)'}</p>
              <p className="text-sm text-gray-600 mt-1">Recipients: {campaign.total_recipients || 0}</p>
            </div>

            {/* Validation Warnings */}
            {!canSend && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">Cannot send campaign</p>
                    <ul className="text-sm text-red-800 mt-2 space-y-1">
                      {!hasRecipients && <li>• Add at least one recipient</li>}
                      {!hasContent && <li>• Add email content (HTML or plain text)</li>}
                      {!hasSubject && <li>• Add a subject line</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Send Options */}
            {canSend && (
              <div className="space-y-3">
                {/* Send Now */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={sendNow}
                    onChange={() => setSendNow(true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Send now</p>
                    <p className="text-sm text-gray-600">Campaign will be sent immediately</p>
                  </div>
                </label>

                {/* Schedule */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={!sendNow}
                    onChange={() => setSendNow(false)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Schedule for later</p>
                    <p className="text-sm text-gray-600 mb-2">Campaign will be sent at the specified time</p>
                    {!sendNow && (
                      <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </label>
              </div>
            )}

            {/* Confirmation Warning */}
            {canSend && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Warning:</strong> Once sent, emails cannot be recalled. Make sure your content is correct.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!canSend || (!sendNow && !scheduledTime)}
              loading={sendCampaign.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendNow ? 'Send Now' : 'Schedule Send'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
