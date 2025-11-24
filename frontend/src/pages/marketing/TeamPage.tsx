import React from 'react';
import { MarketingLayout } from '../../components/marketing/MarketingLayout';
import { SEO } from '../../components/common/SEO';
import { CTASection } from '../../components/marketing/CTASection';
import { StructuredData } from '../../components/common/StructuredData';
import { createTeamMembersSchema } from '../../utils/schemas/personSchema';

export const TeamPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dudley Peacock',
      title: 'Founder & CEO, ERP + AI Strategy',
      bio: 'Built ERP programs, pricing studios, and PE value-creation teams for two decades. Leads every FinanceFlo blueprint so CapLiquify FP&A and ApexDeliver land with operator discipline.',
      image: '/assets/team/dudley-peacock.jpg',
    },
    {
      name: 'Sandra Peacock',
      title: 'Managing Director, Delivery & Success',
      bio: 'Runs the implementation pods that migrate Sage Intacct, Odoo, Microsoft, and NetSuite, while coordinating CapLiquify + ApexDeliver onboarding and managed support retainers.',
      image: '/assets/team/sandra-peacock.jpg',
    },
    {
      name: 'Matthew Collins',
      title: 'CFO & CapLiquify Practice Lead',
      bio: 'Guides finance leaders through 13-week cash builds, lender packs, and working-capital guardrails so every engagement ties ERP actuals to board-ready narratives.',
      image: '/assets/team/matthew-collins.jpg',
    },
    {
      name: 'Adam Pavitt',
      title: 'Director of Delivery Operations',
      bio: 'Owns project governance, playbooks, and telemetry across ERP migrations, ApexDeliver deployments, and AI rollout so every client sees time-to-value in days.',
      image: '/assets/team/adam-pavitt.jpg',
    },
    {
      name: 'Shaun Evertse',
      title: 'Commerce, Warehousing & Supply Chain Lead',
      bio: 'Connects ERP data to pricing, promo, and portal workflows for D2C and distribution brands, ensuring CapLiquify guardrails reflect inventory, fulfillment, and cash cycles.',
      image: '/assets/team/shaun-evertse.jpg',
    },
    {
      name: 'Heike Venter',
      title: 'ERP & Platform Solutions Manager',
      bio: 'Partners with CFOs and CIOs to scope multi-entity rollouts, entitlements, and AI copilots so FinanceFlo engagements stay aligned to commercial goals.',
      image: '/assets/team/heike-venter.jpg',
    },
  ];

  const teamStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FinanceFlo',
    url: 'https://financeflo.ai/team',
    employee: createTeamMembersSchema(
      teamMembers.map((member) => ({
        name: member.name,
        role: member.title,
        company: 'ApexDeliver',
        image: member.image ? `https://financeflo.ai${member.image}` : undefined,
      }))
    ),
  };

  return (
    <MarketingLayout>
      <SEO
        title="Team | ApexDeliver + CapLiquify"
        description="Meet the experts behind ApexDeliver + CapLiquify. Our world-class team combines decades of ERP expertise with cutting-edge AI innovation to deliver transformational results."
        keywords="ApexDeliver team, M&A experts, ERP specialists, finance technology team"
        canonical="https://financeflo.ai/team"
        ogTitle="Meet the FinanceFlo Team"
        ogDescription="A multidisciplinary leadership team with decades of ERP, finance, and AI experience supporting every client engagement."
        ogUrl="https://financeflo.ai/team"
        ogImage="https://financeflo.ai/assets/security-trust-visual.png"
        twitterTitle="FinanceFlo Leadership Team"
        twitterDescription="Get to know the ERP, finance, and AI experts guiding FinanceFlo."
        twitterImage="https://financeflo.ai/assets/security-trust-visual.png"
      />
      <StructuredData json={teamStructuredData} id="team-schema" />

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            FinanceFlo operators who own implementation, automation, and expansion.
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            We’re the ERP resellers, CapLiquify builders, ApexDeliver product leads, and AI consultants who migrate your systems, wire cash guardrails, and stay on call every time you add an entity, promo, or acquisition.
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
            Implementation + managed support in one accountable crew
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            500+ ERP entities migrated, 450+ CapLiquify guardrails live, 300% pipeline lifts tracked inside ApexDeliver, and 24/7 managed services pods that keep copilots, promos, and portals tuned to your cash plan.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Working with FinanceFlo means the same operators build, automate, and measure every motion—no handoffs between agencies, no point-tool stitching, just one partner responsible for outcomes.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        headline="Work with FinanceFlo’s ERP + AI operators"
        description="Book your implementation blueprint to align Sage Intacct, Odoo, Microsoft, or NetSuite with CapLiquify FP&A and ApexDeliver. Start the guided software trial to see the workspace your team will inherit."
        primaryCtaText="Book Implementation Blueprint"
        primaryCtaLink="/contact"
        secondaryCtaText="Start CapLiquify + ApexDeliver Trial"
        secondaryCtaLink="/sign-up"
      />
    </MarketingLayout>
  );
};
