import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { SEO } from './SEO';

describe('SEO', () => {
  beforeEach(() => {
    // Clear document title and meta tags before each test
    document.title = '';
    document.querySelectorAll('meta').forEach((el) => el.remove());
    document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  });

  it('sets document title', () => {
    render(<SEO title="Test Title" description="Test Description" />);
    expect(document.title).toBe('Test Title');
  });

  it('sets description meta tag', () => {
    render(<SEO title="Test" description="Test Description Here" />);
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute('content')).toBe('Test Description Here');
  });

  it('sets keywords meta tag when provided', () => {
    render(<SEO title="Test" description="Test" keywords="keyword1, keyword2, keyword3" />);
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords?.getAttribute('content')).toBe('keyword1, keyword2, keyword3');
  });

  it('sets OpenGraph meta tags', () => {
    render(
      <SEO
        title="Test Title"
        description="Test Description"
        ogTitle="OG Title"
        ogDescription="OG Description"
        ogImage="https://example.com/image.jpg"
        ogUrl="https://example.com"
      />
    );

    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'OG Title'
    );
    expect(
      document.querySelector('meta[property="og:description"]')?.getAttribute('content')
    ).toBe('OG Description');
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://example.com/image.jpg'
    );
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://example.com'
    );
  });

  it('sets Twitter Card meta tags', () => {
    render(
      <SEO
        title="Test Title"
        description="Test Description"
        twitterCard="summary_large_image"
        twitterTitle="Twitter Title"
        twitterDescription="Twitter Description"
        twitterImage="https://example.com/twitter.jpg"
      />
    );

    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image'
    );
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(
      'Twitter Title'
    );
    expect(
      document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')
    ).toBe('Twitter Description');
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://example.com/twitter.jpg'
    );
  });

  it('sets canonical URL when provided', () => {
    render(
      <SEO
        title="Test"
        description="Test"
        canonical="https://example.com/canonical-page"
      />
    );

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    expect(canonical?.href).toBe('https://example.com/canonical-page');
  });

  it('falls back to main title for OG title if not provided', () => {
    render(<SEO title="Main Title" description="Test" />);
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Main Title'
    );
  });

  it('falls back to main description for OG description if not provided', () => {
    render(<SEO title="Test" description="Main Description" />);
    expect(
      document.querySelector('meta[property="og:description"]')?.getAttribute('content')
    ).toBe('Main Description');
  });
});
