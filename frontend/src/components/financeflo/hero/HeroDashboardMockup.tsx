
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap } from "lucide-react";

export const HeroDashboardMockup: React.FC = () => {
  return (
    <div className="relative">
      {/* Main Dashboard Mockup */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-all duration-500">
        {/* Browser Header */}
        <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="ml-4 bg-white rounded px-3 py-1 text-xs text-gray-600">
            financeflo.ai/dashboard
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Finance Dashboard</h3>
              <Badge className="bg-green-100 text-green-800">Live Data</Badge>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">£2.4M</div>
                <div className="text-sm text-green-600">+23% vs last month</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">94%</div>
                <div className="text-sm text-blue-600">+15% improvement</div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded flex items-end justify-between px-2 pb-2">
                <div className="w-4 bg-blue-500 rounded-t h-3/5"></div>
                <div className="w-4 bg-blue-500 rounded-t h-4/5"></div>
                <div className="w-4 bg-blue-500 rounded-t h-2/5"></div>
                <div className="w-4 bg-blue-500 rounded-t h-full"></div>
                <div className="w-4 bg-blue-500 rounded-t h-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
        AI Processing
      </div>
      
      <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
        Real-time Updates
      </div>
    </div>
  );
};
