import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RequestIntroButton } from './RequestIntroButton';

describe('RequestIntroButton', () => {
  it('invokes callback when clicked', () => {
    const handleClick = vi.fn();

    render(<RequestIntroButton onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('request-intro-button'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('shows loading state when loading', () => {
    render(<RequestIntroButton onClick={vi.fn()} loading />);

    expect(screen.getByText(/requesting/i)).toBeInTheDocument();
    expect(screen.getByTestId('request-intro-button')).toBeDisabled();
  });
});
