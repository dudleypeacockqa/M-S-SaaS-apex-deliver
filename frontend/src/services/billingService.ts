/**
 * Billing Service - handles all subscription and billing API calls
 * Implements DEV-009: Subscription & Billing Management (Frontend)
 */

import { api } from './api';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'community';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'incomplete';

export interface Subscription {
  id: string;
  organization_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Invoice {
  id: string;
  amount: string;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  due_date: string | null;
  invoice_pdf: string | null;
}

export interface UsageMetrics {
  deals_count: number;
  users_count: number;
  documents_count: number;
  storage_used_mb: number;
}

export interface TierFeatures {
  max_deals: number | null;
  max_users: number | null;
  max_documents_per_deal?: number;
  storage_gb: number | null;
  financial_intelligence?: boolean;
  deal_matching?: boolean;
  ai_features?: boolean;
  api_access: boolean;
  priority_support: boolean;
  custom_branding?: boolean;
}

export interface TierDetails {
  tier: SubscriptionTier;
  name: string;
  price_monthly: number | string;
  price_annual: number | string;
  description?: string;
  features: TierFeatures;
  stripe_price_id_monthly: string;
  stripe_price_id_annual: string;
}

export interface BillingDashboard {
  subscription: Subscription;
  usage: UsageMetrics;
  tier_details: TierDetails;
  recent_invoices: Invoice[];
  upcoming_invoice_amount: string | null;
}

// Alias for consistency with backend API naming
export type BillingDashboardResponse = BillingDashboard;

export interface CheckoutSessionRequest {
  tier: SubscriptionTier;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface ChangeTierRequest {
  new_tier: SubscriptionTier;
  prorate?: boolean;
}

export interface CancelSubscriptionRequest {
  immediately?: boolean;
  reason?: string;
}

// ============================================================================
// Billing Service
// ============================================================================

export const billingService = {
  /**
   * Create a Stripe Checkout Session for subscription purchase
   */
  async createCheckoutSession(data: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    const response = await api.post<CheckoutSessionResponse>('/subscriptions/create-checkout-session', data);
    return response.data;
  },

  /**
   * Get current user's subscription details
   */
  async getMySubscription(): Promise<Subscription> {
    const response = await api.get<Subscription>('/subscriptions/me');
    return response.data;
  },

  /**
   * Get complete billing dashboard data
   */
  async getBillingDashboard(): Promise<BillingDashboard> {
    const response = await api.get<BillingDashboard>('/subscriptions/billing-dashboard');
    return response.data;
  },

  /**
   * Change subscription tier (upgrade or downgrade)
   */
  async changeTier(data: ChangeTierRequest): Promise<Subscription> {
    const response = await api.put<Subscription>('/subscriptions/change-tier', data);
    return response.data;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(data: CancelSubscriptionRequest): Promise<Subscription> {
    const response = await api.post<Subscription>('/subscriptions/cancel', data);
    return response.data;
  },

  /**
   * Get all available subscription tiers
   */
  async getAllTiers(): Promise<TierDetails[]> {
    const response = await api.get<TierDetails[]>('/subscriptions/tiers');
    return response.data;
  },
};
