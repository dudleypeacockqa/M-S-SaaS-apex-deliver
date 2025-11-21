
import React from "react";
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Badge } from "@/components/marketing/financeflo/ui/badge";
import { Button } from "@/components/marketing/financeflo/ui/button";
import { 
  Star,
  Quote,
  ArrowLeft,
  ArrowRight,
  Building,
  MapPin,
  Calendar
} from "lucide-react";
import { TestimonialData } from "./types";

interface TestimonialCardProps {
  testimonial: TestimonialData;
  activeIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onIndicatorClick: (index: number) => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  activeIndex,
  totalCount,
  onPrevious,
  onNext,
  onIndicatorClick,
}) => {
  return (
    <Card className="bg-white border-0 shadow-2xl overflow-hidden">
      <CardContent className="p-8">
        {/* Quote */}
        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
          <blockquote className="text-xl text-gray-700 leading-relaxed pl-6">
            "{testimonial.quote}"
          </blockquote>
        </div>

        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
            {testimonial.avatar}
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
            <p className="text-blue-600 font-semibold">{testimonial.title}</p>
            <p className="text-gray-600">{testimonial.company}</p>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{testimonial.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{testimonial.companySize}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{testimonial.implementationDate}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <Badge className="bg-blue-100 text-blue-800">{testimonial.industry}</Badge>
          </div>
        </div>

        {/* Before/After */}
        <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-red-600 font-semibold mb-2">Before</div>
              <div className="text-gray-700">{testimonial.beforeAfter.before}</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">After</div>
              <div className="text-gray-700">{testimonial.beforeAfter.after}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalCount }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => onIndicatorClick(index)}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
