/**
 * ActivityForm Component
 *
 * Form for logging new activities
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus } from '@/lib/icons'
import { useCreateActivity } from '@/hooks/master-admin'
import { ActivityType, ActivityStatus } from '@/services/api/masterAdmin'
import type { AdminActivityCreate } from '@/services/api/masterAdmin'

export const ActivityForm: React.FC = () => {
  const [formData, setFormData] = useState<AdminActivityCreate>({
    type: ActivityType.DISCOVERY,
    status: ActivityStatus.DONE,
    date: new Date().toISOString().split('T')[0], // Today
    amount: 1,
    notes: '',
  })

  const createActivity = useCreateActivity()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createActivity.mutateAsync(formData)
      // Reset form
      setFormData({
        type: ActivityType.DISCOVERY,
        status: ActivityStatus.DONE,
        date: new Date().toISOString().split('T')[0],
        amount: 1,
        notes: '',
      })
    } catch (error) {
      console.error('Failed to create activity:', error)
    }
  }

  const handleChange = <K extends keyof AdminActivityCreate>(
    field: K,
    value: AdminActivityCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Activity</h3>

      <div className="space-y-4">
        {/* Activity Type */}
        <div>
          <label htmlFor="activity-type" className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type *
          </label>
          <select
            id="activity-type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as ActivityType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={ActivityType.DISCOVERY}>🔍 Discovery</option>
            <option value={ActivityType.EMAIL}>📧 Email</option>
            <option value={ActivityType.VIDEO}>🎥 Video</option>
            <option value={ActivityType.CALL}>📞 Call</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="activity-status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="activity-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ActivityStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={ActivityStatus.DONE}>✅ Done</option>
            <option value={ActivityStatus.PENDING}>⏳ Pending</option>
            <option value={ActivityStatus.CANCELLED}>❌ Cancelled</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="activity-date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            id="activity-date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="activity-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            id="activity-amount"
            type="number"
            min="1"
            value={formData.amount}
            onChange={(e) => handleChange('amount', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="activity-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="activity-notes"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional notes about this activity..."
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={createActivity.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>
    </form>
  )
}
