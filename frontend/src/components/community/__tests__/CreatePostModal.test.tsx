import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePostModal } from '../CreatePostModal'

describe('CreatePostModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal when open', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    expect(screen.getByText(/create post/i)).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    render(<CreatePostModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    expect(screen.queryByText(/create post/i)).not.toBeInTheDocument()
  })

  it('should render all form fields', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onSubmit with form data when submitted', async () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    // Fill in form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Post Title' },
    })
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test post content' },
    })
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: 'deals' },
    })
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'test,demo' },
    })

    // Submit
    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'Test post content',
        category: 'deals',
        tags: 'test,demo',
        status: 'published',
      })
    })
  })

  it('should not submit with empty title', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    // Leave title empty, fill content
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Test content' },
    })

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /create/i })
    expect(submitButton).toBeDisabled()
  })

  it('should not submit with empty content', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    // Fill title, leave content empty
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' },
    })

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /create/i })
    expect(submitButton).toBeDisabled()
  })

  it('should have default category of general', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement
    expect(categorySelect.value).toBe('general')
  })

  it('should have all category options', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    const categorySelect = screen.getByLabelText(/category/i)
    const options = categorySelect.querySelectorAll('option')

    expect(options).toHaveLength(5)
    expect(options[0].textContent).toContain('General')
    expect(options[1].textContent).toContain('Deals')
    expect(options[2].textContent).toContain('Insights')
    expect(options[3].textContent).toContain('Q&A')
    expect(options[4].textContent).toContain('Networking')
  })

  it('should reset form after successful submit', async () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    // Fill in form
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement
    const contentTextarea = screen.getByLabelText(/content/i) as HTMLTextAreaElement

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(contentTextarea, { target: { value: 'Test content' } })

    // Submit
    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(titleInput.value).toBe('')
      expect(contentTextarea.value).toBe('')
    })
  })

  it('should close modal on backdrop click', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    const backdrop = screen.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display character count for content', () => {
    render(<CreatePostModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />)

    const contentTextarea = screen.getByLabelText(/content/i)
    fireEvent.change(contentTextarea, { target: { value: 'Test' } })

    expect(screen.getByText(/4 characters/i)).toBeInTheDocument()
  })
})
