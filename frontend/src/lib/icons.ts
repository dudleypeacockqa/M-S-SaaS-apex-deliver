/**
 * Centralized icon exports with forced initialization
 *
 * CRITICAL: This file MUST have side effects to prevent Vite from tree-shaking
 * the import in main.tsx. Without side effects, production builds remove the
 * import entirely, causing "Cannot set properties of undefined" errors.
 */

// Import everything to create module initialization side effect
import * as LucideIcons from 'lucide-react'

// Force initialization by touching the window object (prevents tree-shaking)
// This ensures Vite cannot remove the import from main.tsx during production builds
if (typeof window !== 'undefined') {
  // Store reference to prevent tree-shaking optimization
  (window as any).__LUCIDE_ICONS__ = LucideIcons
  console.log('[Icons] Lucide React initialized:', Object.keys(LucideIcons).length, 'exports')
}

// Re-export everything for component imports
export * from 'lucide-react'
export type { LucideIcon } from 'lucide-react'
