import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/marketing/financeflo/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  TrendingUp,
  Shield,
  Award,
  Users,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  Building,
  Zap,
  Brain,
  Globe,
  Phone
} from "lucide-react";

const FinancialServicesIndustry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 text-lg px-6 py-3">
              <Building className="mr-2 h-6 w-6" />
              Financial Services Transformation
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              How Financial Services Firms Are
              <span className="text-blue-600"> Eliminating 60+ Hours</span>
              <br />of Manual Operations Weekly
            </h1>
            
            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The "Financial Intelligence Framework™" that's helping UK financial services 
              firms automate compliance reporting, streamline client onboarding, and improve 
              operational efficiency by 400% while reducing regulatory risk.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl">
                Get Your Financial Services Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-xl">
                <Phone className="mr-2 h-6 w-6" />
                Book Strategy Call
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span>FCA Compliant</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span>200+ FS Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Proven Results for Financial Services Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Within 8-12 weeks, our Financial Intelligence Framework™ delivers 
              measurable improvements across all operational areas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">60+ Hours</div>
                <div className="text-gray-600 mb-4">Weekly Time Savings</div>
                <p className="text-sm text-gray-500">
                  Automated compliance reporting, client onboarding, and operational workflows
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">£750K+</div>
                <div className="text-gray-600 mb-4">Annual Cost Reduction</div>
                <p className="text-sm text-gray-500">
                  Reduced operational costs through automation and efficiency gains
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">400%</div>
                <div className="text-gray-600 mb-4">Efficiency Improvement</div>
                <p className="text-sm text-gray-500">
                  Faster client onboarding, reporting, and compliance processes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unique Mechanism */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-600 text-white text-lg px-6 py-3">
              <Brain className="mr-2 h-6 w-6" />
              The Financial Intelligence Framework™
            </Badge>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Only AI+ERP System Built Specifically for Financial Services
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Unlike generic solutions, our Financial Intelligence Framework™ combines 
              AI-powered automation with industry-specific ERP functionality to address 
              the unique challenges of financial services operations.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                How It Works: Three Core Components
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Intelligent Compliance Engine
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      AI automatically monitors regulatory changes, updates compliance 
                      frameworks, and generates required reports. Reduces compliance 
                      workload by 80% while ensuring 100% accuracy and timeliness.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Automated Client Lifecycle Management
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      From KYC/AML checks to ongoing monitoring, AI handles the entire 
                      client journey. Reduces onboarding time from weeks to hours while 
                      maintaining regulatory compliance and risk management standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Predictive Risk Analytics
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced AI models analyze client behavior, market conditions, 
                      and operational data to predict and prevent risks before they 
                      materialize. Improves decision-making and reduces potential losses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Financial Services Transformation Dashboard
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Compliance Reporting</span>
                  <span className="text-green-600 font-bold">Automated</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Client Onboarding</span>
                  <span className="text-green-600 font-bold">4 Hours</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Risk Assessment</span>
                  <span className="text-green-600 font-bold">Real-time</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Operational Efficiency</span>
                  <span className="text-green-600 font-bold">+400%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Leading Financial Services Firms
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Premier Wealth Management</div>
                    <div className="text-gray-600">£2.5B AUM</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The Financial Intelligence Framework™ transformed our operations completely. 
                  We've reduced compliance reporting time by 85% and can now onboard new clients 
                  in hours instead of weeks. The ROI was evident within the first month."
                </blockquote>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-900">Sarah Mitchell, COO</div>
                  <div className="text-green-600 font-bold">£420K Annual Savings</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">City Investment Partners</div>
                    <div className="text-gray-600">Investment Management</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The predictive risk analytics have been game-changing. We can now identify 
                  potential issues weeks before they become problems. Our operational efficiency 
                  has improved by over 300%, and our clients notice the difference."
                </blockquote>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-900">James Thompson, Managing Director</div>
                  <div className="text-green-600 font-bold">65 Hours/Week Saved</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Services Operations?
          </h2>
          
          <p className="text-xl text-blue-100 mb-12">
            Get your free Financial Services Assessment and discover exactly how much 
            time and money you could save with the Financial Intelligence Framework™.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-xl font-semibold">
              Get Your Free Assessment
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-xl">
              <Phone className="mr-2 h-6 w-6" />
              Book Strategy Call
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>30-Minute Assessment</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Custom ROI Analysis</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Implementation Roadmap</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancialServicesIndustry;

