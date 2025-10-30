/**
 * BreadcrumbList Schema (schema.org) Utilities
 * Creates structured data for navigation breadcrumbs
 *
 * @see https://schema.org/BreadcrumbList
 */

interface Breadcrumb {
  name: string;
  url: string;
}

/**
 * Creates a BreadcrumbList schema for navigation breadcrumbs
 *
 * @param breadcrumbs - Array of breadcrumb items (name + url)
 * @returns BreadcrumbList schema object
 */
export function createBreadcrumbSchema(breadcrumbs: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

/**
 * Type exports for external use
 */
export type { Breadcrumb };
