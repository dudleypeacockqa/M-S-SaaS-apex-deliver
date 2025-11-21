import { useCallback } from 'react';

/**
 * Custom hook for secure external link handling
 * Automatically adds security attributes to prevent security vulnerabilities
 */
export const useSecureExternalLink = () => {
  const openSecureLink = useCallback((url: string, target: string = '_blank') => {
    const link = document.createElement('a');
    link.href = url;
    link.target = target;
    link.rel = 'noopener noreferrer';
    link.click();
  }, []);

  return { openSecureLink };
};

export default useSecureExternalLink;