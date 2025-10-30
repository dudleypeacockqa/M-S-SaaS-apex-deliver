/**
 * Tests for SecurityPage
 * Following TDD RED → GREEN → REFACTOR methodology
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SecurityPage } from './SecurityPage';

describe('SecurityPage', () => {
  describe('Header Section', () => {
    it('should render main heading', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/enterprise-grade security & compliance/i)).toBeInTheDocument();
    });

    it('should render uptime claim in header', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/99.95% uptime/i)).toBeInTheDocument();
    });
  });

  describe('Security Features', () => {
    it('should render "Segregated Multi-Tenant Architecture" feature', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/segregated multi-tenant architecture/i)).toBeInTheDocument();
    });

    it('should render "End-to-End Encryption" feature', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/end-to-end encryption/i)).toBeInTheDocument();
    });

    it('should render "Continuous Security Monitoring" feature', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/continuous security monitoring/i)).toBeInTheDocument();
    });

    it('should render "Advanced Access Controls" feature', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/advanced access controls/i)).toBeInTheDocument();
    });

    it('should render "Comprehensive Audit Logging" feature', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/comprehensive audit logging/i)).toBeInTheDocument();
    });
  });

  describe('Certifications', () => {
    it('should render SOC 2 Type II certification', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/soc 2 type ii certified/i)).toBeInTheDocument();
    });

    it('should render ISO 27001 certification', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/iso 27001:2013 certified/i)).toBeInTheDocument();
    });

    it('should render GDPR compliance badge', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/gdpr compliant/i)).toBeInTheDocument();
    });

    it('should render PCI DSS certification', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/pci dss level 1/i)).toBeInTheDocument();
    });
  });

  describe('Technical Controls', () => {
    it('should render "Data Protection" section', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/^data protection$/i)).toBeInTheDocument();
    });

    it('should mention AES-256 encryption', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/aes-256/i)).toBeInTheDocument();
    });

    it('should mention TLS 1.3 encryption', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/tls 1\.3/i)).toBeInTheDocument();
    });

    it('should render "Infrastructure Security" section', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/^infrastructure security$/i)).toBeInTheDocument();
    });

    it('should render "Access Control" section', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/^access control$/i)).toBeInTheDocument();
    });

    it('should render "Compliance & Auditing" section', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/^compliance & auditing$/i)).toBeInTheDocument();
    });
  });

  describe('Uptime SLA Section', () => {
    it('should render uptime SLA heading', () => {
      render(<SecurityPage />);
      expect(screen.getAllByText(/99\.95% uptime sla/i).length).toBeGreaterThan(0);
    });

    it('should display Recovery Time Objective', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/recovery time objective/i)).toBeInTheDocument();
    });

    it('should display Recovery Point Objective', () => {
      render(<SecurityPage />);
      expect(screen.getByText(/recovery point objective/i)).toBeInTheDocument();
    });
  });

  describe('SEO & Metadata', () => {
    it('should render page with SEO component', () => {
      const { container } = render(<SecurityPage />);
      expect(container.querySelector('meta[name="description"]')).toBeTruthy();
    });
  });
});
