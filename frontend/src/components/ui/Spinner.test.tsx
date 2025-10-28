import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('should render SVG element', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should have animation class', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })

  it('should have default size classes', () => {
    const { container } = render(<Spinner />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-5')
    expect(svg).toHaveClass('w-5')
  })

  it('should apply custom className', () => {
    const { container } = render(<Spinner className="text-blue-500" />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-blue-500')
    expect(svg).toHaveClass('animate-spin')
  })

  it('should merge custom className with default classes', () => {
    const { container } = render(<Spinner className="h-8 w-8 text-red-500" />)
    
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
    expect(svg).toHaveClass('h-8')
    expect(svg).toHaveClass('w-8')
    expect(svg).toHaveClass('text-red-500')
  })

  it('should render circle and path elements', () => {
    const { container } = render(<Spinner />)
    
    const circle = container.querySelector('circle')
    const path = container.querySelector('path')
    
    expect(circle).toBeInTheDocument()
    expect(path).toBeInTheDocument()
  })
})
