// Performance optimization utilities
import { logger } from '@/utils/logger';

// Image optimization
export const optimizeImageLoading = (img: HTMLImageElement, options: {
  lazy?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
} = {}) => {
  const { lazy = true, quality = 80, format = 'webp' } = options;
  
  if (lazy) {
    img.loading = 'lazy';
  }
  
  // Add quality and format parameters if supported
  const src = img.src;
  if (src.includes('?')) {
    img.src = `${src}&q=${quality}&f=${format}`;
  } else {
    img.src = `${src}?q=${quality}&f=${format}`;
  }
};

// Bundle size optimization
export const dynamicImport = async <T>(moduleFactory: () => Promise<{ default: T }>): Promise<T> => {
  try {
    const module = await moduleFactory();
    return module.default;
  } catch (error) {
    logger.error('Dynamic import failed', error as Error);
    throw error;
  }
};

// Memory management
export class MemoryManager {
  private static observers: Set<IntersectionObserver> = new Set();
  private static resizeObservers: Set<ResizeObserver> = new Set();

  static addIntersectionObserver(observer: IntersectionObserver) {
    this.observers.add(observer);
  }

  static addResizeObserver(observer: ResizeObserver) {
    this.resizeObservers.add(observer);
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.resizeObservers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.resizeObservers.clear();
  }
}

// Cache management
export class CacheManager {
  private static cache = new Map<string, { data: unknown; expires: number }>();

  static set(key: string, data: unknown, ttlMs = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }

  static get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear() {
    this.cache.clear();
  }
}

// Performance monitoring
export const measurePerformance = async <T>(
  operation: () => Promise<T> | T,
  operationName: string
): Promise<T> => {
  const start = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - start;
    
    logger.performanceLog(operationName, duration);
    
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${operationName}`, { duration });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`Operation failed: ${operationName}`, error as Error, { duration });
    throw error;
  }
};

// Resource preloading
export const preloadResource = (href: string, as: 'style' | 'script' | 'font' | 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};