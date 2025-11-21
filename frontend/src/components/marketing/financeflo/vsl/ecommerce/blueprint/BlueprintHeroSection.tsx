
import React from "react";
import { TrendingUp } from "lucide-react";

const BlueprintHeroSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* TrendFlo AI Brand */}
        <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm text-white mb-8 shadow-lg">
          <TrendingUp className="mr-2 h-5 w-5" />
          TrendFlo AI Blueprint - Exclusive Training
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TrendFlo AI Blueprint</span>
          <br />
          <span className="text-3xl lg:text-4xl text-blue-200">
            How To Predict Winning Products 90 Days Before Your Competition
          </span>
        </h1>
        
        <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
          The exact methodology that's helping e-commerce brands predict their next winning products with 94% accuracy. 
          This is the same blueprint presented at a $30,000 mastermind for 7 and 8-figure entrepreneurs.
        </p>
      </div>
    </section>
  );
};

export default BlueprintHeroSection;
