/**
 * GridSystem Component
 * Flexible grid layout system for responsive content
 */

import React from 'react'
import { cn } from '../../styles/design-tokens'

export interface GridSystemProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export const GridSystem: React.FC<GridSystemProps> = ({
  cols = 3,
  gap = 'md',
  responsive = true,
  children,
  className,
  ...props
}) => {
  // Base grid styles
  const baseStyles = 'grid'

  // Column styles
  const colStyles = responsive
    ? {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
        12: 'grid-cols-12',
      }
    : {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      }

  // Gap styles
  const gapStyles = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  return (
    <div className={cn(baseStyles, colStyles[cols], gapStyles[gap], className)} {...props}>
      {children}
    </div>
  )
}

export default GridSystem
