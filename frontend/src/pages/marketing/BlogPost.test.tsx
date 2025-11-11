import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BlogPost from './BlogPost'
import React from 'react'

vi.mock('@/components/MarketingNav', () => ({ default: () => <div data-testid="marketing-nav" /> }))
vi.mock('@/components/MarketingFooter', () => ({ default: () => <div data-testid="marketing-footer" /> }))

describe('BlogPost page', () => {
  it('links related articles using their slug', () => {
    render(<BlogPost />)

    const link = screen.getByRole('link', { name: /CapLiquify Optimizes Capital Structure/i })
    expect(link).toHaveAttribute('href', '/blog/capital-structure-optimization')
  })
})
