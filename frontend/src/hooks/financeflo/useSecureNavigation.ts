import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecureExternalLink } from './useSecureExternalLink';

/**
 * Custom hook for secure navigation handling
 * Handles both internal React Router navigation and secure external links
 */
export const useSecureNavigation = () => {
  const navigate = useNavigate();
  const { openSecureLink } = useSecureExternalLink();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean; state?: unknown }) => {
    // Check if it's an external URL
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
      openSecureLink(path);
      return;
    }

    // Internal navigation
    navigate(path, options);
  }, [navigate, openSecureLink]);

  const navigateToExternal = useCallback((url: string, target: string = '_blank') => {
    openSecureLink(url, target);
  }, [openSecureLink]);

  return {
    navigateTo,
    navigateToExternal,
    navigate
  };
};

export default useSecureNavigation;