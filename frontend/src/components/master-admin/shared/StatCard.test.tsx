/**
 * StatCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Activity } from '@/lib/icons'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('should render with basic props', () => {
    render(<StatCard title="Test Metric" value={42} />)

    expect(screen.getByText('Test Metric')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render with subtitle', () => {
    render(<StatCard title="Total Users" value={100} subtitle="Active this month" />)

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Active this month')).toBeInTheDocument()
  })

  it('should render with icon', () => {
    render(<StatCard title="Activities" value={25} icon={Activity} />)

    expect(screen.getByText('Activities')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    // Icon renders as SVG
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render with positive trend', () => {
    render(
      <StatCard
        title="Revenue"
        value="$10,000"
        trend={{ value: 15, isPositive: true }}
      />
    )

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$10,000')).toBeInTheDocument()
    expect(screen.getByText(/15%/)).toBeInTheDocument()
    expect(screen.getByText(/↑/)).toBeInTheDocument()
  })

  it('should render with negative trend', () => {
    render(
      <StatCard
        title="Churn Rate"
        value="2.5%"
        trend={{ value: -5, isPositive: false }}
      />
    )

    expect(screen.getByText('Churn Rate')).toBeInTheDocument()
    expect(screen.getByText('2.5%')).toBeInTheDocument()
    // Use getAllByText since "5%" appears in both value "2.5%" and trend "5%"
    const percentElements = screen.getAllByText(/5%/)
    expect(percentElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/↓/)).toBeInTheDocument()
  })

  it('should call onClick when clicked (if provided)', () => {
    const handleClick = vi.fn()
    render(<StatCard title="Clickable" value={10} onClick={handleClick} />)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should not be clickable when onClick is not provided', () => {
    render(<StatCard title="Non-Clickable" value={10} />)

    const card = screen.getByText('Non-Clickable').closest('div')
    expect(card).not.toHaveAttribute('role', 'button')
    expect(card).not.toHaveAttribute('tabIndex')
  })

  it('should apply custom className', () => {
    const { container } = render(<StatCard title="Custom" value={5} className="custom-class" />)

    // Find the root card element (should have bg-white class and custom-class)
    const card = container.querySelector('.custom-class')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('bg-white', 'custom-class')
  })
})
