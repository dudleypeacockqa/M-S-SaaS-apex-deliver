import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { ArrowRight, Building2, Heart, Banknote, Wrench, Store, Factory, Briefcase, TrendingUp, Shield, Users } from 'lucide-react';

const IndustriesDemoPage: React.FC = () => {
  const industries = [
    {
      name: 'Construction & Real Estate',
      icon: Building2,
      color: 'orange',
      path: '/industries/construction',
      vslPath: '/vsl/construction/opt-in',
      description: 'Project management, cost control, and compliance automation for construction companies.',
      features: ['Project cost tracking', 'Compliance management', 'Equipment scheduling', 'Safety reporting']
    },
    {
      name: 'Healthcare',
      icon: Heart,
      color: 'red',
      path: '/industries/healthcare',
      vslPath: '/vsl/healthcare/opt-in',
      description: 'Patient billing, compliance, and operational efficiency for healthcare organizations.',
      features: ['Patient billing automation', 'HIPAA compliance', 'Inventory management', 'Revenue cycle optimization']
    },
    {
      name: 'Financial Services',
      icon: Banknote,
      color: 'green',
      path: '/industries/financial-services',
      vslPath: '/vsl/financial-services/opt-in',
      description: 'Regulatory compliance, risk management, and client reporting for financial firms.',
      features: ['Regulatory reporting', 'Risk assessment', 'Client onboarding', 'Portfolio management']
    },
    {
      name: 'Manufacturing',
      icon: Factory,
      color: 'blue',
      path: '/industries/manufacturing', // This route doesn't exist yet, but we'll handle it
      vslPath: '/vsl/manufacturing/opt-in',
      description: 'Supply chain optimization, quality control, and production planning automation.',
      features: ['Supply chain tracking', 'Quality assurance', 'Production scheduling', 'Inventory optimization']
    },
    {
      name: 'Professional Services',
      icon: Briefcase,
      color: 'purple',
      path: '/industries/professional-services',
      vslPath: '/vsl/professional-services/opt-in',
      description: 'Time tracking, project billing, and client management for service-based businesses.',
      features: ['Time & expense tracking', 'Project profitability', 'Client billing automation', 'Resource planning']
    },
    {
      name: 'Private Equity',
      icon: TrendingUp,
      color: 'indigo',
      path: '/industries/private-equity',
      vslPath: '/vsl/private-equity/opt-in',
      description: 'Portfolio management, due diligence, and investment tracking for PE firms.',
      features: ['Portfolio analytics', 'Due diligence workflows', 'Investment tracking', 'Performance reporting']
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      orange: 'text-orange-600',
      red: 'text-red-600',
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific ERP Solutions Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore how our AI-powered ERP solutions are tailored for specific industries. 
              Each solution addresses unique challenges and compliance requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Card key={industry.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className={`h-6 w-6 ${getColorClasses(industry.color)}`} />
                      {industry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {industry.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {industry.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full mr-2 bg-${industry.color}-500`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full">
                        <a href={industry.path}>
                          Industry Overview <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-teal-500">
                        <a href={industry.vslPath}>
                          Watch Demo Video <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Cross-Industry Benefits</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                While each industry has unique needs, our AI-powered ERP solutions deliver 
                consistent benefits across all sectors.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Compliance Automation</h3>
                  <p className="text-blue-100">Automated compliance monitoring and reporting for industry-specific regulations.</p>
                </div>
                <div>
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Performance Insights</h3>
                  <p className="text-blue-100">Real-time analytics and KPIs tailored to your industry benchmarks.</p>
                </div>
                <div>
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Team Efficiency</h3>
                  <p className="text-blue-100">AI-powered workflows that understand your team's unique processes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
              <a href="/contact">
                Schedule Industry-Specific Demo <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndustriesDemoPage;