# SEO & Performance Status - ApexDeliver Marketing Site

_Date: 2025-10-28_

## Metadata Coverage

- Global defaults (index.html) now provide Open Graph, Twitter Card, keyword, and verification tags.
- All marketing and legal routes call the shared SEO component with page-specific:
  - Title, description, and keyword focus terms
  - Open Graph/Twitter metadata with image assets under <code>frontend/public/assets</code>
  - Canonical URLs referencing the production domain (<code>https://apexdeliver.com</code>).
- Organization and review structured data is injected via <code>MarketingLayout</code> and <code>EnhancedTestimonials</code> respectively, covering <code>Organization</code>, <code>Product</code>, and <code>Review</code> schema requirements.

## Sitemap & Robots

- <code>public/sitemap.xml</code> now enumerates marketing and legal routes with appropriate <code>changefreq</code> and <code>priority</code> values.
- <code>public/robots.txt</code> allows marketing pages while blocking authenticated app paths and advertises the sitemap URL.

## Google Search Console (Mock)

- Added <code>&lt;meta name="google-site-verification" content="mock-apexdeliver-verification-token" /&gt;</code> to <code>index.html</code> to document the verification handshake.

## Lighthouse

Pending: Running Lighthouse requires a production or preview build. The current workspace build fails because of existing TypeScript errors in the podcast and deal-matching modules. Once those modules compile, run the following command sequence to capture metrics:

<pre><code>npm run build
npm run preview &
# In another terminal
npx lighthouse http://localhost:4173 --preset=desktop --output=json --output-path=docs/marketing/lighthouse-latest.json
</code></pre>

Record the resulting Performance / Accessibility / Best Practices / SEO scores in this file when available.

## Next Actions

1. Resolve outstanding <code>tsc</code> errors in <code>src/components/deal-matching/CriteriaBuilderModal.tsx</code> and the new podcast streaming components.
2. Generate Lighthouse reports (desktop & mobile) once the preview server runs cleanly.
3. Submit the refreshed sitemap to Google Search Console after deployment.
