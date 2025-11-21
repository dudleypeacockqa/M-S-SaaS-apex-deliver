
import React, { useState } from "react";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Play, ChevronDown } from "lucide-react";
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

  const demoOptions = [
    { name: "Complete System Demo", path: "/demo", description: "Full platform walkthrough" },
    { name: "ERP Implementation", path: "/demo/erp", description: "Sage Intacct, Acumatica, Odoo" },
    { name: "Voice AI in Action", path: "/demo/voice-ai", description: "Live conversation demo" },
    { name: "LeverageFlo.ai Marketing", path: "/demo/leverageflo", description: "Marketing automation system" },
    { name: "Industry Solutions", path: "/demo/industries", description: "Construction, Healthcare, Finance" },
  ];

  return (
    <div className="ml-4 flex items-center space-x-3">
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
                  className="w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 transition-all duration-300 group border border-transparent hover:border-brand-gold/20"
                  onClick={() => setIsDemoOpen(false)}
                >
                  <div className="flex items-start space-x-3">
                    <Play className="h-4 w-4 text-brand-navy group-hover:text-brand-gold transition-colors mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                       <div className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">{demo.name}</div>
                       <div className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                         {demo.description}
                       </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-gold transition-all duration-300 transform group-hover:translate-x-1 mt-1" />
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem asChild className="p-0">
              <Link 
                to="/demo"
                className="brand-button-primary w-full px-4 py-2 rounded-lg text-white transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => setIsDemoOpen(false)}
              >
                <Play className="h-4 w-4" />
                View All Demos
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="brand-cta"
        className="text-sm transition-all flex items-center gap-1.5"
        onClick={handleBookConsultation}
      >
        <Calendar className="h-4 w-4" />
        Book Consultation
      </Button>
    </div>
  );
};
