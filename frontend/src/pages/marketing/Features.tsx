import React from 'react';
import MarketingNav from '@/components/MarketingNav'; // Assuming custom component path
import MarketingFooter from '@/components/MarketingFooter'; // Assuming custom component path
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Shield, TrendingUp, Users, DollarSign, Briefcase, BarChart3, Clock, Lock } from 'lucide-react';

// Define the color palette based on branding
const COLORS = {
  primary: 'text-blue-950', // Navy Blue
  accent1: 'text-emerald-500', // Emerald Green
  accent2: 'text-sky-500', // Bright Blue
  bgPrimary: 'bg-white',
  bgSecondary: 'bg-slate-50',
};

// Feature data structure
const coreFeatures = [
  {
    icon: BarChart3,
    title: "CapLiquify FP&A Engine",
    description: "Real-time financial planning and analysis with AI-driven forecasting and scenario modeling.",
    features: [
      { text: "AI-Powered Predictive Modeling", icon: Zap, color: COLORS.accent2 },
      { text: "Dynamic Scenario Planning", icon: TrendingUp, color: COLORS.accent2 },
      { text: "Granular Cost-of-Capital Analysis", icon: DollarSign, color: COLORS.accent2 },
      { text: "Automated Compliance Reporting", icon: Shield, color: COLORS.accent2 },
    ]
  },
  {
    icon: Briefcase,
    title: "ApexDeliver M&A Suite",
    description: "End-to-end M&A lifecycle management, from target identification to post-merger integration.",
    features: [
      { text: "Secure Virtual Data Rooms (VDR)", icon: Lock, color: COLORS.accent1 },
      { text: "AI-Enhanced Due Diligence", icon: Clock, color: COLORS.accent1 },
      { text: "Valuation & Synergy Modeling", icon: DollarSign, color: COLORS.accent1 },
      { text: "Integration Management Playbooks", icon: Briefcase, color: COLORS.accent1 },
    ]
  },
  {
    icon: Users,
    title: "B2B2C Customer Portals",
    description: "White-labeled, secure portals for seamless customer and partner engagement post-acquisition.",
    features: [
      { text: "Customizable Branding & UI", icon: Users, color: COLORS.accent2 },
      { text: "Role-Based Access Control", icon: Shield, color: COLORS.accent2 },
      { text: "Integrated Service Ticketing", icon: CheckCircle, color: COLORS.accent2 },
      { text: "Real-Time Performance Dashboards", icon: BarChart3, color: COLORS.accent2 },
    ]
  },
];

// Component for a single feature card
interface FeatureCardProps {
  feature: typeof coreFeatures[0];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => (
  <Card className="flex flex-col h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-blue-950/50">
    <CardHeader className="space-y-4">
      <feature.icon className={`w-10 h-10 ${COLORS.primary}`} />
      <CardTitle className={`text-2xl font-bold ${COLORS.primary}`}>{feature.title}</CardTitle>
      <CardDescription className="text-gray-600">{feature.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <ul className="space-y-3">
        {feature.features.map((item, index) => (
          <li key={index} className="flex items-start">
            <item.icon className={`w-5 h-5 mr-3 mt-1 shrink-0 ${item.color}`} />
            <span className="text-gray-700 font-medium">{item.text}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Main Features Page Component
const Features: React.FC = () => {
  return (
    <div className={`${COLORS.bgPrimary} min-h-screen flex flex-col`}>
      <MarketingNav />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center px-4" aria-labelledby="hero-heading">
          <div className="max-w-4xl mx-auto">
            <h1 id="hero-heading" className={`text-4xl md:text-6xl font-extrabold mb-4 ${COLORS.primary}`}>
              The <span className={COLORS.accent1}>Integrated</span> Platform for Modern M&A and Finance
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              ApexDeliver and CapLiquify combine to deliver unparalleled clarity and control across the entire acquisition lifecycle and beyond.
            </p>
            <Button size="lg" className={`bg-blue-950 hover:bg-blue-800 text-white font-semibold text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300`}>
              Request a Demo Today
            </Button>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className={`${COLORS.bgSecondary} py-16 md:py-24 px-4`} aria-labelledby="core-features-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="core-features-heading" className={`text-3xl md:text-4xl font-bold text-center mb-12 ${COLORS.primary}`}>
              Three Pillars of Strategic Growth
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition Section (Optional but good for completeness) */}
        <section className="py-16 md:py-24 px-4" aria-labelledby="value-prop-heading">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <h2 id="value-prop-heading" className={`text-3xl md:text-4xl font-bold mb-6 ${COLORS.primary}`}>
                Why Choose Our Unified Solution?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                In the complex world of corporate finance, fragmented tools lead to missed opportunities and costly errors. Our platform is built on a foundation of seamless integration.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className={`w-6 h-6 mr-3 mt-1 shrink-0 ${COLORS.accent1}`} />
                  <p className="text-gray-800">
                    <strong className={COLORS.primary}>Accelerated Deal Velocity:</strong> Cut due diligence time by 40% with AI-powered document analysis.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className={`w-6 h-6 mr-3 mt-1 shrink-0 ${COLORS.accent1}`} />
                  <p className="text-gray-800">
                    <strong className={COLORS.primary}>Precision Forecasting:</strong> Achieve 99% accuracy in financial modeling with CapLiquify's engine.
                  </p>
                </li>
                <li className="flex items-start">
                  <CheckCircle className={`w-6 h-6 mr-3 mt-1 shrink-0 ${COLORS.accent1}`} />
                  <p className="text-gray-800">
                    <strong className={COLORS.primary}>Post-Merger Synergy:</strong> Drive faster realization of synergies through integrated customer portals.
                  </p>
                </li>
              </ul>
            </div>
            <div className="md:order-1">
              {/* Placeholder for an illustration or screenshot */}
              <div className={`aspect-video ${COLORS.bgSecondary} rounded-xl flex items-center justify-center shadow-xl`}>
                <span className={`text-xl font-semibold ${COLORS.primary}`}>Integrated Dashboard Mockup</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-16 md:py-20 px-4 ${COLORS.primary} bg-blue-950`} aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Corporate Strategy?
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Unlock the full potential of your next acquisition and financial planning with a single, powerful platform.
            </p>
            <Button size="lg" variant="secondary" className={`bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg px-10 py-6 rounded-lg shadow-xl transition-all duration-300`}>
              Start Your Free Consultation
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
};

export default Features;