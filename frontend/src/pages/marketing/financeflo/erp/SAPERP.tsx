
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { CheckCircle, TrendingUp, Shield, Database, Clock, ArrowRight, BarChart } from "lucide-react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";

const SAPERP = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-800 mb-6">
            <Database className="mr-2 h-4 w-4" />
            SAP Integration
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Modernize Your
            <span className="text-slate-600"> SAP</span> Enterprise
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Bridge legacy SAP systems with modern cloud technologies through intelligent automation and real-time integration platforms.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600 mb-2">Legacy</div>
              <div className="text-gray-600">System Bridge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600 mb-2">Real-time</div>
              <div className="text-gray-600">Data Sync</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600 mb-2">Cloud</div>
              <div className="text-gray-600">Migration Ready</div>
            </div>
          </div>
          
          <Button size="lg" className="bg-slate-600 hover:bg-slate-700 text-xl px-12 py-4">
            Modernize SAP
          </Button>
        </div>
      </section>

      {/* Integration Capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            SAP Modernization Suite
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Legacy Integration",
                description: "Connect SAP R/3, ECC, and S/4HANA with modern cloud applications seamlessly."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Advanced security protocols for SAP data with encryption and access controls."
              },
              {
                icon: Database,
                title: "Data Migration",
                description: "Safe and efficient SAP data migration to cloud platforms with zero downtime."
              },
              {
                icon: BarChart,
                title: "Real-time Analytics",
                description: "Live SAP data streaming to modern BI tools and analytics platforms."
              },
              {
                icon: Clock,
                title: "Process Automation",
                description: "Automate SAP workflows with intelligent RPA and business process management."
              },
              {
                icon: CheckCircle,
                title: "Compliance Management",
                description: "Automated compliance monitoring for SOX, GDPR, and industry regulations."
              }
            ].map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-slate-50 text-slate-600 mb-6">
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Modernize Your SAP Environment
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="SAP Version & Modules" className="border-gray-200" />
                <Textarea 
                  placeholder="What SAP modernization challenges do you face?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-slate-600 hover:bg-slate-700" size="lg">
                  Get SAP Modernization Plan
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

export default SAPERP;
