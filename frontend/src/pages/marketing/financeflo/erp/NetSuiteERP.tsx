
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Cloud, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const NetSuiteERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
            <Cloud className="mr-2 h-4 w-4" />
            NetSuite Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Amplify Your
            <span className="text-orange-600"> NetSuite</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Extend NetSuite's capabilities with advanced automation, custom integrations, and enhanced reporting for maximum business efficiency.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">300+</div>
              <div className="text-gray-600">Pre-built Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
              <div className="text-gray-600">Process Automation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Cloud Monitoring</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-xl px-12 py-4">
            Enhance NetSuite
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            NetSuite Enhancement Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Advanced SuiteAnalytics",
                description: "Enhanced reporting with AI-powered insights and predictive analytics beyond standard NetSuite."
              },
              {
                icon: Shield,
                title: "Security Plus+",
                description: "Additional security layers with advanced fraud detection and compliance monitoring."
              },
              {
                icon: Cloud,
                title: "Multi-Cloud Integration",
                description: "Seamless connectivity with AWS, Azure, and other cloud platforms."
              },
              {
                icon: BarChart,
                title: "Custom KPI Dashboards",
                description: "Personalized executive dashboards with real-time business metrics."
              },
              {
                icon: Clock,
                title: "Workflow Automation",
                description: "Advanced SuiteFlow enhancements with AI-driven process optimization."
              },
              {
                icon: CheckCircle,
                title: "Data Validation",
                description: "Automated data quality checks and intelligent error prevention."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-orange-50 text-orange-600 mb-6">
                    <capability.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{capability.title}</h3>
                  <p className="text-gray-600">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Supercharge Your NetSuite
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="NetSuite Account ID" className="border-gray-200" />
                <Textarea 
                  placeholder="What NetSuite enhancements do you need?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  Get NetSuite Enhancement Plan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default NetSuiteERP;
