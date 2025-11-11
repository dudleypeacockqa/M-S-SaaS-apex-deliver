import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YouTubeStatusBadge } from './YouTubeStatusBadge'

describe('YouTubeStatusBadge', () => {
  it('renders "Not published" badge with correct styling', () => {
    render(<YouTubeStatusBadge status="not_published" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Not published')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-700')
  })

  it('renders "Uploading…" badge with correct styling', () => {
    render(<YouTubeStatusBadge status="uploading" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveTextContent('Uploading…')
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('renders "Processing…" badge with correct styling', () => {
    render(<YouTubeStatusBadge status="processing" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveTextContent('Processing…')
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-700')
  })

  it('renders "Published" badge with correct styling', () => {
    render(<YouTubeStatusBadge status="published" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveTextContent('Published')
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-700')
  })

  it('renders "Failed" badge with correct styling', () => {
    render(<YouTubeStatusBadge status="failed" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveTextContent('Failed')
    expect(badge).toHaveClass('bg-red-100', 'text-red-700')
  })

  it('applies common badge styling to all statuses', () => {
    const statuses: Array<'not_published' | 'uploading' | 'processing' | 'published' | 'failed'> = [
      'not_published',
      'uploading',
      'processing',
      'published',
      'failed',
    ]

    statuses.forEach((status) => {
      const { unmount } = render(<YouTubeStatusBadge status={status} />)

      const badge = screen.getByTestId('youtube-status-badge')
      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'px-3', 'py-1', 'text-xs', 'font-medium', 'capitalize')

      unmount()
    })
  })

  it('renders as a span element', () => {
    render(<YouTubeStatusBadge status="published" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge.tagName).toBe('SPAN')
  })

  it('has data-testid attribute for testing', () => {
    render(<YouTubeStatusBadge status="published" />)

    expect(screen.getByTestId('youtube-status-badge')).toBeInTheDocument()
  })

  it('renders correct label for each status', () => {
    const statusLabels: Array<[string, string]> = [
      ['not_published', 'Not published'],
      ['uploading', 'Uploading…'],
      ['processing', 'Processing…'],
      ['published', 'Published'],
      ['failed', 'Failed'],
    ]

    statusLabels.forEach(([status, label]) => {
      const { unmount } = render(<YouTubeStatusBadge status={status as any} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })

  it('renders with correct color scheme for not_published status', () => {
    render(<YouTubeStatusBadge status="not_published" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveClass('bg-gray-100')
    expect(badge).toHaveClass('text-gray-700')
  })

  it('renders with correct color scheme for uploading status', () => {
    render(<YouTubeStatusBadge status="uploading" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveClass('bg-blue-100')
    expect(badge).toHaveClass('text-blue-700')
  })

  it('renders with correct color scheme for processing status', () => {
    render(<YouTubeStatusBadge status="processing" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveClass('bg-amber-100')
    expect(badge).toHaveClass('text-amber-700')
  })

  it('renders with correct color scheme for published status', () => {
    render(<YouTubeStatusBadge status="published" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveClass('bg-emerald-100')
    expect(badge).toHaveClass('text-emerald-700')
  })

  it('renders with correct color scheme for failed status', () => {
    render(<YouTubeStatusBadge status="failed" />)

    const badge = screen.getByTestId('youtube-status-badge')
    expect(badge).toHaveClass('bg-red-100')
    expect(badge).toHaveClass('text-red-700')
  })

  it('matches snapshot for not_published status', () => {
    const { container } = render(<YouTubeStatusBadge status="not_published" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for uploading status', () => {
    const { container } = render(<YouTubeStatusBadge status="uploading" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for processing status', () => {
    const { container } = render(<YouTubeStatusBadge status="processing" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for published status', () => {
    const { container } = render(<YouTubeStatusBadge status="published" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot for failed status', () => {
    const { container } = render(<YouTubeStatusBadge status="failed" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
