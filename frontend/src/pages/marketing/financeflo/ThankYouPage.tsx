import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Thank You!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          Your message has been successfully submitted. We'll get back to you within 24 hours to discuss your business requirements review.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            What happens next:
          </p>
          
          <div className="text-left space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>We'll review your business requirements</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Schedule a personalized consultation call</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Provide tailored recommendations</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;