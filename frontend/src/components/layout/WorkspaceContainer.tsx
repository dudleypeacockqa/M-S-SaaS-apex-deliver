import type { FC, PropsWithChildren } from 'react'
import { cn } from '@/styles/design-tokens'

type MaxWidth = '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

const MAX_WIDTH_CLASS: Record<MaxWidth, string> = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
}

export interface WorkspaceContainerProps extends PropsWithChildren {
  /**
   * Optional custom width cap. Defaults to 7xl to mirror legacy dashboards.
   */
  maxWidth?: MaxWidth
  /**
   * Controls horizontal alignment. `start` keeps the container tight
   * against the sidebar, while `center` mirrors the old marketing pages.
   */
  align?: 'start' | 'center'
  className?: string
}

/**
 * Consistent width wrapper for authenticated workspace screens.
 * Removes the need for ad-hoc `max-w-7xl mx-auto` blocks that caused
 * the sidebar/content separation.
 */
export const WorkspaceContainer: FC<WorkspaceContainerProps> = ({
  children,
  className,
  maxWidth = '7xl',
  align = 'start',
}) => {
  return (
    <div
      className={cn(
        'w-full',
        MAX_WIDTH_CLASS[maxWidth],
        align === 'center' ? 'mx-auto' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

