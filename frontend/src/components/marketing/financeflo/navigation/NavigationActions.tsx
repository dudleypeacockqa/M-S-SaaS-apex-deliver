
import React, { useState } from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Play, ChevronDown, LogIn, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/marketing/financeflo/ui/dropdown-menu";

export const NavigationActions = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleBookConsultation = () => {
    // Redirect to contact page for consultation booking
    window.location.href = "/contact";
  };

  const handleSignIn = () => {
    // Redirect to Clerk sign-in page for existing M&A SaaS clients
    window.location.href = "/sign-in";
  };

  const handleStartTrial = () => {
    // Redirect to Clerk sign-up page for 14-day free trial (credit card required)
    window.location.href = "/sign-up";
  };

  const demoOptions = [
    { name: "Complete System Demo", path: "/demo", description: "Full platform walkthrough" },
    { name: "ERP Implementation", path: "/demo/erp", description: "Sage Intacct, Acumatica, Odoo" },
    { name: "Voice AI in Action", path: "/demo/voice-ai", description: "Live conversation demo" },
    { name: "LeverageFlo.ai Marketing", path: "/demo/leverageflo", description: "Marketing automation system" },
    { name: "Industry Solutions", path: "/demo/industries", description: "Construction, Healthcare, Finance" },
  ];

  return (
    <div className="ml-4 flex items-center space-x-3">
      {/* Sign In Button */}
      <Button 
        variant="ghost"
        className="text-sm text-brand-navy hover:text-brand-teal-600 hover:bg-brand-teal-50 transition-all flex items-center gap-1.5"
        onClick={handleSignIn}
      >
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>

      {/* Watch Demos Dropdown */}
      <DropdownMenu onOpenChange={setIsDemoOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="brand-secondary" 
            className="text-sm transition-all flex items-center gap-1.5"
          >
            <Play className="h-4 w-4" />
            Watch Demos
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDemoOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-80 p-2 z-50"
          align="end"
          sideOffset={8}
        >
          <div className="grid gap-1">
            {demoOptions.map((demo) => (
              <DropdownMenuItem key={demo.path} asChild className="p-0">
                 <Link 
                  to={demo.path}
                  className="w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-brand-teal-400/5 hover:to-brand-blue/10 transition-all duration-300 group border border-transparent hover:border-brand-teal-400/20"
                  onClick={() => setIsDemoOpen(false)}
                >
                  <div className="flex items-start space-x-3">
                    <Play className="h-4 w-4 text-brand-navy group-hover:text-brand-teal-600 transition-colors mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                       <div className="font-semibold text-brand-navy group-hover:text-brand-teal-600 transition-colors">{demo.name}</div>
                       <div className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                         {demo.description}
                       </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-teal-600 transition-all duration-300 transform group-hover:translate-x-1 mt-1" />
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className="p-0">
              <Link 
                to="/demo"
                className="bg-gradient-to-r from-brand-teal-400 to-brand-blue hover:from-brand-teal-500 hover:to-brand-blue-600 w-full px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => setIsDemoOpen(false)}
              >
                <Play className="h-4 w-4" />
                View All Demos
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Book Consultation Button */}
      <Button 
        variant="brand-secondary"
        className="text-sm transition-all flex items-center gap-1.5"
        onClick={handleBookConsultation}
      >
        <Calendar className="h-4 w-4" />
        Book Consultation
      </Button>
      
      {/* Start Free Trial Button - Primary CTA */}
      <Button 
        variant="brand-cta"
        className="text-sm bg-gradient-to-r from-brand-teal-400 to-brand-blue hover:from-brand-teal-500 hover:to-brand-blue-600 text-white font-semibold transition-all flex items-center gap-1.5 shadow-lg hover:shadow-xl"
        onClick={handleStartTrial}
      >
        <Sparkles className="h-4 w-4" />
        Start Free Trial
      </Button>
    </div>
  );
};
