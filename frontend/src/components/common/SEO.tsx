import React from 'react';
import { Helmet } from 'react-helmet-async';
import { convertToWebP } from '../../utils/imageUtils';

export interface StructuredDataArticle {
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  description: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  structuredData?: StructuredDataArticle | Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonical,
  structuredData,
}) => {
  // Helper to optimize image URLs (auto-convert to WebP)
  const optimizeImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Convert PNG/JPG to WebP for better performance
    // Social media platforms (Twitter, Facebook, LinkedIn) support WebP
    return convertToWebP(url);
  };

  const optimizedOgImage = optimizeImageUrl(ogImage) || ogImage;
  const optimizedTwitterImage = optimizeImageUrl(twitterImage || ogImage) || twitterImage || ogImage;

  const dataWithContext = structuredData ? {
    '@context': 'https://schema.org',
    ...structuredData,
  } : null;

  return (
    <Helmet>
      {/* Set document title */}
      <title>{title}</title>

      {/* Set basic meta tags */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Set OpenGraph tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      {optimizedOgImage && <meta property="og:image" content={optimizedOgImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}

      {/* Set Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {optimizedTwitterImage && <meta name="twitter:image" content={optimizedTwitterImage} />}

      {/* Set canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Add structured data (JSON-LD) */}
      {dataWithContext && (
        <script type="application/ld+json">
          {JSON.stringify(dataWithContext)}
        </script>
      )}
    </Helmet>
  );
};
