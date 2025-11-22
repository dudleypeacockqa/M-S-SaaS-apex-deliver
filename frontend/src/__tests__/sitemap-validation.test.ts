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

    it('uses 100daysandbeyond.com domain', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      expect(sitemap).toMatch(/https:\/\/100daysandbeyond\.com\//);
      expect(sitemap).not.toMatch(/financeflo\.ai/);
      expect(sitemap).not.toMatch(/apexdeliver\.com/);
    });

    it('includes core marketing pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedPages = [
        'https://100daysandbeyond.com/',
        'https://100daysandbeyond.com/pricing',
        'https://100daysandbeyond.com/features',
        'https://100daysandbeyond.com/about',
        'https://100daysandbeyond.com/contact',
        'https://100daysandbeyond.com/blog',
        'https://100daysandbeyond.com/security',
        'https://100daysandbeyond.com/team',
        'https://100daysandbeyond.com/faq',
        'https://100daysandbeyond.com/podcast',
        'https://100daysandbeyond.com/capliquify-fpa',
        'https://100daysandbeyond.com/sales-promotion-pricing',
        'https://100daysandbeyond.com/book-trial',
      ];

      expectedPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes pricing sub-pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedPricingPages = [
        'https://100daysandbeyond.com/pricing/platform',
        'https://100daysandbeyond.com/pricing/community',
        'https://100daysandbeyond.com/pricing/services',
      ];

      expectedPricingPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });

    it('includes legal pages', () => {
      const sitemap = readFile('../../public/sitemap.xml');
      const urls = parseSitemap(sitemap);
      
      const expectedLegalPages = [
        'https://100daysandbeyond.com/legal/terms',
        'https://100daysandbeyond.com/legal/privacy',
        'https://100daysandbeyond.com/legal/cookies',
      ];

      expectedLegalPages.forEach(page => {
        expect(urls).toContain(page);
      });
    });
  });

  describe('robots.txt', () => {
    it('exists and references correct sitemap URL', () => {
      const robots = readFile('../../public/robots.txt');
      expect(robots).toMatch(/Sitemap: https:\/\/100daysandbeyond\.com\/sitemap\.xml/);
      expect(robots).not.toMatch(/financeflo\.ai/);
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

