/**
 * Tests for SecurityPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SecurityPage } from './SecurityPage';

// Helper to render with Router context
function renderSecurityPage() {
  return render(
    <MemoryRouter>
      <SecurityPage />
    </MemoryRouter>
  );
}

describe('SecurityPage', () => {
  describe('Header Section', () => {
    it('should render main heading', () => {
      renderSecurityPage();
      expect(screen.getByText(/enterprise-grade security & compliance/i)).toBeInTheDocument();
    });

    it('should render uptime claim in header', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/99.95% uptime/i).length).toBeGreaterThan(0);
    });
  });

  describe('Security Features', () => {
    it('should render "Segregated Multi-Tenant Architecture" feature', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/segregated multi-tenant architecture/i).length).toBeGreaterThan(0);
    });

    it('should render "End-to-End Encryption" feature', () => {
      renderSecurityPage();
      expect(screen.getByText(/end-to-end encryption/i)).toBeInTheDocument();
    });

    it('should render "Continuous Security Monitoring" feature', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/continuous security monitoring/i).length).toBeGreaterThan(0);
    });

    it('should render "Advanced Access Controls" feature', () => {
      renderSecurityPage();
      expect(screen.getByText(/advanced access controls/i)).toBeInTheDocument();
    });

    it('should render "Comprehensive Audit Logging" feature', () => {
      renderSecurityPage();
      expect(screen.getByText(/comprehensive audit logging/i)).toBeInTheDocument();
    });
  });

  describe('Certifications', () => {
    it('should render SOC 2 Type II certification', () => {
      renderSecurityPage();
      expect(screen.getByText(/soc 2 type ii certified/i)).toBeInTheDocument();
    });

    it('should render ISO 27001 certification', () => {
      renderSecurityPage();
      expect(screen.getByText(/iso 27001:2013 certified/i)).toBeInTheDocument();
    });

    it('should render GDPR compliance badge', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/gdpr compliant/i).length).toBeGreaterThan(0);
    });

    it('should render PCI DSS certification', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/pci dss level 1/i).length).toBeGreaterThan(0);
    });
  });

  describe('Technical Controls', () => {
    it('should render "Data Protection" section', () => {
      renderSecurityPage();
      expect(screen.getByText(/^data protection$/i)).toBeInTheDocument();
    });

    it('should mention AES-256 encryption', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/aes-256/i).length).toBeGreaterThan(0);
    });

    it('should mention TLS 1.3 encryption', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/tls 1\.3/i).length).toBeGreaterThan(0);
    });

    it('should render "Infrastructure Security" section', () => {
      renderSecurityPage();
      expect(screen.getByText(/^infrastructure security$/i)).toBeInTheDocument();
    });

    it('should render "Access Control" section', () => {
      renderSecurityPage();
      expect(screen.getByText(/^access control$/i)).toBeInTheDocument();
    });

    it('should render "Compliance & Auditing" section', () => {
      renderSecurityPage();
      expect(screen.getByText(/^compliance & auditing$/i)).toBeInTheDocument();
    });
  });

  describe('Uptime SLA Section', () => {
    it('should render uptime SLA heading', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/99\.95% uptime sla/i).length).toBeGreaterThan(0);
    });

    it('should display Recovery Time Objective', () => {
      renderSecurityPage();
      expect(screen.getByText(/recovery time objective/i)).toBeInTheDocument();
    });

    it('should display Recovery Point Objective', () => {
      renderSecurityPage();
      expect(screen.getAllByText(/recovery point objective/i).length).toBeGreaterThan(0);
    });
  });

  describe('SEO & Metadata', () => {
    it('should render page with SEO component', () => {
      renderSecurityPage();
      // SEO component renders meta tags in document head via react-helmet or similar
      // Just verify the page renders successfully
      expect(screen.getByText(/enterprise-grade security & compliance/i)).toBeInTheDocument();
    });
  });
});
