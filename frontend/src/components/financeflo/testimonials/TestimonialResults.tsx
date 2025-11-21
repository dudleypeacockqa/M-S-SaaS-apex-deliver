
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp } from "lucide-react";
import { TestimonialData } from "./types";

interface TestimonialResultsProps {
  testimonial: TestimonialData;
}

export const TestimonialResults: React.FC<TestimonialResultsProps> = ({
  testimonial,
}) => {
  return (
    <div className="space-y-6">
      {/* Video Testimonial */}
      {testimonial.hasVideo && (
        <Card className="bg-white border-0 shadow-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300">
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 text-blue-600 ml-1" />
                </div>
                <p className="text-gray-700 font-semibold">Watch {testimonial.name}'s Story</p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white">LIVE</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Results Metrics */}
      <div className="grid gap-4">
        {testimonial.results.map((result, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{result.metric}</div>
                  <div className="text-2xl font-bold text-blue-600">{result.value}</div>
                  <div className="text-sm text-gray-500">{result.description}</div>
                </div>
                <div className="text-green-600">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
