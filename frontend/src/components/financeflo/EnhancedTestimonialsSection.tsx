
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { TestimonialCard } from "./testimonials/TestimonialCard";
import { TestimonialResults } from "./testimonials/TestimonialResults";
import { CompanyLogos } from "./testimonials/CompanyLogos";
import { SocialProofStats } from "./testimonials/SocialProofStats";
import { TestimonialsCTA } from "./testimonials/TestimonialsCTA";
import { testimonials, companyLogos } from "./testimonials/testimonialsData";

export const EnhancedTestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeTestimonial];

  return (
    <section className="brand-section bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-success to-primary text-white px-6 py-2 text-lg font-semibold mb-6">
            <Award className="h-5 w-5 mr-2" />
            Customer Success Stories
          </Badge>
          
          <h2 className="brand-heading brand-heading-lg text-foreground mb-6">
            Real Results from
            <span className="brand-gradient-text"> Real Businesses</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how UK businesses are transforming their finance operations and achieving 
            measurable results with our AI+ERP platform.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Testimonial Content */}
          <div className="space-y-8">
            <TestimonialCard
              testimonial={currentTestimonial}
              activeIndex={activeTestimonial}
              totalCount={testimonials.length}
              onPrevious={prevTestimonial}
              onNext={nextTestimonial}
              onIndicatorClick={setActiveTestimonial}
            />
          </div>

          {/* Results & Video */}
          <TestimonialResults testimonial={currentTestimonial} />
        </div>

        {/* Company Logos */}
        <CompanyLogos logos={companyLogos} />

        {/* Social Proof Stats */}
        <SocialProofStats />

        {/* CTA */}
        <TestimonialsCTA />
      </div>
    </section>
  );
};

export default EnhancedTestimonialsSection;
