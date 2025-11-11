import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AISuggestionPanel } from './AISuggestionPanel'
import type { AISuggestion } from '../../services/api/documentGeneration'

describe('AISuggestionPanel', () => {
  const mockSuggestions: AISuggestion[] = [
    {
      id: 'suggestion-1',
      title: 'Add Financial Metrics',
      content: 'Include projected revenue growth and EBITDA margins in section 3.',
      confidence: 0.87,
      reasoning: 'Deal documents typically require financial projections for investor confidence.',
    },
    {
      id: 'suggestion-2',
      title: 'Clarify Timeline',
      content: 'Specify the expected closing date for the transaction.',
      confidence: 0.92,
    },
    {
      id: 'suggestion-3',
      title: 'Legal Compliance',
      content: 'Add anti-trust compliance section.',
      // No confidence or reasoning to test conditional rendering
    },
  ]

  const mockCallbacks = {
    onContextChange: vi.fn(),
    onAccept: vi.fn(),
    onReject: vi.fn(),
    onRegenerate: vi.fn(),
  }

  it('renders loading state with skeleton loaders', () => {
    render(
      <AISuggestionPanel
        suggestions={[]}
        loading={true}
        context=""
        {...mockCallbacks}
      />
    )

    const loadingSection = screen.getByLabelText('AI assistance')
    expect(loadingSection).toBeInTheDocument()

    // Find the loading div with aria-busy
    const loadingDiv = loadingSection.querySelector('[aria-busy="true"]')
    expect(loadingDiv).toBeInTheDocument()

    // Should have 3 skeleton loaders
    const skeletons = loadingSection.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(3)
  })

  it('renders empty state when no suggestions available', () => {
    render(
      <AISuggestionPanel
        suggestions={[]}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText(/draft looks polished/i)).toBeInTheDocument()
    expect(screen.getByText(/provide more context to see targeted recommendations/i)).toBeInTheDocument()
  })

  it('renders section header and description', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByRole('heading', { name: /AI Suggestions/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/analyses your draft and flags sections/i)).toBeInTheDocument()
  })

  it('renders context textarea with label', () => {
    render(
      <AISuggestionPanel
        suggestions={[]}
        context="Deal context here"
        {...mockCallbacks}
      />
    )

    const textarea = screen.getByLabelText(/AI context/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('Deal context here')
    expect(textarea).toHaveAttribute('placeholder', 'Share priorities, tone, or deal nuances to steer the AI.')
  })

  it('calls onContextChange when textarea value changes', async () => {
    const user = userEvent.setup()
    const onContextChange = vi.fn()

    render(
      <AISuggestionPanel
        suggestions={[]}
        context=""
        {...mockCallbacks}
        onContextChange={onContextChange}
      />
    )

    const textarea = screen.getByLabelText(/AI context/i)
    await user.type(textarea, 'New context')

    expect(onContextChange).toHaveBeenCalledWith('N')
    expect(onContextChange).toHaveBeenCalledWith('e')
    expect(onContextChange).toHaveBeenCalledWith('w')
  })

  it('renders regenerate button with correct label', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    const regenerateButton = screen.getByRole('button', { name: /regenerate suggestions/i })
    expect(regenerateButton).toBeInTheDocument()
    expect(regenerateButton).toHaveAttribute('aria-live', 'polite')
  })

  it('calls onRegenerate when regenerate button clicked', async () => {
    const user = userEvent.setup()
    const onRegenerate = vi.fn()

    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
        onRegenerate={onRegenerate}
      />
    )

    const regenerateButton = screen.getByRole('button', { name: /regenerate suggestions/i })
    await user.click(regenerateButton)

    expect(onRegenerate).toHaveBeenCalledTimes(1)
  })

  it('renders all suggestions with titles and content', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText('Add Financial Metrics')).toBeInTheDocument()
    expect(screen.getByText(/Include projected revenue growth/i)).toBeInTheDocument()

    expect(screen.getByText('Clarify Timeline')).toBeInTheDocument()
    expect(screen.getByText(/Specify the expected closing date/i)).toBeInTheDocument()

    expect(screen.getByText('Legal Compliance')).toBeInTheDocument()
    expect(screen.getByText(/Add anti-trust compliance section/i)).toBeInTheDocument()
  })

  it('formats confidence as percentage correctly', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText('87% confidence')).toBeInTheDocument()
    expect(screen.getByText('92% confidence')).toBeInTheDocument()
  })

  it('renders em dash for missing confidence values', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    const confidenceBadges = screen.getAllByText(/confidence/)
    const emDashBadge = confidenceBadges.find(badge => badge.textContent === '— confidence')
    expect(emDashBadge).toBeInTheDocument()
  })

  it('renders reasoning when provided', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText(/Reasoning: Deal documents typically require financial projections/i)).toBeInTheDocument()
  })

  it('does not render reasoning when not provided', () => {
    render(
      <AISuggestionPanel
        suggestions={[mockSuggestions[2]]}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.queryByText(/Reasoning:/i)).not.toBeInTheDocument()
  })

  it('renders accept button for each suggestion with proper ARIA label', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByRole('button', { name: 'Accept suggestion "Add Financial Metrics"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept suggestion "Clarify Timeline"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept suggestion "Legal Compliance"' })).toBeInTheDocument()
  })

  it('renders reject button for each suggestion with proper ARIA label', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByRole('button', { name: 'Reject suggestion "Add Financial Metrics"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject suggestion "Clarify Timeline"' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reject suggestion "Legal Compliance"' })).toBeInTheDocument()
  })

  it('calls onAccept with suggestion ID when accept button clicked', async () => {
    const user = userEvent.setup()
    const onAccept = vi.fn()

    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
        onAccept={onAccept}
      />
    )

    const acceptButton = screen.getByRole('button', { name: 'Accept suggestion "Add Financial Metrics"' })
    await user.click(acceptButton)

    expect(onAccept).toHaveBeenCalledWith('suggestion-1')
    expect(onAccept).toHaveBeenCalledTimes(1)
  })

  it('calls onReject with suggestion ID when reject button clicked', async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()

    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
        onReject={onReject}
      />
    )

    const rejectButton = screen.getByRole('button', { name: 'Reject suggestion "Clarify Timeline"' })
    await user.click(rejectButton)

    expect(onReject).toHaveBeenCalledWith('suggestion-2')
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it('renders suggestions as a list with proper ARIA role', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })

  it('renders section with proper ARIA label', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByLabelText('AI assistance')).toBeInTheDocument()
  })

  it('defaults loading to false when not provided', () => {
    render(
      <AISuggestionPanel
        suggestions={mockSuggestions}
        context=""
        {...mockCallbacks}
      />
    )

    // Should not show loading state
    expect(screen.queryByLabelText('AI assistance')).not.toHaveAttribute('aria-busy')
    expect(screen.getByText('Add Financial Metrics')).toBeInTheDocument()
  })

  it('handles undefined confidence gracefully', () => {
    const suggestionWithUndefinedConfidence: AISuggestion = {
      id: 'suggestion-4',
      title: 'Test Suggestion',
      content: 'Test content',
      confidence: undefined,
    }

    render(
      <AISuggestionPanel
        suggestions={[suggestionWithUndefinedConfidence]}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText('— confidence')).toBeInTheDocument()
  })

  it('handles null confidence gracefully', () => {
    const suggestionWithNullConfidence: AISuggestion = {
      id: 'suggestion-5',
      title: 'Test Suggestion',
      content: 'Test content',
      // @ts-expect-error Testing runtime behavior with null
      confidence: null,
    }

    render(
      <AISuggestionPanel
        suggestions={[suggestionWithNullConfidence]}
        context=""
        {...mockCallbacks}
      />
    )

    expect(screen.getByText('— confidence')).toBeInTheDocument()
  })
})
