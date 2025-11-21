
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "£299",
    period: "/month",
    description: "Perfect for growing businesses",
    features: [
      "Up to 500 invoices/month",
      "Basic AI processing",
      "Real-time reporting",
      "Email support",
      "2 user accounts",
      "Basic integrations"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "£699",
    period: "/month",
    description: "Most popular for mid-market",
    features: [
      "Up to 2,000 invoices/month",
      "Advanced AI & analytics",
      "Custom reporting",
      "Priority support",
      "10 user accounts",
      "All integrations",
      "API access",
      "Dedicated account manager"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited invoices",
      "Custom AI training",
      "White-label options",
      "24/7 phone support",
      "Unlimited users",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment"
    ],
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business size and needs. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-0 shadow-lg ${plan.popular ? 'ring-2 ring-blue-600 transform scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                {plan.price !== "Custom" && <p className="text-gray-500 text-xs italic mt-1">ex-VAT (B2B only)</p>}
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  size="lg"
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-gray-500 text-sm mb-8 italic">
            All prices shown are exclusive of VAT. This service is for business-to-business (B2B) customers only.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <span>✓ 99.9% Uptime SLA</span>
            <span>✓ SOC2 Compliant</span>
            <span>✓ 24/7 Monitoring</span>
            <span>✓ UK Data Centers</span>
          </div>
        </div>
      </div>
    </section>
  );
};
