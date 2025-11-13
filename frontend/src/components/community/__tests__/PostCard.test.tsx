import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PostCard } from '../PostCard'
import type { Post } from '../../../services/api/community'

describe('PostCard', () => {
  const mockPost: Post = {
    id: 'post-123',
    organization_id: 'org-456',
    author_user_id: 'user-789',
    title: 'Test Post Title',
    content: 'This is the content of the test post. It contains some information about M&A.',
    category: 'deals',
    tags: 'test,demo',
    status: 'published',
    view_count: 42,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    comment_count: 5,
    reaction_counts: {
      like: 10,
      love: 3,
      insightful: 7,
      celebrate: 2,
    },
  }

  it('should render post title', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('should render post content', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText(/This is the content of the test post/)).toBeInTheDocument()
  })

  it('should display all reaction types with counts', () => {
    render(<PostCard post={mockPost} />)

    // Check that reactions are displayed
    expect(screen.getByText('10')).toBeInTheDocument() // like count
    expect(screen.getByText('3')).toBeInTheDocument() // love count
    expect(screen.getByText('7')).toBeInTheDocument() // insightful count
    expect(screen.getByText('2')).toBeInTheDocument() // celebrate count
  })

  it('should display comment count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText(/5/)).toBeInTheDocument() // comment count
  })

  it('should display view count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText(/42/)).toBeInTheDocument() // view count
  })

  it('should display formatted timestamp', () => {
    render(<PostCard post={mockPost} />)
    // Should display relative time like "2h ago" or absolute date
    const timeElement = screen.getByTestId('post-timestamp')
    expect(timeElement).toBeInTheDocument()
  })

  it('should call onReaction when reaction button is clicked', () => {
    const onReaction = vi.fn()
    render(<PostCard post={mockPost} onReaction={onReaction} />)

    const likeButton = screen.getByRole('button', { name: /like/i })
    fireEvent.click(likeButton)

    expect(onReaction).toHaveBeenCalledWith('like', mockPost.id)
  })

  it('should call onComment when comment button is clicked', () => {
    const onComment = vi.fn()
    render(<PostCard post={mockPost} onComment={onComment} />)

    const commentButton = screen.getByRole('button', { name: /comment/i })
    fireEvent.click(commentButton)

    expect(onComment).toHaveBeenCalledWith(mockPost.id)
  })

  it('should show edit button for own posts', () => {
    const currentUserId = 'user-789'
    const onEdit = vi.fn()
    render(<PostCard post={mockPost} currentUserId={currentUserId} onEdit={onEdit} />)

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })

  it('should show delete button for own posts', () => {
    const currentUserId = 'user-789'
    const onDelete = vi.fn()
    render(<PostCard post={mockPost} currentUserId={currentUserId} onDelete={onDelete} />)

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should not show edit/delete buttons for other users posts', () => {
    const currentUserId = 'different-user-123'
    render(<PostCard post={mockPost} currentUserId={currentUserId} />)

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    const currentUserId = 'user-789'
    render(<PostCard post={mockPost} currentUserId={currentUserId} onEdit={onEdit} />)

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledWith(mockPost.id)
  })

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const currentUserId = 'user-789'
    render(<PostCard post={mockPost} currentUserId={currentUserId} onDelete={onDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(mockPost.id)
  })

  it('should display category badge', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Deals')).toBeInTheDocument()
  })

  it('should handle posts with no reactions', () => {
    const postWithNoReactions = { ...mockPost, reaction_counts: {} }
    render(<PostCard post={postWithNoReactions} />)

    // Should render without errors
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('should handle posts with no comments', () => {
    const postWithNoComments = { ...mockPost, comment_count: 0 }
    render(<PostCard post={postWithNoComments} />)

    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('should truncate long content with "Read more" link', () => {
    const longContent = 'A'.repeat(500)
    const postWithLongContent = { ...mockPost, content: longContent }
    render(<PostCard post={postWithLongContent} />)

    // Should show truncated content
    const content = screen.getByTestId('post-content')
    expect(content.textContent?.length).toBeLessThan(longContent.length)

    // Should show "Read more" button
    expect(screen.getByRole('button', { name: /read more/i })).toBeInTheDocument()
  })

  it('should expand content when "Read more" is clicked', () => {
    const longContent = 'A'.repeat(500)
    const postWithLongContent = { ...mockPost, content: longContent }
    render(<PostCard post={postWithLongContent} />)

    const readMoreButton = screen.getByRole('button', { name: /read more/i })
    fireEvent.click(readMoreButton)

    // Should show full content
    const content = screen.getByTestId('post-content')
    expect(content.textContent).toContain(longContent)
  })
})
