/**
 * ScoreDisplay Component
 *
 * Circular progress ring showing daily score (0-100)
 */

import React from 'react'
import { cn } from '@/styles/design-tokens'

export interface ScoreDisplayProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}) => {
  // Clamp score between 0-100
  const clampedScore = Math.max(0, Math.min(100, score))

  const sizeStyles = {
    sm: { diameter: 80, strokeWidth: 6, fontSize: 'text-xl' },
    md: { diameter: 120, strokeWidth: 8, fontSize: 'text-3xl' },
    lg: { diameter: 160, strokeWidth: 10, fontSize: 'text-5xl' },
  }

  const { diameter, strokeWidth, fontSize } = sizeStyles[size]
  const radius = (diameter - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clampedScore / 100) * circumference

  // Color based on score
  const getColor = () => {
    if (clampedScore >= 80) return '#10b981' // green-500
    if (clampedScore >= 60) return '#3b82f6' // blue-500
    if (clampedScore >= 40) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: diameter, height: diameter }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={diameter} height={diameter}>
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold text-gray-900', fontSize)}>
            {Math.round(clampedScore)}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="mt-2 text-sm font-medium text-gray-600">Daily Score</span>
      )}
    </div>
  )
}
