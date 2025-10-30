/**
 * OptimizedImage Component
 * Responsive image component with WebP/PNG fallback, lazy loading, and preload hints
 *
 * Features:
 * - Automatic WebP with PNG/JPG fallback using <picture> element
 * - Lazy loading by default (unless priority=true)
 * - Responsive images via srcset/sizes
 * - Preload hints for critical images (priority=true)
 * - CLS prevention via width/height attributes
 * - Accessibility via required alt attribute
 */

import React from 'react';
import { convertToWebP, generateSrcSet, getImageExtension } from '../../utils/imageUtils';

export interface OptimizedImageProps {
  /** Image source path (without extension for WebP conversion, or full path for SVG) */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /** Image width in pixels (helps prevent CLS) */
  width?: number;
  /** Image height in pixels (helps prevent CLS) */
  height?: number;
  /** Responsive sizes attribute (e.g., "(max-width: 768px) 100vw, 1200px") */
  sizes?: string;
  /** CSS class name */
  className?: string;
  /** Loading strategy: 'lazy' (default) or 'eager' */
  loading?: 'lazy' | 'eager';
  /** If true, use eager loading and generate preload hint (for above-the-fold images) */
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  loading = 'lazy',
  priority = false,
}) => {
  // Determine actual loading strategy
  const loadingStrategy = priority ? 'eager' : loading;

  // Extract file extension
  const ext = getImageExtension(src);

  // SVG images don't need WebP conversion or picture element
  if (ext === 'svg') {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loadingStrategy}
        decoding="async"
      />
    );
  }

  // Generate WebP path
  const webpSrc = convertToWebP(src);

  // Validate src (empty string can cause full page reload)
  if (!src) {
    return null;
  }

  // Generate srcset for responsive images (if sizes provided)
  const webpSrcSet = sizes ? generateSrcSet(src, [640, 1024, 1920]) : webpSrc;
  const fallbackSrcSet = sizes ? generateSrcSet(src, [640, 1024, 1920]).replace(/\.webp/g, `.${ext || 'png'}`) : src;

  // Generate preload hint for critical images
  // Note: This renders into the document head via React's internal mechanism
  const PreloadHint = priority ? (
    <link
      rel="preload"
      as="image"
      href={webpSrc}
      type="image/webp"
      // @ts-ignore - React doesn't have types for image preload attributes
      imageSrcSet={sizes ? webpSrcSet : undefined}
      imageSizes={sizes}
    />
  ) : null;

  return (
    <>
      {PreloadHint}
      <picture>
        {/* WebP source (primary) */}
        <source
          type="image/webp"
          srcSet={webpSrcSet}
          {...(sizes && { sizes })}
        />

        {/* Fallback img element (PNG/JPG for older browsers) */}
        <img
          src={src}
          srcSet={sizes ? fallbackSrcSet : undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={className}
          loading={loadingStrategy}
          decoding="async"
        />
      </picture>
    </>
  );
};
