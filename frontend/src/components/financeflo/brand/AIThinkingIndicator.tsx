import React from 'react';
import { cn } from "@/lib/utils";
import { Brain, Cpu, Zap } from 'lucide-react';

interface AIThinkingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brain' | 'cpu' | 'zap' | 'dots';
  speed?: 'slow' | 'normal' | 'fast';
}

const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ 
  className,
  size = 'md',
  variant = 'brain',
  speed = 'normal'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const speedClasses = {
    slow: 'duration-3000',
    normal: 'duration-2000',
    fast: 'duration-1000'
  };

  const IconComponent = {
    brain: Brain,
    cpu: Cpu,
    zap: Zap,
    dots: null
  }[variant];

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-gradient-to-r from-blue-500 to-teal-500",
              size === 'sm' && "w-2 h-2",
              size === 'md' && "w-3 h-3",
              size === 'lg' && "w-4 h-4",
              "animate-pulse"
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: speed === 'fast' ? '1s' : speed === 'slow' ? '3s' : '2s'
            }}
          />
        ))}
      </div>
    );
  }

  if (!IconComponent) return null;

  return (
    <div className={cn(
      "relative inline-flex items-center justify-center",
      className
    )}>
      {/* Pulsing background ring */}
      <div className={cn(
        "absolute rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 animate-ping",
        size === 'sm' && "w-6 h-6",
        size === 'md' && "w-8 h-8",
        size === 'lg' && "w-10 h-10"
      )} />
      
      {/* Inner glow ring */}
      <div className={cn(
        "absolute rounded-full bg-gradient-to-r from-blue-500/30 to-teal-500/30 animate-pulse",
        size === 'sm' && "w-5 h-5",
        size === 'md' && "w-7 h-7",
        size === 'lg' && "w-9 h-9"
      )} />
      
      {/* Icon */}
      <IconComponent 
        className={cn(
          sizeClasses[size],
          "text-blue-600 animate-ai-thinking relative z-10"
        )}
        style={{
          animationDuration: speed === 'fast' ? '1s' : speed === 'slow' ? '3s' : '2s'
        }}
      />
    </div>
  );
};

export default AIThinkingIndicator;