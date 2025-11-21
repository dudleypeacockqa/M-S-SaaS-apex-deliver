
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Database, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const OracleERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-orange-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-6">
            <Database className="mr-2 h-4 w-4" />
            Oracle ERP Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Maximize
            <span className="text-red-600"> Oracle ERP</span> ROI
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Unlock the full potential of Oracle ERP Cloud with advanced integrations, AI-powered automation, and enterprise-grade performance optimization.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">Enterprise</div>
              <div className="text-gray-600">Scale Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">AI</div>
              <div className="text-gray-600">Powered Platform</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">Global</div>
              <div className="text-gray-600">Cloud Network</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-xl px-12 py-4">
            Optimize Oracle ERP
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Oracle ERP Cloud Enhancements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Fusion Analytics",
                description: "Advanced Oracle Analytics Cloud integration with custom data models and ML insights."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Advanced security with Oracle Identity Cloud and comprehensive audit controls."
              },
              {
                icon: Database,
                title: "Database Optimization",
                description: "Oracle Database performance tuning and autonomous database integration."
              },
              {
                icon: BarChart,
                title: "AI/ML Integration",
                description: "Oracle AI platform integration with predictive analytics and automation."
              },
              {
                icon: Clock,
                title: "Process Intelligence",
                description: "Oracle Process Mining integration for continuous process optimization."
              },
              {
                icon: CheckCircle,
                title: "Cloud Migration",
                description: "Seamless migration from on-premise Oracle to Oracle Cloud Infrastructure."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-red-50 text-red-600 mb-6">
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
      <section className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Maximize Oracle ERP Performance
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="Oracle ERP Modules" className="border-gray-200" />
                <Textarea 
                  placeholder="What Oracle ERP optimizations do you need?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  Get Oracle Optimization Plan
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

export default OracleERP;
