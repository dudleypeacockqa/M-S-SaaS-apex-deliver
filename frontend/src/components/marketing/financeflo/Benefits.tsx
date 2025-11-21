
import { Card, CardContent } from "@/components/marketing/financeflo/ui/card";
import { TrendingUp, Users, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Profit Margins",
    description: "Reduce operational costs by up to 60% and improve cash flow with automated processes.",
    metric: "60% Cost Reduction",
    color: "text-green-600 bg-green-50"
  },
  {
    icon: Clock,
    title: "Save Time & Resources",
    description: "Free up your finance team to focus on strategic work instead of manual data entry.",
    metric: "40 Hours/Week Saved",
    color: "text-brand-navy bg-brand-navy/5"
  },
  {
    icon: Shield,
    title: "Eliminate Human Error",
    description: "Remove costly mistakes with AI-powered validation and automated workflows.",
    metric: "99.9% Accuracy",
    color: "text-brand-gold bg-brand-gold/10"
  },
  {
    icon: Users,
    title: "Scale Your Business",
    description: "Handle 10x more transactions without increasing headcount or complexity.",
    metric: "10x Scale Capacity",
    color: "text-brand-navy-light bg-brand-navy/5"
  }
];

export const Benefits = () => {
  return (
    <section id="benefits" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transform Your Business Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See immediate impact on your bottom line with measurable improvements across all key metrics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className={`inline-flex p-3 rounded-lg ${benefit.color} mb-6`}>
                  <benefit.icon size={32} />
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{benefit.description}</p>
                </div>
                <div className={`text-2xl font-bold ${benefit.color.split(' ')[0]}`}>
                  {benefit.metric}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
