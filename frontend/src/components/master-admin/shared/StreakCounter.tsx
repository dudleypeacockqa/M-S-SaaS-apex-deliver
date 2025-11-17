/**
 * StreakCounter Component
 *
 * Visual display of activity streak with fire emoji and count
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'
import { Flame } from '@/lib/icons'

export interface StreakCounterProps {
  streakDays: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streakDays,
  className,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: {
      container: 'text-sm gap-1',
      icon: 'h-4 w-4',
      number: 'text-xl',
      label: 'text-xs',
    },
    md: {
      container: 'text-base gap-2',
      icon: 'h-6 w-6',
      number: 'text-3xl',
      label: 'text-sm',
    },
    lg: {
      container: 'text-lg gap-3',
      icon: 'h-8 w-8',
      number: 'text-5xl',
      label: 'text-base',
    },
  }

  const styles = sizeStyles[size]

  // Determine color based on streak length
  const getColor = () => {
    if (streakDays === 0) return 'text-gray-400'
    if (streakDays < 3) return 'text-orange-500'
    if (streakDays < 7) return 'text-orange-600'
    if (streakDays < 30) return 'text-red-500'
    return 'text-red-600' // Long streak!
  }

  return (
    <div
      className={cn(
        'inline-flex flex-col items-center justify-center',
        styles.container,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Flame className={cn(styles.icon, getColor())} />
        <span className={cn('font-bold', styles.number, getColor())}>
          {streakDays}
        </span>
      </div>
      <span className={cn('font-medium text-gray-600', styles.label)}>
        {streakDays === 1 ? 'day streak' : 'days streak'}
      </span>
    </div>
  )
}
