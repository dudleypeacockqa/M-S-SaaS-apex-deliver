import { apiClient } from './client'

export interface NotificationPreferences {
  email_enabled: boolean
  event_ticket_confirmation: boolean
  event_reminders: boolean
  community_comments: boolean
  community_reactions: boolean
  community_mentions: boolean
  system_updates: boolean
  security_alerts: boolean
}

export type NotificationPreferencesUpdate = Partial<NotificationPreferences>

const BASE_PATH = '/api/notifications/preferences'

export const getNotificationPreferences = () =>
  apiClient.get<NotificationPreferences>(BASE_PATH)

export const updateNotificationPreferences = (payload: NotificationPreferencesUpdate) =>
  apiClient.put<NotificationPreferences>(BASE_PATH, payload)
