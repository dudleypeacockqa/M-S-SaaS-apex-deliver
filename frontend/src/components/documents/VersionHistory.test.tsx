import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VersionHistory } from './VersionHistory'
import type { DocumentVersionSummary } from '../../services/api/documentGeneration'

describe('VersionHistory', () => {
  const mockVersions: DocumentVersionSummary[] = [
    {
      id: 'version-1',
      label: 'Version 1.3',
      created_at: '2024-01-15T10:30:00Z',
      created_by: 'John Smith',
      summary: 'Added financial projections and risk analysis',
    },
    {
      id: 'version-2',
      label: 'Version 1.2',
      created_at: '2024-01-14T14:20:00Z',
      created_by: 'Jane Doe',
      summary: 'Updated executive summary',
    },
    {
      id: 'version-3',
      label: 'Version 1.1',
      created_at: '2024-01-13T09:00:00Z',
      // No created_by or summary to test conditional rendering
    },
  ]

  const mockOnRestore = vi.fn()

  it('renders loading state with skeleton loaders', () => {
    render(<VersionHistory versions={[]} loading={true} onRestore={mockOnRestore} />)

    const loadingSection = screen.getByLabelText('Version history')
    expect(loadingSection).toBeInTheDocument()

    // Find the loading div with aria-busy
    const loadingDiv = loadingSection.querySelector('[aria-busy="true"]')
    expect(loadingDiv).toBeInTheDocument()

    // Should have 3 skeleton loaders
    const skeletons = loadingSection.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(3)
  })

  it('renders empty state when no versions available', () => {
    render(<VersionHistory versions={[]} onRestore={mockOnRestore} />)

    expect(screen.getByText(/new documents do not have a change history yet/i)).toBeInTheDocument()
    expect(screen.getByText(/keep editing to create checkpoints/i)).toBeInTheDocument()
  })

  it('renders section header and description', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByRole('heading', { name: /history/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/roll back to a previous snapshot/i)).toBeInTheDocument()
  })

  it('renders all versions with labels', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByText('Version 1.3')).toBeInTheDocument()
    expect(screen.getByText('Version 1.2')).toBeInTheDocument()
    expect(screen.getByText('Version 1.1')).toBeInTheDocument()
  })

  it('formats created_at dates correctly', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    const expectedDate1 = new Date('2024-01-15T10:30:00Z').toLocaleString()
    const expectedDate2 = new Date('2024-01-14T14:20:00Z').toLocaleString()
    const expectedDate3 = new Date('2024-01-13T09:00:00Z').toLocaleString()

    expect(screen.getByText(new RegExp(expectedDate1))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(expectedDate2))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(expectedDate3))).toBeInTheDocument()
  })

  it('renders created_by when provided', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByText(/John Smith/)).toBeInTheDocument()
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
  })

  it('renders "Unknown author" when created_by is not provided', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByText(/Unknown author/)).toBeInTheDocument()
  })

  it('renders summary when provided', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByText('Added financial projections and risk analysis')).toBeInTheDocument()
    expect(screen.getByText('Updated executive summary')).toBeInTheDocument()
  })

  it('does not render summary when not provided', () => {
    const versionsWithoutSummary: DocumentVersionSummary[] = [
      {
        id: 'version-4',
        label: 'Version 1.0',
        created_at: '2024-01-10T08:00:00Z',
      },
    ]

    const { container } = render(
      <VersionHistory versions={versionsWithoutSummary} onRestore={mockOnRestore} />
    )

    const summaryElements = container.querySelectorAll('p.mt-1.text-xs.text-slate-500')
    expect(summaryElements).toHaveLength(0)
  })

  it('renders restore button for each version', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByRole('button', { name: 'Restore version Version 1.3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restore version Version 1.2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restore version Version 1.1' })).toBeInTheDocument()
  })

  it('calls onRestore with correct version ID when button clicked', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()

    render(<VersionHistory versions={mockVersions} onRestore={onRestore} />)

    const restoreButton = screen.getByRole('button', { name: 'Restore version Version 1.2' })
    await user.click(restoreButton)

    expect(onRestore).toHaveBeenCalledWith('version-2')
    expect(onRestore).toHaveBeenCalledTimes(1)
  })

  it('renders versions as a list with proper ARIA role', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })

  it('renders section with proper ARIA label', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    expect(screen.getByLabelText('Version history')).toBeInTheDocument()
  })

  it('defaults loading prop to false when not provided', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    // Should not show loading state
    expect(screen.queryByLabelText('Version history')).not.toHaveAttribute('aria-busy')
    expect(screen.getByText('Version 1.3')).toBeInTheDocument()
  })

  it('handles version with empty string for created_by', () => {
    const versionWithEmptyAuthor: DocumentVersionSummary[] = [
      {
        id: 'version-5',
        label: 'Version 1.0',
        created_at: '2024-01-10T08:00:00Z',
        created_by: '',
      },
    ]

    render(<VersionHistory versions={versionWithEmptyAuthor} onRestore={mockOnRestore} />)

    expect(screen.getByText(/Unknown author/)).toBeInTheDocument()
  })

  it('handles version with empty string for summary', () => {
    const versionWithEmptySummary: DocumentVersionSummary[] = [
      {
        id: 'version-6',
        label: 'Version 1.0',
        created_at: '2024-01-10T08:00:00Z',
        summary: '',
      },
    ]

    const { container } = render(
      <VersionHistory versions={versionWithEmptySummary} onRestore={mockOnRestore} />
    )

    // Empty string summary should not be rendered
    const summaryElements = container.querySelectorAll('p.mt-1.text-xs.text-slate-500')
    expect(summaryElements).toHaveLength(0)
  })

  it('renders versions in the order provided', () => {
    render(<VersionHistory versions={mockVersions} onRestore={mockOnRestore} />)

    // Get all version text elements (not including button text)
    const versionHeadings = screen.getAllByText(/^Version \d\.\d$/)
    expect(versionHeadings[0]).toHaveTextContent('Version 1.3')
    expect(versionHeadings[1]).toHaveTextContent('Version 1.2')
    expect(versionHeadings[2]).toHaveTextContent('Version 1.1')
  })

  it('applies correct styling to restore buttons', () => {
    render(<VersionHistory versions={[mockVersions[0]]} onRestore={mockOnRestore} />)

    const restoreButton = screen.getByRole('button', { name: 'Restore version Version 1.3' })
    expect(restoreButton).toHaveClass('border-indigo-500', 'text-indigo-600', 'hover:bg-indigo-50')
  })

  it('handles versions array with single item', () => {
    render(<VersionHistory versions={[mockVersions[0]]} onRestore={mockOnRestore} />)

    expect(screen.getByText('Version 1.3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restore version Version 1.3' })).toBeInTheDocument()

    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(1)
  })
})
