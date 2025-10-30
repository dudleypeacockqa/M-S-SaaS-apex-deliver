/**
 * Tests for OptimizedImage Component
 * Responsive image component with WebP/PNG fallback and lazy loading
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage } from './OptimizedImage';

describe('OptimizedImage', () => {
  describe('Basic rendering', () => {
    it('should render picture element with WebP and fallback sources', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/dashboard-preview.png"
          alt="Dashboard screenshot"
        />
      );

      const picture = container.querySelector('picture');
      expect(picture).toBeInTheDocument();

      // Check for WebP source
      const webpSource = container.querySelector('source[type="image/webp"]');
      expect(webpSource).toBeInTheDocument();
      expect(webpSource).toHaveAttribute('srcset', '/assets/dashboard-preview.webp');

      // Check for fallback img
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/assets/dashboard-preview.png');
      expect(img).toHaveAttribute('alt', 'Dashboard screenshot');
    });

    it('should render alt text on img element', () => {
      render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero image"
        />
      );

      const img = screen.getByAltText('Hero image');
      expect(img).toBeInTheDocument();
    });

    it('should apply custom className to img element', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          className="rounded-lg shadow-md"
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveClass('rounded-lg', 'shadow-md');
    });
  });

  describe('Lazy loading', () => {
    it('should apply loading="lazy" by default', () => {
      const { container } = render(
        <OptimizedImage src="/assets/hero.png" alt="Hero" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should use loading="eager" when loading prop is eager', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          loading="eager"
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('should use loading="eager" when priority is true', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          priority={true}
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Width and height attributes', () => {
    it('should apply width and height attributes when provided', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          width={1200}
          height={800}
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '1200');
      expect(img).toHaveAttribute('height', '800');
    });

    it('should not add width/height attributes when not provided', () => {
      const { container } = render(
        <OptimizedImage src="/assets/hero.png" alt="Hero" />
      );

      const img = container.querySelector('img');
      expect(img).not.toHaveAttribute('width');
      expect(img).not.toHaveAttribute('height');
    });
  });

  describe('Responsive images (srcset)', () => {
    it('should generate srcset when sizes prop is provided', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          sizes="(max-width: 768px) 100vw, 1200px"
          width={1200}
          height={800}
        />
      );

      const webpSource = container.querySelector('source[type="image/webp"]');
      const srcset = webpSource?.getAttribute('srcset');

      // Should include multiple widths
      expect(srcset).toContain('640w');
      expect(srcset).toContain('1024w');
      expect(srcset).toContain('1920w');
    });

    it('should apply sizes attribute to both source and img elements', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      );

      const webpSource = container.querySelector('source[type="image/webp"]');
      const img = container.querySelector('img');

      expect(webpSource).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 1200px');
      expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 1200px');
    });

    it('should not generate srcset when sizes prop is not provided', () => {
      const { container } = render(
        <OptimizedImage src="/assets/hero.png" alt="Hero" />
      );

      const webpSource = container.querySelector('source[type="image/webp"]');
      const srcset = webpSource?.getAttribute('srcset');

      // Should be single source, no srcset
      expect(srcset).toBe('/assets/hero.webp');
    });
  });

  describe('SVG handling', () => {
    it('should render SVG without picture element', () => {
      const { container } = render(
        <OptimizedImage
          src="/icons/logo.svg"
          alt="Logo"
        />
      );

      const picture = container.querySelector('picture');
      expect(picture).toBeNull();

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icons/logo.svg');
    });

    it('should not apply lazy loading to SVG when priority is true', () => {
      const { container } = render(
        <OptimizedImage
          src="/icons/logo.svg"
          alt="Logo"
          priority={true}
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Priority images', () => {
    it('should use eager loading when priority is true', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          priority={true}
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('should use lazy loading when priority is false', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/hero.png"
          alt="Hero"
          priority={false}
        />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    // Note: Preload link tags cannot be tested in JSDOM environment
    // They would need react-helmet or similar to move into <head>
    // In production, the PreloadHint component will work correctly
  });

  describe('Edge cases', () => {
    it('should return null for empty src (prevents page reload)', () => {
      const { container } = render(
        <OptimizedImage src="" alt="Empty" />
      );

      // Empty src should not render anything to prevent browser from reloading the page
      const img = container.querySelector('img');
      expect(img).toBeNull();
    });

    it('should handle src with query parameters', () => {
      const { container } = render(
        <OptimizedImage
          src="/assets/image.png?v=123"
          alt="Image"
        />
      );

      const webpSource = container.querySelector('source[type="image/webp"]');
      expect(webpSource).toHaveAttribute('srcset', '/assets/image.webp?v=123');
    });

    it('should handle absolute URLs', () => {
      const { container } = render(
        <OptimizedImage
          src="https://example.com/image.png"
          alt="External"
        />
      );

      const webpSource = container.querySelector('source[type="image/webp"]');
      expect(webpSource).toHaveAttribute('srcset', 'https://example.com/image.webp');
    });
  });

  describe('Accessibility', () => {
    it('should always have alt attribute', () => {
      const { container } = render(
        <OptimizedImage src="/assets/hero.png" alt="Hero image" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Hero image');
    });

    it('should support empty alt for decorative images', () => {
      const { container } = render(
        <OptimizedImage src="/assets/decoration.png" alt="" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should include decoding="async" for better UX', () => {
      const { container } = render(
        <OptimizedImage src="/assets/hero.png" alt="Hero" />
      );

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });
});
