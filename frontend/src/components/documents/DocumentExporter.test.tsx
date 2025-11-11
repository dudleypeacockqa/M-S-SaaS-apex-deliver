import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DocumentExporter } from './DocumentExporter'

describe('DocumentExporter', () => {
  const mockOnExport = vi.fn()

  it('renders section header and description', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    expect(screen.getByRole('heading', { name: /export/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/choose the format and presentation options/i)).toBeInTheDocument()
  })

  it('renders export format select with all format options', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const formatSelect = screen.getByLabelText(/export format/i)
    expect(formatSelect).toBeInTheDocument()

    expect(screen.getByRole('option', { name: 'PDF' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Word (.docx)' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'HTML' })).toBeInTheDocument()
  })

  it('defaults to PDF format', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const formatSelect = screen.getByLabelText(/export format/i) as HTMLSelectElement
    expect(formatSelect.value).toBe('application/pdf')
  })

  it('uses defaultFormat prop when provided', () => {
    render(
      <DocumentExporter
        onExport={mockOnExport}
        defaultFormat="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
    )

    const formatSelect = screen.getByLabelText(/export format/i) as HTMLSelectElement
    expect(formatSelect.value).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  })

  it('changes format when user selects different option', async () => {
    const user = userEvent.setup()

    render(<DocumentExporter onExport={mockOnExport} />)

    const formatSelect = screen.getByLabelText(/export format/i)
    await user.selectOptions(formatSelect, 'text/html')

    expect((formatSelect as HTMLSelectElement).value).toBe('text/html')
  })

  it('renders margin input with default value of 15', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const marginInput = screen.getByLabelText(/margin \(mm\)/i) as HTMLInputElement
    expect(marginInput).toBeInTheDocument()
    expect(marginInput.type).toBe('number')
    expect(marginInput.value).toBe('15')
    expect(marginInput.min).toBe('5')
    expect(marginInput.max).toBe('50')
    expect(marginInput.step).toBe('1')
  })

  it('updates margin value when user changes input', async () => {
    const user = userEvent.setup()

    render(<DocumentExporter onExport={mockOnExport} />)

    const marginInput = screen.getByLabelText(/margin \(mm\)/i)
    await user.clear(marginInput)
    await user.type(marginInput, '25')

    expect((marginInput as HTMLInputElement).value).toBe('25')
  })

  it('renders font family select with all font options', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const fontSelect = screen.getByLabelText(/font family/i)
    expect(fontSelect).toBeInTheDocument()

    expect(screen.getByRole('option', { name: 'Inter' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Georgia' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Times New Roman' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Helvetica' })).toBeInTheDocument()
  })

  it('defaults to Inter font', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const fontSelect = screen.getByLabelText(/font family/i) as HTMLSelectElement
    expect(fontSelect.value).toBe('Inter')
  })

  it('changes font when user selects different option', async () => {
    const user = userEvent.setup()

    render(<DocumentExporter onExport={mockOnExport} />)

    const fontSelect = screen.getByLabelText(/font family/i)
    await user.selectOptions(fontSelect, 'Georgia')

    expect((fontSelect as HTMLSelectElement).value).toBe('Georgia')
  })

  it('renders cover page checkbox checked by default', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const checkbox = screen.getByLabelText(/include branded cover page/i) as HTMLInputElement
    expect(checkbox).toBeInTheDocument()
    expect(checkbox.type).toBe('checkbox')
    expect(checkbox.checked).toBe(true)
  })

  it('toggles cover page checkbox when clicked', async () => {
    const user = userEvent.setup()

    render(<DocumentExporter onExport={mockOnExport} />)

    const checkbox = screen.getByLabelText(/include branded cover page/i) as HTMLInputElement
    expect(checkbox.checked).toBe(true)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(false)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('renders submit button with default text', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const submitButton = screen.getByRole('button', { name: /download document/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('shows exporting text when exporting prop is true', () => {
    render(<DocumentExporter onExport={mockOnExport} exporting={true} />)

    expect(screen.getByRole('button', { name: /preparing export/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /download document/i })).not.toBeInTheDocument()
  })

  it('disables submit button when exporting', () => {
    render(<DocumentExporter onExport={mockOnExport} exporting={true} />)

    const submitButton = screen.getByRole('button', { name: /preparing export/i })
    expect(submitButton).toBeDisabled()
  })

  it('calls onExport with correct options when form submitted', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()

    render(<DocumentExporter onExport={onExport} />)

    const submitButton = screen.getByRole('button', { name: /download document/i })
    await user.click(submitButton)

    expect(onExport).toHaveBeenCalledWith({
      format: 'application/pdf',
      margin: 15,
      fontFamily: 'Inter',
      includeCoverPage: true,
    })
    expect(onExport).toHaveBeenCalledTimes(1)
  })

  it('calls onExport with customized options', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()

    render(<DocumentExporter onExport={onExport} />)

    // Change format
    const formatSelect = screen.getByLabelText(/export format/i)
    await user.selectOptions(formatSelect, 'text/html')

    // Change margin
    const marginInput = screen.getByLabelText(/margin \(mm\)/i)
    await user.clear(marginInput)
    await user.type(marginInput, '30')

    // Change font
    const fontSelect = screen.getByLabelText(/font family/i)
    await user.selectOptions(fontSelect, 'Georgia')

    // Uncheck cover page
    const checkbox = screen.getByLabelText(/include branded cover page/i)
    await user.click(checkbox)

    // Submit
    const submitButton = screen.getByRole('button', { name: /download document/i })
    await user.click(submitButton)

    expect(onExport).toHaveBeenCalledWith({
      format: 'text/html',
      margin: 30,
      fontFamily: 'Georgia',
      includeCoverPage: false,
    })
  })

  it('prevents default form submission behavior', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()

    const { container } = render(<DocumentExporter onExport={onExport} />)
    const form = container.querySelector('form')!

    const submitHandler = vi.fn((e) => e.preventDefault())
    form.addEventListener('submit', submitHandler)

    const submitButton = screen.getByRole('button', { name: /download document/i })
    await user.click(submitButton)

    expect(submitHandler).toHaveBeenCalled()
  })

  it('renders section with proper ARIA label', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    expect(screen.getByLabelText(/export document/i)).toBeInTheDocument()
  })

  it('defaults exporting prop to false when not provided', () => {
    render(<DocumentExporter onExport={mockOnExport} />)

    const submitButton = screen.getByRole('button', { name: /download document/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('handles margin input with zero value', async () => {
    const user = userEvent.setup()

    render(<DocumentExporter onExport={mockOnExport} />)

    const marginInput = screen.getByLabelText(/margin \(mm\)/i)
    await user.clear(marginInput)
    await user.type(marginInput, '0')

    expect((marginInput as HTMLInputElement).value).toBe('0')
  })

  it('handles margin input with non-numeric value', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()

    render(<DocumentExporter onExport={onExport} />)

    const marginInput = screen.getByLabelText(/margin \(mm\)/i) as HTMLInputElement
    // Type a non-numeric value
    await user.clear(marginInput)
    await user.type(marginInput, 'abc')

    const submitButton = screen.getByRole('button', { name: /download document/i })
    await user.click(submitButton)

    // Should convert NaN to 0
    expect(onExport).toHaveBeenCalledWith({
      format: 'application/pdf',
      margin: 0,
      fontFamily: 'Inter',
      includeCoverPage: true,
    })
  })

  it('renders form with proper structure', () => {
    const { container } = render(<DocumentExporter onExport={mockOnExport} />)

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('space-y-3')
  })
})
