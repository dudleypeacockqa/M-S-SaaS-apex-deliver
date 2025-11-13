import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPost from './BlogPost'
import React from 'react'

vi.mock('@/components/marketing/MarketingLayout', () => ({
  MarketingLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marketing-layout">{children}</div>
  ),
}))

describe('BlogPost page', () => {
  it('links related articles using their slug', () => {
    render(<BlogPost />)

    const link = screen.getByRole('link', { name: /CapLiquify Optimizes Capital Structure/i })
    expect(link).toHaveAttribute('href', '/blog/capital-structure-optimization')
  })
})
