
export interface HeroStat {
  value: string;
  label: string;
  color: string;
}

export interface TrustIndicator {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

export interface CTAButton {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'primary' | 'secondary';
  action: string;
}
