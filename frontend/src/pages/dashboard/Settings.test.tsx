import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { DashboardSettings } from './Settings'
import * as notificationsApi from '../../services/api/notifications'

vi.mock('../../services/api/notifications')

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderSettings = () => {
  const queryClient = createQueryClient()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <DashboardSettings />
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('DashboardSettings notification preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state while fetching preferences', () => {
    vi.mocked(notificationsApi.getNotificationPreferences).mockImplementation(
      () => new Promise(() => {})
    )

    renderSettings()

    expect(screen.getByText(/Loading preferences/i)).toBeInTheDocument()
  })

  it('renders toggles from API data', async () => {
    vi.mocked(notificationsApi.getNotificationPreferences).mockResolvedValue({
      email_enabled: true,
      event_ticket_confirmation: true,
      event_reminders: true,
      community_comments: true,
      community_reactions: false,
      community_mentions: true,
      system_updates: true,
      security_alerts: true,
    })

    renderSettings()

    expect(await screen.findByLabelText(/Enable all email notifications/i)).toBeChecked()
    expect(screen.getByLabelText(/Reactions to my posts/i)).not.toBeChecked()
  })

  it('updates preference when a toggle is changed', async () => {
    vi.mocked(notificationsApi.getNotificationPreferences).mockResolvedValue({
      email_enabled: true,
      event_ticket_confirmation: true,
      event_reminders: true,
      community_comments: true,
      community_reactions: true,
      community_mentions: true,
      system_updates: true,
      security_alerts: true,
    })
    vi.mocked(notificationsApi.updateNotificationPreferences).mockResolvedValue({
      email_enabled: true,
      event_ticket_confirmation: false,
      event_reminders: true,
      community_comments: true,
      community_reactions: true,
      community_mentions: true,
      system_updates: true,
      security_alerts: true,
    })

    const user = userEvent.setup()
    renderSettings()

    const ticketToggle = await screen.findByLabelText(/Ticket confirmations/i)
    await user.click(ticketToggle)

    await waitFor(() => {
      const call = vi.mocked(notificationsApi.updateNotificationPreferences).mock.calls[0]?.[0]
      expect(call).toEqual({ event_ticket_confirmation: false })
    })
  })
})
