import React from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Play, Volume2, Headphones } from 'lucide-react';

interface VSLPlayButtonProps {
  onClick: () => void;
  isPlaying?: boolean;
  hasAudioPlayed?: boolean;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'prominent' | 'floating';
  theme?: 'dark' | 'light' | 'brand';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  disabled?: boolean;
}

export const VSLPlayButton: React.FC<VSLPlayButtonProps> = ({
  onClick,
  isPlaying = false,
  hasAudioPlayed = false,
  title = "Play VSL Presentation",
  subtitle = "Professional voiceover • High-quality content",
  size = 'md',
  variant = 'default',
  theme = 'brand',
  className = '',
  showIcon = true,
  showText = true,
  disabled = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-4 py-2',
          icon: 'w-4 h-4',
          title: 'text-sm',
          subtitle: 'text-xs'
        };
      case 'lg':
        return {
          container: 'px-8 py-4',
          icon: 'w-8 h-8',
          title: 'text-xl',
          subtitle: 'text-sm'
        };
      case 'xl':
        return {
          container: 'px-10 py-5',
          icon: 'w-10 h-10',
          title: 'text-2xl',
          subtitle: 'text-base'
        };
      default:
        return {
          container: 'px-6 py-3',
          icon: 'w-6 h-6',
          title: 'text-lg',
          subtitle: 'text-sm'
        };
    }
  };

  const getVariantClasses = () => {
    const baseClasses = "transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl";
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} bg-transparent border-2 hover:bg-white/10`;
      case 'prominent':
        return `${baseClasses} bg-gradient-to-r shadow-2xl hover:shadow-3xl`;
      case 'floating':
        return `${baseClasses} rounded-full shadow-2xl hover:shadow-3xl backdrop-blur-md`;
      default:
        return `${baseClasses} rounded-lg`;
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return variant === 'minimal' 
          ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
          : 'bg-white text-gray-900 hover:bg-gray-50';
      case 'dark':
        return variant === 'minimal'
          ? 'border-white text-white hover:border-gray-200'
          : 'bg-gray-900 text-white hover:bg-gray-800';
      default: // brand
        return variant === 'minimal'
          ? 'border-blue-500 text-blue-600 hover:border-blue-600 hover:text-blue-700'
          : variant === 'prominent'
          ? 'from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700'
          : 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const themeClasses = getThemeClasses();

  const getStatusText = () => {
    if (isPlaying) {
      return "🎧 Playing presentation...";
    } else if (hasAudioPlayed) {
      return "▶️ Replay presentation";
    } else {
      return title;
    }
  };

  const getStatusSubtitle = () => {
    if (isPlaying) {
      return "Audio is currently playing";
    } else if (hasAudioPlayed) {
      return "Click to replay from beginning";
    } else {
      return subtitle;
    }
  };

  if (variant === 'floating') {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`${variantClasses} ${themeClasses} ${sizeClasses.container} ${className}`}
        aria-label={getStatusText()}
      >
        {showIcon && (
          <div className={`${sizeClasses.icon} flex items-center justify-center`}>
            {isPlaying ? (
              <div className="animate-pulse">
                <Volume2 className={sizeClasses.icon} />
              </div>
            ) : (
              <Play className={`${sizeClasses.icon} ml-0.5`} />
            )}
          </div>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses} ${themeClasses} ${sizeClasses.container} ${className} ${!showText ? 'aspect-square' : ''}`}
      aria-label={getStatusText()}
    >
      <div className={`flex items-center ${showText ? 'gap-3' : 'justify-center'}`}>
        {showIcon && (
          <div className={`${sizeClasses.icon} flex items-center justify-center flex-shrink-0`}>
            {isPlaying ? (
              <div className="animate-pulse">
                <Volume2 className={sizeClasses.icon} />
              </div>
            ) : hasAudioPlayed ? (
              <Headphones className={sizeClasses.icon} />
            ) : (
              <div className="relative">
                <Play className={`${sizeClasses.icon} ml-0.5`} />
                {variant === 'prominent' && (
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                )}
              </div>
            )}
          </div>
        )}
        
        {showText && (
          <div className="text-left">
            <div className={`font-semibold ${sizeClasses.title}`}>
              {getStatusText()}
            </div>
            {subtitle && (
              <div className={`opacity-80 ${sizeClasses.subtitle} mt-1`}>
                {getStatusSubtitle()}
              </div>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};

export default VSLPlayButton;

