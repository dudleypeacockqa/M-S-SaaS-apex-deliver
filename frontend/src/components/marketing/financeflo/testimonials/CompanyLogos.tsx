
import React from "react";
import { CompanyLogo } from "./types";

interface CompanyLogosProps {
  logos: CompanyLogo[];
}

export const CompanyLogos: React.FC<CompanyLogosProps> = ({ logos }) => {
  return (
    <div className="text-center mb-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Trusted by Leading UK Businesses</h3>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
        {logos.map((company, index) => (
          <div 
            key={index}
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
              {company.logo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
