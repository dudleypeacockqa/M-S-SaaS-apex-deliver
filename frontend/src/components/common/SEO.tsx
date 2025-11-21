import { useEffect, type FC } from 'react';
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
  structuredData?: StructuredDataArticle | Record<string, unknown>;
}

const STRUCTURED_DATA_ID = 'seo-structured-data';

export const SEO: FC<SEOProps> = ({
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
  const optimizeImageUrl = (url: string | undefined): string | undefined => {
    if (!url) {
      return undefined;
    }
    return convertToWebP(url);
  };

  const optimizedOgImage = optimizeImageUrl(ogImage) ?? ogImage;
  const optimizedTwitterImage =
    optimizeImageUrl(twitterImage ?? ogImage) ?? twitterImage ?? ogImage;

  const dataWithContext = structuredData
    ? {
        '@context': 'https://schema.org',
        ...structuredData,
      }
    : null;

  const structuredDataPayload = dataWithContext ? JSON.stringify(dataWithContext) : null;

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const previousTitle = document.title;
    document.title = title;

    const cleanups: Array<() => void> = [];

    const setMetaTag = (
      attribute: 'name' | 'property',
      key: string,
      content?: string,
    ) => {
      if (!content) {
        return;
      }

      const selector =
        attribute === 'name'
          ? `meta[name="${key}"]`
          : `meta[property="${key}"]`;

      let element = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (element) {
        const previousContent = element.getAttribute('content');
        element.setAttribute('content', content);
        cleanups.push(() => {
          if (previousContent !== null) {
            element!.setAttribute('content', previousContent);
          } else {
            element!.remove();
          }
        });
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        element.setAttribute('content', content);
        document.head.appendChild(element);
        const createdElement = element;
        cleanups.push(() => {
          createdElement.remove();
        });
      }
    };

    const setLinkTag = (rel: string, href?: string) => {
      if (!href) {
        return;
      }

      const selector = `link[rel="${rel}"]`;
      let element = document.head.querySelector(selector) as HTMLLinkElement | null;

      if (element) {
        const previousHref = element.getAttribute('href');
        element.setAttribute('href', href);
        cleanups.push(() => {
          if (previousHref !== null) {
            element!.setAttribute('href', previousHref);
          } else {
            element!.remove();
          }
        });
      } else {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        element.setAttribute('href', href);
        document.head.appendChild(element);
        const createdElement = element;
        cleanups.push(() => {
          createdElement.remove();
        });
      }
    };

    const existingStructured = document.getElementById(
      STRUCTURED_DATA_ID,
    ) as HTMLScriptElement | null;

    const applyStructuredData = (payload: string | null) => {
      if (!payload) {
        if (existingStructured) {
          const elementRef = existingStructured;
          const previousContent = elementRef.textContent;
          elementRef.remove();
          cleanups.push(() => {
            if (previousContent !== null) {
              elementRef.textContent = previousContent;
              document.head.appendChild(elementRef);
            }
          });
        }
        return;
      }

      if (existingStructured) {
        const previousContent = existingStructured.textContent;
        existingStructured.textContent = payload;
        cleanups.push(() => {
          if (previousContent !== null) {
            existingStructured.textContent = previousContent;
          } else {
            existingStructured.remove();
          }
        });
      } else {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = STRUCTURED_DATA_ID;
        script.textContent = payload;
        document.head.appendChild(script);
        cleanups.push(() => {
          script.remove();
        });
      }
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('property', 'og:title', ogTitle ?? title);
    setMetaTag('property', 'og:description', ogDescription ?? description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:image', optimizedOgImage);
    setMetaTag('property', 'og:url', ogUrl);
    setMetaTag('name', 'twitter:card', twitterCard);
    setMetaTag('name', 'twitter:title', twitterTitle ?? ogTitle ?? title);
    setMetaTag(
      'name',
      'twitter:description',
      twitterDescription ?? ogDescription ?? description,
    );
    setMetaTag('name', 'twitter:image', optimizedTwitterImage);
    setLinkTag('canonical', canonical);
    applyStructuredData(structuredDataPayload);

    return () => {
      document.title = previousTitle;
      while (cleanups.length > 0) {
        const cleanup = cleanups.pop();
        cleanup?.();
      }
    };
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    optimizedOgImage,
    ogUrl,
    twitterCard,
    twitterTitle,
    twitterDescription,
    optimizedTwitterImage,
    canonical,
    structuredDataPayload,
  ]);

  return null;
};
