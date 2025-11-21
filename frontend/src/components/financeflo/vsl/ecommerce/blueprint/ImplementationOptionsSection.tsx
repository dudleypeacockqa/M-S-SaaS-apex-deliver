
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, CheckCircle } from "lucide-react";

const ImplementationOptionsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How To Implement This In Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You have two options to get predictive intelligence working in your business
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Option 1 */}
          <Card className="border-2 border-red-200 relative">
            <CardContent className="p-8">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Option 1: DIY
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Build It Yourself
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-700">Hire team of data scientists</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-700">Access multiple data sources</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-700">18+ months development time</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-500 mr-3" />
                    <span className="text-gray-700">$500K-$1M investment</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">$500K+</div>
                  <div className="text-gray-600">Minimum Investment</div>
                  <div className="text-sm text-gray-500 mt-1">18+ months to build</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Option 2 */}
          <Card className="border-2 border-green-200 relative bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-8">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  Option 2: TrendFlo AI
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Work With Us
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Fully built and tested system</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">2.8B+ data points analyzed</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">30-day implementation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Done-for-you service</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">30 Days</div>
                  <div className="text-gray-600">To Implementation</div>
                  <div className="text-sm text-gray-500 mt-1">Proven 94% success rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImplementationOptionsSection;
