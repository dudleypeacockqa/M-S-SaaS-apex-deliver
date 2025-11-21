
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Target, BarChart3 } from "lucide-react";

const TrendFloSystemSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            The 3-Component <span className="text-blue-600">TrendFlo AI System</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each component works together to give you unprecedented insight into your market
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Component 1 */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Component 1: Predictive Trend Analysis
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We analyze over 2.8 billion data points across social media, search trends, competitor launches, 
                and market signals to identify trends 60-90 days before they peak.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800 mb-2">Key Features:</div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Social media sentiment analysis</li>
                  <li>• Search volume prediction</li>
                  <li>• Competitor launch tracking</li>
                  <li>• Market signal detection</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Component 2 */}
          <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Component 2: Product-Market Fit Scoring
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We score every potential product opportunity on a scale of 1-100 based on 47 different factors 
                including market demand, competition density, profit margins, and viral potential.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800 mb-2">Scoring Factors:</div>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Market demand intensity</li>
                  <li>• Competition density analysis</li>
                  <li>• Profit margin potential</li>
                  <li>• Viral coefficient prediction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Component 3 */}
          <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Component 3: Channel Optimization Matrix
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We identify the exact influencers, ad channels, and marketing strategies that will give you 
                the highest ROI for each specific product in your catalog.
              </p>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm font-medium text-indigo-800 mb-2">Optimization Areas:</div>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Influencer ROI prediction</li>
                  <li>• Ad channel performance</li>
                  <li>• Content strategy optimization</li>
                  <li>• Budget allocation matrix</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrendFloSystemSection;
