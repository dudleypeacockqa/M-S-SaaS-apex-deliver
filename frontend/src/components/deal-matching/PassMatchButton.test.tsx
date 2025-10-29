import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PassMatchButton } from './PassMatchButton';

describe('PassMatchButton', () => {
  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();

    render(<PassMatchButton onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('pass-match-button'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders loading state when loading', () => {
    render(<PassMatchButton onClick={vi.fn()} loading />);

    expect(screen.getByText(/passing/i)).toBeInTheDocument();
    expect(screen.getByTestId('pass-match-button')).toBeDisabled();
  });
});
