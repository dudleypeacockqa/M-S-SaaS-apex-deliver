import React, { useCallback } from 'react';
import { Button } from "@/components/marketing/financeflo/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Phone
} from "lucide-react";

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  const handleAssessmentClick = useCallback(() => {
    navigate('/assessment');
  }, [navigate]);

  const handleContactClick = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Business Into a Revenue-Generating Machine?
        </h2>
        
        <p className="text-xl text-blue-100 mb-12">
          Join 500+ businesses that have increased qualified prospects by 300% 
          while streamlining operations with our AI-powered ERP integration system.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            onClick={handleAssessmentClick}
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            onClick={handleContactClick}
          >
            <Phone className="mr-2 h-6 w-6" />
            Book Strategy Session
          </Button>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>30-day free trial</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Setup in under 24 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};