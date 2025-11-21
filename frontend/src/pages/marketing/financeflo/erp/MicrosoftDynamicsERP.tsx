
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Layers, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const MicrosoftDynamicsERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            <Layers className="mr-2 h-4 w-4" />
            Microsoft Dynamics Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Unlock
            <span className="text-blue-600"> Dynamics 365</span> Power
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your Microsoft Dynamics 365 into an intelligent business platform with AI-powered automation and seamless Microsoft ecosystem integration.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Microsoft Stack</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">AI</div>
              <div className="text-gray-600">Powered Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">365</div>
              <div className="text-gray-600">Office Integration</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-xl px-12 py-4">
            Optimize Dynamics
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Dynamics 365 Enhancement Suite
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Power BI Plus",
                description: "Advanced analytics beyond standard Power BI with custom AI models and predictive insights."
              },
              {
                icon: Shield,
                title: "Azure Security",
                description: "Enterprise-grade security with Azure AD integration and advanced threat protection."
              },
              {
                icon: Layers,
                title: "Office 365 Sync",
                description: "Deep integration with Teams, SharePoint, and Office applications for seamless workflow."
              },
              {
                icon: BarChart,
                title: "Copilot Enhancement",
                description: "AI-powered business intelligence with natural language queries and automated insights."
              },
              {
                icon: Clock,
                title: "Power Automate Pro",
                description: "Advanced workflow automation with custom connectors and intelligent triggers."
              },
              {
                icon: CheckCircle,
                title: "Compliance Center",
                description: "Automated compliance monitoring with regulatory reporting and audit trails."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-blue-50 text-blue-600 mb-6">
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
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Transform Your Dynamics 365
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="Dynamics 365 Modules Used" className="border-gray-200" />
                <Textarea 
                  placeholder="What Dynamics 365 enhancements interest you?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Get Dynamics Enhancement Plan
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

export default MicrosoftDynamicsERP;
