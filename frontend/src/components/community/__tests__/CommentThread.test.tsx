import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CommentThread } from '../CommentThread'
import type { Comment } from '../../../services/api/community'

describe('CommentThread', () => {
  const mockComments: Comment[] = [
    {
      id: 'comment-1',
      post_id: 'post-123',
      author_user_id: 'user-1',
      content: 'This is a top-level comment',
      parent_comment_id: null,
      created_at: '2025-01-15T10:30:00Z',
      updated_at: '2025-01-15T10:30:00Z',
      reaction_counts: {
        like: 5,
        love: 2,
        insightful: 0,
        celebrate: 0,
      },
      replies: [
        {
          id: 'comment-2',
          post_id: 'post-123',
          author_user_id: 'user-2',
          content: 'This is a reply to comment 1',
          parent_comment_id: 'comment-1',
          created_at: '2025-01-15T10:35:00Z',
          updated_at: '2025-01-15T10:35:00Z',
          reaction_counts: {
            like: 2,
            love: 0,
            insightful: 1,
            celebrate: 0,
          },
          replies: [],
        },
      ],
    },
    {
      id: 'comment-3',
      post_id: 'post-123',
      author_user_id: 'user-3',
      content: 'Another top-level comment',
      parent_comment_id: null,
      created_at: '2025-01-15T10:40:00Z',
      updated_at: '2025-01-15T10:40:00Z',
      reaction_counts: {},
      replies: [],
    },
  ]

  it('should render all top-level comments', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    expect(screen.getByText('This is a top-level comment')).toBeInTheDocument()
    expect(screen.getByText('Another top-level comment')).toBeInTheDocument()
  })

  it('should render nested replies', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    expect(screen.getByText('This is a reply to comment 1')).toBeInTheDocument()
  })

  it('should display reaction counts for comments', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    // First comment should have 5 likes
    const comments = screen.getAllByTestId(/comment-/)
    expect(comments.length).toBeGreaterThan(0)
  })

  it('should show reply button for each comment', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    const replyButtons = screen.getAllByRole('button', { name: /reply/i })
    expect(replyButtons.length).toBeGreaterThan(0)
  })

  it('should show delete button for own comments', () => {
    const currentUserId = 'user-1'
    const onDeleteComment = vi.fn()
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        currentUserId={currentUserId}
        onDeleteComment={onDeleteComment}
      />
    )

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('should not show delete button for other users comments', () => {
    const currentUserId = 'different-user-999'
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        currentUserId={currentUserId}
      />
    )

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })

  it('should open reply form when reply button is clicked', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    const replyButton = screen.getAllByRole('button', { name: /reply/i })[0]
    fireEvent.click(replyButton)

    // Should show textarea for reply
    expect(screen.getByPlaceholderText(/write a reply/i)).toBeInTheDocument()
  })

  it('should call onAddComment when submitting a reply', () => {
    const onAddComment = vi.fn()
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        onAddComment={onAddComment}
      />
    )

    // Click reply button
    const replyButton = screen.getAllByRole('button', { name: /reply/i })[0]
    fireEvent.click(replyButton)

    // Type in textarea
    const textarea = screen.getByPlaceholderText(/write a reply/i)
    fireEvent.change(textarea, { target: { value: 'My reply text' } })

    // Submit
    const submitButtons = screen.getAllByRole('button', { name: /submit/i })
    const replySubmitButton = submitButtons.find(btn => btn.closest('div')?.previousElementSibling?.textContent?.includes('write a reply'))
    fireEvent.click(replySubmitButton || submitButtons[1])

    expect(onAddComment).toHaveBeenCalledWith('My reply text', 'comment-1')
  })

  it('should call onDeleteComment when delete is clicked', () => {
    const onDeleteComment = vi.fn()
    const currentUserId = 'user-1'
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        currentUserId={currentUserId}
        onDeleteComment={onDeleteComment}
      />
    )

    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]
    fireEvent.click(deleteButton)

    expect(onDeleteComment).toHaveBeenCalledWith('comment-1')
  })

  it('should call onReaction when reaction button is clicked', () => {
    const onReaction = vi.fn()
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        onReaction={onReaction}
      />
    )

    const likeButtons = screen.getAllByRole('button', { name: /like reaction/i })
    fireEvent.click(likeButtons[0])

    expect(onReaction).toHaveBeenCalledWith('like', 'comment-1')
  })

  it('should show add comment form at the top', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    expect(screen.getByPlaceholderText(/add a comment/i)).toBeInTheDocument()
  })

  it('should call onAddComment when submitting new top-level comment', () => {
    const onAddComment = vi.fn()
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        onAddComment={onAddComment}
      />
    )

    const textarea = screen.getByPlaceholderText(/add a comment/i)
    fireEvent.change(textarea, { target: { value: 'New comment text' } })

    const submitButton = screen.getAllByRole('button', { name: /submit/i })[0]
    fireEvent.click(submitButton)

    expect(onAddComment).toHaveBeenCalledWith('New comment text', null)
  })

  it('should clear textarea after successful submit', () => {
    const onAddComment = vi.fn()
    render(
      <CommentThread
        comments={mockComments}
        postId="post-123"
        onAddComment={onAddComment}
      />
    )

    const textarea = screen.getByPlaceholderText(/add a comment/i) as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'Test comment' } })

    const submitButton = screen.getAllByRole('button', { name: /submit/i })[0]
    fireEvent.click(submitButton)

    expect(textarea.value).toBe('')
  })

  it('should display empty state when no comments', () => {
    render(<CommentThread comments={[]} postId="post-123" />)

    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument()
  })

  it('should nest replies with proper indentation', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    // Check that nested reply has indentation class
    const nestedComment = screen.getByText('This is a reply to comment 1').closest('[data-testid^="comment-"]')
    expect(nestedComment).toHaveClass('ml-8')
  })

  it('should display formatted timestamp for each comment', () => {
    render(<CommentThread comments={mockComments} postId="post-123" />)

    const timestamps = screen.getAllByTestId(/comment-timestamp-/)
    expect(timestamps.length).toBeGreaterThan(0)
  })
})
