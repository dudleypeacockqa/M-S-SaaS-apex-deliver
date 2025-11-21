import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { TrendingUp, Target, Zap, BarChart3, CheckCircle, Users, Clock, Shield, Building2, DollarSign } from "lucide-react";

const FinancialServicesVSLOptIn = () => {
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
          <source src="/videos/financial_services_transformation_video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-purple-900/90"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* FinanceFlo AI Brand Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-8 shadow-lg">
            <Building2 className="mr-2 h-5 w-5" />
            FinanceFlo AI - Adaptive Intelligence for Financial Services
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            The Secret <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">'Compliance Engine'</span> Technology
            <br />
            <span className="text-3xl lg:text-5xl text-blue-200">
              That's Helping Financial Services Reduce Compliance Costs by 85%
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover how 300+ financial institutions are using AI to automate compliance, reduce operational risks, and 
            <strong className="text-white"> increase efficiency by 400%</strong>... 
            while maintaining the highest regulatory standards
          </p>
          
          {/* Main CTA */}
          <div className="mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/vsl/financial-services/video'}
            >
              <Zap className="mr-3 h-6 w-6" />
              Watch The Free Training Now
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-blue-200 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
              <span>Free Training • No Credit Card Required • 300+ Institutions Already Using This</span>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Discover Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What You'll Discover In This <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Free Training</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The exact methodology that's helping financial institutions automate compliance processes with 95% accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Why 85% of Financial Institutions Struggle with Compliance Costs
                </h3>
                <p className="text-gray-600">
                  And the one thing successful institutions do differently that gives them an unfair advantage
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  The 'Adaptive Intelligence Algorithm'
                </h3>
                <p className="text-gray-600">
                  That automatically handles regulatory reporting and compliance monitoring in real-time
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Eliminate Manual Processes Forever
                </h3>
                <p className="text-gray-600">
                  From transaction monitoring to risk assessment using intelligent automation
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Real Case Studies
                </h3>
                <p className="text-gray-600">
                  How institutions reduced compliance costs by 85% while improving accuracy to 99.8%
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
                85%
              </div>
              <p className="text-xl text-gray-600">Reduction in Compliance Costs</p>
            </div>
            <div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                400%
              </div>
              <p className="text-xl text-gray-600">Increase in Operational Efficiency</p>
            </div>
            <div>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                99.8%
              </div>
              <p className="text-xl text-gray-600">Compliance Accuracy Rate</p>
            </div>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>No Credit Card Required</span>
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
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Revolutionize Your Financial Operations?
          </h2>
          <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
            Stop struggling with manual compliance processes. Get the same AI technology that's helping 300+ financial institutions dominate their markets.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 mb-8"
            onClick={() => window.location.href = '/vsl/financial-services/video'}
          >
            <Zap className="mr-3 h-6 w-6" />
            Watch The Free Training Now
          </Button>
          
          <p className="text-blue-300 text-sm">
            ⚡ Your competition is already using AI to get ahead. Join them or get left behind.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FinancialServicesVSLOptIn;

