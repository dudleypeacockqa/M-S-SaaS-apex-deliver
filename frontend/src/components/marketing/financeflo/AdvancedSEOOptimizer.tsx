import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, unknown>;
  alternateUrls?: { [key: string]: string };
  noindex?: boolean;
  nofollow?: boolean;
}

interface AdvancedSEOOptimizerProps {
  seoData: SEOData;
  children?: React.ReactNode;
}

const AdvancedSEOOptimizer: React.FC<AdvancedSEOOptimizerProps> = ({ seoData, children }) => {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage = "/FF-Favicon-RT.png",
    ogType = "website",
    twitterCard = "summary_large_image",
    structuredData,
    alternateUrls,
    noindex = false,
    nofollow = false
  } = seoData;

  // Generate robots meta tag
  const robotsContent = [];
  if (noindex) robotsContent.push("noindex");
  if (nofollow) robotsContent.push("nofollow");
  if (robotsContent.length === 0) robotsContent.push("index", "follow");

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FinanceFlo.ai",
    "url": "https://flo-finance-uk-website.lovable.app",
    "logo": "https://flo-finance-uk-website.lovable.app/images/logo.png",
    "description": "AI-powered ERP implementation and financial transformation solutions for UK mid-market businesses",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressRegion": "England"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-7492-882175",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://linkedin.com/company/financeflo-ai",
      "https://twitter.com/financeflo_ai"
    ]
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="robots" content={robotsContent.join(", ")} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Alternate URLs for internationalization */}
        {alternateUrls && Object.entries(alternateUrls).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="FinanceFlo.ai" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@financeflo_ai" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="FinanceFlo.ai" />
        <meta name="publisher" content="FinanceFlo.ai" />
        <meta name="copyright" content="© 2025 FinanceFlo.ai. All rights reserved." />
        <meta name="language" content="English" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="United Kingdom" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Performance and Caching */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
        <meta httpEquiv="Expires" content="31536000" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData || defaultStructuredData)}
        </script>
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </Helmet>
      {children}
    </>
  );
};

// SEO utility functions
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "FinanceFlo.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flo-finance-uk-website.lovable.app/images/logo.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "image": article.image || "https://flo-finance-uk-website.lovable.app/images/og-default.jpg",
    "url": article.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
};

export const generateServiceStructuredData = (service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  serviceType: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": service.provider
    },
    "areaServed": {
      "@type": "Country",
      "name": service.areaServed
    },
    "serviceType": service.serviceType,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ERP Implementation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sage Intacct Implementation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Acumatica Implementation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Odoo Implementation"
          }
        }
      ]
    }
  };
};

export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default AdvancedSEOOptimizer;

