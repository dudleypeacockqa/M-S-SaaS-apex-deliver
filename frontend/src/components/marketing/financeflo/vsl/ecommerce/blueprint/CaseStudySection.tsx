
import React from "react";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";

const CaseStudySection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Case Study: How Sarah Scaled From $50K to $300K/Month
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A detailed breakdown of how TrendFlo AI identified the "clean beauty for sensitive skin" trend 
            60 days before it exploded
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Challenge</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Sarah's beauty brand was stuck at $50K per month. Traditional market research suggested 
                focusing on anti-aging products, but the market was saturated with established competitors.
              </p>
              <p>
                She was spending $15K/month on ads with a 2.1x ROAS and struggling to find product-market fit 
                with her existing catalog.
              </p>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-8">The TrendFlo AI Solution</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-sm mr-4 mt-1 flex-shrink-0">1</div>
                <div>
                  <div className="font-medium text-gray-900">Trend Identification</div>
                  <div className="text-gray-600 text-sm">Our algorithm detected rising search volume and social mentions for "sensitive skin" + "clean beauty" 60 days before peak</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold text-sm mr-4 mt-1 flex-shrink-0">2</div>
                <div>
                  <div className="font-medium text-gray-900">Product Scoring</div>
                  <div className="text-gray-600 text-sm">Three specific formulations scored 87, 92, and 89 out of 100 for market potential</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center text-indigo-600 font-bold text-sm mr-4 mt-1 flex-shrink-0">3</div>
                <div>
                  <div className="font-medium text-gray-900">Channel Optimization</div>
                  <div className="text-gray-600 text-sm">Identified 2 micro-influencers with 94% predicted conversion rate for this specific niche</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="bg-white shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Results Timeline</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm mr-4">
                      Day 0
                    </div>
                    <div>
                      <div className="font-medium">$50K/month revenue</div>
                      <div className="text-sm text-gray-600">2.1x ROAS, struggling with product-market fit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm mr-4">
                      Day 30
                    </div>
                    <div>
                      <div className="font-medium">Product development started</div>
                      <div className="text-sm text-gray-600">3 new formulations based on TrendFlo AI recommendations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm mr-4">
                      Day 60
                    </div>
                    <div>
                      <div className="font-medium">Launch with micro-influencers</div>
                      <div className="text-sm text-gray-600">$85K/month, 4.2x ROAS</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm mr-4">
                      Day 120
                    </div>
                    <div>
                      <div className="font-medium">$300K/month revenue</div>
                      <div className="text-sm text-gray-600">6.8x ROAS, market leader in niche</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">500%</div>
                    <div className="text-sm text-green-700">Revenue Increase in 4 Months</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
