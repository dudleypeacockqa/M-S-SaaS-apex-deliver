/**
 * Tests for Blog Post / Article Schema (schema.org)
 * Used for blog posts and article pages
 */

import { describe, it, expect } from 'vitest';
import { createBlogPostSchema } from './blogPostSchema';

describe('blogPostSchema', () => {
  it('should create valid Article schema with required fields', () => {
    const post = {
      title: 'Top 10 M&A Trends for 2025',
      author: 'Jane Smith',
      publishedAt: '2025-01-15T10:00:00Z',
      excerpt: 'Discover the latest trends shaping M&A in 2025',
      featuredImage: 'https://apexdeliver.com/images/blog/ma-trends-2025.jpg',
      url: 'https://apexdeliver.com/blog/ma-trends-2025',
    };

    const schema = createBlogPostSchema(post);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Top 10 M&A Trends for 2025');
    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'Jane Smith',
    });
    expect(schema.datePublished).toBe('2025-01-15T10:00:00Z');
    expect(schema.image).toBe('https://apexdeliver.com/images/blog/ma-trends-2025.jpg');
    expect(schema.description).toBe('Discover the latest trends shaping M&A in 2025');
  });

  it('should include publisher as Organization', () => {
    const post = {
      title: 'Test Article',
      author: 'Test Author',
      publishedAt: '2025-01-01T00:00:00Z',
    };

    const schema = createBlogPostSchema(post);

    expect(schema.publisher).toMatchObject({
      '@type': 'Organization',
      name: 'ApexDeliver',
    });
  });

  it('should include dateModified if provided', () => {
    const post = {
      title: 'Updated Article',
      author: 'Author Name',
      publishedAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-15T12:00:00Z',
    };

    const schema = createBlogPostSchema(post);

    expect(schema.dateModified).toBe('2025-01-15T12:00:00Z');
  });

  it('should handle missing updatedAt gracefully', () => {
    const post = {
      title: 'New Article',
      author: 'Author Name',
      publishedAt: '2025-01-15T00:00:00Z',
    };

    const schema = createBlogPostSchema(post);

    // Should either omit dateModified or set it to publishedAt
    if (schema.dateModified) {
      expect(schema.dateModified).toBe(post.publishedAt);
    }
  });

  it('should include keywords/tags array if provided', () => {
    const post = {
      title: 'SEO Article',
      author: 'SEO Expert',
      publishedAt: '2025-01-15T00:00:00Z',
      tags: ['M&A', 'Due Diligence', 'Valuation', 'Private Equity'],
    };

    const schema = createBlogPostSchema(post);

    expect(schema.keywords).toEqual(['M&A', 'Due Diligence', 'Valuation', 'Private Equity']);
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalPost = {
      title: 'Minimal Article',
      author: 'Author',
      publishedAt: '2025-01-01T00:00:00Z',
    };

    const schema = createBlogPostSchema(minimalPost);

    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Minimal Article');
    expect(schema.author.name).toBe('Author');
    // Optional fields should be omitted or have sensible defaults
  });
});
