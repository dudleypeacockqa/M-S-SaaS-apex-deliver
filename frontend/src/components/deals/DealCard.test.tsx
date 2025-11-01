/**
 * DealCard Component Tests
 *
 * Tests for the reusable deal card component used in lists and detail views
 * TDD: RED PHASE - Writing tests first
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DealCard } from './DealCard'
import type { Deal } from '@/services/api/deals'

describe('DealCard', () => {
  const mockDeal: Deal = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Acme Corp Acquisition',
    target_company: 'Acme Corporation',
    industry: 'Technology',
    deal_size: 5000000,
    currency: 'GBP',
    stage: 'due_diligence',
    owner_id: 'owner-123',
    organization_id: 'org-456',
    description: 'Strategic acquisition of leading tech company',
    archived_at: null,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-20T15:30:00Z',
  }

  describe('Rendering', () => {
    it('should render deal name', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.getByText('Acme Corp Acquisition')).toBeInTheDocument()
    })

    it('should render target company name', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    })

    it('should render industry badge when provided', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('should render formatted deal size when provided', () => {
      render(<DealCard deal={mockDeal} />)

      // Should format £5,000,000 correctly
      expect(screen.getByText(/£5,000,000/)).toBeInTheDocument()
    })

    it('should render deal stage badge', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.getByText(/Due Diligence/i)).toBeInTheDocument()
    })

    it('should not render industry badge when industry is null', () => {
      const dealWithoutIndustry = { ...mockDeal, industry: null }
      render(<DealCard deal={dealWithoutIndustry} />)

      expect(screen.queryByText('Technology')).not.toBeInTheDocument()
    })

    it('should not render deal size when null', () => {
      const dealWithoutSize = { ...mockDeal, deal_size: null }
      render(<DealCard deal={dealWithoutSize} />)

      expect(screen.queryByText(/£/)).not.toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should apply default variant styling', () => {
      const { container } = render(<DealCard deal={mockDeal} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('bg-white')
    })

    it('should apply compact variant when specified', () => {
      const { container } = render(<DealCard deal={mockDeal} variant="compact" />)

      const card = container.firstChild as HTMLElement
      // Compact should have reduced padding
      expect(card).toHaveClass('p-3')
    })

    it('should apply detailed variant when specified', () => {
      const { container } = render(<DealCard deal={mockDeal} variant="detailed" />)

      const card = container.firstChild as HTMLElement
      // Detailed should have more spacing
      expect(card).toHaveClass('p-6')
    })
  })

  describe('Interactive States', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<DealCard deal={mockDeal} onClick={handleClick} />)

      const card = screen.getByText('Acme Corp Acquisition').closest('div')
      await user.click(card!)

      expect(handleClick).toHaveBeenCalledWith(mockDeal.id)
    })

    it('should apply hover styles when clickable', () => {
      const handleClick = vi.fn()
      const { container } = render(<DealCard deal={mockDeal} onClick={handleClick} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('hover:shadow-md')
    })

    it('should not apply hover styles when not clickable', () => {
      const { container } = render(<DealCard deal={mockDeal} />)

      const card = container.firstChild as HTMLElement
      expect(card).not.toHaveClass('cursor-pointer')
    })

    it('should show selected state when selected prop is true', () => {
      const { container } = render(<DealCard deal={mockDeal} selected={true} />)

      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('ring-2')
      expect(card).toHaveClass('ring-blue-500')
    })
  })

  describe('Actions', () => {
    it('should render action buttons when provided', () => {
      const actions = (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )

      render(<DealCard deal={mockDeal} actions={actions} />)

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })

    it('should not render actions section when no actions provided', () => {
      render(<DealCard deal={mockDeal} />)

      // Actions should be in a specific container
      const { container } = render(<DealCard deal={mockDeal} />)
      const actionsContainer = container.querySelector('[data-testid="deal-card-actions"]')

      expect(actionsContainer).not.toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('should render description when showDescription is true', () => {
      render(<DealCard deal={mockDeal} showDescription={true} />)

      expect(screen.getByText('Strategic acquisition of leading tech company')).toBeInTheDocument()
    })

    it('should not render description by default', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.queryByText('Strategic acquisition of leading tech company')).not.toBeInTheDocument()
    })

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200)
      const dealWithLongDesc = { ...mockDeal, description: longDescription }

      render(<DealCard deal={dealWithLongDesc} showDescription={true} />)

      const descElement = screen.getByText(new RegExp(longDescription.substring(0, 20)))
      expect(descElement).toHaveClass('line-clamp-2')
    })
  })

  describe('Timestamps', () => {
    it('should render formatted created date when showTimestamps is true', () => {
      render(<DealCard deal={mockDeal} showTimestamps={true} />)

      // Should show "Created" label
      expect(screen.getByText(/Created/i)).toBeInTheDocument()
    })

    it('should render formatted updated date when showTimestamps is true', () => {
      render(<DealCard deal={mockDeal} showTimestamps={true} />)

      // Should show "Updated" label
      expect(screen.getByText(/Updated/i)).toBeInTheDocument()
    })

    it('should not render timestamps by default', () => {
      render(<DealCard deal={mockDeal} />)

      expect(screen.queryByText(/Created/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Updated/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<DealCard deal={mockDeal} />)

      const heading = screen.getByRole('heading', { name: 'Acme Corp Acquisition' })
      expect(heading.tagName).toBe('H3')
    })

    it('should have accessible click target when clickable', () => {
      const handleClick = vi.fn()
      render(<DealCard deal={mockDeal} onClick={handleClick} />)

      const card = screen.getByText('Acme Corp Acquisition').closest('div')
      expect(card).toHaveAttribute('role', 'button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('should support keyboard navigation when clickable', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<DealCard deal={mockDeal} onClick={handleClick} />)

      const card = screen.getByRole('button')
      card.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle deal with minimal data', () => {
      const minimalDeal: Deal = {
        id: '123',
        name: 'Minimal Deal',
        target_company: 'Company',
        industry: null,
        deal_size: null,
        currency: 'GBP',
        stage: 'sourcing',
        owner_id: 'owner',
        organization_id: 'org',
        description: null,
        archived_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      render(<DealCard deal={minimalDeal} />)

      expect(screen.getByText('Minimal Deal')).toBeInTheDocument()
      expect(screen.getByText('Company')).toBeInTheDocument()
    })

    it('should handle archived deal', () => {
      const archivedDeal = {
        ...mockDeal,
        archived_at: '2025-01-25T12:00:00Z',
      }

      render(<DealCard deal={archivedDeal} />)

      // Should show archived indicator
      expect(screen.getByText(/Archived/i)).toBeInTheDocument()
    })

    it('should handle very long deal name', () => {
      const longName = 'A'.repeat(100)
      const dealWithLongName = { ...mockDeal, name: longName }

      render(<DealCard deal={dealWithLongName} />)

      const heading = screen.getByRole('heading')
      expect(heading).toHaveClass('line-clamp-2')
    })
  })
})
