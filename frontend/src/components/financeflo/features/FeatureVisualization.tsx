
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Feature } from "./types";

interface FeatureVisualizationProps {
  features: Feature[];
  activeFeature: number;
}

export const FeatureVisualization: React.FC<FeatureVisualizationProps> = ({
  features,
  activeFeature,
}) => {
  const navigate = useNavigate();
  const currentFeature = features[activeFeature];

  return (
    <div className="relative">
      <div className="sticky top-8">
        <Card className="bg-white shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className={`p-8 bg-gradient-to-br ${currentFeature.color} text-white`}>
              <div className="flex items-center space-x-4 mb-6">
                <currentFeature.icon className="h-12 w-12" />
                <div>
                  <h3 className="text-2xl font-heading font-bold">{currentFeature.title}</h3>
                  <p className="text-white/80">{currentFeature.subtitle}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Processing Status</span>
                    <Badge className="bg-brand-teal-600 text-white">Active</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{currentFeature.stats.value}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-1000"
                        style={{ 
                          width: activeFeature === 0 ? '95%' : 
                                activeFeature === 1 ? '88%' : 
                                activeFeature === 2 ? '99%' : '92%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <Button
                className="w-full bg-gradient-to-r from-brand-navy to-brand-navy-light hover:from-brand-navy hover:to-brand-navy text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => navigate('/contact')}
              >
                Learn More About {currentFeature.title}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
