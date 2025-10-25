import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustBadges } from './TrustBadges';

describe('TrustBadges', () => {
  it('renders without crashing', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
  });

  it('displays the section heading', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Trusted & Secure/i)).toBeInTheDocument();
  });

  it('displays the section subtitle', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Bank-grade security/i)).toBeInTheDocument();
  });

  it('displays GDPR compliance badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/GDPR Compliant/i)).toBeInTheDocument();
  });

  it('displays AES-256 encryption badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/AES-256 Encryption/i)).toBeInTheDocument();
  });

  it('displays SOC 2 Type II badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/SOC 2 Type II/i)).toBeInTheDocument();
  });

  it('displays ISO 27001 badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/ISO 27001/i)).toBeInTheDocument();
  });

  it('displays uptime SLA badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/99\.9% Uptime/i)).toBeInTheDocument();
  });

  it('displays PCI DSS badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/PCI DSS/i)).toBeInTheDocument();
  });

  it('shows all 6 security badges', () => {
    const { container } = render(<TrustBadges />);
    const badges = container.querySelectorAll('.bg-white.rounded-xl');
    expect(badges.length).toBeGreaterThanOrEqual(6);
  });

  it('displays security features section', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Security Features/i)).toBeInTheDocument();
  });

  it('lists end-to-end encryption', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/End-to-end encryption/i)).toBeInTheDocument();
  });

  it('lists two-factor authentication', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Two-factor authentication/i)).toBeInTheDocument();
  });

  it('lists role-based access control', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Role-based access control/i)).toBeInTheDocument();
  });

  it('lists audit logs', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Comprehensive audit logs/i)).toBeInTheDocument();
  });

  it('lists regular security audits', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Regular security audits/i)).toBeInTheDocument();
  });

  it('lists data backup', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Automated data backup/i)).toBeInTheDocument();
  });

  it('displays integrations section', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Seamless Integrations/i)).toBeInTheDocument();
  });

  it('shows Xero integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Xero/i)).toBeInTheDocument();
  });

  it('shows QuickBooks integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/QuickBooks/i)).toBeInTheDocument();
  });

  it('shows Sage integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Sage/i)).toBeInTheDocument();
  });

  it('shows NetSuite integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/NetSuite/i)).toBeInTheDocument();
  });

  it('shows Stripe integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Stripe/i)).toBeInTheDocument();
  });

  it('shows Slack integration', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Slack/i)).toBeInTheDocument();
  });

  it('displays all 6 integration logos', () => {
    const { container } = render(<TrustBadges />);
    const integrationCards = container.querySelectorAll('.bg-gray-50.rounded-lg');
    expect(integrationCards.length).toBeGreaterThanOrEqual(6);
  });

  it('includes shield icon for security badges', () => {
    const { container } = render(<TrustBadges />);
    const shieldIcons = container.querySelectorAll('svg');
    expect(shieldIcons.length).toBeGreaterThan(0);
  });

  it('has responsive grid layout for badges', () => {
    const { container } = render(<TrustBadges />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('md:grid-cols-3');
  });

  it('has responsive grid layout for integrations', () => {
    const { container } = render(<TrustBadges />);
    const grids = container.querySelectorAll('.grid');
    expect(grids.length).toBeGreaterThan(1);
  });

  it('includes section background styling', () => {
    const { container } = render(<TrustBadges />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('applies hover effects to badges', () => {
    const { container } = render(<TrustBadges />);
    const hoverElements = container.querySelectorAll('.hover\\:shadow-lg');
    expect(hoverElements.length).toBeGreaterThan(0);
  });

  it('displays badge descriptions', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/EU data protection/i)).toBeInTheDocument();
  });

  it('shows bank-grade security description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Bank-grade security/i)).toBeInTheDocument();
  });

  it('displays certified description for SOC 2', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Certified/i)).toBeInTheDocument();
  });

  it('shows uptime guarantee', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/SLA/i)).toBeInTheDocument();
  });

  it('displays payment security description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Payment security/i)).toBeInTheDocument();
  });

  it('includes checkmarks for security features', () => {
    const { container } = render(<TrustBadges />);
    const checkmarks = container.querySelectorAll('.text-green-600');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('displays integration icons', () => {
    const { container } = render(<TrustBadges />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(6);
  });

  it('applies proper spacing between sections', () => {
    const { container } = render(<TrustBadges />);
    const sections = container.querySelectorAll('.py-20');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('uses semantic HTML structure', () => {
    const { container } = render(<TrustBadges />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('displays all content in proper hierarchy', () => {
    const { container } = render(<TrustBadges />);
    const headings = container.querySelectorAll('h2, h3');
    expect(headings.length).toBeGreaterThan(0);
  });
});

