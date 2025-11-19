import React from 'react';
import { CaseStudy as CaseStudyType } from '../../data/caseStudies';
import { ArrowRight, Quote } from 'lucide-react';

interface CaseStudyProps {
  caseStudy: CaseStudyType;
}

export const CaseStudy: React.FC<CaseStudyProps> = ({ caseStudy }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-200">
              <img 
                src={caseStudy.logoUrl} 
                alt={caseStudy.customerName} 
                className="max-h-full max-w-full object-contain opacity-90"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerText = caseStudy.customerName.charAt(0);
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{caseStudy.customerName}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                  {caseStudy.industry}
                </span>
                <span>•</span>
                <span>{caseStudy.customerSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Challenge</h4>
            <p className="text-slate-700 leading-relaxed">{caseStudy.challenge}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Solution</h4>
            <p className="text-slate-700 leading-relaxed">{caseStudy.solution}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{caseStudy.results.metric1.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{caseStudy.results.metric1.label}</div>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-2xl font-bold text-indigo-600">{caseStudy.results.metric2.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{caseStudy.results.metric2.label}</div>
          </div>
          {caseStudy.results.metric3 && (
            <div className="text-center border-l border-slate-200">
              <div className="text-2xl font-bold text-indigo-600">{caseStudy.results.metric3.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{caseStudy.results.metric3.label}</div>
            </div>
          )}
        </div>

        {/* Quote */}
        <blockquote className="relative pl-6 border-l-4 border-indigo-500 bg-indigo-50/30 p-4 rounded-r-lg">
          <Quote className="absolute top-2 left-2 h-4 w-4 text-indigo-300 -translate-x-6 -translate-y-2 opacity-0" />
          <p className="text-slate-700 italic mb-4 relative z-10">
            "{caseStudy.quote}"
          </p>
          <footer className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {caseStudy.quoteName.charAt(0)}
            </div>
            <div className="text-sm">
              <span className="font-bold text-slate-900 block">{caseStudy.quoteName}</span>
              <span className="text-slate-500">{caseStudy.quoteTitle}</span>
            </div>
          </footer>
        </blockquote>
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500">
          Published {new Date(caseStudy.publishedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 flex items-center gap-1 group">
          Read full story 
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
