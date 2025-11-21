// Performance optimization utilities
import { RefObject, useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

/**
 * Custom hook for intersection observer with lazy loading
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [RefObject<HTMLDivElement>, boolean] => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [elementRef, isIntersecting];
};

/**
 * Debounce hook for performance optimization
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook for scroll events and other high-frequency events
 */
export const useThrottle = <T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = useRef<T>();
  const lastCall = useRef<number>(0);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    }) as T,
    [callback, delay]
  );
};

/**
 * Performance measurement utility
 */
export const measurePerformance = (operationName: string) => {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      // Performance logging disabled for production
      if (localStorage.getItem('debug-performance') === 'true') {
        logger.debug(`⚡ ${operationName}: ${duration.toFixed(2)}ms`);
      }
      return duration;
    }
  };
};

/**
 * Image preloader for better UX
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch operations for better performance
 */
export const batchOperations = <T>(
  items: T[],
  operation: (item: T) => void,
  batchSize: number = 10
): Promise<void> => {
  return new Promise((resolve) => {
    let index = 0;
    
    const processBatch = () => {
      const endIndex = Math.min(index + batchSize, items.length);
      
      for (let i = index; i < endIndex; i++) {
        operation(items[i]);
      }
      
      index = endIndex;
      
      if (index < items.length) {
        requestAnimationFrame(processBatch);
      } else {
        resolve();
      }
    };
    
    processBatch();
  });
};