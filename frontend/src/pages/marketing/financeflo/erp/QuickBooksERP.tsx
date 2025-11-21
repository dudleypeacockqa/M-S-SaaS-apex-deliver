
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Calculator, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const QuickBooksERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-6">
            <Calculator className="mr-2 h-4 w-4" />
            QuickBooks Enterprise Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Scale Your
            <span className="text-emerald-600"> QuickBooks</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform QuickBooks Enterprise into a comprehensive business management platform with advanced automation and enterprise-grade integrations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-600">App Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">80%</div>
              <div className="text-gray-600">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">99%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-xl px-12 py-4">
            Enhance QuickBooks
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            QuickBooks Enterprise Enhancements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Advanced Reporting",
                description: "Custom financial reports and dashboards beyond standard QuickBooks capabilities."
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Additional security layers with advanced user permissions and audit trails."
              },
              {
                icon: Calculator,
                title: "Multi-Currency Pro",
                description: "Advanced multi-currency handling with real-time exchange rates and hedging."
              },
              {
                icon: BarChart,
                title: "Business Intelligence",
                description: "AI-powered insights and predictive analytics for financial forecasting."
              },
              {
                icon: Clock,
                title: "Workflow Automation",
                description: "Intelligent automation of accounting processes and approval workflows."
              },
              {
                icon: CheckCircle,
                title: "Integration Hub",
                description: "Seamless connectivity with CRM, e-commerce, and other business applications."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-emerald-50 text-emerald-600 mb-6">
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
      <section className="py-20 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Supercharge QuickBooks Enterprise
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="QuickBooks Enterprise Version" className="border-gray-200" />
                <Textarea 
                  placeholder="What QuickBooks enhancements do you need?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                  Get QuickBooks Enhancement Plan
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

export default QuickBooksERP;
