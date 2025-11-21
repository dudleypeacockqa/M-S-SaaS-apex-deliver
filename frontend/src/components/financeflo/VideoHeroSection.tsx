import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoHeroSectionProps {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterImage?: string;
  ctaText?: string;
  ctaLink?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export const VideoHeroSection = ({
  title,
  subtitle,
  videoUrl,
  posterImage,
  ctaText = "Get Started",
  ctaLink = "/contact",
  autoPlay = true,
  showControls = true
}: VideoHeroSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    setShowVideo(true);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-30"
          autoPlay={autoPlay}
          muted={isMuted}
          loop
          playsInline
          poster={posterImage}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4"
                onClick={() => window.location.href = ctaLink}
              >
                {ctaText}
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-blue-600 hover:bg-white hover:text-blue-900 transition-all duration-300 text-lg px-8 py-4"
                onClick={handleVideoClick}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                className="w-full h-auto"
                controls={showVideo}
                poster={posterImage}
                onClick={!showVideo ? handleVideoClick : undefined}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Play Overlay */}
              {!showVideo && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer group"
                  onClick={handleVideoClick}
                >
                  <div className="bg-white bg-opacity-90 rounded-full p-6 group-hover:bg-opacity-100 transition-all duration-300 group-hover:scale-110">
                    <Play className="h-12 w-12 text-blue-600 ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Video Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">300%</div>
                <div className="text-sm text-blue-100">ROI Increase</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">80%</div>
                <div className="text-sm text-blue-100">Time Saved</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">30 Days</div>
                <div className="text-sm text-blue-100">Implementation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {showControls && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleMute}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          
          <button
            onClick={handleFullscreen}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-opacity-30 transition-all"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
};

