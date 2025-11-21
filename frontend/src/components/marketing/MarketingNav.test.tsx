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
    expect(screen.getAllByRole('link', { name: /pricing/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /products/i }).length).toBeGreaterThan(0);
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

  it('ensures closed mobile menu is hidden from screen readers and keyboard', () => {
    renderWithRouter(<MarketingNav />);
    // The mobile menu container
    const mobileNav = document.getElementById('mobile-primary-nav');
    
    // Should be in the document but hidden
    expect(mobileNav).toBeInTheDocument();
    
    // Check for accessibility attribute
    expect(mobileNav).toHaveAttribute('aria-hidden', 'true');
    
    // Check for Tailwind classes that ensure visual/interaction hiding
    expect(mobileNav).toHaveClass('invisible');
    expect(mobileNav).toHaveClass('pointer-events-none');
    expect(mobileNav).toHaveClass('opacity-0');
  });

  it('links solutions dropdown items to persona routes', async () => {
    renderWithRouter(<MarketingNav />);
    const solutionsTrigger = screen.getAllByRole('button', { name: /Solutions/i })[0];
    fireEvent.keyDown(solutionsTrigger, { key: 'ArrowDown' });

    const cfoLink = await screen.findByRole('menuitem', { name: /CFO Command Center/i });
    const dealTeamLink = await screen.findByRole('menuitem', { name: /Deal Team Workspace/i });

    expect(cfoLink).toHaveAttribute('href', '/solutions/cfo');
    expect(dealTeamLink).toHaveAttribute('href', '/solutions/deal-team');
  });

  it('exposes compare routes within the navigation', async () => {
    renderWithRouter(<MarketingNav />);
    const compareTrigger = screen.getAllByRole('button', { name: /Compare/i })[0];
    fireEvent.keyDown(compareTrigger, { key: 'ArrowDown' });

    const dealRoomLink = await screen.findByRole('menuitem', { name: /DealRoom Alternative/i });
    const midaxoLink = await screen.findByRole('menuitem', { name: /Midaxo Alternative/i });

    expect(dealRoomLink).toHaveAttribute('href', '/compare/dealroom-alternative');
    expect(midaxoLink).toHaveAttribute('href', '/compare/midaxo-alternative');
  });
});
