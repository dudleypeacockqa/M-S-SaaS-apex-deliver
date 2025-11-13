/**
 * Event Creator
 * Feature: F-012 Event Management Hub
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent, type EventCreate } from '../../services/api/events'
import { useUser } from '@clerk/clerk-react'
import { Button, Spinner } from '../../components/ui'

export const EventCreator: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<Partial<EventCreate>>({
    name: '',
    description: '',
    event_type: 'virtual',
    status: 'draft',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    location: '',
    virtual_link: '',
    capacity: undefined,
    base_price: 0,
    currency: 'GBP',
    organization_id: user?.organizationId || '',
  })

  const createMutation = useMutation({
    mutationFn: (event: EventCreate) => createEvent(event),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate(`/events/${data.id}`)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.start_date || !formData.end_date || !formData.organization_id) {
      alert('Please fill in all required fields')
      return
    }

    await createMutation.mutateAsync(formData as EventCreate)
  }

  const handleCancel = () => {
    navigate('/events')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="virtual">Virtual</option>
                    <option value="in_person">In Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Dates</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Physical location or virtual link"
                />
              </div>

              {(formData.event_type === 'virtual' || formData.event_type === 'hybrid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Virtual Link
                  </label>
                  <input
                    type="url"
                    value={formData.virtual_link}
                    onChange={(e) => setFormData({ ...formData, virtual_link: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}
            </div>

            {/* Capacity & Pricing */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Capacity & Pricing</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    min={1}
                    placeholder="Unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      min={0}
                      step={0.01}
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-500"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <Spinner /> : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

