/**
 * CampaignForm Component
 *
 * Form for creating and editing campaigns
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCreateCampaign, useUpdateCampaign } from '@/hooks/master-admin'
import { CampaignType, CampaignStatus } from '@/services/api/masterAdmin'
import type { AdminCampaign, AdminCampaignCreate, AdminCampaignUpdate } from '@/services/api/masterAdmin'

export interface CampaignFormProps {
  campaign?: AdminCampaign
  onSuccess?: () => void
  onCancel?: () => void
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSuccess, onCancel }) => {
  const isEditing = !!campaign

  const [formData, setFormData] = useState<AdminCampaignCreate>({
    name: campaign?.name || '',
    campaign_type: campaign?.campaign_type || CampaignType.EMAIL,
    subject_line: campaign?.subject_line || '',
    body_html: campaign?.body_html || '',
    body_text: campaign?.body_text || '',
    status: campaign?.status || CampaignStatus.DRAFT,
    scheduled_for: campaign?.scheduled_for || null,
  })

  const createCampaign = useCreateCampaign()
  const updateCampaign = useUpdateCampaign()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await updateCampaign.mutateAsync({
          campaignId: campaign.id,
          update: formData as AdminCampaignUpdate,
        })
      } else {
        await createCampaign.mutateAsync(formData)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save campaign:', error)
    }
  }

  const handleChange = (field: keyof AdminCampaignCreate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createCampaign.isPending || updateCampaign.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Campaign Type */}
      <div>
        <label htmlFor="campaign_type" className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Type *
        </label>
        <select
          id="campaign_type"
          value={formData.campaign_type}
          onChange={(e) => handleChange('campaign_type', e.target.value as CampaignType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value={CampaignType.EMAIL}>Email</option>
          <option value={CampaignType.NEWSLETTER}>Newsletter</option>
          <option value={CampaignType.PROMOTION}>Promotion</option>
          <option value={CampaignType.FOLLOW_UP}>Follow-up</option>
          <option value={CampaignType.ANNOUNCEMENT}>Announcement</option>
        </select>
      </div>

      {/* Subject Line */}
      <div>
        <label htmlFor="subject_line" className="block text-sm font-medium text-gray-700 mb-1">
          Subject Line *
        </label>
        <input
          type="text"
          id="subject_line"
          value={formData.subject_line || ''}
          onChange={(e) => handleChange('subject_line', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Body HTML */}
      <div>
        <label htmlFor="body_html" className="block text-sm font-medium text-gray-700 mb-1">
          Email Body (HTML)
        </label>
        <textarea
          id="body_html"
          value={formData.body_html || ''}
          onChange={(e) => handleChange('body_html', e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="<p>Your email content here...</p>"
        />
      </div>

      {/* Body Text */}
      <div>
        <label htmlFor="body_text" className="block text-sm font-medium text-gray-700 mb-1">
          Email Body (Plain Text)
        </label>
        <textarea
          id="body_text"
          value={formData.body_text || ''}
          onChange={(e) => handleChange('body_text', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Plain text version of your email..."
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as CampaignStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={CampaignStatus.DRAFT}>Draft</option>
          <option value={CampaignStatus.SCHEDULED}>Scheduled</option>
        </select>
      </div>

      {/* Scheduled For */}
      {formData.status === CampaignStatus.SCHEDULED && (
        <div>
          <label htmlFor="scheduled_for" className="block text-sm font-medium text-gray-700 mb-1">
            Schedule For
          </label>
          <input
            type="datetime-local"
            id="scheduled_for"
            value={formData.scheduled_for ? new Date(formData.scheduled_for).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleChange('scheduled_for', e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" loading={isLoading}>
          {isEditing ? 'Update Campaign' : 'Create Campaign'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
