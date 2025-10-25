const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getAuthToken(): string | null {
  return localStorage.getItem('clerk_token');
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'community';

export interface Subscription {
  id: string;
  organization_id?: string;
  tier: SubscriptionTier;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TierDetails {
  tier: SubscriptionTier;
  name: string;
  price_monthly: number;
  price_annual: number;
  features: {
    max_deals: number | null;
    max_users: number | null;
    storage_gb: number | null;
    ai_features: boolean;
    api_access: boolean;
    priority_support: boolean;
  };
  stripe_price_id_monthly: string;
  stripe_price_id_annual: string;
}

export interface Invoice {
  id: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  invoice_pdf: string | null;
}

export interface UsageMetrics {
  deals_count: number;
  users_count: number;
  documents_count: number;
  storage_used_mb: number;
}

export interface BillingDashboard {
  subscription: Subscription;
  usage: UsageMetrics;
  tier_details: TierDetails;
  recent_invoices: Invoice[];
  upcoming_invoice_amount: string | null;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface CustomerPortalResponse {
  url: string;
}

export const billingService = {
  async createCheckoutSession(tier: SubscriptionTier): Promise<CheckoutSessionResponse> {
    const successUrl = `${window.location.origin}/billing/checkout-success`;
    const cancelUrl = `${window.location.origin}/billing/checkout-cancel`;
    return await fetchAPI<CheckoutSessionResponse>('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ tier, success_url: successUrl, cancel_url: cancelUrl }),
    });
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      return await fetchAPI<Subscription>('/billing/me', { method: 'GET' });
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },

  async getBillingDashboard(): Promise<BillingDashboard> {
    return await fetchAPI<BillingDashboard>('/billing/billing-dashboard', { method: 'GET' });
  },

  async changeTier(newTier: SubscriptionTier, prorate: boolean): Promise<Subscription> {
    return await fetchAPI<Subscription>('/billing/change-tier', {
      method: 'PUT',
      body: JSON.stringify({ new_tier: newTier, prorate }),
    });
  },

  async cancelSubscription(immediately: boolean = false): Promise<Subscription> {
    return await fetchAPI<Subscription>('/billing/cancel', {
      method: 'POST',
      body: JSON.stringify({ immediately }),
    });
  },

  async getTiers(): Promise<TierDetails[]> {
    return await fetchAPI<TierDetails[]>('/billing/tiers', { method: 'GET' });
  },

  async getCustomerPortalUrl(): Promise<CustomerPortalResponse> {
    return await fetchAPI<CustomerPortalResponse>('/billing/customer-portal', { method: 'POST' });
  },

  async redirectToCheckout(tier: SubscriptionTier): Promise<void> {
    const session = await this.createCheckoutSession(tier);
    window.location.assign(session.checkout_url);
  },
};
