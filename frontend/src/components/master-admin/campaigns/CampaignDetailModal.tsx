/**
 * CampaignDetailModal Component
 *
 * Modal displaying full campaign details with recipients, stats, and actions
 */

import React, { useState } from 'react'
import { cn } from '@/styles/design-tokens'
import { X, Edit2, Trash2, Send } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { CampaignForm } from './CampaignForm'
import { RecipientManager } from './RecipientManager'
import { CampaignStats } from './CampaignStats'
import { EmailPreview } from './EmailPreview'
import { SendCampaignDialog } from './SendCampaignDialog'
import { useDeleteCampaign } from '@/hooks/master-admin'
import { CampaignStatus } from '@/services/api/masterAdmin'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export interface CampaignDetailModalProps {
  campaign: AdminCampaign
  isOpen: boolean
  onClose: () => void
  onDeleted?: () => void
}

type TabType = 'overview' | 'recipients' | 'preview'

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showSendDialog, setShowSendDialog] = useState(false)

  const deleteCampaign = useDeleteCampaign()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${campaign.name}"? This cannot be undone.`)) {
      try {
        await deleteCampaign.mutateAsync(campaign.id)
        onDeleted?.()
        onClose()
      } catch (error) {
        console.error('Failed to delete campaign:', error)
      }
    }
  }

  const canSend = campaign.status === CampaignStatus.DRAFT && campaign.total_recipients && campaign.total_recipients > 0

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={cn(
            'bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto',
            'transform transition-all'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Campaign' : campaign.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs (if not editing) */}
            {!isEditing && (
              <div className="flex gap-1 border-b border-gray-200 -mb-6 pb-0">
                {[
                  { id: 'overview' as const, label: 'Overview' },
                  { id: 'recipients' as const, label: 'Recipients' },
                  { id: 'preview' as const, label: 'Preview' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              /* Edit Mode */
              <CampaignForm
                campaign={campaign}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              /* View Mode */
              <>
                {activeTab === 'overview' && <CampaignStats campaign={campaign} />}
                {activeTab === 'recipients' && <RecipientManager campaignId={campaign.id} />}
                {activeTab === 'preview' && <EmailPreview campaign={campaign} />}
              </>
            )}

            {/* Actions (if not editing) */}
            {!isEditing && (
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                {canSend && (
                  <Button variant="primary" onClick={() => setShowSendDialog(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleteCampaign.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Campaign Dialog */}
      {showSendDialog && (
        <SendCampaignDialog
          campaign={campaign}
          isOpen={showSendDialog}
          onClose={() => setShowSendDialog(false)}
          onSuccess={() => {
            setShowSendDialog(false)
            onClose()
          }}
        />
      )}
    </>
  )
}
