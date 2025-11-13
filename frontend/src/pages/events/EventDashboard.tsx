/**
 * Event Dashboard
 * Feature: F-012 Event Management Hub
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listEvents, deleteEvent, type Event } from '../../services/api/events'
import { Card, CardHeader, CardBody, Button, Spinner } from '../../components/ui'

export const EventDashboard: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'cancelled' | 'completed'>('all')
  const [filterType, setFilterType] = useState<'all' | 'virtual' | 'in_person' | 'hybrid'>('all')

  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ['events', filterStatus, filterType],
    queryFn: () => listEvents({
      status: filterStatus === 'all' ? undefined : filterStatus,
      event_type: filterType === 'all' ? undefined : filterType,
    }),
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const handleCreateEvent = () => {
    navigate('/events/new')
  }

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteMutation.mutateAsync(eventId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-900">Error Loading Events</h3>
          <p className="text-sm text-red-700">{error instanceof Error ? error.message : 'Failed to load events'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your events, registrations, and analytics</p>
          </div>
          <Button onClick={handleCreateEvent} className="bg-indigo-600 text-white hover:bg-indigo-500">
            Create Event
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Status:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Type:
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="virtual">Virtual</option>
              <option value="in_person">In Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events && events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{event.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{event.event_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Start:</span>
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Price:</span>
                      <span>{event.currency} {event.base_price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      onClick={() => handleViewEvent(event.id)}
                      className="flex-1 bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-600 text-white hover:bg-red-500"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No events found</p>
              <Button onClick={handleCreateEvent} className="mt-4 bg-indigo-600 text-white hover:bg-indigo-500">
                Create Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
