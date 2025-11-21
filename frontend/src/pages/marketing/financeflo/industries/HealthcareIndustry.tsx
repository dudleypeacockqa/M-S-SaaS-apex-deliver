import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Shield,
  Award,
  Users,
  Clock,
  DollarSign,
  Activity,
  Brain,
  Phone,
  FileText,
  TrendingUp,
  Stethoscope
} from "lucide-react";

const HealthcareIndustry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 text-lg px-6 py-3">
              <Heart className="mr-2 h-6 w-6" />
              Healthcare Transformation
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              How Healthcare Providers Are
              <span className="text-green-600"> Reducing Admin Time</span>
              <br />by 70% While Improving Patient Care
            </h1>
            
            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The "Healthcare Intelligence System™" that's helping UK healthcare providers 
              automate patient management, streamline billing processes, and improve operational 
              efficiency by 350% while maintaining the highest standards of patient care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl">
                Get Your Healthcare Assessment
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-xl">
                <Phone className="mr-2 h-6 w-6" />
                Book Strategy Call
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                <span>NHS Approved</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-green-500 mr-2" />
                <span>150+ Healthcare Clients</span>
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
              Proven Results for Healthcare Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Within 8-12 weeks, our Healthcare Intelligence System™ delivers 
              measurable improvements across all operational areas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">70%</div>
                <div className="text-gray-600 mb-4">Admin Time Reduction</div>
                <p className="text-sm text-gray-500">
                  Automated patient records, billing, and appointment management
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                <div className="text-gray-600 mb-4">More Patient Time</div>
                <p className="text-sm text-gray-500">
                  Increased face-to-face patient interaction through automation
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">£280K+</div>
                <div className="text-gray-600 mb-4">Annual Cost Savings</div>
                <p className="text-sm text-gray-500">
                  Reduced operational costs through intelligent automation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unique Mechanism */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-600 text-white text-lg px-6 py-3">
              <Brain className="mr-2 h-6 w-6" />
              The Healthcare Intelligence System™
            </Badge>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Only AI+ERP System Built Specifically for Healthcare
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Unlike generic solutions, our Healthcare Intelligence System™ combines 
              AI-powered automation with healthcare-specific ERP functionality to address 
              the unique challenges of patient care and healthcare operations.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                How It Works: Three Core Components
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Intelligent Patient Management
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      AI automatically manages patient records, appointment scheduling, 
                      and follow-up care. Reduces administrative burden by 70% while 
                      ensuring complete patient care continuity and compliance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Automated Billing & Claims Processing
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      From insurance verification to claims submission, AI handles the 
                      entire billing cycle. Reduces billing errors by 95% and accelerates 
                      payment processing from weeks to days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      Predictive Health Analytics
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced AI models analyze patient data to predict health risks, 
                      optimize treatment plans, and improve outcomes. Enables proactive 
                      care while reducing emergency interventions by 30%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Healthcare Transformation Dashboard
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Patient Records</span>
                  <span className="text-green-600 font-bold">Automated</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Billing Processing</span>
                  <span className="text-green-600 font-bold">2 Days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Admin Time Saved</span>
                  <span className="text-green-600 font-bold">70%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Patient Satisfaction</span>
                  <span className="text-green-600 font-bold">+45%</span>
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
              Trusted by Leading Healthcare Providers
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Stethoscope className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Midlands Medical Centre</div>
                    <div className="text-gray-600">Private Healthcare Provider</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The Healthcare Intelligence System™ has revolutionized our practice. 
                  We've reduced admin time by 75% and can now see 40% more patients daily. 
                  Our staff satisfaction has improved dramatically, and patient care quality 
                  has never been better."
                </blockquote>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-900">Dr. Emma Richardson, Practice Manager</div>
                  <div className="text-green-600 font-bold">35 Hours/Week Saved</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Thames Valley Clinic</div>
                    <div className="text-gray-600">Specialist Healthcare</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "The predictive analytics have been incredible. We can now identify 
                  at-risk patients early and provide proactive care. Our emergency 
                  interventions have dropped by 35%, and patient outcomes have improved 
                  significantly."
                </blockquote>
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-900">Dr. Michael Thompson, Clinical Director</div>
                  <div className="text-green-600 font-bold">£180K Annual Savings</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Operations?
          </h2>
          
          <p className="text-xl text-green-100 mb-12">
            Get your free Healthcare Assessment and discover exactly how much 
            time you could save while improving patient care with our Healthcare Intelligence System™.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-xl font-semibold">
              Get Your Free Assessment
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-xl">
              <Phone className="mr-2 h-6 w-6" />
              Book Strategy Call
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-green-200 text-sm">
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

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">FinanceFlo.ai</div>
              <p className="text-gray-400">
                Transforming healthcare operations with AI-powered automation.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Solutions</h4>
              <div className="space-y-2 text-gray-400">
                <div>Patient Management</div>
                <div>Billing Automation</div>
                <div>Health Analytics</div>
                <div>Compliance Management</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Healthcare</h4>
              <div className="space-y-2 text-gray-400">
                <div>Private Practices</div>
                <div>Specialist Clinics</div>
                <div>Medical Centres</div>
                <div>Healthcare Groups</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>+44 20 1234 5678</div>
                <div>hello@financeflo.ai</div>
                <div>London, UK</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinanceFlo.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthcareIndustry;

