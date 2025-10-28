import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustBadges } from './TrustBadges';

describe('TrustBadges', () => {
  it('renders without crashing', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Enterprise-Grade Security/i)).toBeInTheDocument();
  });

  it('displays the security section heading', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Enterprise-Grade Security & Compliance/i)).toBeInTheDocument();
  });

  it('displays the security section subtitle', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Your data is protected by the same security standards/i)).toBeInTheDocument();
  });

  it('displays GDPR compliance badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/GDPR Compliant/i)).toBeInTheDocument();
  });

  it('displays Bank-Grade Security badge', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Bank-Grade Security/i)).toBeInTheDocument();
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
    const badges = container.querySelectorAll('.bg-white.rounded-xl.shadow-lg');
    expect(badges.length).toBeGreaterThanOrEqual(6);
  });

  it('displays GDPR description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Full compliance with EU data protection/i)).toBeInTheDocument();
  });

  it('displays AES-256 encryption description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/AES-256 encryption for all data/i)).toBeInTheDocument();
  });

  it('displays SOC 2 description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Certified security controls and processes/i)).toBeInTheDocument();
  });

  it('displays ISO description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Information security management certified/i)).toBeInTheDocument();
  });

  it('displays uptime SLA description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Enterprise-grade reliability SLA/i)).toBeInTheDocument();
  });

  it('displays PCI DSS description', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Secure payment processing standards/i)).toBeInTheDocument();
  });

  it('displays data encryption feature', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Data Encryption/i)).toBeInTheDocument();
    expect(screen.getByText(/End-to-end encryption/i)).toBeInTheDocument();
  });

  it('displays regular audits feature', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Regular Audits/i)).toBeInTheDocument();
    expect(screen.getByText(/Third-party security audits/i)).toBeInTheDocument();
  });

  it('displays backup and recovery feature', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Backup & Recovery/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily encrypted backups/i)).toBeInTheDocument();
  });

  it('displays integrations section', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Seamless Integrations/i)).toBeInTheDocument();
  });

  it('shows Xero integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/Xero accounting integration/i)).toBeInTheDocument();
  });

  it('shows QuickBooks integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/QuickBooks accounting integration/i)).toBeInTheDocument();
  });

  it('shows Sage integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/Sage accounting integration/i)).toBeInTheDocument();
  });

  it('shows NetSuite integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/NetSuite ERP integration/i)).toBeInTheDocument();
  });

  it('shows Stripe integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/Stripe payment integration/i)).toBeInTheDocument();
  });

  it('shows Slack integration', () => {
    render(<TrustBadges />);
    expect(screen.getByAltText(/Slack collaboration integration/i)).toBeInTheDocument();
  });

  it('displays all 6 integration logos', () => {
    render(<TrustBadges />);

    const logos = screen.getAllByRole('img', { name: /integration/i });
    expect(logos).toHaveLength(6);
  });

  it('includes shield icons for security badges', () => {
    const { container } = render(<TrustBadges />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(6);
  });

  it('has responsive grid layout for badges', () => {
    const { container } = render(<TrustBadges />);
    const grid = container.querySelector('.lg\\:grid-cols-6');
    expect(grid).toBeInTheDocument();
  });

  it('has responsive grid layout for integrations', () => {
    const { container } = render(<TrustBadges />);
    const grids = container.querySelectorAll('.md\\:grid-cols-6');
    expect(grids.length).toBeGreaterThan(0);
  });

  it('includes section background styling', () => {
    const { container} = render(<TrustBadges />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gray-50');
  });

  it('applies hover effects to badges', () => {
    const { container } = render(<TrustBadges />);
    const hoverElements = container.querySelectorAll('.hover\\:shadow-xl');
    expect(hoverElements.length).toBeGreaterThan(0);
  });

  it('displays custom integration CTA', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Need a custom integration/i)).toBeInTheDocument();
  });

  it('includes link to view all integrations', () => {
    render(<TrustBadges />);
    const link = screen.getByText(/View all integrations/i);
    expect(link.closest('a')).toHaveAttribute('href', '/integrations');
  });

  it('displays checkmarks for security features', () => {
    const { container } = render(<TrustBadges />);
    const checkmarks = container.querySelectorAll('.text-green-600');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('includes integration icons/logos', () => {
    render(<TrustBadges />);
    const logos = screen.getAllByRole('img', { name: /integration/i });
    expect(logos.length).toBe(6);
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
    const headings = container.querySelectorAll('h2, h3, h4');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('shows integration subtitle', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/Connect with the tools you already use/i)).toBeInTheDocument();
  });

  it('applies group hover effects', () => {
    const { container } = render(<TrustBadges />);
    const groupElements = container.querySelectorAll('.group');
    expect(groupElements.length).toBeGreaterThan(0);
  });

  it('displays badge icons in colored circles', () => {
    const { container } = render(<TrustBadges />);
    const iconCircles = container.querySelectorAll('.bg-blue-100.rounded-full');
    expect(iconCircles.length).toBe(6);
  });

  it('shows security feature cards', () => {
    const { container } = render(<TrustBadges />);
    const featureCards = container.querySelectorAll('.border-2.border-gray-200');
    expect(featureCards.length).toBe(3);
  });

  it('mentions TLS 1.3 encryption', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/TLS 1\.3/i)).toBeInTheDocument();
  });

  it('mentions penetration testing', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/penetration testing/i)).toBeInTheDocument();
  });

  it('mentions 30-day retention', () => {
    render(<TrustBadges />);
    expect(screen.getByText(/30-day retention/i)).toBeInTheDocument();
  });

  it('applies shadow effects to integration container', () => {
    const { container } = render(<TrustBadges />);
    const shadowElement = container.querySelector('.shadow-xl');
    expect(shadowElement).toBeInTheDocument();
  });
});

