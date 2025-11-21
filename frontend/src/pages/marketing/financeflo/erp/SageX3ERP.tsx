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
  Factory,
  Globe,
  Layers
} from 'lucide-react';

export default function SageX3ERP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      <Navigation />
      
      {/* Hero Section with VSL Video */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-red-900/5 to-amber-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Certified Sage X3 Partner
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Power Manufacturing with 
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Sage X3</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join 450+ UK manufacturing and distribution businesses achieving 350% operational efficiency and global scalability with our expert Sage X3 implementation, support, and AI enhancement services.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600 mb-1">450+</div>
                  <div className="text-sm text-gray-600">Implementations</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-red-100">
                  <div className="text-3xl font-bold text-red-600 mb-1">350%</div>
                  <div className="text-sm text-gray-600">Efficiency Gain</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-100">
                  <div className="text-3xl font-bold text-amber-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-yellow-100">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Global Support</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Assessment
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +44 7360 539147
                </EnhancedButton>
              </div>
            </div>

            {/* Right Content - VSL Video Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-orange-900 to-red-900 flex items-center justify-center relative">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 to-red-900/90"></div>
                  
                  {/* Play Button */}
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                  
                  {/* Video Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Sage X3 Manufacturing Excellence
                      </h3>
                      <p className="text-white/80 text-sm">
                        See how we helped a £100M manufacturer optimize global operations across 12 countries
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE: Sage X3 Demo</span>
                  </div>
                  <div className="text-white/60 text-sm">18:45</div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Factory className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Global</div>
                    <div className="text-xs text-gray-600">Manufacturing</div>
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
              Complete Sage X3 Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From global implementation to ongoing support and AI enhancement - your complete Sage X3 partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Implementation */}
            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Global Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Expert Sage X3 implementation for manufacturing and distribution with our proven ADAPT methodology.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Manufacturing & distribution setup
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Multi-site & multi-company
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Global localization support
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Advanced workflow automation
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Enterprise Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  24/7 enterprise support ensuring your Sage X3 system delivers maximum manufacturing efficiency.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    24/7 global support coverage
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Manufacturing process optimization
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    System upgrades & patches
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Performance monitoring
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            <Card className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Supercharge your Sage X3 with our Adaptive Intelligence Framework™ for intelligent manufacturing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Predictive maintenance AI
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Demand forecasting models
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Quality control automation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Supply chain optimization
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sage X3 Advantages */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Sage X3 ERP?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most powerful ERP for manufacturing and distribution with global capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manufacturing Focus</h3>
              <p className="text-gray-600 text-sm">
                Built specifically for complex manufacturing and distribution operations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Global Ready</h3>
              <p className="text-gray-600 text-sm">
                Multi-site, multi-company, and multi-currency support across 50+ countries
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advanced Features</h3>
              <p className="text-gray-600 text-sm">
                Sophisticated manufacturing, planning, and supply chain management
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Proven ROI</h3>
              <p className="text-gray-600 text-sm">
                Demonstrated 350% efficiency gains in manufacturing environments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Power Your Manufacturing?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join 450+ manufacturing businesses that have achieved global operational excellence with our expert Sage X3 implementation and AI enhancement services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold"
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

