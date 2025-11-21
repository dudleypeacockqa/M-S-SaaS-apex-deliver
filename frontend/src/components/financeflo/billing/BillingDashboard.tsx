import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Star, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

const BillingDashboard = () => {
  const { subscribed, subscription_tier, subscription_end, loading, openCustomerPortal } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getTierColor = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case 'basic': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'premium': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'enterprise': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={subscribed ? 'default' : 'secondary'}>
                {subscribed ? 'Active' : 'Inactive'}
              </Badge>
              {subscription_tier && (
                <Badge className={getTierColor(subscription_tier)}>
                  {subscription_tier}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Billing Date */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscribed ? formatDate(subscription_end) : 'N/A'}
            </div>
            {subscribed && (
              <p className="text-xs text-muted-foreground">
                Your subscription renews automatically
              </p>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Features</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription_tier || 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscribed ? 'Premium features enabled' : 'Limited features'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription details and management options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {subscription_tier || 'Free'} Plan
              </h3>
              <p className="text-sm text-muted-foreground">
                {subscribed 
                  ? `Active until ${formatDate(subscription_end)}`
                  : 'No active subscription'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {subscribed && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Manage Subscription
                </Button>
              )}
            </div>
          </div>

          {!subscribed && (
            <div className="rounded-lg border border-dashed p-4 text-center">
              <h4 className="font-semibold mb-2">Upgrade Your Plan</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get access to premium features and unlock the full potential of IntelliFlow
              </p>
              <Button onClick={() => window.location.href = '/pricing'}>
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent billing transactions and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{subscription_tier} Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Subscription renewal
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${subscription_tier === 'Basic' ? '7.99' : subscription_tier === 'Premium' ? '19.99' : '49.99'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription_end)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                className="w-full"
              >
                View All Invoices
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No billing history available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;