import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelpTooltip } from './HelpTooltip'

describe('HelpTooltip', () => {
  it('renders accessible trigger and hides content by default', () => {
    render(<HelpTooltip content="Filter tasks by assignee" />)
    const button = screen.getByRole('button', { name: /help/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByText('Filter tasks by assignee')).not.toBeVisible()
  })

  it('reveals tooltip content on hover and focus', async () => {
    const user = userEvent.setup()
    render(<HelpTooltip content="Filter tasks by assignee" />)
    const button = screen.getByRole('button', { name: /help/i })

    await user.hover(button)
    expect(screen.getByText('Filter tasks by assignee')).toBeVisible()

    await user.unhover(button)
    await waitFor(() => expect(screen.getByText('Filter tasks by assignee')).not.toBeVisible())

    await act(async () => {
      button.focus()
    })
    await waitFor(() => expect(screen.getByText('Filter tasks by assignee')).toBeVisible())
  })
})
