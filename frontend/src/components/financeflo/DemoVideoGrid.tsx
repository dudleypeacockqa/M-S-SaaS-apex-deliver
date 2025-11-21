import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Clock, Users, Star } from "lucide-react";

interface DemoVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  featured?: boolean;
  viewCount?: number;
  rating?: number;
}

interface DemoVideoGridProps {
  videos: DemoVideo[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export const DemoVideoGrid = ({ 
  videos, 
  title = "Watch Our Demos", 
  subtitle = "See our solutions in action",
  showFilters = true 
}: DemoVideoGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<DemoVideo | null>(null);

  const categories = ["all", ...Array.from(new Set(videos.map(video => video.category)))];
  
  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const featuredVideos = videos.filter(video => video.featured);
  const regularVideos = filteredVideos.filter(video => !video.featured);

  const handleVideoPlay = (video: DemoVideo) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Featured Videos */}
        {featuredVideos.length > 0 && selectedCategory === "all" && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Demos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onPlay={handleVideoPlay}
                  featured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Videos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onPlay={handleVideoPlay}
            />
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal 
            video={selectedVideo} 
            onClose={closeVideoModal} 
          />
        )}
      </div>
    </section>
  );
};

interface VideoCardProps {
  video: DemoVideo;
  onPlay: (video: DemoVideo) => void;
  featured?: boolean;
}

const VideoCard = ({ video, onPlay, featured = false }: VideoCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${
      featured ? "ring-2 ring-blue-500" : ""
    }`}>
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* Play Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          onClick={() => onPlay(video)}
        >
          <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <Play className="h-8 w-8 text-blue-600 ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {video.duration}
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {video.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {video.category}
          </span>
          {video.viewCount && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {video.viewCount.toLocaleString()} views
            </div>
          )}
        </div>

        {/* CTA */}
        <Button 
          onClick={() => onPlay(video)}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Watch Demo
        </Button>
      </div>
    </div>
  );
};

interface VideoModalProps {
  video: DemoVideo;
  onClose: () => void;
}

const VideoModal = ({ video, onClose }: VideoModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">{video.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video bg-black">
          <video 
            className="w-full h-full"
            controls
            autoPlay
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Description */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{video.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {video.category}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {video.duration}
              </div>
              {video.viewCount && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {video.viewCount.toLocaleString()} views
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => window.location.href = "/contact"}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

