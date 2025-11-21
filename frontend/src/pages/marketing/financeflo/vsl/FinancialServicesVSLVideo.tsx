import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Play, Building2, Target, Users, CheckCircle, ArrowRight, Clock, Shield, TrendingUp } from "lucide-react";

const FinancialServicesVSLVideo = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Video Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* FinanceFlo AI Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-6 shadow-lg">
              <Building2 className="mr-2 h-5 w-5" />
              FinanceFlo AI - Adaptive Intelligence for Financial Services
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">'Compliance Engine' Technology</span>
              <br />
              That Reduces Financial Services Compliance Costs by 85%
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Watch this exclusive training to discover how 300+ financial institutions are using AI to automate compliance and 
              <strong> increase operational efficiency by 400%</strong>
            </p>
          </div>
          
          {/* Video Player */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative">
                    {/* Audio Player for Financial Services */}
                    <audio 
                      controls 
                      className="absolute bottom-4 left-4 right-4 z-10"
                      preload="metadata"
                    >
                      <source src="/audio/trendflo_main_vsl_audio_hq.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    {/* Video Placeholder */}
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 inline-flex">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        The FinanceFlo AI Compliance Engine Technology
                      </h3>
                      <p className="text-blue-200">
                        15 minutes • Financial Services Intelligence Training
                      </p>
                      <p className="text-blue-300 text-sm mt-2">
                        🎧 Professional British voice preview - Click play below
                      </p>
                    </div>
                  </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span>1,847 views this week</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                <span>15 minutes</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span>Exclusive Content</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Financial Leaders Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real financial institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">85%</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance Cost Reduction</h3>
                <p className="text-gray-600">Average reduction in compliance preparation time</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-4">400%</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Efficiency Increase</h3>
                <p className="text-gray-600">Improvement in operational processing speed</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-4">99.8%</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accuracy Rate</h3>
                <p className="text-gray-600">Compliance accuracy with AI automation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Operations?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join 300+ financial institutions already using FinanceFlo AI to revolutionize their compliance and operations.
          </p>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = '/vsl/financial-services/application'}
          >
            Get Your Free Assessment Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex justify-center items-center space-x-6 mt-8 text-sm text-blue-300">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Free Assessment</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>30-Day Implementation</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Bank-Level Security</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialServicesVSLVideo;

