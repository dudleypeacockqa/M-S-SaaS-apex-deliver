import React, { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

export const InteractiveTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number | null>(1);

  const stages = [
    {
      id: 1,
      title: "Stage 1: Evaluation",
      duration: "0-90 days",
      color: "bg-blue-500",
      activities: ["Deal sourcing", "Initial screening", "Financial analysis", "Market research", "Letter of Intent (LOI)"],
    },
    {
      id: 2,
      title: "Stage 2: Pre-Deal",
      duration: "90-180 days",
      color: "bg-indigo-500",
      activities: ["Due diligence", "Legal review", "Valuation modeling", "Deal structuring", "Purchase agreement"],
    },
    {
      id: 3,
      title: "Stage 3: Post-Deal",
      duration: "180-270 days",
      color: "bg-purple-500",
      activities: ["PMI planning", "Day 1 execution", "Team integration", "Systems migration", "Process alignment"],
    },
    {
      id: 4,
      title: "Stage 4: Operations",
      duration: "270+ days",
      color: "bg-emerald-500",
      activities: ["Value creation", "Performance monitoring", "Optimization", "Growth strategy", "Exit planning"],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-2xl font-bold mb-8 text-gray-900 text-center">M&A Lifecycle Timeline</h3>
      
      {/* Timeline Visual */}
      <div className="relative mb-12 hidden md:block">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
        <div className="flex justify-between relative">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none`}
            >
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ${
                  activeStage === stage.id ? `${stage.color} scale-110 ring-4 ring-offset-2 ring-indigo-100` : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {stage.id}
              </div>
              <div className={`mt-4 font-semibold ${activeStage === stage.id ? 'text-indigo-900' : 'text-gray-500'}`}>
                {stage.title}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stage.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Timeline (Vertical) */}
      <div className="md:hidden space-y-4 mb-8">
        {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeStage === stage.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}
            >
                <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold mr-3 ${activeStage === stage.id ? stage.color : 'bg-gray-400'}`}>
                    {stage.id}
                </div>
                <div className="text-left">
                    <div className={`font-semibold ${activeStage === stage.id ? 'text-gray-900' : 'text-gray-600'}`}>{stage.title}</div>
                    <div className="text-xs text-gray-500">{stage.duration}</div>
                </div>
            </button>
        ))}
      </div>

      {/* Active Stage Details */}
      <div className="bg-gray-50 rounded-xl p-6 min-h-[300px] transition-all duration-300">
        {activeStage && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-8 rounded-full ${stages[activeStage - 1].color}`}></div>
                <h4 className="text-2xl font-bold text-gray-900">{stages[activeStage - 1].title}</h4>
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 shadow-sm">
                    {stages[activeStage - 1].duration}
                </span>
             </div>
             
             <p className="text-gray-600 mb-6 text-lg">
                Key activities and milestones managed in this phase:
             </p>

             <div className="grid md:grid-cols-2 gap-4">
                {stages[activeStage - 1].activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="font-medium text-gray-800">{activity}</span>
                    </div>
                ))}
             </div>

             <div className="mt-8 flex justify-end">
                <button className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 hover:gap-3 transition-all">
                    Explore {stages[activeStage - 1].title} Tools <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

