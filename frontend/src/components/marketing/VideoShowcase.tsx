import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoShowcaseProps {
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string; // For future use with actual embed
  wistiaId?: string; // Specific support for Wistia if needed
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  title,
  description,
  thumbnailUrl = '/assets/dashboard-preview.png', // Default fallback
  wistiaId = '9z7dy1zjmb', // Defaulting to the inspiration video ID for demo purposes if none provided
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePlay = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              See It In Action
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              {title}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {description}
            </p>
            
            <button
              onClick={handlePlay}
              className="group flex items-center gap-4 text-white hover:text-emerald-400 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center transition-all transform group-hover:scale-110 shadow-lg shadow-emerald-900/20">
                <Play className="w-5 h-5 fill-current ml-1" />
              </div>
              <span className="font-semibold text-lg">Watch the 60-second demo</span>
            </button>
          </div>

          {/* Video Thumbnail / Player */}
          <div className="relative group">
            {/* Decorative background blob */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-2xl opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000"></div>
            
            <div 
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer aspect-video bg-slate-800 group-hover:scale-[1.02] transition-transform duration-300"
              onClick={handlePlay}
            >
              {/* Placeholder Thumbnail Image */}
               {/* In a real app, we'd use a real image. For now, a gradient or the provided URL if valid */}
               <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  {/* If we had a real image, it would be here. */}
                   <div className="text-slate-500 font-mono text-xs">
                      [Video Thumbnail: {thumbnailUrl}]
                   </div>
               </div>

               {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

              {/* Play Button Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-emerald-600/90 group-hover:border-emerald-500 transition-all duration-300 scale-100 group-hover:scale-110">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded text-xs font-mono font-medium text-white">
                1:00
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Embed Iframe (Using Wistia as example/placeholder) */}
            <iframe
              src={`https://fast.wistia.net/embed/iframe/${wistiaId}?videoFoam=true&autoPlay=true`}
              title="Demo Video"
              allow="autoplay; fullscreen"
              frameBorder="0"
              scrolling="no"
              className="w-full h-full"
              name="wistia_embed"
            ></iframe>
             <script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>
          </div>
          
          {/* Close on click outside */}
          <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
        </div>
      )}
    </section>
  );
};

