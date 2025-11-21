
import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  color: string;
  bgColor: string;
  stats: { value: string; label: string };
}

export interface AdditionalFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}
