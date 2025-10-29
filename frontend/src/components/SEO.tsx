import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title,
  description = "The end-to-end M&A intelligence platform. From deal flow to cash flow, ApexDeliver + CapLiquify unifies your entire M&A lifecycle into a single, intelligent, and automated platform.",
  keywords = "M&A software, deal flow management, due diligence, valuation, FP&A, cash flow forecasting, working capital management, pricing strategy, post-merger integration",
  ogImage = "https://apex-cap.com/og-image.png",
  ogType = "website",
  canonicalUrl,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | ApexDeliver + CapLiquify`;
    } else {
      document.title = "ApexDeliver + CapLiquify | End-to-End M&A Intelligence Platform";
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title || 'ApexDeliver + CapLiquify | End-to-End M&A Intelligence Platform', true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || 'ApexDeliver + CapLiquify | End-to-End M&A Intelligence Platform');
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonicalUrl);
    }
  }, [title, description, keywords, ogImage, ogType, canonicalUrl]);

  return null;
}
