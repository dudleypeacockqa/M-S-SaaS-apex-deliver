import React from 'react';
import { cn } from "@/lib/utils";

interface IntelliFlowLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'minimal';
  animated?: boolean;
}

const IntelliFlowLogo: React.FC<IntelliFlowLogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'default',
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-40 h-12',
    xl: 'w-48 h-16'
  };

  const variantStyles = {
    default: {
      primary: '#1E40AF',
      secondary: '#0891B2',
      accent: '#3B82F6',
      text: '#1E3A8A'
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      accent: '#E2E8F0',
      text: '#FFFFFF'
    },
    minimal: {
      primary: '#1E40AF',
      secondary: '#0891B2',
      accent: '#3B82F6',
      text: '#1E3A8A'
    }
  };

  const colors = variantStyles[variant];

  return (
    <div className={cn(
      "flex items-center space-x-2",
      sizeClasses[size],
      animated && "animate-ai-pulse",
      className
    )}>
      {/* Brain/Neural Network Icon */}
      <div className="relative">
        <svg
          viewBox="0 0 40 40"
          className={cn(
            "w-8 h-8",
            size === 'sm' && "w-6 h-6",
            size === 'lg' && "w-10 h-10",
            size === 'xl' && "w-12 h-12",
            animated && "animate-ai-thinking"
          )}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural Network Pattern */}
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.accent} />
            </linearGradient>
            {animated && (
              <animate attributeName="stop-color" dur="3s" repeatCount="indefinite">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </animate>
            )}
          </defs>
          
          {/* Brain outline */}
          <path
            d="M20 4C26 4 30 8 32 14C34 16 35 19 35 22C35 28 32 32 28 34C26 35 23 36 20 36C17 36 14 35 12 34C8 32 5 28 5 22C5 19 6 16 8 14C10 8 14 4 20 4Z"
            fill="url(#brainGradient)"
            opacity="0.8"
          />
          
          {/* Neural connections */}
          <circle cx="12" cy="15" r="2" fill={colors.accent} opacity="0.9" />
          <circle cx="20" cy="12" r="2" fill={colors.primary} opacity="0.9" />
          <circle cx="28" cy="15" r="2" fill={colors.secondary} opacity="0.9" />
          <circle cx="15" cy="22" r="2" fill={colors.secondary} opacity="0.9" />
          <circle cx="25" cy="22" r="2" fill={colors.accent} opacity="0.9" />
          <circle cx="20" cy="28" r="2" fill={colors.primary} opacity="0.9" />
          
          {/* Connection lines */}
          <line x1="12" y1="15" x2="20" y2="12" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
          <line x1="20" y1="12" x2="28" y2="15" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
          <line x1="12" y1="15" x2="15" y2="22" stroke={colors.secondary} strokeWidth="1" opacity="0.6" />
          <line x1="28" y1="15" x2="25" y2="22" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
          <line x1="15" y1="22" x2="25" y2="22" stroke={colors.primary} strokeWidth="1" opacity="0.6" />
          <line x1="15" y1="22" x2="20" y2="28" stroke={colors.secondary} strokeWidth="1" opacity="0.6" />
          <line x1="25" y1="22" x2="20" y2="28" stroke={colors.accent} strokeWidth="1" opacity="0.6" />
          
          {animated && (
            <>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 20 20;360 20 20"
                dur="20s"
                repeatCount="indefinite"
              />
            </>
          )}
        </svg>
        
        {animated && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 animate-ping" />
        )}
      </div>

      {/* Text Logo */}
      <div className="flex flex-col">
        <h1 
          className={cn(
            "font-bold tracking-tight brand-heading",
            size === 'sm' && "text-lg",
            size === 'md' && "text-xl",
            size === 'lg' && "text-2xl", 
            size === 'xl' && "text-3xl",
            variant === 'white' ? "text-white" : "text-blue-900"
          )}
          style={{ 
            background: variant !== 'white' ? 'linear-gradient(135deg, #1E40AF 0%, #0891B2 50%, #3B82F6 100%)' : undefined,
            backgroundClip: variant !== 'white' ? 'text' : undefined,
            WebkitBackgroundClip: variant !== 'white' ? 'text' : undefined,
            color: variant !== 'white' ? 'transparent' : colors.text
          }}
        >
          IntelliFlow
        </h1>
        <span 
          className={cn(
            "text-xs font-medium tracking-wider uppercase",
            size === 'sm' && "text-[10px]",
            size === 'lg' && "text-sm",
            size === 'xl' && "text-base",
            variant === 'white' ? "text-gray-200" : "text-teal-600"
          )}
        >
          AI iPaaS Platform
        </span>
      </div>
    </div>
  );
};

export default IntelliFlowLogo;