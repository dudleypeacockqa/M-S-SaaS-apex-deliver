/**
 * TDD Tests for TemplateManager Component
 * 
 * Tests for template management UI following TDD principles.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import TemplateManager from '../TemplateManager'

// Mock the API client
vi.mock('@/services/api/templates', () => ({
  listTemplates: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn(),
  renderTemplatePreview: vi.fn(),
}))

describe('TemplateManager', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TemplateManager />
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  it('lists templates returned from the API', async () => {
    const { listTemplates } = await import('@/services/api/templates')
    vi.mocked(listTemplates).mockResolvedValue({
      items: [
        {
          id: 10,
          organization_id: 'org-1',
          name: 'Test Template',
          type: 'email',
          subject: 'Subject',
          content: 'Body',
          variables: ['first_name', 'company'],
          is_default: false,
          created_by: 'user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      total: 1,
    })

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Test Template')).toBeInTheDocument()
      expect(screen.getByText(/first_name/)).toBeInTheDocument()
    })
  })

  it('creates a new template via the modal', async () => {
    const { listTemplates, createTemplate } = await import('@/services/api/templates')
    vi.mocked(listTemplates).mockResolvedValue({ items: [], total: 0 })
    vi.mocked(createTemplate).mockResolvedValue({
      id: 55,
      organization_id: 'org-1',
      name: 'Welcome Email',
      subject: 'Hello {{first_name}}',
      content: 'Body',
      type: 'email',
      variables: ['first_name'],
      is_default: false,
      created_by: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /create template/i }))
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Welcome Email' } })
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello {{first_name}}' } })
    fireEvent.change(screen.getByLabelText('Content *'), { target: { value: 'Body' } })
    fireEvent.click(screen.getAllByRole('button', { name: /create template/i }).at(-1)!)

    await waitFor(() => {
      expect(createTemplate).toHaveBeenCalledWith({
        name: 'Welcome Email',
        type: 'email',
        subject: 'Hello {{first_name}}',
        content: 'Body',
      })
    })
  })

  it('shows preview using the render endpoint', async () => {
    const { listTemplates, renderTemplatePreview } = await import('@/services/api/templates')
    vi.mocked(listTemplates).mockResolvedValue({
      items: [
        {
          id: 22,
          organization_id: 'org-1',
          name: 'Preview Template',
          type: 'email',
          subject: 'Hi {{first_name}}',
          content: 'Hello',
          variables: ['first_name'],
          is_default: false,
          created_by: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      total: 1,
    })
    vi.mocked(renderTemplatePreview).mockResolvedValue({
      subject: 'Hello John',
      content: 'Hi John, welcome!'
    })
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined)

    renderComponent()

    await waitFor(() => expect(screen.getByText('Preview Template')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /preview/i }))

    await waitFor(() => {
      expect(renderTemplatePreview).toHaveBeenCalledWith(22, {})
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Hello John'))
    })

    alertSpy.mockRestore()
  })
})

