import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SaveMatchButton } from './SaveMatchButton';

describe('SaveMatchButton', () => {
  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();

    render(<SaveMatchButton onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('save-match-button'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('shows loading text when loading', () => {
    render(<SaveMatchButton onClick={vi.fn()} loading />);

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
    expect(screen.getByTestId('save-match-button')).toBeDisabled();
  });
});
