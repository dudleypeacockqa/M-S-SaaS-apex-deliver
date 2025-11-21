/**
 * Event Management API Client
 * Feature: F-012 Event Management Hub
 */

import { apiClient } from './client'

const BASE_PATH = '/api/events'

export interface Event {
  id: string
  name: string
  description?: string
  event_type: 'virtual' | 'in_person' | 'hybrid'
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  start_date: string
  end_date: string
  registration_deadline?: string
  location?: string
  virtual_link?: string
  capacity?: number
  base_price: number
  currency: string
  organization_id: string
  created_by_user_id: string
  created_at: string
  updated_at?: string
}

export interface EventSession {
  id: string
  event_id: string
  name: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  virtual_link?: string
  capacity?: number
  speaker_name?: string
  speaker_bio?: string
  organization_id: string
  created_by_user_id: string
  created_at: string
  updated_at?: string
}

export interface EventTicket {
  id: string
  event_id: string
  name: string
  description?: string
  price: number
  currency: string
  quantity: number
  available_quantity: number
  status: 'active' | 'sold_out' | 'cancelled'
  organization_id: string
  created_by_user_id: string
  created_at: string
  updated_at?: string
}

export interface EventRegistration {
  id: string
  event_id: string
  ticket_id?: string
  user_id?: string
  attendee_name: string
  attendee_email: string
  attendee_phone?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no_show'
  payment_status: string
  payment_amount: number
  currency: string
  checked_in: boolean
  checked_in_at?: string
  registered_at: string
  organization_id: string
  registered_by_user_id?: string
  created_at: string
  updated_at?: string
}

export interface EventAnalytics {
  id: string
  event_id: string
  total_registrations: number
  total_attendees: number
  total_revenue: number
  currency: string
  session_metrics: Record<string, any>
  recorded_at: string
  organization_id: string
}

export interface EventCreate {
  name: string
  description?: string
  event_type: 'virtual' | 'in_person' | 'hybrid'
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  start_date: string
  end_date: string
  registration_deadline?: string
  location?: string
  virtual_link?: string
  capacity?: number
  base_price?: number
  currency?: string
  organization_id: string
}

export interface EventUpdate {
  name?: string
  description?: string
  event_type?: 'virtual' | 'in_person' | 'hybrid'
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  start_date?: string
  end_date?: string
  registration_deadline?: string
  location?: string
  virtual_link?: string
  capacity?: number
  base_price?: number
  currency?: string
}

export interface EventSessionCreate {
  name: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  virtual_link?: string
  capacity?: number
  speaker_name?: string
  speaker_bio?: string
  event_id: string
  organization_id: string
}

export interface EventTicketCreate {
  name: string
  description?: string
  price: number
  currency: string
  quantity: number
  status?: 'active' | 'sold_out' | 'cancelled'
  event_id: string
  organization_id: string
}

export interface EventRegistrationCreate {
  event_id: string
  ticket_id?: string
  user_id?: string
  attendee_name: string
  attendee_email: string
  attendee_phone?: string
  status?: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no_show'
  organization_id: string
}

// Event CRUD operations
export async function listEvents(params?: {
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  event_type?: 'virtual' | 'in_person' | 'hybrid'
  skip?: number
  limit?: number
}): Promise<Event[]> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append('status', params.status)
  if (params?.event_type) queryParams.append('event_type', params.event_type)
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  
  const queryString = queryParams.toString()
  const url = queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH
  return apiClient.get<Event[]>(url)
}

export async function getEvent(eventId: string): Promise<Event> {
  return apiClient.get<Event>(`${BASE_PATH}/${eventId}`)
}

export async function createEvent(event: EventCreate): Promise<Event> {
  return apiClient.post<Event>(BASE_PATH, event)
}

export async function updateEvent(eventId: string, event: EventUpdate): Promise<Event> {
  return apiClient.put<Event>(`${BASE_PATH}/${eventId}`, event)
}

export async function deleteEvent(eventId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/${eventId}`)
}

// Event Session operations
export async function listEventSessions(eventId: string): Promise<EventSession[]> {
  return apiClient.get<EventSession[]>(`${BASE_PATH}/${eventId}/sessions`)
}

export async function getEventSession(eventId: string, sessionId: string): Promise<EventSession> {
  return apiClient.get<EventSession>(`${BASE_PATH}/${eventId}/sessions/${sessionId}`)
}

export async function createEventSession(eventId: string, session: EventSessionCreate): Promise<EventSession> {
  return apiClient.post<EventSession>(`${BASE_PATH}/${eventId}/sessions`, session)
}

export async function updateEventSession(eventId: string, sessionId: string, session: Partial<EventSessionCreate>): Promise<EventSession> {
  return apiClient.put<EventSession>(`${BASE_PATH}/${eventId}/sessions/${sessionId}`, session)
}

export async function deleteEventSession(eventId: string, sessionId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/${eventId}/sessions/${sessionId}`)
}

// Event Ticket operations
export async function listEventTickets(eventId: string): Promise<EventTicket[]> {
  return apiClient.get<EventTicket[]>(`${BASE_PATH}/${eventId}/tickets`)
}

export async function getEventTicket(eventId: string, ticketId: string): Promise<EventTicket> {
  return apiClient.get<EventTicket>(`${BASE_PATH}/${eventId}/tickets/${ticketId}`)
}

export async function createEventTicket(eventId: string, ticket: EventTicketCreate): Promise<EventTicket> {
  return apiClient.post<EventTicket>(`${BASE_PATH}/${eventId}/tickets`, ticket)
}

export async function updateEventTicket(eventId: string, ticketId: string, ticket: Partial<EventTicketCreate>): Promise<EventTicket> {
  return apiClient.put<EventTicket>(`${BASE_PATH}/${eventId}/tickets/${ticketId}`, ticket)
}

export async function deleteEventTicket(eventId: string, ticketId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/${eventId}/tickets/${ticketId}`)
}

// Event Registration operations
export async function listEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  return apiClient.get<EventRegistration[]>(`${BASE_PATH}/${eventId}/registrations`)
}

export async function getEventRegistration(eventId: string, registrationId: string): Promise<EventRegistration> {
  return apiClient.get<EventRegistration>(`${BASE_PATH}/${eventId}/registrations/${registrationId}`)
}

export async function createEventRegistration(eventId: string, registration: EventRegistrationCreate): Promise<EventRegistration> {
  return apiClient.post<EventRegistration>(`${BASE_PATH}/${eventId}/registrations`, registration)
}

export async function updateEventRegistration(eventId: string, registrationId: string, registration: Partial<EventRegistrationCreate>): Promise<EventRegistration> {
  return apiClient.patch<EventRegistration>(`${BASE_PATH}/${eventId}/registrations/${registrationId}`, registration)
}

export async function deleteEventRegistration(eventId: string, registrationId: string): Promise<void> {
  return apiClient.delete<void>(`${BASE_PATH}/${eventId}/registrations/${registrationId}`)
}

// Event Analytics
export async function getEventAnalytics(eventId: string): Promise<EventAnalytics> {
  return apiClient.get<EventAnalytics>(`${BASE_PATH}/${eventId}/analytics`)
}

// Event Export
export async function exportEventRegistrations(eventId: string): Promise<Blob> {
  return apiClient.get<Blob>(`${BASE_PATH}/${eventId}/registrations/export`, {
    responseType: 'blob',
    contentType: null,
  })
}

// Event Ticket Purchase (Stripe)
export interface TicketPurchaseRequest {
  ticket_type: string
  quantity: number
}

export interface TicketPurchaseResponse {
  checkout_session_id: string
  checkout_url: string
  amount: number
  currency: string
}

export async function purchaseEventTicket(
  eventId: string,
  request: TicketPurchaseRequest
): Promise<TicketPurchaseResponse> {
  return apiClient.post<TicketPurchaseResponse>(
    `/api/events/${eventId}/tickets/purchase`,
    request
  )
}