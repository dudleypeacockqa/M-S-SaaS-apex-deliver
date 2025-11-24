import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object;
  noIndex?: boolean;
  noFollow?: boolean;
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  title = "FinanceFlo.ai - AI-Powered Finance Automation for UK Businesses",
  description = "Transform your finance operations with AI+ERP integration. Join 450+ UK businesses achieving 66% cost reduction and 500% ROI boost with our Adaptive Intelligence Framework™.",
  keywords = [
    "AI finance automation",
    "ERP integration UK",
    "Sage Intacct implementation",
    "Acumatica cloud ERP",
    "Odoo implementation",
    "Sage X3 manufacturing ERP",
    "finance automation software",
    "AI-powered accounting",
    "UK ERP consultants",
    "business process automation",
    "financial management system",
    "cloud accounting solutions"
  ],
  canonicalUrl,
  ogImage = "/FF-Favicon-RT.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData,
  noIndex = false,
  noFollow = false
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const finalCanonicalUrl = canonicalUrl || currentUrl;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FinanceFlo.ai",
    "description": "AI-Powered Finance Automation for UK Businesses",
    "url": "https://financeflo.ai",
    "logo": "https://financeflo.ai/assets/branding/financeflo-logo-primary.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-7360-539147",
      "contactType": "customer service",
      "areaServed": "GB",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://www.linkedin.com/company/financeflo-ai",
      "https://twitter.com/financeflo_ai"
    ],
    "offers": {
      "@type": "Offer",
      "description": "AI-powered ERP integration and finance automation services",
      "areaServed": "GB"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FinanceFlo.ai" />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@financeflo_ai" />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="FinanceFlo.ai" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en-GB" />
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      
      {/* Business-specific Meta Tags */}
      <meta name="business.contact_data.country" content="GB" />
      <meta name="business.contact_data.phone_number" content="+44-7360-539147" />
      <meta name="business.contact_data.email" content="hello@financeflo.ai" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEOOptimizer;

