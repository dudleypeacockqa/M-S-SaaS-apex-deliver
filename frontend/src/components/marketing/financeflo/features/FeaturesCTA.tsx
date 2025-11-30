
import React from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { useNavigate } from "react-router-dom";
import { Target, Calendar } from "lucide-react";

export const FeaturesCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-12 sm:mt-16 px-0">
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-3 sm:mb-4 break-words">Ready to Transform Your Finance Operations?</h3>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-white/90 break-words px-2">
          Join 500+ businesses that have revolutionized their finance processes with our AI+ERP platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Button
            size="lg"
            className="bg-white text-brand-navy hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            onClick={() => navigate('/assessment')}
          >
            Start Free Assessment
            <Target className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            size="lg"
            className="bg-brand-teal-600 text-white hover:bg-brand-teal-600/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            onClick={() => navigate('/contact')}
          >
            Schedule Demo
            <Calendar className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
