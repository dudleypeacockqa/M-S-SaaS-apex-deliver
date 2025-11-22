// @vitest-environment node
import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

const readFile = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, relativePath), 'utf-8')

describe('Public-facing domain configuration', () => {
  it('uses https://financeflo.ai in sitemap.xml', () => {
    const sitemap = readFile('../../public/sitemap.xml')
    expect(sitemap).toMatch(/https:\/\/financeflo\.ai\//)
    expect(sitemap).not.toMatch(/100daysandbeyond\.com/)
    expect(sitemap).not.toMatch(/apexdeliver\.com/)
  })

  it('points robots.txt sitemap to financeflo.ai', () => {
    const robots = readFile('../../public/robots.txt')
    expect(robots).toMatch(/Sitemap: https:\/\/financeflo\.ai\/sitemap\.xml/)
    expect(robots).not.toMatch(/100daysandbeyond\.com/)
    expect(robots).not.toMatch(/apexdeliver\.com/)
  })

  it('renders canonical and og:url tags for financeflo.ai in index.html', () => {
    const indexHtml = readFile('../../index.html')
    expect(indexHtml).toMatch(/<link rel="canonical" href="https:\/\/financeflo\.ai\//)
    expect(indexHtml).toMatch(/<meta property="og:url" content="https:\/\/financeflo\.ai\//)
    expect(indexHtml).not.toMatch(/100daysandbeyond\.com/)
    expect(indexHtml).not.toMatch(/apexdeliver\.com/)
  })
})
