import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { ArrowRight, Zap, Target, Users, BarChart, MessageSquare, Star } from 'lucide-react';

const LeverageFloDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              LeverageFlo.ai Marketing Automation Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our complete marketing automation ecosystem that generates 800+ qualified 
              prospects monthly through AI-powered cold outbound and nurturing systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Cold Outbound System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Enterprise-level cold outbound with Voice AI generating 800+ qualified prospects monthly.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    800+ qualified prospects/month
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    AI-powered voice conversations
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Automated nurturing sequences
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/leverageflo/cold-outbound">
                    View System <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-green-600" />
                  Lead Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete marketing automation ecosystem with AI-powered optimization and conversion tracking.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Multi-channel lead capture
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    AI-powered optimization
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Real-time analytics
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/leverageflo/lead-generation">
                    View System <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-purple-600" />
                  Reviews & Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Automated reputation management and systematic referral generation system.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Automated review requests
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Systematic referral program
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Reputation monitoring
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full">
                  <a href="/leverageflo/reviews-referrals">
                    View System <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Complete Marketing Ecosystem</h2>
                <p className="text-blue-100 mb-6">
                  See how all LeverageFlo.ai systems work together to create a comprehensive 
                  marketing automation platform that drives consistent, measurable results.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Integrated CRM & ERP connectivity
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Advanced analytics and reporting
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Multi-channel communication
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-3xl font-bold">800+</div>
                    <div className="text-blue-200">Monthly Prospects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">45%</div>
                    <div className="text-blue-200">Conversion Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">300%</div>
                    <div className="text-blue-200">ROI Increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-blue-200">Automation</div>
                  </div>
                </div>
                <Button size="lg" variant="secondary">
                  <a href="/leverageflo/demo" className="flex items-center">
                    View Complete Demo <ArrowRight className="h-5 w-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a href="/contact">
                Schedule LeverageFlo.ai Demo <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LeverageFloDemoPage;