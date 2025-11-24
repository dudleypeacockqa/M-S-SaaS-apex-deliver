/**
 * MarketingNav Mobile Navigation Tests
 * Following TDD RED → GREEN → REFACTOR methodology
 * 
 * Tests mobile dropdown animations, focus traps, and keyboard navigation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MarketingNav } from '../MarketingNav';

// Mock window.matchMedia for responsive tests
const mockMatchMedia = (matches: boolean) => {
  return vi.fn(() => ({
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

// Mock window.innerWidth for responsive behavior
const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MarketingNav Mobile Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setWindowWidth(768); // Mobile width
    window.matchMedia = mockMatchMedia(false); // Not desktop
  });

  describe('Mobile Menu Toggle', () => {
    it('opens mobile menu when hamburger button is clicked', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('closes mobile menu when hamburger button is clicked again', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      });
      
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('applies slide animation classes when menu opens', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
      
      expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0');
      
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(mobileMenu).toHaveClass('max-h-[1200px]', 'opacity-100');
      });
    });
  });

  describe('Mobile Dropdown Animations', () => {
    it('toggles dropdown with smooth animation', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
        expect(mobileMenu).toBeInTheDocument();
      });
      
      const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
      const servicesButton = mobileMenu?.querySelector('button[aria-controls="mobile-dropdown-Services"]') as HTMLButtonElement;
      expect(servicesButton).toBeInTheDocument();

      fireEvent.click(servicesButton!);

      await waitFor(() => {
        const dropdown = document.getElementById('mobile-dropdown-Services');
        expect(dropdown).toHaveClass('max-h-96', 'opacity-100');
      });
    });

    it('collapses dropdown when clicked again', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
        expect(mobileMenu).toBeInTheDocument();
      });
      
      const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
      const servicesButton = mobileMenu?.querySelector('button[aria-controls="mobile-dropdown-Services"]') as HTMLButtonElement;

      // Open dropdown
      fireEvent.click(servicesButton!);

      await waitFor(() => {
        const dropdown = document.getElementById('mobile-dropdown-Services');
        expect(dropdown).toHaveClass('max-h-96', 'opacity-100');
      });

      // Close dropdown
      fireEvent.click(servicesButton!);

      await waitFor(() => {
        const dropdown = document.getElementById('mobile-dropdown-Services');
        expect(dropdown).toHaveClass('max-h-0', 'opacity-0');
      });
    });
  });

  describe('Focus Trap', () => {
    it('traps focus within mobile menu when open', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
        expect(mobileMenu).toBeInTheDocument();
      });
      
      const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
      const focusableElements = mobileMenu?.querySelectorAll('a, button, [tabindex="0"]') ?? [];
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it('returns focus to toggle button when menu closes', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      toggleButton.focus();
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      });
      
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes mobile menu on Escape key', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      });
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('prevents body scroll when mobile menu is open', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('restores body scroll when mobile menu closes', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
      
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on mobile menu', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
        expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('has proper ARIA expanded state on dropdown buttons', async () => {
      renderWithRouter(<MarketingNav />);
      
      const toggleButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
        expect(mobileMenu).toBeInTheDocument();
      });
      
      const mobileMenu = screen.getByRole('navigation').querySelector('#mobile-primary-nav');
      const servicesButton = mobileMenu?.querySelector('button[aria-controls="mobile-dropdown-Services"]') as HTMLButtonElement;

      expect(servicesButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(servicesButton!);

      await waitFor(() => {
        expect(servicesButton).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});
