// @vitest-environment node
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const readFile = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, relativePath), 'utf-8');

describe('Public-facing domain configuration', () => {
  it('uses https://100daysandbeyond.com in sitemap.xml', () => {
    const sitemap = readFile('../../public/sitemap.xml');
    expect(sitemap).toMatch(/https:\/\/100daysandbeyond\.com\//);
    expect(sitemap).not.toMatch(/apexdeliver\.com/);
  });

  it('points robots.txt sitemap to 100daysandbeyond.com', () => {
    const robots = readFile('../../public/robots.txt');
    expect(robots).toMatch(/Sitemap: https:\/\/100daysandbeyond\.com\/sitemap\.xml/);
    expect(robots).not.toMatch(/apexdeliver\.com/);
  });

  it('renders canonical and og:url tags for 100daysandbeyond.com in index.html', () => {
    const indexHtml = readFile('../../index.html');
    expect(indexHtml).toMatch(/<link rel="canonical" href="https:\/\/100daysandbeyond\.com\//);
    expect(indexHtml).toMatch(/<meta property="og:url" content="https:\/\/100daysandbeyond\.com\//);
    expect(indexHtml).not.toMatch(/apexdeliver\.com/);
  });
});
