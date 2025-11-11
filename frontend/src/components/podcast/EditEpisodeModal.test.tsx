import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditEpisodeModal } from './EditEpisodeModal'
import type { PodcastEpisode } from '../../services/api/podcasts'

describe('EditEpisodeModal', () => {
  const mockEpisode: PodcastEpisode = {
    id: 'episode-1',
    title: 'M&A Trends in Tech',
    description: 'Discussion of M&A trends in technology sector',
    show_notes: 'Key takeaways from the episode',
    episode_number: 5,
    season_number: 2,
    audio_file_url: 'https://example.com/audio.mp3',
    video_file_url: 'https://example.com/video.mp4',
    thumbnail_url: 'https://example.com/thumb.jpg',
    status: 'draft',
    created_by: 'user-1',
    organization_id: 'org-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T12:00:00Z',
    published_at: null,
    transcript: null,
    transcript_language: null,
    duration_seconds: 3600,
    youtube_video_id: null,
  }

  const mockCallbacks = {
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when episode is null', () => {
    const { container } = render(
      <EditEpisodeModal
        episode={null}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders modal with dialog role and aria-modal', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders modal heading', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByRole('heading', { name: /edit episode/i, level: 2 })).toBeInTheDocument()
  })

  it('pre-populates form with episode data', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('M&A Trends in Tech')
    expect(screen.getByLabelText(/description/i)).toHaveValue('Discussion of M&A trends in technology sector')
    expect(screen.getByLabelText(/show notes/i)).toHaveValue('Key takeaways from the episode')
    expect(screen.getByLabelText(/status/i)).toHaveValue('draft')
  })

  it('renders title input as required', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    expect(titleInput).toBeRequired()
  })

  it('renders all status options', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByRole('option', { name: 'Draft' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Published' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Archived' })).toBeInTheDocument()
  })

  it('displays episode info in read-only section', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    // Check for season and episode info using text content match
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Season: 2 Episode: 5'
    })).toBeInTheDocument()

    expect(screen.getByText('https://example.com/audio.mp3')).toBeInTheDocument()
  })

  it('displays video URL when available', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByText(/Video URL:/i)).toBeInTheDocument()
    expect(screen.getByText('https://example.com/video.mp4')).toBeInTheDocument()
  })

  it('does not display video URL when not available', () => {
    const episodeWithoutVideo = { ...mockEpisode, video_file_url: null }

    render(
      <EditEpisodeModal
        episode={episodeWithoutVideo}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.queryByText(/Video URL:/i)).not.toBeInTheDocument()
  })

  it('updates title field when user types', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'New Episode Title')

    expect(titleInput).toHaveValue('New Episode Title')
  })

  it('updates description field when user types', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'New description')

    expect(descriptionInput).toHaveValue('New description')
  })

  it('updates show notes field when user types', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const showNotesInput = screen.getByLabelText(/show notes/i)
    await user.clear(showNotesInput)
    await user.type(showNotesInput, 'New show notes')

    expect(showNotesInput).toHaveValue('New show notes')
  })

  it('updates status field when user selects different option', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const statusSelect = screen.getByLabelText(/status/i)
    await user.selectOptions(statusSelect, 'published')

    expect(statusSelect).toHaveValue('published')
  })

  it('calls onClose when Cancel button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSubmit with updated data when form submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: 'Discussion of M&A trends in technology sector',
      show_notes: 'Key takeaways from the episode',
      status: 'draft',
    })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('does not call onSubmit when title is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows error message when title is empty', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    // Wait for error to appear
    const errorMessage = await screen.findByText('Title is required')
    expect(errorMessage).toBeInTheDocument()
  })

  it('does not call onSubmit when title is only whitespace', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={onSubmit}
        isSubmitting={false}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)
    await user.type(titleInput, '   ')

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })

  it('disables buttons when isSubmitting is true', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={true}
      />
    )

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })

  it('shows "Saving..." text when isSubmitting is true', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={true}
      />
    )

    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()
  })

  it('handles episode with null description and show_notes', () => {
    const episodeWithNullFields = {
      ...mockEpisode,
      description: null,
      show_notes: null,
    }

    render(
      <EditEpisodeModal
        episode={episodeWithNullFields}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(screen.getByLabelText(/show notes/i)).toHaveValue('')
  })

  it('converts empty description and show_notes to undefined in onSubmit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    const episodeWithNullFields = {
      ...mockEpisode,
      description: null,
      show_notes: null,
    }

    render(
      <EditEpisodeModal
        episode={episodeWithNullFields}
        onClose={mockCallbacks.onClose}
        onSubmit={onSubmit}
        isSubmitting={false}
      />
    )

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'M&A Trends in Tech',
      description: undefined,
      show_notes: undefined,
      status: 'draft',
    })
  })

  it('clears error message when form is resubmitted', async () => {
    const user = userEvent.setup()

    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    // First submission with empty title
    const titleInput = screen.getByLabelText(/title/i)
    await user.clear(titleInput)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)

    expect(screen.getByText('Title is required')).toBeInTheDocument()

    // Second submission with valid title
    await user.type(titleInput, 'Valid Title')
    await user.click(saveButton)

    expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
  })

  it('resets form data when episode changes', () => {
    const { rerender } = render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('M&A Trends in Tech')

    const newEpisode: PodcastEpisode = {
      ...mockEpisode,
      id: 'episode-2',
      title: 'New Episode Title',
      description: 'New description',
    }

    rerender(
      <EditEpisodeModal
        episode={newEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    expect(screen.getByLabelText(/title/i)).toHaveValue('New Episode Title')
    expect(screen.getByLabelText(/description/i)).toHaveValue('New description')
  })

  it('renders audio URL as a link', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const audioLink = screen.getByRole('link', { name: 'https://example.com/audio.mp3' })
    expect(audioLink).toHaveAttribute('href', 'https://example.com/audio.mp3')
    expect(audioLink).toHaveAttribute('target', '_blank')
    expect(audioLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders video URL as a link when available', () => {
    render(
      <EditEpisodeModal
        episode={mockEpisode}
        onClose={mockCallbacks.onClose}
        onSubmit={mockCallbacks.onSubmit}
        isSubmitting={false}
      />
    )

    const videoLink = screen.getByRole('link', { name: 'https://example.com/video.mp4' })
    expect(videoLink).toHaveAttribute('href', 'https://example.com/video.mp4')
    expect(videoLink).toHaveAttribute('target', '_blank')
    expect(videoLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
