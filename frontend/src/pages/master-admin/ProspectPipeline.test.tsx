import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as ReactRouterDom from 'react-router-dom'

import { renderWithQueryClient } from '../../setupTests'
import { ProspectPipeline } from './ProspectPipeline'

const mockNavigate = vi.fn()
vi.mock('@/components/master-admin/prospects', () => {
  const React = require('react')
  const sampleProspect = {
    id: 1,
    name: 'Acme Corp',
    status: 'qualified',
  }

  const ProspectKanban = ({ onAddProspect, onProspectClick }: any) => (
    <div data-testid="kanban-view">
      <button onClick={() => onAddProspect?.('qualified')} data-testid="kanban-add">
        Column Add
      </button>
      <button onClick={() => onProspectClick?.(sampleProspect)} data-testid="kanban-view-prospect">
        View Prospect
      </button>
    </div>
  )

  const ProspectList = () => <div data-testid="list-view">ProspectList</div>

  const ProspectForm = ({ prospect, onSuccess, onCancel }: any) => (
    <div data-testid="prospect-form">
      <span data-testid="initial-status">{prospect?.status ?? 'none'}</span>
      <button data-testid="prospect-form-success" onClick={() => onSuccess?.()}>
        Save
      </button>
      <button data-testid="prospect-form-cancel" onClick={() => onCancel?.()}>
        Cancel
      </button>
    </div>
  )

  const ProspectDetailModal = ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="prospect-detail-modal">
        Detail Modal
        <button data-testid="close-detail" onClick={() => onClose?.()}>
          Close
        </button>
      </div>
    ) : null

  return {
    ProspectKanban,
    ProspectList,
    ProspectForm,
    ProspectDetailModal,
  }
})

const renderPage = () => {
  const user = userEvent.setup()
  const utils = renderWithQueryClient(
    <ReactRouterDom.MemoryRouter>
      <ProspectPipeline />
    </ReactRouterDom.MemoryRouter>,
  )
  return { user, ...utils }
}

describe('ProspectPipeline page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    mockNavigate.mockReset()
    vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(mockNavigate)
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders default kanban view and toggles to list', async () => {
    const { user } = renderPage()

    expect(screen.getByTestId('kanban-view')).toBeInTheDocument()
    expect(screen.queryByTestId('list-view')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /list/i }))
    expect(screen.getByTestId('list-view')).toBeInTheDocument()
  })

  it('navigates back to dashboard', async () => {
    const { user } = renderPage()
    await user.click(screen.getByRole('button', { name: /back to dashboard/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/master-admin')
  })

  it('opens add prospect modal from header button and closes via cancel', async () => {
    const { user } = renderPage()

    await user.click(screen.getByRole('button', { name: /add prospect/i }))
    expect(screen.getByTestId('prospect-form')).toBeInTheDocument()
    expect(screen.getByTestId('initial-status')).toHaveTextContent('none')

    await user.click(screen.getByTestId('prospect-form-cancel'))
    expect(screen.queryByTestId('prospect-form')).not.toBeInTheDocument()
  })

  it('prefills initial status when kanban column add is used', async () => {
    const { user } = renderPage()
    await user.click(screen.getByTestId('kanban-add'))

    expect(screen.getByTestId('initial-status')).toHaveTextContent('qualified')
  })

  it('opens and closes prospect detail modal when a card is clicked', async () => {
    const { user } = renderPage()

    await user.click(screen.getByTestId('kanban-view-prospect'))
    expect(screen.getByTestId('prospect-detail-modal')).toBeInTheDocument()

    await user.click(screen.getByTestId('close-detail'))
    expect(screen.queryByTestId('prospect-detail-modal')).not.toBeInTheDocument()
  })
})
