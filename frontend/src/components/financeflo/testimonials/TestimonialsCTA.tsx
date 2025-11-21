
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users } from "lucide-react";

export const TestimonialsCTA: React.FC = () => {
  return (
    <div className="text-center mt-16">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join These Success Stories?</h3>
      <p className="text-xl text-gray-600 mb-8">
        See how your business can achieve similar results with our AI+ERP platform.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Start Your Success Story
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
        
        <Button 
          size="lg"
          variant="outline"
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          View All Case Studies
          <Users className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
