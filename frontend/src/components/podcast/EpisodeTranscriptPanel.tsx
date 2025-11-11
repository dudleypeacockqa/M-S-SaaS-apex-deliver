import React from 'react'

interface EpisodeTranscriptPanelProps {
  episodeId: string
  transcript: string | null
  transcriptLanguage?: string | null
  isTranscribing: boolean
  onTranscribe: () => void
  successMessage?: string | null
}

export const EpisodeTranscriptPanel: React.FC<EpisodeTranscriptPanelProps> = ({
  episodeId,
  transcript,
  transcriptLanguage,
  isTranscribing,
  onTranscribe,
  successMessage,
}) => {
  if (transcript === null) {
    return (
      <div className="flex flex-col gap-2 items-start">
        <button
          type="button"
          onClick={onTranscribe}
          disabled={isTranscribing}
          className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isTranscribing ? 'Transcribing…' : 'Transcribe audio'}
        </button>
        {successMessage ? (
          <p className="text-xs text-emerald-600" role="status">
            {successMessage}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 max-w-md" data-testid="transcript-ready-panel">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Transcript ready</span>
        {transcriptLanguage ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {transcriptLanguage.toUpperCase()}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-gray-700 line-clamp-2">{transcript}</p>
      <div className="flex gap-2">
        <a
          href={`/api/podcasts/episodes/${episodeId}/transcript`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
        >
          Download transcript (TXT)
        </a>
        <a
          href={`/api/podcasts/episodes/${episodeId}/transcript.srt`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:text-indigo-800 underline"
        >
          Download transcript (SRT)
        </a>
      </div>
      <button
        type="button"
        onClick={onTranscribe}
        disabled={isTranscribing}
        className="text-xs text-indigo-600 hover:text-indigo-800 underline text-left"
      >
        {isTranscribing ? 'Regenerating…' : 'Regenerate Transcript'}
      </button>
      {successMessage ? (
        <p className="text-xs text-emerald-600" role="status">
          {successMessage}
        </p>
      ) : null}
    </div>
  )
}
