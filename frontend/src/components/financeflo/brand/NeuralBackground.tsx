import React from 'react';
import { cn } from "@/lib/utils";

interface NeuralBackgroundProps {
  className?: string;
  variant?: 'subtle' | 'prominent' | 'animated';
  opacity?: number;
}

const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ 
  className, 
  variant = 'subtle',
  opacity = 0.1 
}) => {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3
  }));

  const connections = nodes.map((node, i) => {
    const connectedNodes = nodes
      .filter((_, j) => j !== i)
      .filter(() => Math.random() > 0.7)
      .slice(0, 3);
    
    return connectedNodes.map(target => ({
      from: node,
      to: target,
      opacity: Math.random() * 0.6 + 0.2
    }));
  }).flat();

  return (
    <div 
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        variant === 'animated' && "animate-neural-flow",
        className
      )}
      style={{ opacity }}
    >
      {/* Neural Network SVG */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(218 100% 35%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(193 76% 36%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(210 100% 60%)" stopOpacity="0.4" />
          </linearGradient>
          
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(218 100% 35%)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(193 76% 36%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(210 100% 60%)" stopOpacity="0.3" />
          </linearGradient>

          {variant === 'animated' && (
            <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
          )}
        </defs>

        {/* Connection lines */}
        {connections.map((connection, i) => (
          <line
            key={i}
            x1={connection.from.x}
            y1={connection.from.y}
            x2={connection.to.x}
            y2={connection.to.y}
            stroke="url(#connectionGradient)"
            strokeWidth="0.2"
            opacity={connection.opacity}
          >
            {variant === 'animated' && (
              <animate
                attributeName="opacity"
                values={`0;${connection.opacity};0`}
                dur={`${2 + Math.random() * 2}s`}
                repeatCount="indefinite"
                begin={`${Math.random() * 2}s`}
              />
            )}
          </line>
        ))}

        {/* Neural nodes */}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size / 10}
            fill="url(#nodeGradient)"
            opacity="0.8"
          >
            {variant === 'animated' && (
              <>
                <animate
                  attributeName="r"
                  values={`${node.size / 10};${(node.size + 2) / 10};${node.size / 10}`}
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${node.delay}s`}
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${node.delay}s`}
                />
              </>
            )}
          </circle>
        ))}
      </svg>

      {/* Overlay gradient for depth */}
      <div 
        className={cn(
          "absolute inset-0",
          variant === 'prominent' ? 
            "bg-gradient-to-br from-blue-500/5 via-teal-500/10 to-blue-600/5" :
            "bg-gradient-to-br from-blue-500/2 via-teal-500/3 to-blue-600/2"
        )}
      />
    </div>
  );
};

export default NeuralBackground;