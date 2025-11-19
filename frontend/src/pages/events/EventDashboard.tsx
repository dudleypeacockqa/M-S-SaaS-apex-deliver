/**
 * Event Dashboard
 * Feature: F-012 Event Management Hub
 */

import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listEvents, deleteEvent, type Event } from '../../services/api/events'
import { Card, CardHeader, CardBody, Button, Spinner } from '../../components/ui'
import { LoadingState } from '../../components/common/LoadingState'
import { EmptyState } from '../../components/common/EmptyState'

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

  const summary = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        publishedEvents: 0,
        projectedRevenue: 0,
        averageTicket: 0,
      }
    }

    const totalEvents = events.length
    const publishedEvents = events.filter((event) => event.status === 'published').length
    const projectedRevenue = events.reduce((sum, event) => {
      const capacity = event.capacity ?? 0
      return sum + capacity * event.base_price
    }, 0)
    const averageTicket = events.reduce((sum, event) => sum + event.base_price, 0) / totalEvents

    return {
      totalEvents,
      publishedEvents,
      projectedRevenue,
      averageTicket,
    }
  }, [events])

  const upcomingEvent = useMemo(() => {
    if (!events || events.length === 0) return null
    const sorted = [...events].sort((a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    return sorted[0]
  }, [events])

  if (isLoading) {
    return <LoadingState message="Loading events" fullScreen />
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error loading events"
          description={error instanceof Error ? error.message : 'Failed to load events'}
          onAction={() => queryClient.invalidateQueries({ queryKey: ['events'] })}
          actionLabel="Retry"
        />
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

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Total events</p>
            <p className="text-3xl font-bold text-indigo-900">{summary.totalEvents}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Live campaigns</p>
            <p className="text-3xl font-bold text-emerald-900">{summary.publishedEvents}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projected revenue</p>
            <p className="text-3xl font-bold text-slate-900">
              £{summary.projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average ticket</p>
            <p className="text-3xl font-bold text-slate-900">
              £{summary.averageTicket.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
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

        {upcomingEvent && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Next event</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{upcomingEvent.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(upcomingEvent.start_date).toLocaleString()} · {upcomingEvent.event_type.replace('_', ' ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleViewEvent(upcomingEvent.id)} className="bg-indigo-600 text-white">
                  Review run sheet
                </Button>
                <Button onClick={() => navigate(`/events/${upcomingEvent.id}/registrations`)} className="bg-white border border-slate-200 text-slate-700">
                  Registrations
                </Button>
              </div>
            </div>
          </div>
        )}

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
                      <span>{new Date(event.start_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Price:</span>
                      <span>{event.currency} {event.base_price.toFixed(2)}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">Capacity:</span>
                        <span>{event.capacity.toLocaleString()}</span>
                      </div>
                    )}
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
            <div className="col-span-full">
              <EmptyState
                title="No events match the filters"
                description="Launch your first event or adjust filters to see published experiences."
                onAction={handleCreateEvent}
                actionLabel="Create event"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
