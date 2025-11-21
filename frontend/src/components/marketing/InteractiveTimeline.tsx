import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Clock, FileText, Users, BarChart2 } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  duration: string;
  color: string;
  icon: React.ElementType;
  description: string;
  activities: string[];
}

const stages: Stage[] = [
  {
    id: 1,
    title: 'Evaluation',
    duration: '0-90 Days',
    color: 'bg-blue-500',
    icon: FileText,
    description: 'Initial sourcing, screening, and preliminary valuation of potential targets.',
    activities: ['Deal Sourcing', 'Initial Screening', 'NDA Management', 'Teaser Review']
  },
  {
    id: 2,
    title: 'Pre-Deal',
    duration: '90-180 Days',
    color: 'bg-indigo-500',
    icon: BarChart2,
    description: 'Deep due diligence, financial modeling, and negotiation of terms.',
    activities: ['Due Diligence', 'Financial Modeling', 'Site Visits', 'LOI / Term Sheet']
  },
  {
    id: 3,
    title: 'Post-Deal',
    duration: '180-270 Days',
    color: 'bg-purple-500',
    icon: Users,
    description: 'Closing the transaction and beginning the immediate integration tasks.',
    activities: ['Closing', 'Day 1 Planning', 'Team Onboarding', 'System Access']
  },
  {
    id: 4,
    title: 'Optimization',
    duration: '270+ Days',
    color: 'bg-emerald-500',
    icon: Clock,
    description: 'Long-term value creation, synergy realization, and operational improvements.',
    activities: ['Synergy Tracking', 'Process Optimization', 'Culture Integration', 'Growth Initiatives']
  }
];

export const InteractiveTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-6 bg-slate-900 text-white">
        <h3 className="text-xl font-bold">M&A Lifecycle Explorer</h3>
        <p className="text-slate-400 text-sm mt-1">Click on a stage to explore key activities.</p>
      </div>
      
      {/* Progress Bar */}
      <div className="px-6 pt-8 pb-4">
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeStage - 1) / (stages.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`relative group focus:outline-none`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10 bg-white
                  ${activeStage >= stage.id ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 text-slate-300'}
                  ${activeStage === stage.id ? 'scale-125 shadow-lg' : ''}
                `}>
                  <stage.icon className="h-4 w-4" />
                </div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600 w-24 text-center">
                  {stage.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="p-6 md:p-8 min-h-[300px]">
        {stages.map((stage) => (
          <div 
            key={stage.id}
            className={`transition-all duration-500 ${activeStage === stage.id ? 'opacity-100 translate-x-0' : 'opacity-0 absolute pointer-events-none translate-x-8'}`}
          >
            {activeStage === stage.id && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${stage.color}`}>
                      {stage.duration}
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900">{stage.title} Stage</h4>
                  </div>
                  <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                    {stage.description}
                  </p>
                  <button className="text-indigo-600 font-semibold flex items-center gap-2 hover:text-indigo-700 transition-colors">
                    View Tools for {stage.title} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Key Activities
                  </h5>
                  <div className="space-y-3">
                    {stage.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
