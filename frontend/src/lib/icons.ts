/**
 * Centralized icon exports - direct re-exports from lucide-react
 *
 * NOTE: This file exists solely for import path consistency.
 * It does NOT pre-load icons - they load on-demand when components import them.
 */

// Re-export everything from lucide-react
export * from 'lucide-react'

// Explicit re-exports for commonly used icons (helps with tree-shaking)
export type { LucideIcon } from 'lucide-react'
