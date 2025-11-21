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
  Cloud,
  Layers,
  Globe
} from 'lucide-react';

export default function AcumaticaERP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Navigation />
      
      {/* Hero Section with VSL Video */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-teal-900/5 to-cyan-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Certified Acumatica Partner
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Scale Your Business with 
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Acumatica Cloud ERP</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join 450+ UK businesses achieving unlimited scalability and 300% productivity gains with our expert Acumatica implementation, support, and AI enhancement services.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">450+</div>
                  <div className="text-sm text-gray-600">Implementations</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-100">
                  <div className="text-3xl font-bold text-teal-600 mb-1">300%</div>
                  <div className="text-sm text-gray-600">Productivity Gain</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-cyan-100">
                  <div className="text-3xl font-bold text-cyan-600 mb-1">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">∞</div>
                  <div className="text-sm text-gray-600">Scalability</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Assessment
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +44 7360 539147
                </EnhancedButton>
              </div>
            </div>

            {/* Right Content - VSL Video Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center relative">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-teal-900/90"></div>
                  
                  {/* Play Button */}
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                  
                  {/* Video Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Acumatica Cloud ERP Transformation
                      </h3>
                      <p className="text-white/80 text-sm">
                        See how we helped a growing manufacturer scale from £10M to £50M revenue with unlimited users
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE: Acumatica Demo</span>
                  </div>
                  <div className="text-white/60 text-sm">12:15</div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-600">Cloud Native</div>
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
              Complete Acumatica Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From cloud implementation to unlimited scalability and AI enhancement - your complete Acumatica partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Implementation */}
            <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Cloud Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Expert Acumatica cloud implementation with unlimited scalability and our proven ADAPT methodology.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Cloud-native setup & configuration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Unlimited user licensing model
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Multi-company & multi-currency
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Mobile-first deployment
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Managed Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  24/7 managed support ensuring your Acumatica system delivers maximum performance and reliability.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    24/7 cloud monitoring
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Automatic updates & patches
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Performance optimization
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    User training & adoption
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Supercharge your Acumatica with our Adaptive Intelligence Framework™ for intelligent automation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Intelligent workflow automation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Predictive analytics dashboard
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Custom AI model integration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Real-time business insights
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Acumatica Advantages */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Acumatica Cloud ERP?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The only truly cloud-native ERP with unlimited scalability and modern architecture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Unlimited Users</h3>
              <p className="text-gray-600 text-sm">
                No per-user licensing fees - scale your team without additional costs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">True Cloud Native</h3>
              <p className="text-gray-600 text-sm">
                Built for the cloud from the ground up, not a legacy system retrofitted
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Architecture</h3>
              <p className="text-gray-600 text-sm">
                Modular design allows you to implement only what you need, when you need it
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Global Ready</h3>
              <p className="text-gray-600 text-sm">
                Multi-company, multi-currency, and multi-language support out of the box
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Scale Without Limits?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join 450+ businesses that have achieved unlimited scalability with our expert Acumatica implementation and AI enhancement services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold"
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

