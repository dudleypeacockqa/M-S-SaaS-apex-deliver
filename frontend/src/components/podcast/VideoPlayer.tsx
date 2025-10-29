/**
 * VideoPlayer - Production-ready video player for podcast episodes (DEV-016)
 * Supports MP4/MOV playback with full controls for Premium tier users
 */

import React, { useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string | null;
  episodeName: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Event) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  episodeName,
  autoplay = false,
  loop = false,
  muted = false,
  onPlay,
  onPause,
  onEnded,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(event.nativeEvent);
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    }
  };

  const handlePause = () => {
    if (onPause) {
      onPause();
    }
  };

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  if (!videoUrl) {
    return (
      <div
        data-testid="video-player-container"
        className="max-w-4xl mx-auto p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{episodeName}</h2>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 text-lg">No video available</p>
          <p className="text-gray-500 text-sm mt-2">
            Upload a video file to view it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="video-player-container"
      className="max-w-4xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{episodeName}</h2>

      <div className="bg-black rounded-lg overflow-hidden shadow-xl">
        {hasError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 text-lg font-medium">Failed to load video</p>
            <p className="text-red-600 text-sm mt-2">
              The video file could not be loaded. Please try again later.
            </p>
          </div>
        ) : (
          <video
            data-testid="video-player"
            src={videoUrl}
            controls
            {...(autoplay && { autoPlay: true })}
            {...(loop && { loop: true })}
            {...(muted && { muted: true })}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            aria-label={`Video player for ${episodeName}`}
            className="w-full h-auto"
            preload="metadata"
          >
            <p className="text-white p-4">
              Your browser does not support the video tag. Please upgrade your browser.
            </p>
          </video>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Controls:</span> Use the play/pause button,
          volume slider, and fullscreen button. Press Space to play/pause, or use
          arrow keys to seek.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
