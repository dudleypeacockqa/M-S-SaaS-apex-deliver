import React from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface VSLControlsOverlayProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen?: boolean;
  showProgress?: boolean;
  audioProgress?: number;
  audioDuration?: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onRestart: () => void;
  onFullscreenToggle?: () => void;
  position?: 'bottom-right' | 'bottom-center' | 'center' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const VSLControlsOverlay: React.FC<VSLControlsOverlayProps> = ({
  isPlaying,
  isMuted,
  isFullscreen = false,
  showProgress = false,
  audioProgress = 0,
  audioDuration = 0,
  onPlayPause,
  onMuteToggle,
  onRestart,
  onFullscreenToggle,
  position = 'bottom-right',
  size = 'md',
  theme = 'dark',
  className = ''
}) => {
  const getPositionClass = () => {
    switch (position) {
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'gap-1';
      case 'lg':
        return 'gap-3';
      default:
        return 'gap-2';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      default:
        return 'sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-4 w-4';
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-white/90 hover:bg-white text-black border-gray-200';
      case 'auto':
        return 'bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md';
      default:
        return 'bg-black/80 hover:bg-black/90 text-white border-none backdrop-blur-sm';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`absolute ${getPositionClass()} ${className}`}>
      {/* Progress Bar */}
      {showProgress && audioDuration > 0 && (
        <div className="mb-2 w-48 bg-black/50 rounded-full h-1 backdrop-blur-sm">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
          />
        </div>
      )}

      {/* Time Display */}
      {showProgress && audioDuration > 0 && (
        <div className="mb-2 text-center">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono backdrop-blur-sm">
            {formatTime(audioProgress)} / {formatTime(audioDuration)}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className={`flex ${getSizeClass()}`}>
        {/* Play/Pause Button */}
        <Button
          variant="secondary"
          size={getButtonSize()}
          onClick={onPlayPause}
          className={`${getThemeClass()} transition-all duration-200 hover:scale-105 shadow-lg`}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className={getIconSize()} />
          ) : (
            <Play className={`${getIconSize()} ml-0.5`} />
          )}
        </Button>
        
        {/* Volume Button */}
        <Button
          variant="secondary"
          size={getButtonSize()}
          onClick={onMuteToggle}
          className={`${getThemeClass()} transition-all duration-200 hover:scale-105 shadow-lg`}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? (
            <VolumeX className={getIconSize()} />
          ) : (
            <Volume2 className={getIconSize()} />
          )}
        </Button>

        {/* Restart Button */}
        <Button
          variant="secondary"
          size={getButtonSize()}
          onClick={onRestart}
          className={`${getThemeClass()} transition-all duration-200 hover:scale-105 shadow-lg`}
          aria-label="Restart video"
        >
          <RotateCcw className={getIconSize()} />
        </Button>

        {/* Fullscreen Button (if provided) */}
        {onFullscreenToggle && (
          <Button
            variant="secondary"
            size={getButtonSize()}
            onClick={onFullscreenToggle}
            className={`${getThemeClass()} transition-all duration-200 hover:scale-105 shadow-lg`}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className={getIconSize()} />
            ) : (
              <Maximize2 className={getIconSize()} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VSLControlsOverlay;

