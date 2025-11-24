import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('SEO Assets Validation', () => {
  const publicDir = path.resolve(__dirname, '../../public')
  
  describe('sitemap.xml', () => {
    it('should exist and be valid XML', () => {
      const sitemapPath = path.join(publicDir, 'sitemap.xml')
      expect(fs.existsSync(sitemapPath)).toBe(true)
      
      const sitemap = fs.readFileSync(sitemapPath, 'utf-8')
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?')
      expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    })

    it('should include all required marketing pages', () => {
      const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8')
      
      const requiredPages = [
        'https://financeflo.ai/',
        'https://financeflo.ai/pricing',
        'https://financeflo.ai/features',
        'https://financeflo.ai/blog',
        'https://financeflo.ai/contact',
        'https://financeflo.ai/capliquify-fpa',
        'https://financeflo.ai/sales-promotion-pricing',
        'https://financeflo.ai/4-stage-cycle',
        'https://financeflo.ai/case-studies',
      ]
      
      requiredPages.forEach(page => {
        expect(sitemap).toContain(`<loc>${page}</loc>`)
      })
    })

    it('should use correct domain (financeflo.ai)', () => {
      const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8')
      expect(sitemap).toMatch(/https:\/\/financeflo\.ai\//)
      expect(sitemap).not.toMatch(/100daysandbeyond\.com/)
    })
  })

  describe('robots.txt', () => {
    it('should exist', () => {
      const robotsPath = path.join(publicDir, 'robots.txt')
      expect(fs.existsSync(robotsPath)).toBe(true)
    })

    it('should reference sitemap correctly', () => {
      const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf-8')
      expect(robots).toContain('Sitemap: https://financeflo.ai/sitemap.xml')
    })

    it('should allow marketing pages', () => {
      const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf-8')
      expect(robots).toMatch(/Allow: \//)
      expect(robots).toMatch(/Allow: \/blog/)
      expect(robots).toMatch(/Allow: \/pricing/)
    })

    it('should disallow authenticated areas', () => {
      const robots = fs.readFileSync(path.join(publicDir, 'robots.txt'), 'utf-8')
      expect(robots).toMatch(/Disallow: \/dashboard/)
      expect(robots).toMatch(/Disallow: \/admin\//)
    })
  })
})

