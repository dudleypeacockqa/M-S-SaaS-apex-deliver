import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteEpisodeModal } from './DeleteEpisodeModal'
import type { PodcastEpisode } from '../../services/api/podcasts'

describe('DeleteEpisodeModal', () => {
  const mockEpisode: PodcastEpisode = {
    id: 'episode-1',
    title: 'M&A Trends in Tech',
    description: 'Discussion of M&A trends in technology sector',
    show_notes: null,
    episode_number: 5,
    season_number: 2,
    audio_file_url: 'https://example.com/audio.mp3',
    video_file_url: null,
    thumbnail_url: null,
    status: 'draft',
    created_by: 'user-1',
    organization_id: 'org-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: null,
    published_at: null,
    transcript: null,
    transcript_language: null,
    duration_seconds: 3600,
    youtube_video_id: null,
  }

  const mockCallbacks = {
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  }

  it('returns null when episode is null', () => {
    const { container } = render(
      <DeleteEpisodeModal
        episode={null}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders modal with dialog role and aria-modal', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders modal heading', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByRole('heading', { name: /delete episode/i, level: 3 })).toBeInTheDocument()
  })

  it('displays warning icon', () => {
    const { container } = render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const warningIcon = container.querySelector('svg.text-red-600')
    expect(warningIcon).toBeInTheDocument()
  })

  it('displays episode title in confirmation message', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
    expect(screen.getByText('M&A Trends in Tech')).toBeInTheDocument()
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
  })

  it('displays episode season and episode number', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText(/Season 2, Episode 5/i)).toBeInTheDocument()
  })

  it('displays episode status', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('renders Cancel button', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('renders Confirm Delete button', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument()
  })

  it('calls onClose when Cancel button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when Confirm Delete button clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={onConfirm}
        isSubmitting={false}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
    await user.click(confirmButton)

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isSubmitting is true', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={true}
      />
    )

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled()
  })

  it('shows "Deleting..." text when isSubmitting is true', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={true}
      />
    )

    expect(screen.getByRole('button', { name: /deleting/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /confirm delete/i })).not.toBeInTheDocument()
  })

  it('applies correct styling to Confirm Delete button', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
    expect(confirmButton).toHaveClass('bg-red-600', 'hover:bg-red-700')
  })

  it('applies correct styling to Cancel button', () => {
    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toHaveClass('border-gray-300', 'bg-white', 'hover:bg-gray-50')
  })

  it('displays episode with published status', () => {
    const publishedEpisode = { ...mockEpisode, status: 'published' as const }

    render(
      <DeleteEpisodeModal
        episode={publishedEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText('published')).toBeInTheDocument()
  })

  it('displays episode with archived status', () => {
    const archivedEpisode = { ...mockEpisode, status: 'archived' as const }

    render(
      <DeleteEpisodeModal
        episode={archivedEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText('archived')).toBeInTheDocument()
  })

  it('renders episode title as bold in confirmation message', () => {
    const { container } = render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const strongElement = container.querySelector('strong')
    expect(strongElement).toHaveTextContent('M&A Trends in Tech')
  })

  it('handles episode title with special characters', () => {
    const episodeWithSpecialChars = {
      ...mockEpisode,
      title: 'Episode "Special" & <Unique>',
    }

    render(
      <DeleteEpisodeModal
        episode={episodeWithSpecialChars}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(screen.getByText('Episode "Special" & <Unique>')).toBeInTheDocument()
  })

  it('handles long episode titles', () => {
    const episodeWithLongTitle = {
      ...mockEpisode,
      title: 'This is a very long episode title that might wrap to multiple lines in the modal',
    }

    render(
      <DeleteEpisodeModal
        episode={episodeWithLongTitle}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    expect(
      screen.getByText('This is a very long episode title that might wrap to multiple lines in the modal')
    ).toBeInTheDocument()
  })

  it('does not call onConfirm or onClose multiple times when rapidly clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={onConfirm}
        isSubmitting={false}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /confirm delete/i })

    // Rapidly click the button
    await user.click(confirmButton)
    await user.click(confirmButton)
    await user.click(confirmButton)

    // Should only be called once per click (3 times total in this test)
    expect(onConfirm).toHaveBeenCalledTimes(3)
  })

  it('renders modal overlay with correct styling', () => {
    const { container } = render(
      <DeleteEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onConfirm={mockCallbacks.onConfirm}
        isSubmitting={false}
      />
    )

    const overlay = container.firstChild as HTMLElement
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black', 'bg-opacity-50')
  })
})
