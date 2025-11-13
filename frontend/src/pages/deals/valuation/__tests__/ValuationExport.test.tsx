/**
 * Valuation Export Template Picker Tests
 * TDD: RED → GREEN → REFACTOR
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ValuationExportPicker } from '../components/ValuationExportPicker'

describe('ValuationExportPicker', () => {
  const mockTemplates = [
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level valuation overview',
      preview: 'Includes DCF, Comparables, and Precedent transaction summaries',
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive valuation report',
      preview: 'Full financial models, sensitivity analysis, and assumptions',
    },
    {
      id: 'presentation',
      name: 'Investor Presentation',
      description: 'Slide-ready format',
      preview: 'Formatted for board presentations and investor meetings',
    },
  ]

  it('should render export template options', () => {
    const onSelect = vi.fn()
    render(<ValuationExportPicker templates={mockTemplates} onSelect={onSelect} />)

    expect(screen.getByText('Executive Summary')).toBeInTheDocument()
    expect(screen.getByText('Detailed Analysis')).toBeInTheDocument()
    expect(screen.getByText('Investor Presentation')).toBeInTheDocument()
  })

  it('should show template preview on selection', async () => {
    const onSelect = vi.fn()
    render(<ValuationExportPicker templates={mockTemplates} onSelect={onSelect} />)

    const summaryOption = screen.getByText('Executive Summary').closest('button')
    if (summaryOption) {
      fireEvent.click(summaryOption)
    }

    await waitFor(() => {
      expect(screen.getByText(/Includes DCF, Comparables, and Precedent transaction summaries/)).toBeInTheDocument()
    })
  })

  it('should call onSelect when template is confirmed', async () => {
    const onSelect = vi.fn()
    render(<ValuationExportPicker templates={mockTemplates} onSelect={onSelect} />)

    const summaryOption = screen.getByText('Executive Summary').closest('button')
    if (summaryOption) {
      fireEvent.click(summaryOption)
    }

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText('Use This Template')).toBeInTheDocument()
    })

    const confirmButton = screen.getByText('Use This Template')
    fireEvent.click(confirmButton)

    // onSelect is called with (templateId, format)
    expect(onSelect).toHaveBeenCalledWith('summary', 'pdf')
  })

  it('should allow format selection (PDF/DOCX)', () => {
    const onSelect = vi.fn()
    render(<ValuationExportPicker templates={mockTemplates} onSelect={onSelect} />)

    const formatSelect = screen.getByLabelText(/Export format/i)
    expect(formatSelect).toBeInTheDocument()

    fireEvent.change(formatSelect, { target: { value: 'docx' } })
    expect(formatSelect).toHaveValue('docx')
  })
})

