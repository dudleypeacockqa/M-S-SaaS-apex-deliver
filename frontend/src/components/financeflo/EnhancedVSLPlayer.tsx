import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { logger } from '@/utils/logger';
import { useBritishVoice } from '@/components/BritishVoiceProvider';
import { VOICE_DEFAULTS } from '@/utils/financeflo/voiceDefaults';

interface EnhancedVSLPlayerProps {
  videoSrc: string;
  audioSrc?: string;
  posterImage?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaPhone?: string;
  ctaAction?: () => void;
  phoneNumber?: string;
  duration?: string;
  className?: string;
  autoplay?: boolean;
  showControls?: boolean;
  controlsPosition?: 'bottom-right' | 'bottom-center' | 'center';
  showTitle?: boolean;
  showProgress?: boolean;
  contentType?: 'vsl' | 'explainer' | 'testimonial' | 'cta';
}

export const EnhancedVSLPlayer: React.FC<EnhancedVSLPlayerProps> = ({
  videoSrc,
  audioSrc,
  posterImage,
  title = "FinanceFlo.ai Video",
  className = "",
  autoplay = false,
  showControls = true,
  controlsPosition = 'bottom-right',
  showTitle = true,
  showProgress = false,
  contentType = 'vsl'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  // British voice context
  const { getVoiceSettings, enforceVoiceStandards } = useBritishVoice();

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      // Enforce British voice standards
      enforceVoiceStandards(video);
      enforceVoiceStandards(audio);
      
      // Add voice quality metadata
      const voiceSettings = getVoiceSettings(contentType);
      audio.setAttribute('data-voice-accent', String(voiceSettings.accent));
      audio.setAttribute('data-voice-tone', String(voiceSettings.tone));
      audio.setAttribute('data-content-type', contentType);
      
      // Set up video looping
      video.loop = true;
      video.muted = true; // Video is always muted, audio comes from separate track
      
      // Audio event listeners
      const handleAudioTimeUpdate = () => {
        setAudioProgress(audio.currentTime);
      };
      
      const handleAudioLoadedMetadata = () => {
        setAudioDuration(audio.duration);
      };
      
      const handleAudioEnded = () => {
        setIsPlaying(false);
        video.pause();
        setAudioProgress(0);
      };

      audio.addEventListener('timeupdate', handleAudioTimeUpdate);
      audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
      audio.addEventListener('ended', handleAudioEnded);
      
      // Sync video with audio
      const syncVideoWithAudio = () => {
        if (audio.currentTime > 0 && !audio.paused) {
          const videoTime = audio.currentTime % video.duration;
          if (Math.abs(video.currentTime - videoTime) > 0.5) {
            video.currentTime = videoTime;
          }
        }
      };

      const syncInterval = setInterval(syncVideoWithAudio, 1000);

      if (autoplay) {
        handlePlay();
      }

      return () => {
        audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
        audio.removeEventListener('ended', handleAudioEnded);
        clearInterval(syncInterval);
      };
    }
  }, [autoplay]);

  const handlePlay = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      try {
        await video.play();
        if (!audioPlayed || audio.paused) {
          await audio.play();
          setAudioPlayed(true);
        }
        setIsPlaying(true);
      } catch (error) {
        logger.error('Error playing media', error instanceof Error ? error : new Error('Media playback failed'), {
          videoSrc,
          audioSrc
        });
      }
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      video.pause();
      audio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio) {
      video.currentTime = 0;
      audio.currentTime = 0;
      setAudioProgress(0);
      if (isPlaying) {
        handlePlay();
      }
    }
  };

  const handleVideoClick = () => {
    if (!audioPlayed) {
      handlePlay();
    } else {
      togglePlayPause();
    }
  };

  const getControlsPositionClass = () => {
    switch (controlsPosition) {
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setShowControlsOverlay(true)}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg cursor-pointer"
        poster={posterImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em' font-family='Arial' font-size='24'%3ELoading Video...%3C/text%3E%3C/svg%3E"}
        onClick={handleVideoClick}
        playsInline
        webkit-playsinline="true"
        preload="metadata"
        muted
        controls={false}
        onLoadStart={() => logger.info('Video loading started')}
        onCanPlay={() => logger.info('Video can play')}
        onError={(e) => logger.error('Video error occurred', new Error('Video playback error'), { 
          error: e,
          videoSrc: videoSrc 
        })}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Video Loading...</div>
            <div className="text-sm opacity-75">Please wait while content loads</div>
          </div>
        </div>
      </video>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
      >
        <source src={audioSrc} type="audio/wav" />
        <source src={audioSrc.replace('.wav', '.mp3')} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>

      {/* Video Title Overlay */}
      {showTitle && title && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
          {title}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && audioDuration > 0 && (
        <div className="absolute bottom-16 left-4 right-4 bg-black/50 rounded-full h-2 backdrop-blur-sm">
          <div 
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
          />
        </div>
      )}

      {/* Time Display */}
      {showProgress && audioDuration > 0 && (
        <div className="absolute bottom-20 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono backdrop-blur-sm">
          {formatTime(audioProgress)} / {formatTime(audioDuration)}
        </div>
      )}

      {/* Enhanced Controls Overlay - Always Visible */}
      {showControls && (
        <div className={`absolute ${getControlsPositionClass()} flex gap-2 z-20 bg-black/80 p-2 rounded-lg backdrop-blur-sm shadow-xl`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg min-w-[40px] h-[40px]"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMute}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg min-w-[40px] h-[40px]"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRestart}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg min-w-[40px] h-[40px]"
            aria-label="Restart video"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Click to Play Audio Indicator */}
      {!audioPlayed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg cursor-pointer backdrop-blur-sm" onClick={handleVideoClick}>
          <div className="bg-white/95 text-black px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-3 shadow-lg hover:bg-white transition-all duration-200 hover:scale-105">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Play className="h-4 w-4 text-white ml-0.5" />
            </div>
            <span>Click to play VSL presentation</span>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {audioPlayed && isPlaying && audioProgress === 0 && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-xs backdrop-blur-sm">
          Loading...
        </div>
      )}
    </div>
  );
};

export default EnhancedVSLPlayer;

