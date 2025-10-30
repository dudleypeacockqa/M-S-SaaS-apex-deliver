/**
 * Tests for Image Utility Functions
 * Helpers for WebP detection, path manipulation, and srcset generation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  supportsWebP,
  getOptimizedImagePath,
  generateSrcSet,
  getImageExtension,
  convertToWebP,
} from './imageUtils';

describe('imageUtils', () => {
  describe('supportsWebP', () => {
    it('should return a boolean indicating WebP support', () => {
      const result = supportsWebP();
      expect(typeof result).toBe('boolean');
    });

    it('should detect WebP support from createElement canvas', () => {
      // In test environment, this will be false (no canvas)
      const result = supportsWebP();
      expect(result).toBe(false);
    });
  });

  describe('getImageExtension', () => {
    it('should extract extension from image path with .png', () => {
      const ext = getImageExtension('/assets/dashboard-preview.png');
      expect(ext).toBe('png');
    });

    it('should extract extension from image path with .jpg', () => {
      const ext = getImageExtension('/images/hero.jpg');
      expect(ext).toBe('jpg');
    });

    it('should extract extension from image path with .webp', () => {
      const ext = getImageExtension('/assets/image.webp');
      expect(ext).toBe('webp');
    });

    it('should handle path with query parameters', () => {
      const ext = getImageExtension('/assets/image.png?v=123');
      expect(ext).toBe('png');
    });

    it('should return empty string for path without extension', () => {
      const ext = getImageExtension('/assets/image');
      expect(ext).toBe('');
    });
  });

  describe('convertToWebP', () => {
    it('should replace .png with .webp', () => {
      const result = convertToWebP('/assets/dashboard-preview.png');
      expect(result).toBe('/assets/dashboard-preview.webp');
    });

    it('should replace .jpg with .webp', () => {
      const result = convertToWebP('/images/hero.jpg');
      expect(result).toBe('/images/hero.webp');
    });

    it('should replace .jpeg with .webp', () => {
      const result = convertToWebP('/photos/profile.jpeg');
      expect(result).toBe('/photos/profile.webp');
    });

    it('should handle path without extension', () => {
      const result = convertToWebP('/assets/image');
      expect(result).toBe('/assets/image.webp');
    });

    it('should preserve query parameters', () => {
      const result = convertToWebP('/assets/image.png?v=123');
      expect(result).toBe('/assets/image.webp?v=123');
    });

    it('should not modify .svg files', () => {
      const result = convertToWebP('/icons/logo.svg');
      expect(result).toBe('/icons/logo.svg');
    });

    it('should not modify .webp files', () => {
      const result = convertToWebP('/assets/image.webp');
      expect(result).toBe('/assets/image.webp');
    });
  });

  describe('getOptimizedImagePath', () => {
    it('should return WebP path when WebP is supported', () => {
      const result = getOptimizedImagePath('/assets/hero.png', true);
      expect(result).toBe('/assets/hero.webp');
    });

    it('should return original path when WebP is not supported', () => {
      const result = getOptimizedImagePath('/assets/hero.png', false);
      expect(result).toBe('/assets/hero.png');
    });

    it('should return SVG path unchanged regardless of WebP support', () => {
      const resultSupported = getOptimizedImagePath('/icons/logo.svg', true);
      const resultUnsupported = getOptimizedImagePath('/icons/logo.svg', false);
      expect(resultSupported).toBe('/icons/logo.svg');
      expect(resultUnsupported).toBe('/icons/logo.svg');
    });

    it('should handle .jpg files', () => {
      const result = getOptimizedImagePath('/photos/image.jpg', true);
      expect(result).toBe('/photos/image.webp');
    });
  });

  describe('generateSrcSet', () => {
    it('should generate srcset for multiple widths', () => {
      const srcset = generateSrcSet('/assets/hero.png', [640, 1024, 1920]);
      expect(srcset).toContain('/assets/hero-640w.webp 640w');
      expect(srcset).toContain('/assets/hero-1024w.webp 1024w');
      expect(srcset).toContain('/assets/hero-1920w.webp 1920w');
    });

    it('should separate entries with commas', () => {
      const srcset = generateSrcSet('/assets/hero.png', [640, 1024]);
      const entries = srcset.split(', ');
      expect(entries.length).toBe(2);
    });

    it('should handle single width', () => {
      const srcset = generateSrcSet('/assets/hero.png', [1024]);
      expect(srcset).toBe('/assets/hero-1024w.webp 1024w');
    });

    it('should preserve directory structure', () => {
      const srcset = generateSrcSet('/images/products/hero.jpg', [640, 1024]);
      expect(srcset).toContain('/images/products/hero-640w.webp 640w');
      expect(srcset).toContain('/images/products/hero-1024w.webp 1024w');
    });

    it('should handle paths without extension', () => {
      const srcset = generateSrcSet('/assets/image', [640]);
      expect(srcset).toBe('/assets/image-640w.webp 640w');
    });

    it('should return empty string for empty widths array', () => {
      const srcset = generateSrcSet('/assets/hero.png', []);
      expect(srcset).toBe('');
    });

    it('should handle .webp source images', () => {
      const srcset = generateSrcSet('/assets/hero.webp', [640, 1024]);
      expect(srcset).toContain('/assets/hero-640w.webp 640w');
      expect(srcset).toContain('/assets/hero-1024w.webp 1024w');
    });
  });
});
