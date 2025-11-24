import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

describe('Comprehensive SEO Validation', () => {
  const publicDir = join(process.cwd(), 'public')
  const distDir = join(process.cwd(), 'dist')

  describe('Sitemap.xml Validation', () => {
    const sitemapPath = join(publicDir, 'sitemap.xml')

    it('should exist', () => {
      expect(existsSync(sitemapPath)).toBe(true)
    })

    it('should be valid XML', () => {
      const sitemap = readFileSync(sitemapPath, 'utf-8')
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?')
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    })

    it('should include all required marketing pages', () => {
      const sitemap = readFileSync(sitemapPath, 'utf-8')
      
      const requiredPages = [
        'https://financeflo.ai/',
        'https://financeflo.ai/pricing',
        'https://financeflo.ai/features',
        'https://financeflo.ai/blog',
        'https://financeflo.ai/contact',
        'https://financeflo.ai/about',
        'https://financeflo.ai/capliquify-fpa',
        'https://financeflo.ai/sales-promotion-pricing',
        'https://financeflo.ai/pricing/platform',
        'https://financeflo.ai/pricing/community',
        'https://financeflo.ai/pricing/services',
      ]
      
      requiredPages.forEach(page => {
        expect(sitemap).toContain(`<loc>${page}</loc>`)
      })
    })

    it('should use correct domain (financeflo.ai)', () => {
      const sitemap = readFileSync(sitemapPath, 'utf-8')
      // Should use financeflo.ai as primary domain
      expect(sitemap).toMatch(/https:\/\/financeflo\.ai\//)
    })

    it('should not include authenticated routes', () => {
      const sitemap = readFileSync(sitemapPath, 'utf-8')
      expect(sitemap).not.toContain('/dashboard')
      expect(sitemap).not.toContain('/admin/')
      expect(sitemap).not.toContain('/deals/')
    })
  })

  describe('Robots.txt Validation', () => {
    const robotsPath = join(publicDir, 'robots.txt')

    it('should exist', () => {
      expect(existsSync(robotsPath)).toBe(true)
    })

    it('should reference sitemap correctly', () => {
      const robots = readFileSync(robotsPath, 'utf-8')
      expect(robots).toContain('Sitemap: https://financeflo.ai/sitemap.xml')
    })

    it('should allow marketing pages', () => {
      const robots = readFileSync(robotsPath, 'utf-8')
      expect(robots).toMatch(/Allow: \//)
      expect(robots).toMatch(/Allow: \/blog/)
      expect(robots).toMatch(/Allow: \/pricing/)
      expect(robots).toMatch(/Allow: \/features/)
    })

    it('should disallow authenticated areas', () => {
      const robots = readFileSync(robotsPath, 'utf-8')
      expect(robots).toMatch(/Disallow: \/dashboard/)
      expect(robots).toMatch(/Disallow: \/admin\//)
      expect(robots).toMatch(/Disallow: \/deals\//)
      expect(robots).toMatch(/Disallow: \/api\//)
    })
  })

  describe('Meta Tags Validation (Static HTML)', () => {
    it('should have meta tags in homepage', () => {
      const htmlPath = join(distDir, 'index.html')
      if (!existsSync(htmlPath)) {
        console.warn('Homepage HTML not found, skipping meta tag validation')
        return
      }

      const content = readFileSync(htmlPath, 'utf-8')
      
      // Description meta tag
      expect(content).toMatch(/<meta\s+name=["']description["'][^>]*content=/i)
      
      // Open Graph tags
      expect(content).toMatch(/<meta\s+property=["']og:title["'][^>]*content=/i)
      expect(content).toMatch(/<meta\s+property=["']og:description["'][^>]*content=/i)
      expect(content).toMatch(/<meta\s+property=["']og:url["'][^>]*content=/i)
      expect(content).toMatch(/<meta\s+property=["']og:image["'][^>]*content=/i)
      
      // Twitter Card tags
      expect(content).toMatch(/<meta\s+name=["']twitter:card["'][^>]*content=/i)
      expect(content).toMatch(/<meta\s+name=["']twitter:title["'][^>]*content=/i)
      
      // Canonical URL
      expect(content).toMatch(/<link\s+rel=["']canonical["'][^>]*href=/i)
    })

    it('should have canonical URLs using financeflo.ai', () => {
      const htmlPath = join(distDir, 'index.html')
      if (!existsSync(htmlPath)) {
        return
      }

      const content = readFileSync(htmlPath, 'utf-8')
      const canonicalMatch = content.match(/<link\s+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
      
      if (canonicalMatch) {
        const canonicalUrl = canonicalMatch[1]
        expect(canonicalUrl).toMatch(/https:\/\/(financeflo\.ai|100daysandbeyond\.com)/)
      }
    })
  })

  describe('Structured Data Validation', () => {
    it('should have Organization schema in MarketingLayout', () => {
      // Check that MarketingLayout component includes Organization schema
      const marketingLayoutPath = join(process.cwd(), 'src', 'components', 'marketing', 'MarketingLayout.tsx')
      if (existsSync(marketingLayoutPath)) {
        const content = readFileSync(marketingLayoutPath, 'utf-8')
        expect(content).toMatch(/@type["']:\s*["']Organization["']/i)
        expect(content).toMatch(/StructuredData/i)
      }
    })

    it('should have FAQPage schema in FAQPage component', () => {
      const faqPagePath = join(process.cwd(), 'src', 'pages', 'marketing', 'FAQPage.tsx')
      if (existsSync(faqPagePath)) {
        const content = readFileSync(faqPagePath, 'utf-8')
        expect(content).toMatch(/@type["']:\s*["']FAQPage["']/i)
        expect(content).toMatch(/StructuredData/i)
      }
    })

    it('should have breadcrumb schema utilities', () => {
      const breadcrumbSchemaPath = join(process.cwd(), 'src', 'utils', 'schemas', 'breadcrumbSchema.ts')
      if (existsSync(breadcrumbSchemaPath)) {
        const content = readFileSync(breadcrumbSchemaPath, 'utf-8')
        expect(content).toMatch(/BreadcrumbList/i)
        expect(content).toMatch(/@type/i)
      }
    })

    it('should have blog post schema utilities', () => {
      const blogPostSchemaPath = join(process.cwd(), 'src', 'utils', 'schemas', 'blogPostSchema.ts')
      if (existsSync(blogPostSchemaPath)) {
        const content = readFileSync(blogPostSchemaPath, 'utf-8')
        expect(content).toMatch(/Article/i)
        expect(content).toMatch(/@type/i)
      }
    })
  })

  describe('Domain Consistency', () => {
    it('should use consistent domain in sitemap', () => {
      const sitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf-8')
      // All URLs should use financeflo.ai
      const urls = sitemap.match(/<loc>(https?:\/\/[^<]+)<\/loc>/g) || []
      urls.forEach(url => {
        const urlMatch = url.match(/<loc>(https?:\/\/[^<]+)<\/loc>/)
        if (urlMatch) {
          const fullUrl = urlMatch[1]
          // Should use financeflo.ai (primary domain)
          expect(fullUrl).toMatch(/^https:\/\/financeflo\.ai\//)
        }
      })
    })

    it('should use consistent domain in robots.txt', () => {
      const robots = readFileSync(join(publicDir, 'robots.txt'), 'utf-8')
      // Sitemap reference should use financeflo.ai
      expect(robots).toMatch(/Sitemap:\s*https:\/\/financeflo\.ai\/sitemap\.xml/)
    })
  })

  describe('SEO Component Validation', () => {
    it('should have SEO component with all required props', () => {
      const seoComponentPath = join(process.cwd(), 'src', 'components', 'common', 'SEO.tsx')
      if (existsSync(seoComponentPath)) {
        const content = readFileSync(seoComponentPath, 'utf-8')
        
        // Should handle title, description, og tags, canonical
        expect(content).toMatch(/title/i)
        expect(content).toMatch(/description/i)
        expect(content).toMatch(/ogTitle|og:title/i)
        expect(content).toMatch(/canonical/i)
      }
    })
  })
})

