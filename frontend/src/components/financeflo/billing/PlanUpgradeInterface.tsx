import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$7.99',
    description: 'Perfect for individuals getting started',
    icon: Star,
    features: [
      'Up to 5 AI agents',
      'Basic workflow automation',
      'Email support',
      '10GB storage',
      'Basic analytics',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    description: 'Best for growing teams and businesses',
    icon: Zap,
    features: [
      'Up to 25 AI agents',
      'Advanced workflow automation',
      'Priority support',
      '100GB storage',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99',
    description: 'For large organizations with advanced needs',
    icon: Crown,
    features: [
      'Unlimited AI agents',
      'Custom workflow builder',
      '24/7 dedicated support',
      'Unlimited storage',
      'Advanced security',
      'Custom integrations',
      'White-label options',
      'SLA guarantee',
    ],
    popular: false,
  },
];

const PlanUpgradeInterface = () => {
  const { subscription_tier, createCheckout, loading } = useSubscription();
  const { toast } = useToast();

  const handleUpgrade = async (planId: string) => {
    try {
      await createCheckout(planId as 'basic' | 'premium' | 'enterprise');
      toast({
        title: "Success",
        description: "Redirecting to checkout...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  const isCurrentPlan = (planId: string) => {
    return subscription_tier?.toLowerCase() === planId.toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of IntelliFlow with our flexible pricing plans.
          Start your 7-day free trial today.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentPlan(plan.id);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </div>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || isCurrent}
                >
                  {isCurrent ? 'Current Plan' : `Start ${plan.name} Trial`}
                </Button>
                
                {!isCurrent && (
                  <p className="text-xs text-center text-muted-foreground">
                    7-day free trial • No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4 pt-8">
        <h2 className="text-xl font-semibold">All plans include:</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          <div className="space-y-2">
            <h3 className="font-medium">7-Day Free Trial</h3>
            <p className="text-sm text-muted-foreground">
              Try all features risk-free for a full week
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Cancel Anytime</h3>
            <p className="text-sm text-muted-foreground">
              No long-term commitments or cancellation fees
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Secure & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security and 99.9% uptime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanUpgradeInterface;