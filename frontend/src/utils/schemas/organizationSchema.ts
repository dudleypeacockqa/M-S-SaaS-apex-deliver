/**
 * Organization Schema (schema.org) Utilities
 * Creates structured data for ApexDeliver company information
 *
 * @see https://schema.org/Organization
 */

/**
 * Creates an Organization schema for ApexDeliver
 *
 * @returns Organization schema object
 */
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ApexDeliver',
    url: 'https://apexdeliver.com',
    logo: 'https://apexdeliver.com/logo.png',
    description: 'End-to-end M&A intelligence platform for deal flow management, financial analysis, and secure collaboration',
    email: 'contact@apexdeliver.com',
    telephone: '+44 20 1234 5678',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressLocality: 'London',
    },
    sameAs: [
      'https://linkedin.com/company/apexdeliver',
      'https://twitter.com/apexdeliver',
      'https://github.com/apexdeliver',
    ],
  };
}
