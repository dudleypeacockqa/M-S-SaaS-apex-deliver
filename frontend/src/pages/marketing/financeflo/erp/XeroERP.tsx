
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Cloud, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const XeroERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-sky-100 text-sky-800 mb-6">
            <Cloud className="mr-2 h-4 w-4" />
            Xero Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Amplify Your
            <span className="text-sky-600"> Xero</span> Potential
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Extend Xero's cloud accounting capabilities with intelligent automation, advanced reporting, and seamless business application integrations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">1000+</div>
              <div className="text-gray-600">App Ecosystem</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">Real-time</div>
              <div className="text-gray-600">Cloud Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-600 mb-2">24/7</div>
              <div className="text-gray-600">Accessibility</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-xl px-12 py-4">
            Optimize Xero
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Xero Enhancement Suite
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Advanced Analytics",
                description: "Enhanced financial analytics and forecasting beyond standard Xero reporting."
              },
              {
                icon: Shield,
                title: "Security Plus",
                description: "Additional security features with advanced fraud detection and monitoring."
              },
              {
                icon: Cloud,
                title: "API Optimization",
                description: "Optimized API integrations with intelligent rate limiting and error handling."
              },
              {
                icon: BarChart,
                title: "Custom Dashboards",
                description: "Personalized executive dashboards with real-time KPIs and performance metrics."
              },
              {
                icon: Clock,
                title: "Smart Automation",
                description: "AI-powered automation for invoicing, payments, and reconciliation processes."
              },
              {
                icon: CheckCircle,
                title: "Multi-Entity Management",
                description: "Advanced multi-company management with consolidated reporting."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-sky-50 text-sky-600 mb-6">
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
      <section className="py-20 bg-sky-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Enhance Your Xero Experience
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="Xero Organization Name" className="border-gray-200" />
                <Textarea 
                  placeholder="What Xero enhancements are you looking for?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-sky-600 hover:bg-sky-700" size="lg">
                  Get Xero Enhancement Plan
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

export default XeroERP;
