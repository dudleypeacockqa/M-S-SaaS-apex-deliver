import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { TrendingUp, Target, Zap, BarChart3, CheckCircle, Users, Clock, Shield, Building, DollarSign, Eye } from "lucide-react";

const PrivateEquityVSLOptIn = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/private_equity_transformation_video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/85 to-indigo-900/90"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* FinanceFlo AI Brand Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-gray-600 to-blue-700 text-white mb-8 shadow-lg">
            <Building className="mr-2 h-5 w-5" />
            FinanceFlo AI - Adaptive Intelligence for Private Equity
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            The Secret <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">'Deal Intelligence'</span> Technology
            <br />
            <span className="text-3xl lg:text-5xl text-blue-200">
              That's Helping PE Firms Identify Hidden Value 90 Days Before Competition
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover how 150+ private equity firms are using AI to accelerate due diligence by 300%, improve portfolio performance by 40%, and 
            <strong className="text-white"> identify value creation opportunities others miss</strong>
          </p>
          
          {/* Main CTA */}
          <div className="mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/vsl/private-equity/video'}
            >
              <Eye className="mr-3 h-6 w-6" />
              Watch The Exclusive Training Now
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-blue-200 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              <span>Confidential Training • No Credit Card Required • 150+ PE Firms Already Using This</span>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Discover Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You'll Discover In This <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Confidential Training</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The exact methodology that's helping PE firms achieve 40% higher portfolio company EBITDA growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Why 80% of PE Firms Miss Value Creation Opportunities
                </h3>
                <p className="text-gray-600">
                  And the one thing top-quartile firms do differently to identify hidden value
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  The 'Predictive Intelligence Algorithm'
                </h3>
                <p className="text-gray-600">
                  That analyzes portfolio companies and predicts performance with 85% accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Accelerate Due Diligence by 300%
                </h3>
                <p className="text-gray-600">
                  From 8 weeks to 2 weeks while improving analysis depth and accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Confidential Case Studies
                </h3>
                <p className="text-gray-600">
                  How PE firms moved from bottom quartile to top quartile in 18 months
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-16">
            The Results Speak For Themselves
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                300%
              </div>
              <p className="text-xl text-gray-600">Faster Due Diligence</p>
            </div>
            <div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                40%
              </div>
              <p className="text-xl text-gray-600">Higher Portfolio EBITDA Growth</p>
            </div>
            <div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                85%
              </div>
              <p className="text-xl text-gray-600">Financial Projection Accuracy</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>Confidential Training</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>15-Minute Training</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-purple-500" />
              <span>100% Free Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Gain the AI Advantage in Private Equity?
          </h2>
          <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
            Stop analyzing deals manually. Get the same AI intelligence that's helping 150+ PE firms identify opportunities others miss.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 mb-8"
            onClick={() => window.location.href = '/vsl/private-equity/video'}
          >
            <Eye className="mr-3 h-6 w-6" />
            Watch The Confidential Training Now
          </Button>
          
          <p className="text-blue-300 text-sm">
            ⚡ Limited access - Only 8 implementation slots available this quarter
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivateEquityVSLOptIn;

