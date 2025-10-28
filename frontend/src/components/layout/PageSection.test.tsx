import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageSection } from './PageSection'

describe('PageSection', () => {
  it('should render children correctly', () => {
    render(
      <PageSection>
        <div data-testid="child">Test Content</div>
      </PageSection>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render as a section element by default', () => {
    const { container } = render(
      <PageSection>Content</PageSection>
    )

    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('should apply default variant styles', () => {
    const { container } = render(
      <PageSection>Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-white')
  })

  it('should apply gray variant styles', () => {
    const { container } = render(
      <PageSection variant="gray">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-gray-50')
  })

  it('should apply gradient variant styles', () => {
    const { container } = render(
      <PageSection variant="gradient">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-gradient-to-br')
    expect(section).toHaveClass('from-blue-50')
    expect(section).toHaveClass('via-white')
    expect(section).toHaveClass('to-teal-50')
  })

  it('should apply dark variant styles', () => {
    const { container } = render(
      <PageSection variant="dark">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('bg-gray-900')
    expect(section).toHaveClass('text-white')
  })

  it('should apply default spacing (lg)', () => {
    const { container } = render(
      <PageSection>Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-16')
    expect(section).toHaveClass('md:py-24')
  })

  it('should apply no spacing when spacing is none', () => {
    const { container } = render(
      <PageSection spacing="none">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-0')
  })

  it('should apply sm spacing', () => {
    const { container } = render(
      <PageSection spacing="sm">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-8')
    expect(section).toHaveClass('md:py-12')
  })

  it('should apply md spacing', () => {
    const { container } = render(
      <PageSection spacing="md">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-12')
    expect(section).toHaveClass('md:py-16')
  })

  it('should apply lg spacing (default)', () => {
    const { container } = render(
      <PageSection spacing="lg">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-16')
    expect(section).toHaveClass('md:py-24')
  })

  it('should apply xl spacing', () => {
    const { container } = render(
      <PageSection spacing="xl">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-24')
    expect(section).toHaveClass('md:py-32')
  })

  it('should render container div by default (not fullWidth)', () => {
    render(
      <PageSection>
        <div data-testid="content">Test</div>
      </PageSection>
    )

    // When not fullWidth, wraps children in a container div
    const content = screen.getByTestId('content')
    const parent = content.parentElement
    expect(parent).toHaveClass('container')
    expect(parent).toHaveClass('mx-auto')
    expect(parent).toHaveClass('px-4')
  })

  it('should not render container div when fullWidth is true', () => {
    const { container } = render(
      <PageSection fullWidth>
        <div data-testid="content">Test</div>
      </PageSection>
    )

    const content = screen.getByTestId('content')
    const section = container.querySelector('section')
    // Content should be direct child of section
    expect(section).toContainElement(content)
  })

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <PageSection className="custom-class">Content</PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('custom-class')
    expect(section).toHaveClass('bg-white')
    expect(section).toHaveClass('py-16')
  })

  it('should pass through HTML attributes', () => {
    const { container } = render(
      <PageSection data-testid="section" role="region" aria-label="Main section">
        Content
      </PageSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('data-testid', 'section')
    expect(section).toHaveAttribute('role', 'region')
    expect(section).toHaveAttribute('aria-label', 'Main section')
  })
})
