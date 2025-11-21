
import React from "react";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Star } from "lucide-react";

export const HeroTrustBadge: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <Star className="h-5 w-5 mr-2" />
        Trusted by 500+ UK Finance Leaders
      </Badge>
    </div>
  );
};
