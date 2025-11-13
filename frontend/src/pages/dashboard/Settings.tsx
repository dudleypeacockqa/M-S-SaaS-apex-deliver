import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotificationPreferences, updateNotificationPreferences, type NotificationPreferences } from '../../services/api/notifications'

export const DashboardSettings: React.FC = () => (
  <section data-testid="dashboard-settings" style={{ display: 'grid', gap: '1.5rem' }}>
    <header>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Workspace Settings</h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Configure notifications, integrations, and security defaults for your team.
      </p>
    </header>

    <NotificationPreferencesPanel />
  </section>
)

const NotificationPreferencesPanel = () => {
  const queryClient = useQueryClient()
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences,
  })

  const mutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (updated) => {
      queryClient.setQueryData(['notification-preferences'], updated)
    },
  })

  const handleToggle = (field: keyof NotificationPreferences) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked
    mutation.mutate({ [field]: value })
  }

  return (
    <article
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
        maxWidth: '720px',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Notification Preferences</h2>
      {isLoading && <p style={{ color: '#94a3b8', marginTop: '0.75rem' }}>Loading preferences…</p>}
      {isError && (
        <p style={{ color: '#dc2626', marginTop: '0.75rem' }}>
          {error instanceof Error ? error.message : 'Failed to load preferences.'}
        </p>
      )}
      {data && (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          <PreferenceGroup
            title="Email"
            description="Control whether you receive email notifications from ApexDeliver."
            options={[
              {
                label: 'Enable all email notifications',
                field: 'email_enabled',
              },
            ]}
            preferences={data}
            onToggle={handleToggle}
            disabled={mutation.isPending}
          />
          <PreferenceGroup
            title="Events"
            description="Manage ticket confirmations and reminder emails."
            options={[
              { label: 'Ticket confirmations', field: 'event_ticket_confirmation' },
              { label: 'Event reminders', field: 'event_reminders' },
            ]}
            preferences={data}
            onToggle={handleToggle}
            disabled={mutation.isPending || !data.email_enabled}
          />
          <PreferenceGroup
            title="Community"
            description="Stay informed about comments, reactions, and mentions."
            options={[
              { label: 'Comments on my posts', field: 'community_comments' },
              { label: 'Reactions to my posts', field: 'community_reactions' },
              { label: 'Mentions', field: 'community_mentions' },
            ]}
            preferences={data}
            onToggle={handleToggle}
            disabled={mutation.isPending || !data.email_enabled}
          />
          <PreferenceGroup
            title="System"
            description="Security alerts and platform updates."
            options={[
              { label: 'Product updates', field: 'system_updates' },
              { label: 'Security alerts', field: 'security_alerts' },
            ]}
            preferences={data}
            onToggle={handleToggle}
            disabled={mutation.isPending || !data.email_enabled}
          />
        </div>
      )}
    </article>
  )
}

type PreferenceProps = {
  title: string
  description: string
  options: Array<{ label: string; field: keyof NotificationPreferences }>
  preferences: NotificationPreferences
  disabled: boolean
  onToggle: (field: keyof NotificationPreferences) => (event: React.ChangeEvent<HTMLInputElement>) => void
}

const PreferenceGroup: React.FC<PreferenceProps> = ({ title, description, options, preferences, onToggle, disabled }) => (
  <section>
    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
    <p style={{ color: '#64748b', margin: '0.25rem 0 0.75rem' }}>{description}</p>
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      {options.map((option) => (
        <label key={option.field} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
          <input
            type="checkbox"
            checked={preferences[option.field]}
            onChange={onToggle(option.field)}
            disabled={disabled || (!preferences.email_enabled && option.field !== 'email_enabled')}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </section>
)
