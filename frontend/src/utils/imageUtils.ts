/**
 * Image Utility Functions
 * Helpers for WebP detection, path manipulation, and srcset generation
 */

/**
 * Detect if the browser supports WebP images
 * Uses canvas.toDataURL() method to check for WebP support
 *
 * @returns true if WebP is supported, false otherwise
 */
export function supportsWebP(): boolean {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // Check if canvas.toDataURL supports WebP
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  } catch (err) {
    return false;
  }

  return false;
}

/**
 * Extract file extension from image path
 *
 * @param path - Image file path
 * @returns File extension without the dot (e.g., "png", "jpg")
 */
export function getImageExtension(path: string): string {
  // Remove query parameters first
  const pathWithoutQuery = path.split('?')[0];

  // Extract extension
  const match = pathWithoutQuery.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Convert image path to WebP version
 * Replaces .png, .jpg, .jpeg extensions with .webp
 * Leaves .svg and .webp unchanged
 *
 * @param path - Original image path
 * @returns Path with .webp extension
 */
export function convertToWebP(path: string): string {
  const ext = getImageExtension(path);

  // Don't convert SVG or already-WebP images
  if (ext === 'svg' || ext === 'webp') {
    return path;
  }

  // Split path and query parameters
  const [pathPart, queryPart] = path.split('?');

  // Replace extension with .webp
  let webpPath: string;
  if (ext) {
    webpPath = pathPart.replace(new RegExp(`\\.${ext}$`, 'i'), '.webp');
  } else {
    webpPath = pathPart + '.webp';
  }

  // Re-add query parameters if they existed
  return queryPart ? `${webpPath}?${queryPart}` : webpPath;
}

/**
 * Get optimized image path based on WebP support
 * Returns WebP version if supported, original otherwise
 *
 * @param path - Original image path
 * @param webpSupported - Whether WebP is supported (default: auto-detect)
 * @returns Optimized image path
 */
export function getOptimizedImagePath(
  path: string,
  webpSupported: boolean = supportsWebP()
): string {
  const ext = getImageExtension(path);

  // SVG is already optimal, return unchanged
  if (ext === 'svg') {
    return path;
  }

  // Return WebP version if supported
  if (webpSupported) {
    return convertToWebP(path);
  }

  // Return original path if WebP not supported
  return path;
}

/**
 * Generate srcset attribute for responsive images
 * Creates entries for each width with -Xw suffix
 *
 * @param basePath - Base image path (without width suffix)
 * @param widths - Array of widths for responsive images
 * @returns srcset string (e.g., "image-640w.webp 640w, image-1024w.webp 1024w")
 */
export function generateSrcSet(basePath: string, widths: number[]): string {
  if (widths.length === 0) {
    return '';
  }

  // Extract path components
  const ext = getImageExtension(basePath);
  const [pathPart, queryPart] = basePath.split('?');

  // Remove extension from path
  let basePathWithoutExt: string;
  if (ext) {
    basePathWithoutExt = pathPart.replace(new RegExp(`\\.${ext}$`, 'i'), '');
  } else {
    basePathWithoutExt = pathPart;
  }

  // Generate srcset entries
  const entries = widths.map((width) => {
    const widthPath = `${basePathWithoutExt}-${width}w.webp`;
    const fullPath = queryPart ? `${widthPath}?${queryPart}` : widthPath;
    return `${fullPath} ${width}w`;
  });

  return entries.join(', ');
}
