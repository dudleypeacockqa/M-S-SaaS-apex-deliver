import React from 'react';
import { cn } from "@/lib/utils";

interface DataFlowVisualizationProps {
  className?: string;
  direction?: 'horizontal' | 'vertical';
  speed?: 'slow' | 'normal' | 'fast';
  density?: 'low' | 'medium' | 'high';
}

const DataFlowVisualization: React.FC<DataFlowVisualizationProps> = ({ 
  className,
  direction = 'horizontal',
  speed = 'normal',
  density = 'medium'
}) => {
  const particleCount = {
    low: 5,
    medium: 10,
    high: 15
  }[density];

  const animationDuration = {
    slow: '3s',
    normal: '2s', 
    fast: '1s'
  }[speed];

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: (i * 0.2) % 2,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.6 + 0.4
  }));

  return (
    <div className={cn(
      "relative overflow-hidden",
      direction === 'horizontal' ? "w-full h-2" : "w-2 h-full",
      className
    )}>
      {/* Flow track */}
      <div className={cn(
        "absolute bg-gradient-to-r from-transparent via-blue-500/20 to-transparent",
        direction === 'horizontal' ? "w-full h-full" : "w-full h-full rotate-90"
      )} />

      {/* Data particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute rounded-full bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg",
            direction === 'horizontal' ? "animate-data-flow" : "animate-data-flow-vertical"
          )}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: animationDuration,
            opacity: particle.opacity,
            top: direction === 'horizontal' ? '50%' : `${Math.random() * 80 + 10}%`,
            left: direction === 'vertical' ? '50%' : `${Math.random() * 80 + 10}%`,
            transform: direction === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)'
          }}
        />
      ))}

      {/* Glowing end points */}
      <div className={cn(
        "absolute w-3 h-3 rounded-full bg-blue-500 shadow-lg animate-pulse",
        direction === 'horizontal' ? "left-0 top-1/2 -translate-y-1/2" : "top-0 left-1/2 -translate-x-1/2"
      )} />
      <div className={cn(
        "absolute w-3 h-3 rounded-full bg-teal-500 shadow-lg animate-pulse",
        direction === 'horizontal' ? "right-0 top-1/2 -translate-y-1/2" : "bottom-0 left-1/2 -translate-x-1/2"
      )} />
    </div>
  );
};

export default DataFlowVisualization;