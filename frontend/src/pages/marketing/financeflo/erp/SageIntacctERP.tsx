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
  Sparkles
} from 'lucide-react';

export default function SageIntacctERP() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      {/* Hero Section with VSL Video */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-indigo-900/5 to-purple-900/10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  Certified Sage Intacct Partner
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your Finance Operations with 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Sage Intacct</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join 450+ UK mid-market businesses achieving 66% cost reduction and 500% ROI boost with our certified Sage Intacct implementation, support, and AI enhancement services.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-1">450+</div>
                  <div className="text-sm text-gray-600">Implementations</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">66%</div>
                  <div className="text-sm text-gray-600">Cost Reduction</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-1">500%</div>
                  <div className="text-sm text-gray-600">ROI Increase</div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100">
                  <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Free Assessment
                </EnhancedButton>
                
                <EnhancedButton 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call: +44 7360 539147
                </EnhancedButton>
              </div>
            </div>

            {/* Right Content - VSL Video Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90"></div>
                  
                  {/* Play Button */}
                  <button className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                  
                  {/* Video Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Sage Intacct Implementation Success Story
                      </h3>
                      <p className="text-white/80 text-sm">
                        See how we helped a £50M construction company reduce month-end close from 15 days to 3 days
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Bar */}
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">LIVE: Sage Intacct Demo</span>
                  </div>
                  <div className="text-white/60 text-sm">8:42</div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">98%</div>
                    <div className="text-xs text-gray-600">Client Satisfaction</div>
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
              Complete Sage Intacct Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From implementation to ongoing support and AI enhancement, we're your trusted Sage Intacct partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Implementation */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Implementation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Expert Sage Intacct implementation with our proven ADAPT methodology ensuring rapid deployment and maximum ROI.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Complete system setup & configuration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Data migration & integration
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    User training & documentation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Go-live support & optimization
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </EnhancedButton>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  24/7 expert support ensuring your Sage Intacct system runs smoothly with maximum uptime and performance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    24/7 technical support
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    System monitoring & maintenance
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Regular updates & optimization
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    User training & best practices
                  </li>
                </ul>
                <EnhancedButton className="w-full bg-green-600 hover:bg-green-700 text-white">
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
                  Supercharge your Sage Intacct with our Adaptive Intelligence Framework™ for unprecedented automation and insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Intelligent automation workflows
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Predictive analytics & insights
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Custom AI model training
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Real-time decision support
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

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FinanceFlo.ai for Sage Intacct?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just implementers - we're your strategic partners in financial transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Certified Experts</h3>
              <p className="text-gray-600 text-sm">
                Official Sage Intacct certified partners with 10+ years of implementation experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rapid Deployment</h3>
              <p className="text-gray-600 text-sm">
                Average implementation time of 8-12 weeks with our proven ADAPT methodology
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Unique AI enhancement capabilities that supercharge your Sage Intacct investment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">UK Mid-Market Focus</h3>
              <p className="text-gray-600 text-sm">
                Specialized expertise in UK mid-market businesses (£3M-£100M turnover)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Finance Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 450+ businesses that have revolutionized their finance processes with our expert Sage Intacct implementation and AI enhancement services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Assessment
            </EnhancedButton>
            
            <EnhancedButton 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
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

