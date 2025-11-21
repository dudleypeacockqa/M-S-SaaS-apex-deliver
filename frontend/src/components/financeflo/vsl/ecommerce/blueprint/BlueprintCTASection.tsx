
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";

const BlueprintCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
          Ready to Implement TrendFlo AI?
        </h2>
        
        <p className="text-xl text-blue-200 mb-12 leading-relaxed">
          If you're serious about getting ahead of your competition and want to stop guessing about your product launches, 
          book a strategy session with our team.
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            What You'll Get On Your Strategy Session:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "The exact trends about to explode in your niche",
              "Which of your current products have highest profit potential",
              "Specific influencers and ad channels for best ROI",
              "How TrendFlo AI integrates with your current systems"
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-blue-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 px-12 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = '/vsl/ecommerce/application'}
          >
            <Zap className="mr-3 h-6 w-6" />
            Book Your Strategy Session Now
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <div className="text-blue-300 space-y-2">
            <p className="text-sm">
              ⚡ Strategy sessions normally cost $2,500 - yours is complimentary
            </p>
            <p className="text-sm">
              🔒 Only 7 spots available this quarter
            </p>
            <p className="text-sm">
              ⏰ Your competition is already using data to get ahead
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueprintCTASection;
