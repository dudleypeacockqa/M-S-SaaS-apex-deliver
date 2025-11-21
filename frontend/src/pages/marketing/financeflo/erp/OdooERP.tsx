import React from 'react';
import { Navigation } from '@/components/marketing/financeflo/Navigation';
import { Footer } from '@/components/marketing/financeflo/Footer';
import { EnhancedButton } from '@/components/marketing/financeflo/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Play, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Award,
  ArrowRight,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  Puzzle,
  Settings,
  Code
} from 'lucide-react';

export default function OdooERP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Navigation />
      
      {/* Hero Section with VSL Video */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-blue-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Certified Odoo Partner
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Customize Everything with 
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Odoo ERP</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join 450+ UK businesses achieving complete customization and 400% efficiency gains with our expert Odoo implementation, support, and AI enhancement services.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-1">450+</div>
                  <div className="text-sm text-gray-600">Implementations</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">400%</div>
                  <div className="text-sm text-gray-600">Efficiency Gain</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Integrated Apps</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-violet-100">
                  <div className="text-3xl font-bold text-violet-600 mb-1">100%</div>
                  <div className="text-sm text-gray-600">Customizable</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Assessment
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +44 7360 539147
                </EnhancedButton>
              </div>
            </div>

            {/* Right Content - VSL Video Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center relative">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90"></div>
                  
                  {/* Play Button */}
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                  
                  {/* Video Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Odoo Complete Business Suite
                      </h3>
                      <p className="text-white/80 text-sm">
                        See how we unified 15 different systems into one customized Odoo solution for a £25M retailer
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE: Odoo Demo</span>
                  </div>
                  <div className="text-white/60 text-sm">15:30</div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Puzzle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">50+</div>
                    <div className="text-xs text-gray-600">Integrated Apps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Complete Odoo Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From custom implementation to ongoing support and AI enhancement - your complete Odoo partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Implementation */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Custom Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Expert Odoo implementation with complete customization using our proven ADAPT methodology.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Custom module development
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Complete business suite integration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Workflow automation setup
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Third-party integrations
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Development Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  24/7 development support ensuring your Odoo system evolves with your business needs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    24/7 technical support
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Custom module maintenance
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Version upgrades & migrations
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Performance optimization
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            <Card className="border-2 border-violet-100 hover:border-violet-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Supercharge your Odoo with our Adaptive Intelligence Framework™ for intelligent automation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    AI-powered workflow automation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Predictive analytics modules
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Custom AI model integration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Intelligent reporting dashboards
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Odoo Advantages */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Odoo ERP?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most flexible and customizable ERP solution with complete business suite integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Puzzle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Suite</h3>
              <p className="text-gray-600 text-sm">
                50+ integrated apps covering every aspect of your business operations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Open Source</h3>
              <p className="text-gray-600 text-sm">
                Complete customization freedom with open-source architecture
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Highly Customizable</h3>
              <p className="text-gray-600 text-sm">
                Tailor every aspect to match your unique business processes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cost Effective</h3>
              <p className="text-gray-600 text-sm">
                Lower total cost of ownership with transparent pricing model
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Customize Everything?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 450+ businesses that have achieved complete customization with our expert Odoo implementation and AI enhancement services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: +44 7360 539147
            </EnhancedButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

