/**
 * DealFilters Component Tests
 *
 * Tests for the deal filtering and search component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DealFilters } from './DealFilters'
import type { DealStage } from '@/services/api/deals'

describe('DealFilters', () => {
  const mockOnFilterChange = vi.fn()
  const mockOnSearchChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    onFilterChange: mockOnFilterChange,
    onSearchChange: mockOnSearchChange,
  }

  describe('Rendering', () => {
    it('should render search input', () => {
      render(<DealFilters {...defaultProps} />)

      expect(screen.getByPlaceholderText(/search deals/i)).toBeInTheDocument()
    })

    it('should render stage filter dropdown', () => {
      render(<DealFilters {...defaultProps} />)

      expect(screen.getByLabelText(/filter by stage/i)).toBeInTheDocument()
    })

    it('should render clear filters button', () => {
      render(<DealFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })

    it('should show all stage options in dropdown', () => {
      render(<DealFilters {...defaultProps} />)

      const stageSelect = screen.getByLabelText(/filter by stage/i)
      const options = stageSelect.querySelectorAll('option')

      // Should have "All Stages" + 5 pipeline stages
      expect(options.length).toBe(6)
      expect(options[0].textContent).toBe('All Stages')
      expect(options[1].textContent).toBe('Sourcing')
      expect(options[2].textContent).toBe('Evaluation')
      expect(options[3].textContent).toBe('Due Diligence')
      expect(options[4].textContent).toBe('Negotiation')
      expect(options[5].textContent).toBe('Closing')
    })
  })

  describe('Search Functionality', () => {
    it('should call onSearchChange when typing in search input', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText(/search deals/i)
      await user.type(searchInput, 'Acme')

      await waitFor(() => {
        expect(mockOnSearchChange).toHaveBeenCalledWith('Acme')
      })
    })

    it('should debounce search input (not call on every keystroke)', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText(/search deals/i)
      await user.type(searchInput, 'Test')

      // Should not call immediately for each character
      expect(mockOnSearchChange).not.toHaveBeenCalledWith('T')
      expect(mockOnSearchChange).not.toHaveBeenCalledWith('Te')
      expect(mockOnSearchChange).not.toHaveBeenCalledWith('Tes')

      // Should call once after debounce delay
      await waitFor(() => {
        expect(mockOnSearchChange).toHaveBeenCalledWith('Test')
      }, { timeout: 1000 })
    })

    it('should clear search when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      // Type in search
      const searchInput = screen.getByPlaceholderText(/search deals/i) as HTMLInputElement
      await user.type(searchInput, 'Acme')

      await waitFor(() => {
        expect(searchInput.value).toBe('Acme')
      })

      // Wait for clear button to become enabled (state update is async)
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await waitFor(() => {
        expect(clearButton).not.toBeDisabled()
      })

      // Click clear
      await user.click(clearButton)

      await waitFor(() => {
        expect(searchInput.value).toBe('')
      })
      expect(mockOnSearchChange).toHaveBeenCalledWith('')
    })
  })

  describe('Stage Filter Functionality', () => {
    it('should call onFilterChange when stage is selected', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      const stageSelect = screen.getByLabelText(/filter by stage/i)
      await user.selectOptions(stageSelect, 'evaluation')

      expect(mockOnFilterChange).toHaveBeenCalledWith({ stage: 'evaluation' })
    })

    it('should call onFilterChange with undefined when "All Stages" is selected', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      const stageSelect = screen.getByLabelText(/filter by stage/i)

      // First select a stage
      await user.selectOptions(stageSelect, 'sourcing')
      expect(mockOnFilterChange).toHaveBeenCalledWith({ stage: 'sourcing' })

      // Then select "All Stages"
      await user.selectOptions(stageSelect, '')
      expect(mockOnFilterChange).toHaveBeenCalledWith({ stage: undefined })
    })

    it('should clear stage filter when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      // Select a stage
      const stageSelect = screen.getByLabelText(/filter by stage/i) as HTMLSelectElement
      await user.selectOptions(stageSelect, 'due_diligence')

      expect(stageSelect.value).toBe('due_diligence')

      // Wait for clear button to become enabled
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await waitFor(() => {
        expect(clearButton).not.toBeDisabled()
      })

      // Click clear
      await user.click(clearButton)

      await waitFor(() => {
        expect(stageSelect.value).toBe('')
      })
      expect(mockOnFilterChange).toHaveBeenCalledWith({ stage: undefined })
    })
  })

  describe('Combined Filters', () => {
    it('should handle both search and stage filter simultaneously', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      // Set search
      const searchInput = screen.getByPlaceholderText(/search deals/i)
      await user.type(searchInput, 'Acme')

      await waitFor(() => {
        expect(mockOnSearchChange).toHaveBeenCalledWith('Acme')
      })

      // Set stage filter
      const stageSelect = screen.getByLabelText(/filter by stage/i)
      await user.selectOptions(stageSelect, 'evaluation')

      expect(mockOnFilterChange).toHaveBeenCalledWith({ stage: 'evaluation' })
    })

    it('should clear both filters when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} />)

      // Set both filters
      const searchInput = screen.getByPlaceholderText(/search deals/i)
      await user.type(searchInput, 'Test')

      const stageSelect = screen.getByLabelText(/filter by stage/i)
      await user.selectOptions(stageSelect, 'negotiation')

      // Wait for clear button to become enabled (both filters active)
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await waitFor(() => {
        expect(clearButton).not.toBeDisabled()
      })

      // Click clear
      await user.click(clearButton)

      await waitFor(() => {
        expect((searchInput as HTMLInputElement).value).toBe('')
        expect((stageSelect as HTMLSelectElement).value).toBe('')
      })
    })
  })

  describe('Active Filter Indicators', () => {
    it('should show active filter count when filters are applied', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} activeFilters={1} />)

      expect(screen.getByText('1 filter active')).toBeInTheDocument()
    })

    it('should show plural "filters" when multiple filters active', async () => {
      const user = userEvent.setup()
      render(<DealFilters {...defaultProps} activeFilters={2} />)

      expect(screen.getByText('2 filters active')).toBeInTheDocument()
    })

    it('should not show filter count when no filters active', () => {
      render(<DealFilters {...defaultProps} activeFilters={0} />)

      expect(screen.queryByText(/filter.*active/i)).not.toBeInTheDocument()
    })

    it('should disable clear button when no filters active', () => {
      render(<DealFilters {...defaultProps} activeFilters={0} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).toBeDisabled()
    })

    it('should enable clear button when filters active', () => {
      render(<DealFilters {...defaultProps} activeFilters={1} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).not.toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<DealFilters {...defaultProps} />)

      expect(screen.getByLabelText(/filter by stage/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/search deals/i)).toHaveAttribute('aria-label')
    })

    it('should have accessible button labels', () => {
      render(<DealFilters {...defaultProps} />)

      const clearButton = screen.getByRole('button', { name: /clear/i })
      expect(clearButton).toHaveAttribute('aria-label')
    })
  })

  describe('Default Values', () => {
    it('should accept and display default search value', () => {
      render(<DealFilters {...defaultProps} defaultSearch="Initial Search" />)

      const searchInput = screen.getByPlaceholderText(/search deals/i) as HTMLInputElement
      expect(searchInput.value).toBe('Initial Search')
    })

    it('should accept and display default stage filter', () => {
      render(<DealFilters {...defaultProps} defaultStage="sourcing" />)

      const stageSelect = screen.getByLabelText(/filter by stage/i) as HTMLSelectElement
      expect(stageSelect.value).toBe('sourcing')
    })
  })
})
