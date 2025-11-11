import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YouTubePublishButton } from './YouTubePublishButton'

describe('YouTubePublishButton', () => {
  const mockOnClick = vi.fn()

  it('renders button with default text', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    expect(screen.getByRole('button', { name: /publish episode/i })).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('calls onClick when button clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<YouTubePublishButton isLoading={false} onClick={onClick} />)

    const button = screen.getByRole('button', { name: /publish episode/i })
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading text when isLoading is true', () => {
    render(<YouTubePublishButton isLoading={true} onClick={mockOnClick} />)

    expect(screen.getByRole('button', { name: /publishing to youtube/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /publish episode/i })).not.toBeInTheDocument()
  })

  it('disables button when isLoading is true', () => {
    render(<YouTubePublishButton isLoading={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('disables button when disabled prop is true', () => {
    render(<YouTubePublishButton isLoading={false} disabled={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('disables button when both isLoading and disabled are true', () => {
    render(<YouTubePublishButton isLoading={true} disabled={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('does not disable button when both isLoading and disabled are false', () => {
    render(<YouTubePublishButton isLoading={false} disabled={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('defaults disabled prop to false when not provided', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<YouTubePublishButton isLoading={false} disabled={true} onClick={onClick} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<YouTubePublishButton isLoading={true} onClick={onClick} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies correct styling classes', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-md',
      'border-transparent',
      'bg-red-600',
      'px-4',
      'py-2',
      'text-sm',
      'font-semibold',
      'text-white',
      'shadow-sm',
      'hover:bg-red-700'
    )
  })

  it('applies disabled styling when disabled', () => {
    render(<YouTubePublishButton isLoading={false} disabled={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-70')
  })

  it('applies disabled styling when loading', () => {
    render(<YouTubePublishButton isLoading={true} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-70')
  })

  it('can be clicked multiple times when not disabled or loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<YouTubePublishButton isLoading={false} onClick={onClick} />)

    const button = screen.getByRole('button')
    await user.click(button)
    await user.click(button)
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('changes text based on isLoading prop', () => {
    const { rerender } = render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    expect(screen.getByText('Publish episode')).toBeInTheDocument()

    rerender(<YouTubePublishButton isLoading={true} onClick={mockOnClick} />)

    expect(screen.getByText('Publishing to YouTube…')).toBeInTheDocument()
    expect(screen.queryByText('Publish episode')).not.toBeInTheDocument()
  })

  it('toggles disabled state based on disabled prop', () => {
    const { rerender } = render(<YouTubePublishButton isLoading={false} disabled={false} onClick={mockOnClick} />)

    let button = screen.getByRole('button')
    expect(button).not.toBeDisabled()

    rerender(<YouTubePublishButton isLoading={false} disabled={true} onClick={mockOnClick} />)

    button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('has YouTube branding color (red)', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700')
  })

  it('has focus ring styling', () => {
    render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:ring-offset-2')
  })

  it('matches snapshot in default state', () => {
    const { container } = render(<YouTubePublishButton isLoading={false} onClick={mockOnClick} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot in loading state', () => {
    const { container } = render(<YouTubePublishButton isLoading={true} onClick={mockOnClick} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot in disabled state', () => {
    const { container } = render(<YouTubePublishButton isLoading={false} disabled={true} onClick={mockOnClick} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
