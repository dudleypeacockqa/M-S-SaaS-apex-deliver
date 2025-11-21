
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Clock, 
  Shield, 
  BarChart3, 
  Zap, 
  CheckCircle,
  FileText,
  Banknote
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Invoice Processing",
    description: "Automatically extract, validate, and process invoices with 99.9% accuracy using advanced OCR and machine learning."
  },
  {
    icon: Clock,
    title: "Real-Time Financial Reporting",
    description: "Get instant access to P&L, cash flow, and balance sheet reports with live data updates every 15 minutes."
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "End-to-end encryption, SOC2 compliance, and multi-factor authentication keep your financial data secure."
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Forecast cash flow, predict payment delays, and identify cost-saving opportunities with AI insights."
  },
  {
    icon: Zap,
    title: "Automated Reconciliation",
    description: "Match transactions across accounts automatically, reducing month-end closing time by 75%."
  },
  {
    icon: CheckCircle,
    title: "Compliance Automation",
    description: "Stay compliant with HMRC, FRS 102, and other UK regulations with automated tax calculations and reporting."
  },
  {
    icon: FileText,
    title: "Smart Document Management",
    description: "Organize, store, and retrieve financial documents with intelligent categorization and search."
  },
  {
    icon: Banknote,
    title: "Multi-Currency Support",
    description: "Handle international transactions with real-time exchange rates and automated currency conversion."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Automate Finance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive finance automation tools designed specifically for UK mid-market businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-blue-600 mb-4">
                  <feature.icon size={48} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
