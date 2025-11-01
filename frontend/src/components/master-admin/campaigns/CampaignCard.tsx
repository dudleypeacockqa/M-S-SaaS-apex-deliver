/**
 * CampaignCard Component
 *
 * Display individual campaign with status, stats, and actions
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { Mail, Users, Eye, MousePointer, Calendar, MoreVertical, Edit2, Trash2, Send } from 'lucide-react'
import { CampaignType, CampaignStatus } from '@/services/api/masterAdmin'
import type { AdminCampaign } from '@/services/api/masterAdmin'

export interface CampaignCardProps {
  campaign: AdminCampaign
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onSend?: () => void
}

const getCampaignTypeBadge = (type: CampaignType) => {
  const styles = {
    [CampaignType.EMAIL]: 'bg-blue-100 text-blue-800',
    [CampaignType.NEWSLETTER]: 'bg-purple-100 text-purple-800',
    [CampaignType.PROMOTION]: 'bg-green-100 text-green-800',
    [CampaignType.FOLLOW_UP]: 'bg-yellow-100 text-yellow-800',
    [CampaignType.ANNOUNCEMENT]: 'bg-red-100 text-red-800',
  }

  const labels = {
    [CampaignType.EMAIL]: 'Email',
    [CampaignType.NEWSLETTER]: 'Newsletter',
    [CampaignType.PROMOTION]: 'Promotion',
    [CampaignType.FOLLOW_UP]: 'Follow-up',
    [CampaignType.ANNOUNCEMENT]: 'Announcement',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[type])}>
      {labels[type]}
    </span>
  )
}

const getCampaignStatusBadge = (status: CampaignStatus) => {
  const styles = {
    [CampaignStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [CampaignStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [CampaignStatus.SENDING]: 'bg-yellow-100 text-yellow-800',
    [CampaignStatus.SENT]: 'bg-green-100 text-green-800',
    [CampaignStatus.FAILED]: 'bg-red-100 text-red-800',
  }

  const labels = {
    [CampaignStatus.DRAFT]: 'Draft',
    [CampaignStatus.SCHEDULED]: 'Scheduled',
    [CampaignStatus.SENDING]: 'Sending',
    [CampaignStatus.SENT]: 'Sent',
    [CampaignStatus.FAILED]: 'Failed',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {labels[status]}
    </span>
  )
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onClick,
  onEdit,
  onDelete,
  onSend,
}) => {
  const [showMenu, setShowMenu] = React.useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete?.()
  }

  const handleSend = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    onSend?.()
  }

  const sentDate = campaign.sent_at ? new Date(campaign.sent_at) : null
  const scheduledDate = campaign.scheduled_for ? new Date(campaign.scheduled_for) : null

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow relative',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{campaign.name}</h3>
          {campaign.subject_line && (
            <p className="text-sm text-gray-600 truncate mt-1">Subject: {campaign.subject_line}</p>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            aria-label="Campaign actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  {campaign.status === CampaignStatus.DRAFT && onSend && (
                    <button
                      onClick={handleSend}
                      className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Campaign
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        {getCampaignTypeBadge(campaign.campaign_type)}
        {getCampaignStatusBadge(campaign.status)}
      </div>

      {/* Stats (if sent) */}
      {campaign.status === CampaignStatus.SENT && (
        <div className="grid grid-cols-4 gap-3 mb-3 py-3 border-y border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <Mail className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{campaign.total_sent || 0}</p>
            <p className="text-xs text-gray-500">Sent</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-green-600 mb-1">
              <Eye className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{campaign.total_opened || 0}</p>
            <p className="text-xs text-gray-500">Opened</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-purple-600 mb-1">
              <MousePointer className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{campaign.total_clicked || 0}</p>
            <p className="text-xs text-gray-500">Clicked</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-600 mb-1">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{campaign.total_recipients || 0}</p>
            <p className="text-xs text-gray-500">Recipients</p>
          </div>
        </div>
      )}

      {/* Draft: Recipients count */}
      {campaign.status === CampaignStatus.DRAFT && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4" />
          <span>{campaign.total_recipients || 0} recipients</span>
        </div>
      )}

      {/* Footer: Dates */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {sentDate && <span>Sent {sentDate.toLocaleDateString()}</span>}
          {scheduledDate && !sentDate && <span>Scheduled {scheduledDate.toLocaleDateString()}</span>}
          {!sentDate && !scheduledDate && <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  )
}
