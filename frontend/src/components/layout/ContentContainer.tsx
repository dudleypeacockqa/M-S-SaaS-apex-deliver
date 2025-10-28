/**
 * ContentContainer Component
 * Responsive container with max-width constraints for content sections
 */

import React from 'react'
import { cn } from '../../styles/design-tokens'

export interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
  centered?: boolean
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  maxWidth = 'xl',
  padding = true,
  centered = true,
  children,
  className,
  ...props
}) => {
  // Max-width styles
  const maxWidthStyles = {
    sm: 'max-w-screen-sm',   // 640px
    md: 'max-w-screen-md',   // 768px
    lg: 'max-w-screen-lg',   // 1024px
    xl: 'max-w-screen-xl',   // 1280px
    '2xl': 'max-w-screen-2xl', // 1536px
    full: 'max-w-full',
  }

  // Centered styles
  const centeredStyles = centered ? 'mx-auto' : ''

  // Padding styles
  const paddingStyles = padding ? 'px-4 md:px-6 lg:px-8' : ''

  return (
    <div
      className={cn(maxWidthStyles[maxWidth], centeredStyles, paddingStyles, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default ContentContainer
