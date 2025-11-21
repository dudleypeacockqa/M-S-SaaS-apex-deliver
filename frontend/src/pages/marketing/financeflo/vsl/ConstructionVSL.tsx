import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Play, CheckCircle, HardHat, TrendingUp, Clock, Shield } from "lucide-react";

const ConstructionVSL = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Video Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-6">
            <HardHat className="mr-2 h-4 w-4" />
            For Construction Companies Only
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Stop Losing Money on
            <span className="text-orange-600"> Manual Finance Tasks</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Watch how UK construction companies are saving £50,000+ annually by automating invoice processing, project costing, and cash flow management.
          </p>
          
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="aspect-video bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                alt="Construction site with workers"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-xl px-8 py-4">
                  <Play className="mr-3 h-6 w-6" />
                  Watch 5-Minute Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Are These Construction Finance Headaches Costing You Money?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Spending hours manually processing subcontractor invoices",
              "Losing track of project costs and going over budget",
              "Cash flow problems due to delayed invoice processing",
              "Difficulty tracking materials costs across multiple sites",
              "Manual timesheet processing eating up admin time",
              "Struggling with complex tax compliance and CIS deductions"
            ].map((problem, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-sm">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-gray-700 text-lg">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            FinanceFlo.ai: Built Specifically for Construction Companies
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Project Cost Tracking",
                description: "Real-time project profitability tracking with automated cost allocation across multiple sites and phases."
              },
              {
                icon: Clock,
                title: "CIS Compliance",
                description: "Automated CIS deductions, monthly returns, and subcontractor verification to keep you HMRC compliant."
              },
              {
                icon: Shield,
                title: "Cash Flow Management",
                description: "Predict cash flow gaps, automate payment schedules, and manage retention releases automatically."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-orange-50 text-orange-600 mb-6">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Construction Companies Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "James Mitchell",
                role: "Operations Director",
                company: "Mitchell Construction Ltd",
                content: "We've cut our invoice processing time by 80% and improved project margins by 15%. The CIS automation alone saves us 20 hours per month.",
                savings: "£45,000 annually"
              },
              {
                name: "Sarah Thompson",
                role: "Finance Manager", 
                company: "BuildRight Contractors",
                content: "Real-time project costing has transformed how we bid for jobs. We now know exactly where we stand on every project.",
                savings: "£62,000 annually"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-2xl font-bold text-orange-600 mb-4">
                    Saved {testimonial.savings}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-gray-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Special Construction Industry Pricing
          </h2>
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-5xl font-bold text-orange-600 mb-4">£599/month</div>
              <p className="text-xl text-gray-600 mb-8">Everything you need to automate construction finance</p>
              <ul className="text-left space-y-4 mb-8 max-w-md mx-auto">
                {[
                  "Unlimited invoice processing",
                  "CIS compliance automation", 
                  "Project cost tracking",
                  "Cash flow forecasting",
                  "Subcontractor management",
                  "Dedicated construction support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-xl px-12 py-4">
                Start 14-Day Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Get Your Free Construction Finance Automation Assessment
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="Annual Revenue" className="border-gray-200" />
                <Textarea 
                  placeholder="What are your biggest construction finance challenges?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
                  Get My Free Assessment
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

export default ConstructionVSL;
