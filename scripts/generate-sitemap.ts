import { drizzle } from "drizzle-orm/mysql2";
import { blogPosts } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";

async function generateSitemap() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  // Get all published blog posts
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true));
  
  const baseUrl = "https://apexdeliver.com";
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/pricing', priority: '0.9', changefreq: 'weekly' },
    { url: '/features', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/team', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/podcast', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookies', priority: '0.3', changefreq: 'yearly' },
  ];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // Add static pages
  for (const page of staticPages) {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }
  
  // Add blog posts
  for (const post of posts) {
    const postDate = post.publishedAt ? post.publishedAt.toISOString().split('T')[0] : currentDate;
    sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
  
  sitemap += `</urlset>`;
  
  // Write to public directory
  fs.writeFileSync('client/public/sitemap.xml', sitemap);
  console.log(`✓ Sitemap generated with ${staticPages.length} static pages and ${posts.length} blog posts`);
  process.exit(0);
}

generateSitemap().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exit(1);
});
