import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

export interface BrandIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'outline' | 'gradient';
}

// Brain/Cognitive Icon
export const BrainIcon: React.FC<BrandIconProps> = ({ className, size = 'md', variant = 'filled' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(218 100% 35%)" />
          <stop offset="50%" stopColor="hsl(193 76% 36%)" />
          <stop offset="100%" stopColor="hsl(210 100% 60%)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C15.5 2 18 4.5 18.5 8C19.5 8.5 20.5 9.5 20.5 11C20.5 13.5 18.5 15.5 16 16C15.5 16.5 14.5 17 12 17C9.5 17 8.5 16.5 8 16C5.5 15.5 3.5 13.5 3.5 11C3.5 9.5 4.5 8.5 5.5 8C6 4.5 8.5 2 12 2Z"
        fill={variant === 'gradient' ? 'url(#brainGradient)' : variant === 'filled' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      <circle cx="9" cy="9" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="15" cy="9" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8" />
    </svg>
  );
};

// Neural Network Icon
export const NeuralIcon: React.FC<BrandIconProps> = ({ className, size = 'md', variant = 'filled' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(218 100% 35%)" />
          <stop offset="50%" stopColor="hsl(193 76% 36%)" />
          <stop offset="100%" stopColor="hsl(210 100% 60%)" />
        </linearGradient>
      </defs>
      
      {/* Connection lines */}
      <line x1="6" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="18" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="18" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      
      {/* Nodes */}
      <circle 
        cx="6" cy="6" r="2" 
        fill={variant === 'gradient' ? 'url(#neuralGradient)' : 'currentColor'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      <circle 
        cx="18" cy="6" r="2" 
        fill={variant === 'gradient' ? 'url(#neuralGradient)' : 'currentColor'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      <circle 
        cx="12" cy="12" r="3" 
        fill={variant === 'gradient' ? 'url(#neuralGradient)' : 'currentColor'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      <circle 
        cx="6" cy="18" r="2" 
        fill={variant === 'gradient' ? 'url(#neuralGradient)' : 'currentColor'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      <circle 
        cx="18" cy="18" r="2" 
        fill={variant === 'gradient' ? 'url(#neuralGradient)' : 'currentColor'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
    </svg>
  );
};

// AI Agent Icon
export const AIAgentIcon: React.FC<BrandIconProps> = ({ className, size = 'md', variant = 'filled' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="agentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(218 100% 35%)" />
          <stop offset="50%" stopColor="hsl(193 76% 36%)" />
          <stop offset="100%" stopColor="hsl(210 100% 60%)" />
        </linearGradient>
      </defs>
      
      {/* Head */}
      <circle 
        cx="12" cy="8" r="4" 
        fill={variant === 'gradient' ? 'url(#agentGradient)' : variant === 'filled' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      
      {/* Body */}
      <path
        d="M8 14C8 13 9 12 10 12H14C15 12 16 13 16 14V20H8V14Z"
        fill={variant === 'gradient' ? 'url(#agentGradient)' : variant === 'filled' ? 'currentColor' : 'none'}
        stroke={variant === 'outline' ? 'currentColor' : 'none'}
        strokeWidth={variant === 'outline' ? '2' : '0'}
      />
      
      {/* AI Elements */}
      <circle cx="10" cy="6" r="0.5" fill="white" opacity="0.8" />
      <circle cx="14" cy="6" r="0.5" fill="white" opacity="0.8" />
      <path d="M10 9L12 10L14 9" stroke="white" strokeWidth="1" opacity="0.6" />
    </svg>
  );
};

// Automation Flow Icon
export const AutomationIcon: React.FC<BrandIconProps> = ({ className, size = 'md', variant = 'filled' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="automationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(218 100% 35%)" />
          <stop offset="50%" stopColor="hsl(193 76% 36%)" />
          <stop offset="100%" stopColor="hsl(210 100% 60%)" />
        </linearGradient>
      </defs>
      
      {/* Flow arrows */}
      <path
        d="M3 12H7M17 12H21M7 8L11 12L7 16M13 8L17 12L13 16"
        stroke={variant === 'gradient' ? 'url(#automationGradient)' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Nodes */}
      <circle 
        cx="3" cy="12" r="2" 
        fill={variant === 'gradient' ? 'url(#automationGradient)' : 'currentColor'}
      />
      <circle 
        cx="21" cy="12" r="2" 
        fill={variant === 'gradient' ? 'url(#automationGradient)' : 'currentColor'}
      />
    </svg>
  );
};

// Predictive Analytics Icon
export const PredictiveIcon: React.FC<BrandIconProps> = ({ className, size = 'md', variant = 'filled' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="predictiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(218 100% 35%)" />
          <stop offset="50%" stopColor="hsl(193 76% 36%)" />
          <stop offset="100%" stopColor="hsl(210 100% 60%)" />
        </linearGradient>
      </defs>
      
      {/* Chart bars */}
      <rect x="3" y="16" width="3" height="5" fill="currentColor" opacity="0.6" />
      <rect x="7" y="12" width="3" height="9" fill="currentColor" opacity="0.7" />
      <rect x="11" y="8" width="3" height="13" fill="currentColor" opacity="0.8" />
      <rect x="15" y="4" width="3" height="17" fill={variant === 'gradient' ? 'url(#predictiveGradient)' : 'currentColor'} />
      
      {/* Prediction line */}
      <path
        d="M18 4L22 2"
        stroke={variant === 'gradient' ? 'url(#predictiveGradient)' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
};

export const BrandIconComponents = {
  BrainIcon,
  NeuralIcon,
  AIAgentIcon,
  AutomationIcon,
  PredictiveIcon
};