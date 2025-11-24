import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MarketingNav } from './MarketingNav';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const setDesktopViewport = () => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1400,
  });
};

const triggerResize = () => {
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
};

describe('MarketingNav', () => {
  it('renders FinanceFlo logo and brand name', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getByLabelText(/FinanceFlo home/i)).toBeInTheDocument();
  });

  it('displays Services navigation dropdown', () => {
    renderWithRouter(<MarketingNav />);
    expect(screen.getAllByRole('link', { name: /pricing/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Services/i }).length).toBeGreaterThan(0);
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
    expect(screen.getAllByText(/ERP Implementation & Resell/i).length).toBeGreaterThan(0);
  });

  it('toggles mobile dropdown panels', () => {
    renderWithRouter(<MarketingNav />);
    fireEvent.click(screen.getByLabelText(/toggle menu/i));
    const servicesButtons = screen.getAllByRole('button', { name: /Services/i });
    fireEvent.click(servicesButtons[servicesButtons.length - 1]);
    expect(screen.getByText(/AI Consulting & Copilots/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation for desktop dropdowns', async () => {
    setDesktopViewport();
    renderWithRouter(<MarketingNav />);
    triggerResize();
    const servicesTrigger = screen.getAllByRole('button', { name: /Services/i })[0];
    servicesTrigger.focus();
    await act(async () => {
      fireEvent.keyDown(servicesTrigger, { key: 'ArrowDown' });
    });

    const firstMenuItem = await screen.findByRole('menuitem', { name: /ERP Implementation & Resell/i });
    await waitFor(() => expect(firstMenuItem).toHaveFocus());

    await act(async () => {
      fireEvent.keyDown(firstMenuItem, { key: 'Escape' });
    });
    await waitFor(() => expect(servicesTrigger).toHaveFocus());
  });

  it('traps focus inside the mobile menu when open', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MarketingNav />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    await user.click(toggle);

    const mobileServicesButton = screen.getAllByRole('button', { name: /Services/i }).pop()!;
    await waitFor(() => expect(mobileServicesButton).toHaveFocus());

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    const startTrialLink = screen.getAllByRole('link', { name: /Start Free Trial/i }).pop()!;
    expect(startTrialLink).toHaveFocus();

    await user.tab();
    expect(mobileServicesButton).toHaveFocus();
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
    const user = userEvent.setup();
    renderWithRouter(<MarketingNav />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    await user.click(toggle);
    const solutionsButtons = screen.getAllByRole('button', { name: /Solutions/i });
    const mobileSolutions = solutionsButtons[solutionsButtons.length - 1];
    await user.click(mobileSolutions);

    const cfoLink = await screen.findByRole('link', { name: /CFO & Finance Control Tower/i });
    const dealTeamLink = await screen.findByRole('link', { name: /Deal & Corporate Development/i });

    expect(cfoLink).toHaveAttribute('href', '/solutions/cfo');
    expect(dealTeamLink).toHaveAttribute('href', '/solutions/deal-team');
  });

  it('exposes software routes within the navigation', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MarketingNav />);
    const toggle = screen.getByLabelText(/toggle menu/i);
    await user.click(toggle);
    const softwareButtons = screen.getAllByRole('button', { name: /Software/i });
    const mobileSoftware = softwareButtons[softwareButtons.length - 1];
    await user.click(mobileSoftware);

    const capLink = await screen.findByRole('link', { name: /CapLiquify FP&A/i });
    const apexLink = await screen.findByRole('link', { name: /ApexDeliver Deal Cloud/i });

    expect(capLink).toHaveAttribute('href', '/capliquify-fpa');
    expect(apexLink).toHaveAttribute('href', '/features');
  });
});
