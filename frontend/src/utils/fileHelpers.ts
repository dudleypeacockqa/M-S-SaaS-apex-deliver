/**
 * File Helper Utilities
 * Common functions for file handling and formatting
 */

/**
 * Format file size in bytes to human-readable string
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "2.4 MB", "500.0 KB", "350 B")
 */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Calculate overall progress from multiple items
 * @param items Array of items with progress property
 * @returns Average progress percentage (0-100)
 */
export const calculateOverallProgress = (items: Array<{ progress: number }>): number => {
  if (items.length === 0) return 0;
  const totalProgress = items.reduce((sum, item) => sum + item.progress, 0);
  return Math.round(totalProgress / items.length);
};
