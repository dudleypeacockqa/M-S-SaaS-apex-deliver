import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  loading: boolean;
  error?: string;
}

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    loading: true,
  });
  const { user } = useAuth();

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionStatus({ subscribed: false, loading: false });
      return;
    }

    try {
      setSubscriptionStatus(prev => ({ ...prev, loading: true, error: undefined }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end,
        loading: false,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus({
        subscribed: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription',
      });
    }
  };

  const createCheckout = async (planType: 'basic' | 'premium' | 'enterprise' = 'premium') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return {
    ...subscriptionStatus,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};