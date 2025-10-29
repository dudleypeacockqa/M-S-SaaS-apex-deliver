import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { CTASection } from '../../components/marketing/CTASection';

export const TeamPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dudley Peacock',
      title: 'Founder & CEO',
      bio: 'M&A professional and entrepreneur with a vision to democratize access to enterprise-grade deal intelligence tools. Dudley brings decades of experience in finance, technology, and business transformation.',
      image: '/assets/team/dudley-peacock.jpg',
    },
    {
      name: 'Sandra Peacock',
      title: 'Managing Director',
      bio: 'Strategic leader with extensive experience in operations management and business development. Sandra ensures operational excellence and client success across all ApexDeliver initiatives.',
      image: '/assets/team/sandra-peacock.jpg',
    },
    {
      name: 'Matthew Collins',
      title: 'CFO',
      bio: 'Financial strategist with deep expertise in corporate finance, M&A transactions, and financial modeling. Matthew oversees all financial operations and strategic planning.',
      image: '/assets/team/matthew-collins.jpg',
    },
    {
      name: 'Adam Pavitt',
      title: 'Director of Operations',
      bio: 'Operations expert focused on process optimization and scalability. Adam ensures ApexDeliver delivers exceptional service and platform reliability to all clients.',
      image: '/assets/team/adam-pavitt.jpg',
    },
    {
      name: 'Shaun Evertse',
      title: 'E-Commerce, Warehousing & Supply Chain Expert',
      bio: 'Supply chain and logistics specialist with extensive experience in e-commerce operations, warehousing, and inventory management. Shaun brings operational excellence to our platform.',
      image: '/assets/team/shaun-evertse.jpg',
    },
    {
      name: 'Heike Venter',
      title: 'ERP Sales Manager',
      bio: 'ERP solutions expert with a proven track record in enterprise software sales and client relationship management. Heike helps businesses leverage technology for growth.',
      image: '/assets/team/heike-venter.jpg',
    },
  ];

  return (
    <MarketingLayout>
      <SEO
        title="Team | ApexDeliver + CapLiquify"
        description="Meet the experts behind ApexDeliver + CapLiquify. Our world-class team combines decades of ERP expertise with cutting-edge AI innovation to deliver transformational results."
        keywords="ApexDeliver team, M&A experts, ERP specialists, finance technology team"
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Meet the Experts Behind Your Success
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Our world-class team combines decades of ERP expertise with cutting-edge AI innovation to deliver transformational results for finance leaders across the globe.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Placeholder for team member photo */}
                    <div className="text-6xl font-bold text-indigo-900">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-900 font-semibold mb-4">{member.title}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Team Matters */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Experience That Drives Results
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our team brings together over 20 years of combined experience in ERP implementation, financial planning, M&A execution, and AI-powered business intelligence. We've successfully guided over 230 businesses through complex transformations, delivering an average ROI of 300-500%.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            When you work with ApexDeliver + CapLiquify, you're not just getting software—you're getting a team of seasoned professionals who understand your challenges and are committed to your success.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </MarketingLayout>
  );
};
