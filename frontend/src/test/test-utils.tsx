/**
 * Test utilities and helpers
 * Provides common test setup and wrapper components
 */
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Render component with React Router context
 * Use this for components that use Link, useNavigate, etc.
 */
export const renderWithRouter = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>, options);
};

/**
 * Render component with both Router and React Query context
 * Use this for components that make API calls
 */
export const renderWithRouterAndQuery = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
    options
  );
};

/**
 * Render component with React Query context only
 */
export const renderWithQuery = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    options
  );
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
