import { useEffect } from 'react';
import { convertToWebP, supportsWebP } from '../../utils/imageUtils';

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
}) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Helper to optimize image URLs (auto-convert to WebP)
    const optimizeImageUrl = (url: string | undefined): string | undefined => {
      if (!url) return undefined;
      // Convert PNG/JPG to WebP for better performance
      // Social media platforms (Twitter, Facebook, LinkedIn) support WebP
      return convertToWebP(url);
    };

    // Set basic meta tags
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Set OpenGraph tags
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:type', 'website', true);

    if (ogImage) {
      // Use WebP for OG images (Facebook, LinkedIn support it)
      const optimizedOgImage = optimizeImageUrl(ogImage);
      setMetaTag('og:image', optimizedOgImage || ogImage, true);
    }

    if (ogUrl) {
      setMetaTag('og:url', ogUrl, true);
    }

    // Set Twitter Card tags
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('twitter:description', twitterDescription || ogDescription || description);

    if (twitterImage || ogImage) {
      // Use WebP for Twitter images (Twitter supports WebP since 2019)
      const imageUrl = twitterImage || ogImage || '';
      const optimizedTwitterImage = optimizeImageUrl(imageUrl);
      setMetaTag('twitter:image', optimizedTwitterImage || imageUrl);
    }

    // Set canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }

      linkElement.setAttribute('href', canonical);
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
  ]);

  return null; // This component doesn't render anything
};
