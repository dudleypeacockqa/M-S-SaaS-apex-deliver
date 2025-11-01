/**
 * ProspectForm Component
 *
 * Form for creating/editing prospects
 */

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'
import { useCreateProspect, useUpdateProspect } from '@/hooks/master-admin'
import { ProspectStatus } from '@/services/api/masterAdmin'
import type { AdminProspect, AdminProspectCreate } from '@/services/api/masterAdmin'

export interface ProspectFormProps {
  prospect?: AdminProspect // If provided, edit mode
  onSuccess?: () => void
  onCancel?: () => void
}

export const ProspectForm: React.FC<ProspectFormProps> = ({
  prospect,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AdminProspectCreate>({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: ProspectStatus.NEW,
    source: '',
    tags: '',
    notes: '',
  })

  const createProspect = useCreateProspect()
  const updateProspect = useUpdateProspect()

  // Initialize form data when editing
  useEffect(() => {
    if (prospect) {
      setFormData({
        name: prospect.name,
        email: prospect.email || '',
        phone: prospect.phone || '',
        company: prospect.company || '',
        title: prospect.title || '',
        status: prospect.status,
        source: prospect.source || '',
        tags: prospect.tags || '',
        notes: prospect.notes || '',
      })
    }
  }, [prospect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (prospect) {
        // Update existing prospect
        await updateProspect.mutateAsync({
          prospectId: prospect.id,
          update: formData,
        })
      } else {
        // Create new prospect
        await createProspect.mutateAsync(formData)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save prospect:', error)
    }
  }

  const handleChange = <K extends keyof AdminProspectCreate>(
    field: K,
    value: AdminProspectCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isLoading = createProspect.isPending || updateProspect.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="prospect-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          id="prospect-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prospect-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="prospect-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="prospect-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="prospect-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Company & Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prospect-company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="prospect-company"
            type="text"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="prospect-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="prospect-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status & Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prospect-status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="prospect-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProspectStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={ProspectStatus.NEW}>New</option>
            <option value={ProspectStatus.QUALIFIED}>Qualified</option>
            <option value={ProspectStatus.ENGAGED}>Engaged</option>
            <option value={ProspectStatus.PROPOSAL}>Proposal</option>
            <option value={ProspectStatus.NEGOTIATION}>Negotiation</option>
            <option value={ProspectStatus.CLOSED_WON}>Closed - Won</option>
            <option value={ProspectStatus.CLOSED_LOST}>Closed - Lost</option>
          </select>
        </div>

        <div>
          <label htmlFor="prospect-source" className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <input
            id="prospect-source"
            type="text"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            placeholder="e.g., LinkedIn, Referral, Event"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="prospect-tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          id="prospect-tags"
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="e.g., VIP, Tech, Enterprise"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="prospect-notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="prospect-notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes about this prospect..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          {prospect ? 'Update Prospect' : 'Create Prospect'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
