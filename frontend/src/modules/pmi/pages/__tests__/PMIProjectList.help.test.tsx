import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PMIProjectList } from '../PMIProjectList'

vi.mock('../../hooks/usePMIProject', () => ({
  usePMIProjects: () => ({
    data: { items: [] },
    isLoading: false,
    error: null,
  }),
}))

describe('PMIProjectList help affordance', () => {
  it('renders PMI workspace help trigger', () => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PMIProjectList />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(screen.getByRole('button', { name: /pmi help/i })).toBeInTheDocument()
  })
})
