/**
 * Organization Schema (schema.org) Utilities
 * Creates structured data for ApexDeliver company information
 *
 * Last Updated: 2025-10-30
 * @see https://schema.org/Organization
 * @see https://schema.org/SoftwareApplication
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
    legalName: 'ApexDeliver Limited',
    url: 'https://100daysandbeyond.com',
    logo: 'https://100daysandbeyond.com/logo.png',
    description: 'Professional M&A intelligence platform for dealmakers worldwide. Comprehensive suite for deal flow management, financial analysis, secure data rooms, and intelligent deal matching.',
    email: 'support@apexdeliver.com',
    telephone: '+44-20-1234-5678',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressLocality: 'London',
      postalCode: 'EC1A 1BB',
      streetAddress: '123 Financial District',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+44-20-1234-5678',
        contactType: 'customer support',
        email: 'support@apexdeliver.com',
        areaServed: 'GB',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        email: 'sales@apexdeliver.com',
        contactType: 'sales',
        areaServed: ['GB', 'US', 'EU'],
      },
    ],
    sameAs: [
      'https://linkedin.com/company/apexdeliver',
      'https://twitter.com/apexdeliver',
      'https://github.com/dudleypeacockqa/M-S-SaaS-apex-deliver',
    ],
    founder: {
      '@type': 'Person',
      name: 'Dudley Peacock',
      jobTitle: 'Founder & CEO',
    },
    knowsAbout: [
      'Mergers and Acquisitions',
      'Financial Planning & Analysis',
      'Deal Flow Management',
      'Post-Merger Integration',
      'Working Capital Management',
    ],
  };
}

/**
 * Creates a SoftwareApplication schema for ApexDeliver platform
 *
 * @returns SoftwareApplication schema object
 */
export function createProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ApexDeliver M&A Intelligence Platform',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Mergers and Acquisitions Software',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: '279',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '279',
        priceCurrency: 'GBP',
        unitText: 'per month',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Comprehensive M&A platform with deal pipeline management, financial intelligence engine, secure data rooms, intelligent deal matching, and AI-powered analytics. Designed for PE firms, corporate M&A teams, and independent advisors.',
    featureList: [
      'Deal Flow & Pipeline Management',
      'Financial Intelligence Engine (47+ ratios)',
      'Secure Document & Data Room',
      'Multi-Method Valuation Suite (DCF, Comps, Precedents)',
      'Intelligent Deal Matching (AI-powered)',
      'Task Management & Workflow Automation',
      'Podcast & Content Studio',
      'Event Management Hub',
    ],
    screenshot: 'https://100daysandbeyond.com/assets/dashboard-preview.png',
    softwareVersion: '2.0',
    releaseNotes: 'Complete production release with all core features',
    author: {
      '@type': 'Organization',
      name: 'ApexDeliver',
    },
    provider: {
      '@type': 'Organization',
      name: 'ApexDeliver',
      url: 'https://100daysandbeyond.com',
    },
    url: 'https://100daysandbeyond.com',
    downloadUrl: 'https://100daysandbeyond.com/sign-up',
    softwareRequirements: 'Modern web browser (Chrome, Firefox, Safari, Edge)',
    browserRequirements: 'Requires JavaScript',
    permissions: 'Internet connection required',
  };
}
