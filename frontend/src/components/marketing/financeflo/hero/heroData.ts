
import { 
  ArrowRight, 
  Play,
  Shield,
  Award,
  CheckCircle
} from "lucide-react";
import { HeroStat, TrustIndicator, CTAButton } from "./types";

export const heroStats: HeroStat[] = [
  {
    value: "80%",
    label: "Time Saved",
    color: "text-blue-600"
  },
  {
    value: "300%",
    label: "ROI Increase", 
    color: "text-green-600"
  },
  {
    value: "30 Days",
    label: "Implementation",
    color: "text-purple-600"
  }
];

export const trustIndicators: TrustIndicator[] = [
  {
    icon: Shield,
    label: "Enterprise Security",
    color: "text-green-600"
  },
  {
    icon: Award,
    label: "Award Winning",
    color: "text-blue-600"
  },
  {
    icon: CheckCircle,
    label: "Guaranteed Results",
    color: "text-purple-600"
  }
];

export const ctaButtons: CTAButton[] = [
  {
    text: "Start Free Assessment",
    icon: ArrowRight,
    variant: "primary",
    action: "assessment"
  },
  {
    text: "Watch Demo Video",
    icon: Play,
    variant: "secondary", 
    action: "demo"
  }
];
