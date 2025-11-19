/**
 * Event Details
 * Feature: F-012 Event Management Hub
 */

import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEvent,
  deleteEvent,
  listEventSessions,
  listEventTickets,
  listEventRegistrations,
  getEventAnalytics,
  exportEventRegistrations,
  purchaseEventTicket,
  type Event,
  type EventSession,
  type EventTicket,
  type EventRegistration,
  type EventAnalytics,
} from '../../services/api/events'
import { Card, CardHeader, CardBody, Button, Spinner } from '../../components/ui'
import { WorkspaceContainer } from '@/components/layout/WorkspaceContainer'

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'tickets' | 'registrations' | 'analytics'>('overview')

  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId!),
    enabled: !!eventId,
  })

  const { data: sessions, isLoading: sessionsLoading } = useQuery<EventSession[]>({
    queryKey: ['event-sessions', eventId],
    queryFn: () => listEventSessions(eventId!),
    enabled: !!eventId && activeTab === 'sessions',
  })

  const { data: tickets, isLoading: ticketsLoading } = useQuery<EventTicket[]>({
    queryKey: ['event-tickets', eventId],
    queryFn: () => listEventTickets(eventId!),
    enabled: !!eventId && activeTab === 'tickets',
  })

  const { data: registrations, isLoading: registrationsLoading } = useQuery<EventRegistration[]>({
    queryKey: ['event-registrations', eventId],
    queryFn: () => listEventRegistrations(eventId!),
    enabled: !!eventId && activeTab === 'registrations',
  })

  const { data: analytics, isLoading: analyticsLoading } = useQuery<EventAnalytics>({
    queryKey: ['event-analytics', eventId],
    queryFn: () => getEventAnalytics(eventId!),
    enabled: !!eventId && activeTab === 'analytics',
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      navigate('/events')
    },
  })

  const handleExportRegistrations = async () => {
    if (!eventId) return
    try {
      const blob = await exportEventRegistrations(eventId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `event-${eventId}-registrations.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export registrations', error)
      alert('Failed to export registrations')
    }
  }

  const handlePurchaseTicket = async (ticketId: string, quantity: number = 1) => {
    if (!eventId) return
    try {
      const response = await purchaseEventTicket(eventId, {
        ticket_type: ticketId,
        quantity,
      })
      // Redirect to Stripe Checkout
      window.location.href = response.checkout_url
    } catch (error) {
      console.error('Failed to initiate ticket purchase', error)
      alert('Failed to initiate ticket purchase. Please try again.')
    }
  }

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-900">Event Not Found</h3>
          <p className="text-sm text-red-700">The event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/events')} className="mt-4 bg-indigo-600 text-white hover:bg-indigo-500">
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WorkspaceContainer className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{event.description || 'No description'}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(`/events/${eventId}/edit`)}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Edit Event
            </Button>
            <Button
              onClick={() => deleteMutation.mutateAsync(eventId!)}
              className="bg-red-600 text-white hover:bg-red-500"
              disabled={deleteMutation.isPending}
            >
              Delete Event
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {(['overview', 'sessions', 'tickets', 'registrations', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Event Information</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <span className="ml-2 text-sm text-gray-900 capitalize">{event.event_type.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date:</span>
                      <span className="ml-2 text-sm text-gray-900">{new Date(event.start_date).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">End Date:</span>
                      <span className="ml-2 text-sm text-gray-900">{new Date(event.end_date).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location:</span>
                        <span className="ml-2 text-sm text-gray-900">{event.location}</span>
                      </div>
                    )}
                    {event.virtual_link && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Virtual Link:</span>
                        <a href={event.virtual_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-600 hover:underline">
                          {event.virtual_link}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-500">Capacity:</span>
                      <span className="ml-2 text-sm text-gray-900">{event.capacity || 'Unlimited'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <span className="ml-2 text-sm text-gray-900">{event.currency} {event.base_price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div>
              {sessionsLoading ? (
                <Spinner />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions && sessions.length > 0 ? (
                    sessions.map((session) => (
                      <Card key={session.id}>
                        <CardHeader>
                          <h3 className="text-lg font-semibold text-gray-900">{session.name}</h3>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{session.description || 'No description'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">Start:</span>
                              <span>{new Date(session.start_time).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">End:</span>
                              <span>{new Date(session.end_time).toLocaleString()}</span>
                            </div>
                            {session.speaker_name && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-medium">Speaker:</span>
                                <span>{session.speaker_name}</span>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No sessions found.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <div>
              {ticketsLoading ? (
                <Spinner />
              ) : (
                <div className="space-y-4">
                  {tickets && tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'sold_out' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{ticket.description || 'No description'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">Price:</span>
                              <span>{ticket.currency} {ticket.price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-medium">Available:</span>
                              <span>{ticket.available_quantity} / {ticket.quantity}</span>
                            </div>
                          </div>
                          {ticket.status === 'active' && ticket.available_quantity > 0 && (
                            <div className="mt-4">
                              <Button
                                onClick={() => handlePurchaseTicket(ticket.id, 1)}
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-500"
                              >
                                Purchase Ticket
                              </Button>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No tickets found.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'registrations' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Registrations</h2>
                <Button
                  onClick={handleExportRegistrations}
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Export CSV
                </Button>
              </div>
              {registrationsLoading ? (
                <Spinner />
              ) : (
                <div className="space-y-4">
                  {registrations && registrations.length > 0 ? (
                    registrations.map((registration) => (
                      <Card key={registration.id}>
                        <CardBody>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{registration.attendee_name}</p>
                              <p className="text-sm text-gray-500">{registration.attendee_email}</p>
                              {registration.attendee_phone && (
                                <p className="text-sm text-gray-500">{registration.attendee_phone}</p>
                              )}
                              <p className="text-sm text-gray-500">Registered: {new Date(registration.registered_at).toLocaleString()}</p>
                              {registration.payment_amount > 0 && (
                                <p className="text-sm text-gray-500">Payment: {registration.currency} {registration.payment_amount.toFixed(2)} ({registration.payment_status})</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                registration.status === 'attended' ? 'bg-blue-100 text-blue-800' :
                                registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {registration.status}
                              </span>
                              {registration.checked_in && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  Checked In
                                </span>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No registrations found.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              {analyticsLoading ? (
                <Spinner />
              ) : analytics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Total Registrations</h3>
                      </CardHeader>
                      <CardBody>
                        <p className="text-3xl font-bold text-gray-900">{analytics.total_registrations}</p>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Total Attendees</h3>
                      </CardHeader>
                      <CardBody>
                        <p className="text-3xl font-bold text-green-600">{analytics.total_attendees}</p>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                      </CardHeader>
                      <CardBody>
                        <p className="text-3xl font-bold text-gray-900">{analytics.currency} {typeof analytics.total_revenue === 'number' ? analytics.total_revenue.toFixed(2) : parseFloat(String(analytics.total_revenue)).toFixed(2)}</p>
                      </CardBody>
                    </Card>
                  </div>
                  {analytics.session_metrics && Object.keys(analytics.session_metrics).length > 0 && (
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900">Session Metrics</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {Object.entries(analytics.session_metrics).map(([sessionId, metrics]: [string, any]) => (
                            <div key={sessionId} className="border-b border-gray-200 pb-4 last:border-b-0">
                              <h4 className="font-medium text-gray-900">Session: {sessionId}</h4>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div>
                                  <span className="text-sm text-gray-500">Registrations:</span>
                                  <span className="ml-2 text-sm font-medium text-gray-900">{metrics.registrations || 0}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Attendees:</span>
                                  <span className="ml-2 text-sm font-medium text-gray-900">{metrics.attendees || 0}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Revenue:</span>
                                  <span className="ml-2 text-sm font-medium text-gray-900">{analytics.currency} {typeof metrics.revenue === 'number' ? metrics.revenue.toFixed(2) : parseFloat(String(metrics.revenue || 0)).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No analytics data available.</p>
              )}
            </div>
          )}
        </div>
      </WorkspaceContainer>
    </div>
  )
}

