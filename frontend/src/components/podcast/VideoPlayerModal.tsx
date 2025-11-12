import React, { useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

interface VideoPlayerModalProps {
  open: boolean;
  onClose: () => void;
  episodeName: string;
  videoUrl: string | null;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  open,
  onClose,
  episodeName,
  videoUrl,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Video player for ${episodeName}`}
      data-testid="video-player-modal"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Video playback</p>
            <h2 className="text-lg font-semibold text-slate-900">{episodeName}</h2>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close video player"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <VideoPlayer videoUrl={videoUrl} episodeName={episodeName} muted={false} />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 text-sm">
          {videoUrl ? (
            <div className="text-slate-600">
              Playback powered by the Premium video pipeline. Downloads are limited to authorized editors.
            </div>
          ) : (
            <div className="text-slate-600">
              This episode does not have a video file yet. Upload a video to enable playback.
            </div>
          )}
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-indigo-200 px-3 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Download video
            </a>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
