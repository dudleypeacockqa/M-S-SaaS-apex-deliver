import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MarketingNav } from './MarketingNav';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MarketingNav', () => {
  it('renders logo and brand name', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByLabelText(/ApexDeliver home/i)).toBeInTheDocument();
  });

  it('displays navigation links', () => {
    renderWithRouter(<MarketingNav />);
    // Pricing is a direct link
    expect(screen.getAllByRole('link', { name: /pricing/i }).length).toBeGreaterThan(0);
    // Dropdown triggers exist
    expect(screen.getAllByRole('button', { name: /products/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /solutions/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /resources/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /company/i }).length).toBeGreaterThan(0);
  });

  it('shows Sign In and Sign Up CTAs', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getAllByRole('link', { name: /sign in/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /start free trial/i }).length).toBeGreaterThan(0);
  });

  it('renders navigation as nav element for accessibility', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('opens the mobile menu and exposes links', () => {
    renderWithRouter(<MarketingNav />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByText(/CapLiquify FP&A/i).length).toBeGreaterThan(0);
  });

  it('toggles mobile dropdown panels', () => {
    renderWithRouter(<MarketingNav />);
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const productButtons = screen.getAllByRole('button', { name: /Products/i });
    fireEvent.click(productButtons[productButtons.length - 1]);
    expect(screen.getByText(/Sales & Promotion Pricing/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation for desktop dropdowns', async () => {
    renderWithRouter(<MarketingNav />);
    const productsTrigger = screen.getAllByRole('button', { name: /Products/i })[0];
    productsTrigger.focus();
    fireEvent.keyDown(productsTrigger, { key: 'ArrowDown' });

    const firstMenuItem = await screen.findByRole('menuitem', { name: /CapLiquify FP&A/i });
    await waitFor(() => expect(firstMenuItem).toHaveFocus());

    fireEvent.keyDown(firstMenuItem, { key: 'Escape' });
    await waitFor(() => expect(productsTrigger).toHaveFocus());
  });

  it('traps focus inside the mobile menu when open', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MarketingNav />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    await user.click(toggle);

    const mobileProductsButton = screen.getAllByRole('button', { name: /Products/i }).pop()!;
    await waitFor(() => expect(mobileProductsButton).toHaveFocus());

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    const startTrialLink = screen.getAllByRole('link', { name: /Start Free Trial/i }).pop()!;
    expect(startTrialLink).toHaveFocus();

    await user.tab();
    expect(mobileProductsButton).toHaveFocus();
  });
});
