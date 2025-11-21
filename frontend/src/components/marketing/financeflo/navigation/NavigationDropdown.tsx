
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/marketing/financeflo/ui/dropdown-menu";

interface NavigationDropdownProps {
  title: string;
  links: Array<{ 
    name: string; 
    path: string; 
    description?: string;
  }>;
  useColumns?: boolean; // New prop to enable two-column layout
}

export const NavigationDropdown = ({ title, links = [], useColumns = false }: NavigationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDescriptions = links.some(link => link.description);
  
  // Calculate width based on columns and descriptions
  const getDropdownWidth = () => {
    if (useColumns && hasDescriptions) return "w-[640px]"; // Two columns with descriptions
    if (useColumns) return "w-[480px]"; // Two columns without descriptions
    if (hasDescriptions) return "w-80"; // Single column with descriptions
    return "w-56"; // Single column without descriptions
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center px-4 py-2 text-base font-medium text-brand-navy hover:text-brand-gold transition-all duration-300 focus:outline-none group relative"
          >
            {title}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-brand-gold`} />
            {/* Enhanced visual indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ${getDropdownWidth()} p-2 z-50`}
        align="center"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className={`grid gap-1 ${useColumns ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {links.map((link) => (
            <DropdownMenuItem key={link.path} asChild className="p-0">
              <Link 
                to={link.path}
                className={`w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 transition-all duration-300 group border border-transparent hover:border-brand-gold/20 ${
                  hasDescriptions ? 'block' : 'text-sm'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {hasDescriptions ? (
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">{link.name}</div>
                      {link.description && (
                        <div className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                          {link.description}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-gold transition-all duration-300 transform group-hover:translate-x-1 mt-1" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brand-navy group-hover:text-brand-gold transition-colors">{link.name}</span>
                    <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-gold transition-all duration-300 transform group-hover:translate-x-1" />
                  </div>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
