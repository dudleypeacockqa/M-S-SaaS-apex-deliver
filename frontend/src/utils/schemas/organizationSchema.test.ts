/**
 * Tests for Organization Schema (schema.org)
 * Used for ApexDeliver company information
 */

import { describe, it, expect } from 'vitest';
import { createOrganizationSchema } from './organizationSchema';

describe('organizationSchema', () => {
  it('should create valid Organization schema with all fields', () => {
    const schema = createOrganizationSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('ApexDeliver');
    expect(schema.url).toBe('https://100daysandbeyond.com');
    expect(schema.logo).toContain('logo.png');
    expect(schema.description).toContain('M&A intelligence platform');
  });

  it('should include contact information', () => {
    const schema = createOrganizationSchema();

    expect(schema.email).toBe('support@apexdeliver.com');
    expect(schema.telephone).toBeTruthy();
  });

  it('should include social media profiles (sameAs array)', () => {
    const schema = createOrganizationSchema();

    expect(schema.sameAs).toBeInstanceOf(Array);
    expect(schema.sameAs.length).toBeGreaterThan(0);
    expect(schema.sameAs).toContain('https://linkedin.com/company/apexdeliver');
  });

  it('should include address information', () => {
    const schema = createOrganizationSchema();

    expect(schema.address).toMatchObject({
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    });
  });
});
