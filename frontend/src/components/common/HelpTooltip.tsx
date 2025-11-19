import React, { useId, useState, type ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'

interface HelpTooltipProps {
  content: ReactNode
  label?: string
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, label = 'Help' }) => {
  const tooltipId = useId()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      <div
        role="tooltip"
        id={tooltipId}
        aria-hidden={!isVisible}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        className={`absolute left-1/2 top-full mt-2 w-52 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg transition-opacity ${
          isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

export default HelpTooltip
