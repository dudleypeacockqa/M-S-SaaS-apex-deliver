
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface MobileNavigationSectionProps {
  title: string;
  links: Array<{ 
    name: string; 
    path: string;
    description?: string;
  }>;
  onLinkClick: () => void;
}

export const MobileNavigationSection = ({ title, links, onLinkClick }: MobileNavigationSectionProps) => {
  const hasDescriptions = links.some(link => link.description);
  
  return (
    <div className="px-3 py-3">
      <div className="text-sm font-medium text-gray-900 mb-3">{title}</div>
      <div className="pl-2 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="group block px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 rounded-lg transition-all duration-300 border border-transparent hover:border-brand-gold/20"
            onClick={onLinkClick}
          >
            {hasDescriptions ? (
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">
                    {link.name}
                  </div>
                  {link.description && (
                    <div className="text-xs text-gray-600 mt-0.5 group-hover:text-gray-700 transition-colors">
                      {link.description}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-gold transition-all duration-300 transform group-hover:translate-x-1 mt-1 ml-2" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-brand-navy group-hover:text-brand-gold transition-colors font-medium">{link.name}</span>
                <ArrowRight className="h-4 w-4 text-transparent group-hover:text-brand-gold transition-all duration-300 transform group-hover:translate-x-1" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
