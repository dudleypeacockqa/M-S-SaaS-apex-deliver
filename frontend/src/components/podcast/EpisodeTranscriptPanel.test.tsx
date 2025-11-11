import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { EpisodeTranscriptPanel } from './EpisodeTranscriptPanel'

describe('EpisodeTranscriptPanel', () => {
  it('renders transcribe button when no transcript exists', async () => {
    const user = userEvent.setup()
    const handleTranscribe = vi.fn()

    render(
      <EpisodeTranscriptPanel
        episodeId="ep-1"
        transcript={null}
        isTranscribing={false}
        onTranscribe={handleTranscribe}
        successMessage="Transcript requested"
      />
    )

    const button = screen.getByRole('button', { name: /transcribe audio/i })
    await user.click(button)
    expect(handleTranscribe).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent(/transcript requested/i)
  })

  it('shows transcript metadata, download links, and regenerate action', async () => {
    const user = userEvent.setup()
    const handleTranscribe = vi.fn()

    render(
      <EpisodeTranscriptPanel
        episodeId="ep-42"
        transcript="Existing transcript"
        transcriptLanguage="en"
        isTranscribing={false}
        onTranscribe={handleTranscribe}
      />
    )

    expect(screen.getByText(/transcript ready/i)).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText(/existing transcript/i)).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /download transcript \(txt\)/i })).toHaveAttribute(
      'href',
      '/api/podcasts/episodes/ep-42/transcript'
    )
    expect(screen.getByRole('link', { name: /download transcript \(srt\)/i })).toHaveAttribute(
      'href',
      '/api/podcasts/episodes/ep-42/transcript.srt'
    )

    const regenerate = screen.getByRole('button', { name: /regenerate transcript/i })
    await user.click(regenerate)
    expect(handleTranscribe).toHaveBeenCalledTimes(1)
  })
})
