
import React from "react";
import { heroStats } from "./heroData";

export const HeroStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {heroStats.map((stat, index) => (
        <div 
          key={index}
          className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
