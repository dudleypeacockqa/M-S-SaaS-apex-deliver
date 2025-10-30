/**
 * Breadcrumbs Navigation Component
 * Displays navigation breadcrumbs with schema.org structured data
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { createBreadcrumbSchema, type Breadcrumb as BreadcrumbType } from '../../utils/schemas/breadcrumbSchema';

interface BreadcrumbsProps {
  items: BreadcrumbType[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  // Generate structured data for SEO
  const breadcrumbSchema = createBreadcrumbSchema(items);

  return (
    <>
      {/* BreadcrumbList Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                {!isLast ? (
                  <>
                    <Link
                      to={item.url}
                      className="hover:text-indigo-900 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <span className="breadcrumb-separator mx-2 text-gray-400">
                      →
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-gray-900">
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
