
import React from "react";
import { Play } from "lucide-react";

const BlueprintVideoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Video Player */}
        <div className="relative mb-8">
          <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center relative">
              {/* Audio Player for Testing */}
              <audio 
                controls 
                className="absolute bottom-4 left-4 right-4 z-10"
                preload="metadata"
              >
                <source src="https://storage.googleapis.com/msgsndr/f2hL1WCfLruukYmOIvhu/media/6862bf63ceea900109da2836.mpeg" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              {/* Video Placeholder */}
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 inline-flex">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  The TrendFlo AI Blueprint
                </h3>
                <p className="text-purple-200">
                  20 minutes • Exclusive Methodology Training
                </p>
                <p className="text-purple-300 text-sm mt-2">
                  🎧 Professional British voice preview - Click play below
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Video Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What You'll Learn In This Blueprint
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The complete framework for implementing predictive intelligence in your e-commerce business
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlueprintVideoSection;
