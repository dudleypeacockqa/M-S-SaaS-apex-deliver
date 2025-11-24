/**
 * Sitemap Validation Tests
 * Following TDD RED → GREEN → REFACTOR methodology
 * 
 * Ensures sitemap.xml includes all expected marketing pages
 * and robots.txt references the correct sitemap URL
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const readFile = (relativePath: string) => {
  const filePath = path.resolve(__dirname, relativePath);
  return fs.readFileSync(filePath, 'utf-8');
};

const parseSitemap = (xml: string) => {
  const urls: string[] = [];
  const urlMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  for (const match of urlMatches) {
    urls.push(match[1]);
  }
  return urls;
};

describe('Sitemap Validation', () => {
  describe('sitemap.xml', () => {
    it('exists and is valid XML', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      expect(sitemap).toContain('<?xml version="1.0"');
      expect(sitemap).toContain('<urlset');
    });

    it('uses financeflo.ai domain', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      expect(sitemap).toMatch(/https:\/\/financeflo\.ai\//);
      expect(sitemap).not.toMatch(/100daysandbeyond\.com/);
      expect(sitemap).not.toMatch(/apexdeliver\.com/);
    });

    it('includes core marketing pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedPages = [
        'https://financeflo.ai/',
        'https://financeflo.ai/pricing',
        'https://financeflo.ai/features',
        'https://financeflo.ai/about',
        'https://financeflo.ai/contact',
        'https://financeflo.ai/blog',
        'https://financeflo.ai/security',
        'https://financeflo.ai/team',
        'https://financeflo.ai/faq',
        'https://financeflo.ai/podcast',
        'https://financeflo.ai/capliquify-fpa',
        'https://financeflo.ai/sales-promotion-pricing',
        'https://financeflo.ai/book-trial',
        'https://financeflo.ai/solutions/cfo',
        'https://financeflo.ai/solutions/deal-team',
        'https://financeflo.ai/calculator',
        'https://financeflo.ai/assessment',
        'https://financeflo.ai/resources/roi-calculator',
        'https://financeflo.ai/demo',
        'https://financeflo.ai/enterprise-roi',
        'https://financeflo.ai/ecommerce-application',
      ];

      expectedPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes merged FinanceFlo ERP and industry routes', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);

      const industryPages = [
        'https://financeflo.ai/industries/construction',
        'https://financeflo.ai/industries/financial-services',
        'https://financeflo.ai/industries/healthcare',
        'https://financeflo.ai/industries/investment-banking',
        'https://financeflo.ai/industries/family-office',
        'https://financeflo.ai/industries/insurance',
        'https://financeflo.ai/industries/capital-markets',
        'https://financeflo.ai/industries/professional-services',
        'https://financeflo.ai/industries/subscription-business',
        'https://financeflo.ai/industries/ecommerce',
        'https://financeflo.ai/industries/private-equity',
      ];

      const erpPages = [
        'https://financeflo.ai/erp/sage-intacct',
        'https://financeflo.ai/erp/acumatica',
        'https://financeflo.ai/erp/odoo',
        'https://financeflo.ai/erp/sage-x3',
        'https://financeflo.ai/erp/netsuite',
        'https://financeflo.ai/erp/microsoft-dynamics',
        'https://financeflo.ai/erp/sap',
      ];

      [...industryPages, ...erpPages].forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes AI, implementation, and iPaaS service pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);

      const aiPages = [
        'https://financeflo.ai/ai-enhancement/sage-intacct',
        'https://financeflo.ai/ai-enhancement/acumatica',
        'https://financeflo.ai/ai-enhancement/odoo',
        'https://financeflo.ai/ai-enhancement/sage-x3',
      ];

      const implementationPages = [
        'https://financeflo.ai/implementation/sage-intacct',
        'https://financeflo.ai/implementation/acumatica',
        'https://financeflo.ai/implementation/odoo',
        'https://financeflo.ai/implementation/sage-x3',
      ];

      const ipaasPages = [
        'https://financeflo.ai/ipaas/intelliflow',
        'https://financeflo.ai/ipaas/strategy',
        'https://financeflo.ai/ipaas/connectors',
        'https://financeflo.ai/ipaas/api-management',
      ];

      [...aiPages, ...implementationPages, ...ipaasPages].forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes pricing sub-pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedPricingPages = [
        'https://financeflo.ai/pricing/platform',
        'https://financeflo.ai/pricing/community',
        'https://financeflo.ai/pricing/services',
      ];

      expectedPricingPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes legal pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedLegalPages = [
        'https://financeflo.ai/legal/terms',
        'https://financeflo.ai/legal/privacy',
        'https://financeflo.ai/legal/cookies',
      ];

      expectedLegalPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });
  });

  describe('robots.txt', () => {
    it('exists and references correct sitemap URL', () => {
      const robots = readFile('../../public/robots.txt');
      expect(robots).toMatch(/Sitemap: https:\/\/financeflo\.ai\/sitemap\.xml/);
      expect(robots).not.toMatch(/100daysandbeyond\.com/);
      expect(robots).not.toMatch(/apexdeliver\.com/);
    });

    it('allows marketing pages', () => {
      const robots = readFile('../../public/robots.txt');
      expect(robots).toMatch(/Allow: \//);
      expect(robots).toMatch(/Allow: \/pricing/);
      expect(robots).toMatch(/Allow: \/blog/);
    });

    it('blocks authenticated areas', () => {
      const robots = readFile('../../public/robots.txt');
      expect(robots).toMatch(/Disallow: \/dashboard/);
      expect(robots).toMatch(/Disallow: \/admin/);
      expect(robots).toMatch(/Disallow: \/deals/);
    });
  });
});

