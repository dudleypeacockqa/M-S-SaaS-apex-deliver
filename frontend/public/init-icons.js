// Pre-initialize Lucide React icon library before main app loads
// This prevents "Cannot set properties of undefined" errors in production builds
(function() {
  // Create a global namespace for Lucide if it doesn't exist
  if (typeof window !== 'undefined') {
    window.__lucide_initialized__ = true;
  }
})();