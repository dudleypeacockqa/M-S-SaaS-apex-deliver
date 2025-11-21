
import React from "react";

export const SocialProofStats: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold mb-2">500+</div>
          <div className="text-white/80">Happy Customers</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">98%</div>
          <div className="text-white/80">Satisfaction Rate</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">£50M+</div>
          <div className="text-white/80">Cost Savings Generated</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">24/7</div>
          <div className="text-white/80">Support Available</div>
        </div>
      </div>
    </div>
  );
};
