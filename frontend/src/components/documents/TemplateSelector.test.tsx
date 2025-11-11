import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TemplateSelector } from './TemplateSelector'
import type { DocumentTemplate } from '../../services/api/documentGeneration'

describe('TemplateSelector', () => {
  const mockTemplates: DocumentTemplate[] = [
    {
      id: 'template-1',
      name: 'NDA Template',
      category: 'Legal',
      description: 'Standard Non-Disclosure Agreement for M&A transactions',
      estimated_length: '5 pages',
      last_updated: '2024-01-15',
      industries: ['Technology', 'Finance'],
      tags: ['confidentiality', 'legal'],
      sample_excerpt: 'This Agreement is entered into as of...',
    },
    {
      id: 'template-2',
      name: 'LOI Template',
      category: 'Deal',
      description: 'Letter of Intent template',
      estimated_length: '3 pages',
      last_updated: '2024-02-20',
      industries: ['Manufacturing'],
      tags: ['deal', 'proposal'],
      sample_excerpt: 'This Letter of Intent outlines...',
    },
    {
      id: 'template-3',
      name: 'Due Diligence Checklist',
      // No optional fields to test conditional rendering
    },
  ]

  const mockOnUseTemplate = vi.fn()

  it('renders loading state with skeleton loaders', () => {
    render(
      <TemplateSelector
        templates={[]}
        loading={true}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    const loadingSection = screen.getByRole('region', { name: /document templates loading/i })
    expect(loadingSection).toBeInTheDocument()
    expect(loadingSection).toHaveAttribute('aria-busy', 'true')

    // Should have 3 skeleton loaders
    const skeletons = loadingSection.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(3)
  })

  it('renders empty state when no templates available', () => {
    render(
      <TemplateSelector
        templates={[]}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    expect(screen.getByTestId('template-empty-state')).toBeInTheDocument()
    expect(screen.getByText(/no templates available yet/i)).toBeInTheDocument()
  })

  it('renders list of templates with all details', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Header
    expect(screen.getByRole('heading', { name: /templates/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/start from a curated blueprint/i)).toBeInTheDocument()

    // Template 1 - NDA (all fields)
    expect(screen.getByText('NDA Template')).toBeInTheDocument()
    expect(screen.getByText('Legal')).toBeInTheDocument()
    expect(screen.getByText('Standard Non-Disclosure Agreement for M&A transactions')).toBeInTheDocument()
    expect(screen.getByText('5 pages')).toBeInTheDocument()
    expect(screen.getByText('Technology, Finance')).toBeInTheDocument()
    expect(screen.getByText('confidentiality, legal')).toBeInTheDocument()
    expect(screen.getByText(/This Agreement is entered into as of.../i)).toBeInTheDocument()

    // Template 2 - LOI
    expect(screen.getByText('LOI Template')).toBeInTheDocument()
    expect(screen.getByText('Deal')).toBeInTheDocument()

    // Template 3 - Due Diligence (no optional fields)
    expect(screen.getByText('Due Diligence Checklist')).toBeInTheDocument()
  })

  it('formats last_updated date correctly', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Should format date using toLocaleDateString
    const expectedDate = new Date('2024-01-15').toLocaleDateString()
    expect(screen.getByText(expectedDate)).toBeInTheDocument()
  })

  it('renders "Use template" button for each template', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    const buttons = screen.getAllByRole('button', { name: /use template/i })
    expect(buttons).toHaveLength(3)

    expect(screen.getByRole('button', { name: 'Use template NDA Template' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use template LOI Template' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use template Due Diligence Checklist' })).toBeInTheDocument()
  })

  it('calls onUseTemplate with correct template ID when button clicked', async () => {
    const user = userEvent.setup()

    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    const ndaButton = screen.getByRole('button', { name: 'Use template NDA Template' })
    await user.click(ndaButton)

    expect(mockOnUseTemplate).toHaveBeenCalledWith('template-1')
    expect(mockOnUseTemplate).toHaveBeenCalledTimes(1)
  })

  it('highlights selected template with special styling', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedTemplateId="template-2"
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Selected template should show "In use" badge
    expect(screen.getByText('In use')).toBeInTheDocument()

    // Should apply indigo border styling to selected template
    const loiTemplateCard = screen.getByText('LOI Template').closest('li')
    expect(loiTemplateCard).toHaveClass('border-indigo-500', 'bg-indigo-50')
  })

  it('does not show "In use" badge for non-selected templates', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedTemplateId="template-1"
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Should have exactly 1 "In use" badge (for template-1)
    const inUseBadges = screen.queryAllByText('In use')
    expect(inUseBadges).toHaveLength(1)
  })

  it('does not crash when selectedTemplateId is null', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        selectedTemplateId={null}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Should render all templates without "In use" badge
    expect(screen.getByText('NDA Template')).toBeInTheDocument()
    expect(screen.queryByText('In use')).not.toBeInTheDocument()
  })

  it('renders template without optional fields gracefully', () => {
    const minimalTemplate: DocumentTemplate = {
      id: 'minimal',
      name: 'Minimal Template',
    }

    render(
      <TemplateSelector
        templates={[minimalTemplate]}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Should render name and button
    expect(screen.getByText('Minimal Template')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Use template Minimal Template' })).toBeInTheDocument()

    // Should NOT render optional fields
    expect(screen.queryByText(/length/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/updated/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/industries/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/tags/i)).not.toBeInTheDocument()
  })

  it('handles empty arrays for industries and tags gracefully', () => {
    const templateWithEmptyArrays: DocumentTemplate = {
      id: 'empty-arrays',
      name: 'Empty Arrays Template',
      industries: [],
      tags: [],
    }

    render(
      <TemplateSelector
        templates={[templateWithEmptyArrays]}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    // Should NOT render industries/tags sections when arrays are empty
    expect(screen.queryByText(/industries/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/tags/i)).not.toBeInTheDocument()
  })

  it('applies hover styles to use template button', () => {
    render(
      <TemplateSelector
        templates={[mockTemplates[0]]}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    const button = screen.getByRole('button', { name: 'Use template NDA Template' })
    expect(button).toHaveClass('hover:bg-indigo-50', 'border-indigo-500', 'text-indigo-600')
  })

  it('renders templates as a list with proper ARIA role', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })

  it('renders section with proper ARIA label', () => {
    render(
      <TemplateSelector
        templates={mockTemplates}
        onUseTemplate={mockOnUseTemplate}
      />
    )

    expect(screen.getByRole('region', { name: /document templates/i })).toBeInTheDocument()
  })
})
