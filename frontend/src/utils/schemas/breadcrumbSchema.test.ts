/**
 * Tests for BreadcrumbList Schema (schema.org)
 * Used for navigation breadcrumbs on all pages
 */

import { describe, it, expect } from 'vitest';
import { createBreadcrumbSchema } from './breadcrumbSchema';

describe('breadcrumbSchema', () => {
  it('should create valid BreadcrumbList schema with multiple items', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://apexdeliver.com' },
      { name: 'Features', url: 'https://apexdeliver.com/features' },
      { name: 'Deal Pipeline', url: 'https://apexdeliver.com/features/pipeline' },
    ];

    const schema = createBreadcrumbSchema(breadcrumbs);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);

    // Check first breadcrumb
    expect(schema.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://apexdeliver.com',
    });

    // Check last breadcrumb
    expect(schema.itemListElement[2]).toMatchObject({
      '@type': 'ListItem',
      position: 3,
      name: 'Deal Pipeline',
      item: 'https://apexdeliver.com/features/pipeline',
    });
  });

  it('should handle single breadcrumb (homepage only)', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://apexdeliver.com' },
    ];

    const schema = createBreadcrumbSchema(breadcrumbs);

    expect(schema.itemListElement).toHaveLength(1);
    expect(schema.itemListElement[0].position).toBe(1);
  });

  it('should correctly increment position for each breadcrumb', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://apexdeliver.com' },
      { name: 'Blog', url: 'https://apexdeliver.com/blog' },
      { name: 'Article', url: 'https://apexdeliver.com/blog/post-1' },
      { name: 'Comments', url: 'https://apexdeliver.com/blog/post-1#comments' },
    ];

    const schema = createBreadcrumbSchema(breadcrumbs);

    expect(schema.itemListElement).toHaveLength(4);
    schema.itemListElement.forEach((item: any, index: number) => {
      expect(item.position).toBe(index + 1);
    });
  });

  it('should handle breadcrumbs with special characters in URLs', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://apexdeliver.com' },
      { name: 'Search Results', url: 'https://apexdeliver.com/search?q=M%26A' },
    ];

    const schema = createBreadcrumbSchema(breadcrumbs);

    expect(schema.itemListElement[1].item).toBe('https://apexdeliver.com/search?q=M%26A');
  });

  it('should handle breadcrumbs without trailing slashes', () => {
    const breadcrumbs = [
      { name: 'Home', url: 'https://apexdeliver.com/' },
      { name: 'Pricing', url: 'https://apexdeliver.com/pricing' },
    ];

    const schema = createBreadcrumbSchema(breadcrumbs);

    expect(schema.itemListElement[0].item).toBe('https://apexdeliver.com/');
    expect(schema.itemListElement[1].item).toBe('https://apexdeliver.com/pricing');
  });
});
