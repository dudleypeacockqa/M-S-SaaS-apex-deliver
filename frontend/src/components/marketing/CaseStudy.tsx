import React from 'react';
import { CaseStudy as CaseStudyType } from '../../data/caseStudies';

export const CaseStudy: React.FC<{ caseStudy: CaseStudyType }> = ({ caseStudy }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        {/* Using a div placeholder if image fails or is SVG placeholder */}
        <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
            {caseStudy.customerName.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{caseStudy.customerName}</h3>
          <span className="text-sm text-gray-600">{caseStudy.industry} • {caseStudy.customerSize}</span>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
            <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">Challenge</h4>
            <p className="text-gray-700">{caseStudy.challenge}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">Solution</h4>
            <p className="text-gray-700">{caseStudy.solution}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 my-6">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{caseStudy.results.metric1.value}</div>
                <div className="text-xs text-gray-500">{caseStudy.results.metric1.label}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{caseStudy.results.metric2.value}</div>
                <div className="text-xs text-gray-500">{caseStudy.results.metric2.label}</div>
            </div>
            {caseStudy.results.metric3 && (
                 <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">{caseStudy.results.metric3.value}</div>
                    <div className="text-xs text-gray-500">{caseStudy.results.metric3.label}</div>
                </div>
            )}
        </div>

        <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-600 my-4">
          "{caseStudy.quote}"
          <footer className="mt-2 text-sm font-semibold text-gray-900 not-italic">
            — {caseStudy.quoteName}, {caseStudy.quoteTitle}
          </footer>
        </blockquote>
      </div>

      <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium">
        Start Your Free Trial
      </button>
    </div>
  );
};

