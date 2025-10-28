import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentContainer } from './ContentContainer'

describe('ContentContainer', () => {
  it('should render children correctly', () => {
    render(
      <ContentContainer>
        <div data-testid="child">Test Content</div>
      </ContentContainer>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply default maxWidth of xl', () => {
    const { container } = render(
      <ContentContainer>Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('max-w-screen-xl')
  })

  it('should apply custom maxWidth when provided', () => {
    const { container } = render(
      <ContentContainer maxWidth="sm">Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('max-w-screen-sm')
  })

  it('should apply all maxWidth variants correctly', () => {
    const variants: Array<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'> = ['sm', 'md', 'lg', 'xl', '2xl', 'full']

    variants.forEach((maxWidth) => {
      const { container } = render(
        <ContentContainer maxWidth={maxWidth}>Content</ContentContainer>
      )

      const div = container.firstChild as HTMLElement
      const expectedClass = maxWidth === 'full' ? 'max-w-full' : `max-w-screen-${maxWidth}`
      expect(div).toHaveClass(expectedClass)
    })
  })

  it('should apply centered styles by default', () => {
    const { container } = render(
      <ContentContainer>Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('mx-auto')
  })

  it('should not apply centered styles when centered is false', () => {
    const { container } = render(
      <ContentContainer centered={false}>Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).not.toHaveClass('mx-auto')
  })

  it('should apply padding styles by default', () => {
    const { container } = render(
      <ContentContainer>Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('px-4')
    expect(div).toHaveClass('md:px-6')
    expect(div).toHaveClass('lg:px-8')
  })

  it('should not apply padding styles when padding is false', () => {
    const { container } = render(
      <ContentContainer padding={false}>Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).not.toHaveClass('px-4')
    expect(div).not.toHaveClass('md:px-6')
    expect(div).not.toHaveClass('lg:px-8')
  })

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <ContentContainer className="custom-class">Content</ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('custom-class')
    expect(div).toHaveClass('max-w-screen-xl')
    expect(div).toHaveClass('mx-auto')
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <ContentContainer data-testid="container" role="region" aria-label="Main content">
        Content
      </ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveAttribute('data-testid', 'container')
    expect(div).toHaveAttribute('role', 'region')
    expect(div).toHaveAttribute('aria-label', 'Main content')
  })

  it('should handle all combinations of props', () => {
    const { container } = render(
      <ContentContainer
        maxWidth="lg"
        padding={false}
        centered={false}
        className="test-class"
      >
        Content
      </ContentContainer>
    )

    const div = container.firstChild as HTMLElement
    expect(div).toHaveClass('max-w-screen-lg')
    expect(div).toHaveClass('test-class')
    expect(div).not.toHaveClass('mx-auto')
    expect(div).not.toHaveClass('px-4')
  })
})
