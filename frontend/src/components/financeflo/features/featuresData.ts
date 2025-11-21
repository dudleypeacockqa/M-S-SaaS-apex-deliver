
import { 
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Cog
} from "lucide-react";
import { Feature, AdditionalFeature } from "./types";

export const mainFeatures: Feature[] = [
  {
    icon: Brain,
    title: "Adaptive Intelligence Framework™",
    subtitle: "AI That Learns Your Business",
    description: "Our AI system adapts to your specific workflows, industry requirements, and business processes. Unlike generic solutions, it becomes smarter with every transaction.",
    benefits: [
      "Custom AI models trained on your data",
      "Industry-specific intelligence",
      "Continuous learning and optimization",
      "Predictive insights and recommendations"
    ],
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50",
    stats: { value: "300%", label: "Efficiency Gain" }
  },
  {
    icon: Zap,
    title: "Lightning-Fast ERP Integration",
    subtitle: "Seamless System Connectivity",
    description: "Connect your existing ERP systems (Sage Intacct, Acumatica, Odoo) in minutes, not months. Our pre-built connectors ensure data flows seamlessly across all platforms.",
    benefits: [
      "Pre-built ERP connectors",
      "Real-time data synchronization",
      "Zero-downtime implementation",
      "Automatic error handling"
    ],
    color: "from-green-500 to-teal-600",
    bgColor: "bg-green-50",
    stats: { value: "15 Min", label: "Setup Time" }
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    subtitle: "Bank-Level Protection",
    description: "Your financial data is protected with military-grade encryption, SOC2 compliance, and multi-factor authentication. We exceed industry security standards.",
    benefits: [
      "End-to-end encryption",
      "SOC2 Type II certified",
      "Multi-factor authentication",
      "UK data residency"
    ],
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-50",
    stats: { value: "99.9%", label: "Uptime SLA" }
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics Engine",
    subtitle: "Future-Ready Insights",
    description: "Forecast cash flow, predict payment delays, and identify growth opportunities with AI-powered analytics that see around corners.",
    benefits: [
      "Cash flow forecasting",
      "Risk assessment automation",
      "Growth opportunity identification",
      "Scenario planning tools"
    ],
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
    stats: { value: "95%", label: "Accuracy Rate" }
  }
];

export const additionalFeatures: AdditionalFeature[] = [
  {
    icon: Clock,
    title: "24/7 Automated Processing",
    description: "Never miss a transaction with round-the-clock processing"
  },
  {
    icon: Users,
    title: "Multi-User Collaboration",
    description: "Team-based workflows with role-based permissions"
  },
  {
    icon: BarChart3,
    title: "Real-Time Reporting",
    description: "Live dashboards with instant business insights"
  },
  {
    icon: Cog,
    title: "Custom Workflows",
    description: "Tailored automation for your unique processes"
  }
];
