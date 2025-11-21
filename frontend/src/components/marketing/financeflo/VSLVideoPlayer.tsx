import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VSLVideoPlayerProps {
  videoSrc: string;
  audioSrc: string;
  posterImage?: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  showControls?: boolean;
}

export const VSLVideoPlayer: React.FC<VSLVideoPlayerProps> = ({
  videoSrc,
  audioSrc,
  posterImage,
  title = "FinanceFlo.ai Video",
  className = "",
  autoplay = true,
  showControls = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      // Set up video looping
      video.loop = true;
      video.muted = true; // Video is always muted, audio comes from separate track
      
      if (autoplay) {
        video.play().catch((error) => {
          import('@/utils/logger').then(({ logger }) => {
            logger.warn('Video autoplay failed', { error, src: videoSrc });
          });
        });
        if (!audioPlayed) {
          audio.play().catch((error) => {
            import('@/utils/logger').then(({ logger }) => {
              logger.warn('Audio autoplay failed', { error, src: audioSrc });
            });
          });
          setAudioPlayed(true);
        }
      }
    }
  }, [autoplay, audioPlayed]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      if (isPlaying) {
        video.pause();
        audio.pause();
      } else {
        video.play().catch((error) => {
          import('@/utils/logger').then(({ logger }) => {
            logger.warn('Video play failed', { error, src: videoSrc });
          });
        });
        if (!audioPlayed) {
          audio.play().catch((error) => {
            import('@/utils/logger').then(({ logger }) => {
              logger.warn('Audio play failed', { error, src: audioSrc });
            });
          });
          setAudioPlayed(true);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    if (!audioPlayed) {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch((error) => {
          import('@/utils/logger').then(({ logger }) => {
            logger.warn('Audio play on click failed', { error, src: audioSrc });
          });
        });
        setAudioPlayed(true);
      }
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        poster={posterImage}
        onClick={handleVideoClick}
        playsInline
        webkit-playsinline="true"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src={audioSrc} type="audio/wav" />
        Your browser does not support the audio tag.
      </audio>

      {/* Video Overlay with Title */}
      {title && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
          {title}
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}
            className="bg-black/70 hover:bg-black/80 text-white border-none"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMute}
            className="bg-black/70 hover:bg-black/80 text-white border-none"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Click to Play Audio Indicator */}
      {!audioPlayed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg cursor-pointer" onClick={handleVideoClick}>
          <div className="bg-white/90 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Click to hear audio
          </div>
        </div>
      )}
    </div>
  );
};

export default VSLVideoPlayer;

