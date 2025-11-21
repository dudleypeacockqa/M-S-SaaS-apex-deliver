
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Williams",
    role: "Finance Director",
    company: "TechFlow Solutions",
    content: "FinanceFlo.ai has transformed our finance operations completely. We've reduced our month-end closing time from 5 days to just 6 hours.",
    rating: 5,
    avatar: "SW"
  },
  {
    name: "Michael Chen",
    role: "CFO",
    company: "GreenTech Industries",
    content: "The AI-powered invoice processing is incredible. We're processing 300% more invoices with the same team size.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emma Thompson",
    role: "Head of Finance",
    company: "Retail Plus Ltd",
    content: "Real-time reporting has given us unprecedented visibility into our cash flow. We can make decisions faster than ever.",
    rating: 5,
    avatar: "ET"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Finance Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what finance professionals are saying about their experience with FinanceFlo.ai
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">SAGE</div>
            <div className="text-2xl font-bold text-gray-400">XERO</div>
            <div className="text-2xl font-bold text-gray-400">QUICKBOOKS</div>
            <div className="text-2xl font-bold text-gray-400">HSBC</div>
          </div>
          <p className="text-gray-500 mt-4">Seamlessly integrates with your existing tools</p>
        </div>
      </div>
    </section>
  );
};
