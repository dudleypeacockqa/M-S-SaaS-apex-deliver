import React, { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Enhanced lazy loading utility that adds preloading capabilities
 * @param importFn - The import function for the component
 * @param preload - Whether to preload the component immediately
 * @returns LazyExoticComponent with preload method
 */
export function optimizedLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preload = false
): LazyExoticComponent<T> & { preload: () => void } {
  const lazyComponent = lazy(importFn);
  
  // Add preload method to the lazy component
  const enhancedComponent = lazyComponent as LazyExoticComponent<T> & { preload: () => void };
  
  // Define the preload method
  enhancedComponent.preload = () => {
    // Start loading the component
    importFn().catch(err => {
      // Use structured logging instead of console.warn
      import('@/utils/logger').then(({ logger }) => {
        logger.warn('Error preloading component', err);
      });
    });
  };
  
  // Preload immediately if requested
  if (preload) {
    enhancedComponent.preload();
  }
  
  return enhancedComponent;
}

/**
 * Preload multiple components in parallel
 * @param components - Array of components with preload method
 */
export function preloadComponents(components: Array<{ preload: () => void }>) {
  components.forEach(component => {
    component.preload();
  });
}

/**
 * Preload components after a delay (useful for preloading after initial render)
 * @param components - Array of components with preload method
 * @param delay - Delay in milliseconds before preloading
 */
export function preloadAfterDelay(components: Array<{ preload: () => void }>, delay = 2000) {
  setTimeout(() => {
    preloadComponents(components);
  }, delay);
}

