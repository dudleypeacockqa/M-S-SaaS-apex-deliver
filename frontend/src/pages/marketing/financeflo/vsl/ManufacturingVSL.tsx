import React from "react";
import { Navigation } from "@/components/marketing/financeflo/Navigation";
import { Footer } from "@/components/marketing/financeflo/Footer";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Input } from "@/components/marketing/financeflo/ui/input";
import { Textarea } from "@/components/marketing/financeflo/ui/textarea";
import { Play, CheckCircle, Factory, TrendingUp, Clock, Shield } from "lucide-react";

const ManufacturingVSL = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Video Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
            <Factory className="mr-2 h-4 w-4" />
            For Manufacturing Companies Only
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Stop Production Line
            <span className="text-green-600"> Finance Bottlenecks</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn how UK manufacturers are reducing cost accounting time by 85% while improving product margins with automated job costing, inventory tracking, and production finance.
          </p>
          
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="aspect-video bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden">
              <video 
                src="/videos/manufacturing_vsl_final.mp4"
                poster="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Manufacturing Finance Problems Hurting Profitability?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Complex job costing across multiple production lines",
              "Inventory valuation nightmares with WIP tracking",
              "Manual allocation of overhead costs to products",
              "Difficulty tracking true product profitability",
              "Time-consuming month-end cost rollups",
              "Struggling with standard vs actual cost variance analysis"
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
            Manufacturing-Specific Finance Automation
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Automated Job Costing",
                description: "Real-time job costing with automatic material, labor, and overhead allocation across all production orders."
              },
              {
                icon: Clock,
                title: "WIP & Inventory Tracking",
                description: "Live work-in-progress valuation and inventory movements with automated cost basis calculations."
              },
              {
                icon: Shield,
                title: "Product Profitability",
                description: "Instant product margin analysis with standard vs actual cost reporting and variance explanations."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-lg bg-green-50 text-green-600 mb-6">
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
            Manufacturing Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "David Mitchell",
                role: "Production Director",
                company: "Precision Components Ltd",
                content: "We discovered 3 products were losing money that we thought were profitable. The automated costing saved our margins.",
                improvement: "18% margin increase"
              },
              {
                name: "Lisa Carter",
                role: "Finance Manager",
                company: "Advanced Manufacturing UK",
                content: "Month-end closing went from 2 weeks to 3 days. We now have real-time visibility into every job's profitability.",
                improvement: "85% faster reporting"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {testimonial.improvement}
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
            Manufacturing Finance Package
          </h2>
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <div className="text-5xl font-bold text-green-600 mb-4">£799/month</div>
              <p className="text-xl text-gray-600 mb-8">Complete manufacturing finance automation</p>
              <ul className="text-left space-y-4 mb-8 max-w-md mx-auto">
                {[
                  "Automated job costing",
                  "WIP tracking & valuation",
                  "Product profitability analysis",
                  "Standard cost maintenance",
                  "Variance reporting",
                  "Manufacturing finance expert"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-xl px-12 py-4">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="py-20 bg-green-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Get Your Free Manufacturing Finance Assessment
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="border-gray-200" />
                  <Input placeholder="Last Name" className="border-gray-200" />
                </div>
                <Input placeholder="Business Email" type="email" className="border-gray-200" />
                <Input placeholder="Company Name" className="border-gray-200" />
                <Input placeholder="Annual Production Volume" className="border-gray-200" />
                <Textarea 
                  placeholder="What manufacturing finance challenges are you facing?"
                  className="border-gray-200 min-h-[100px]" 
                />
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
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

export default ManufacturingVSL;
