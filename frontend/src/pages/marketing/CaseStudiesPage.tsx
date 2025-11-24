import React from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { trackCtaClick } from '../../lib/analytics';
import { StructuredData } from '../../components/common/StructuredData';
import { createBreadcrumbSchema } from '../../utils/schemas/breadcrumbSchema';
import { caseStudies } from '../../data/caseStudies';
import { CaseStudy } from '../../components/marketing/CaseStudy';

export const CaseStudiesPage: React.FC = () => {
  const caseStudiesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: caseStudies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: `${study.customerName} Case Study`,
        description: `${study.industry}: ${study.challenge}`,
        url: `https://financeflo.ai/case-studies#case-study-${study.id}`,
      },
    })),
  };

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://financeflo.ai/' },
    { name: 'Case Studies', url: 'https://financeflo.ai/case-studies' },
  ]);

  return (
    <MarketingLayout>
      <SEO
        title="Case Studies | ApexDeliver + CapLiquify Success Stories"
        description="See how private equity firms, dealmakers, and finance leaders use ApexDeliver and CapLiquify to accelerate M&A, optimize cash flow, and drive portfolio value."
        keywords="M&A case studies, private equity success stories, cash flow optimization, PMI case studies, buy and build"
      />
      <StructuredData json={caseStudiesSchema} id="case-studies-schema" />
      <StructuredData json={breadcrumbSchema} id="case-studies-breadcrumbs" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Real Results from Real Dealmakers
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              See how private equity firms, strategic acquirers, and finance leaders use ApexDeliver + CapLiquify to accelerate M&A, optimize cash flow, and drive portfolio value.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-5xl font-bold text-emerald-400">75%</div>
                <div className="text-indigo-100 mt-2">Faster PMI Cycles</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-emerald-400">£8.2M</div>
                <div className="text-indigo-100 mt-2">Avg. Cash Unlocked</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-emerald-400">95%+</div>
                <div className="text-indigo-100 mt-2">Forecast Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div key={study.id} id={`case-study-${study.id}`} className="h-full">
                <CaseStudy caseStudy={study} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of dealmakers, finance leaders, and private equity firms who trust ApexDeliver + CapLiquify to accelerate their M&A and optimize their cash flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('start-trial', 'case-studies-cta')}
            >
              Start Your Free 14-Day Trial
            </Link>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-100 text-indigo-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              onClick={() => trackCtaClick('schedule-demo', 'case-studies-cta')}
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
