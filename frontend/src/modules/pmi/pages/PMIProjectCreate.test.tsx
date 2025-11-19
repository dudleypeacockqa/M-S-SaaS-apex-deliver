/**
 * Tests for PMIProjectCreate page - 100% Coverage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PMIProjectCreate } from './PMIProjectCreate';
import { useCreatePMIProject } from '../hooks/usePMIProject';

vi.mock('../hooks/usePMIProject', () => ({
  useCreatePMIProject: vi.fn(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PMIProjectCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create form', () => {
    vi.mocked(useCreatePMIProject).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
    } as any);

    renderWithProviders(<PMIProjectCreate />);
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockMutate = vi.fn().mockResolvedValue({ id: 'proj-123' });
    vi.mocked(useCreatePMIProject).mockReturnValue({
      mutateAsync: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
    } as any);

    renderWithProviders(<PMIProjectCreate />);

    const nameInput = screen.getByLabelText(/project name/i);
    await userEvent.type(nameInput, 'New PMI Project');

    const dealInput = screen.getByLabelText(/associated deal/i);
    await userEvent.type(dealInput, 'deal-1');

    const submitButton = screen.getByRole('button', { name: /create pmi project/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});

