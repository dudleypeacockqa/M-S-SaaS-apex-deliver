/**
 * AddDealForm Component
 *
 * Quick form for adding a deal to a prospect
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useCreateDeal } from '@/hooks/master-admin'
import { AdminDealStage } from '@/services/api/masterAdmin'
import type { AdminDealCreate } from '@/services/api/masterAdmin'

export interface AddDealFormProps {
  prospectId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export const AddDealForm: React.FC<AddDealFormProps> = ({
  prospectId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AdminDealCreate>({
    prospect_id: prospectId,
    title: '',
    stage: AdminDealStage.DISCOVERY,
    value: undefined,
    probability: 50,
    expected_close_date: '',
    notes: '',
  })

  const createDeal = useCreateDeal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createDeal.mutateAsync(formData)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create deal:', error)
    }
  }

  const handleChange = <K extends keyof AdminDealCreate>(
    field: K,
    value: AdminDealCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="deal-title" className="block text-sm font-medium text-gray-700 mb-1">
          Deal Title *
        </label>
        <input
          id="deal-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Q4 Enterprise Deal"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Stage & Probability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="deal-stage" className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            id="deal-stage"
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value as AdminDealStage)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={AdminDealStage.DISCOVERY}>Discovery</option>
            <option value={AdminDealStage.QUALIFICATION}>Qualification</option>
            <option value={AdminDealStage.PROPOSAL}>Proposal</option>
            <option value={AdminDealStage.NEGOTIATION}>Negotiation</option>
            <option value={AdminDealStage.CLOSING}>Closing</option>
            <option value={AdminDealStage.WON}>Won</option>
            <option value={AdminDealStage.LOST}>Lost</option>
          </select>
        </div>

        <div>
          <label htmlFor="deal-probability" className="block text-sm font-medium text-gray-700 mb-1">
            Win Probability (%)
          </label>
          <input
            id="deal-probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleChange('probability', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Value & Expected Close Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="deal-value" className="block text-sm font-medium text-gray-700 mb-1">
            Deal Value ($)
          </label>
          <input
            id="deal-value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value || ''}
            onChange={(e) => handleChange('value', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="deal-close-date" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Close Date
          </label>
          <input
            id="deal-close-date"
            type="date"
            value={formData.expected_close_date || ''}
            onChange={(e) => handleChange('expected_close_date', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="deal-notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="deal-notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes about this deal..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" fullWidth loading={createDeal.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createDeal.isPending}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
