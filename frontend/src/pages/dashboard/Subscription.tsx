import { useEffect, useMemo, useState } from 'react'

import {
  billingService,
  type BillingDashboard,
  type Subscription,
  type SubscriptionTier,
} from '../../services/billingService'

interface LoadingState {
  dashboard: boolean
  changeTier: boolean
  cancel: boolean
  portal: boolean
}

interface ErrorState {
  dashboard: string | null
  action: string | null
}

const tierLabels: Record<SubscriptionTier, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
  community: 'Community Leader',
}

const statusColors: Record<Subscription['status'], string> = {
  trialing: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  past_due: 'bg-yellow-100 text-yellow-800',
  canceled: 'bg-gray-100 text-gray-800',
  unpaid: 'bg-red-100 text-red-800',
}

const formatCurrency = (value: number, currency = 'GBP'): string =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)

const formatDate = (value?: string | null): string => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

const calculateUsagePercentage = (current: number, max?: number | null): number => {
  if (!max || max <= 0) return 0
  return Math.min(100, Math.round((current / max) * 100))
}

const renderStatusBadge = (status: Subscription['status']) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[status]}`}
  >
    {status === 'past_due' && '⚠️'}
    {status === 'trialing' && '⏳'}
    {status === 'active' && '✔️'}
    {status === 'canceled' && '⚪'}
    {status === 'unpaid' && '❗'}
    <span className="ml-1 capitalize">{status.replace('_', ' ')}</span>
  </span>
)

export const DashboardSubscription: React.FC = () => {
  const [dashboard, setDashboard] = useState<BillingDashboard | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    dashboard: true,
    changeTier: false,
    cancel: false,
    portal: false,
  })
  const [error, setError] = useState<ErrorState>({ dashboard: null, action: null })
  const [isChangeTierOpen, setChangeTierOpen] = useState(false)
  const [isCancelOpen, setCancelOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [cancelImmediately, setCancelImmediately] = useState(false)
  const [cancellationConfirmed, setCancellationConfirmed] = useState(false)

  const subscription = dashboard?.subscription
  const tierDetails = dashboard?.tier_details

  const availableTiers = useMemo(() => {
    if (!tierDetails) return []
    return Object.entries(tierLabels).map(([tier, label]) => ({
      tier: tier as SubscriptionTier,
      label,
      priceMonthly: tierDetails.tier === tier ? tierDetails.price_monthly : null,
    }))
  }, [tierDetails])

  const loadDashboard = async () => {
    setLoading((prev) => ({ ...prev, dashboard: true }))
    setError((prev) => ({ ...prev, dashboard: null }))

    try {
      const result = await billingService.getBillingDashboard()
      setDashboard(result)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        dashboard: err instanceof Error ? err.message : 'Failed to load billing data',
      }))
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }))
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleChangeTier = async () => {
    if (!selectedTier || !subscription) return
    if (selectedTier === subscription.tier) {
      setError((prev) => ({ ...prev, action: 'You are already on this tier.' }))
      return
    }

    setLoading((prev) => ({ ...prev, changeTier: true }))
    setError((prev) => ({ ...prev, action: null }))

    try {
      await billingService.changeTier(selectedTier, true)
      setChangeTierOpen(false)
      await loadDashboard()
    } catch (err) {
      setError((prev) => ({
        ...prev,
        action: err instanceof Error ? err.message : 'Failed to change tier',
      }))
    } finally {
      setLoading((prev) => ({ ...prev, changeTier: false }))
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription || !cancellationConfirmed) {
      setError((prev) => ({ ...prev, action: 'Please confirm cancellation before proceeding.' }))
      return
    }

    setLoading((prev) => ({ ...prev, cancel: true }))
    setError((prev) => ({ ...prev, action: null }))

    try {
      await billingService.cancelSubscription(cancelImmediately)
      setCancelOpen(false)
      setCancellationConfirmed(false)
      await loadDashboard()
    } catch (err) {
      setError((prev) => ({
        ...prev,
        action: err instanceof Error ? err.message : 'Failed to cancel subscription',
      }))
    } finally {
      setLoading((prev) => ({ ...prev, cancel: false }))
    }
  }

  const handleOpenPortal = async () => {
    setLoading((prev) => ({ ...prev, portal: true }))
    setError((prev) => ({ ...prev, action: null }))

    try {
      const { url } = await billingService.getCustomerPortalUrl()
      window.location.assign(url)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        action: err instanceof Error ? err.message : 'Failed to open billing portal',
      }))
    } finally {
      setLoading((prev) => ({ ...prev, portal: false }))
    }
  }

  if (loading.dashboard) {
    return (
      <section className="space-y-6" data-testid="dashboard-subscription">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
          <p className="text-slate-500 mt-2">Loading your subscription details…</p>
        </header>
        <article className="bg-white shadow rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </article>
      </section>
    )
  }

  if (error.dashboard) {
    return (
      <section className="space-y-6" data-testid="dashboard-subscription">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
          <p className="text-slate-500 mt-2">Manage your plan and billing preferences.</p>
        </header>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Unable to load billing data</h2>
          <p className="mt-2">{error.dashboard}</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={loadDashboard}
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (!dashboard || !subscription || !tierDetails) {
    return (
      <section className="space-y-6" data-testid="dashboard-subscription">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
          <p className="text-slate-500 mt-2">No subscription information is available.</p>
        </header>
        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
          <p>It looks like you don’t have an active subscription yet.</p>
          <p className="mt-2">
            Visit the{' '}
            <a href="/pricing" className="text-indigo-600 font-medium">
              pricing page
            </a>{' '}
            to get started.
          </p>
        </div>
      </section>
    )
  }

  const dealsUsage = calculateUsagePercentage(
    dashboard.usage.deals_count,
    tierDetails.features.max_deals ?? undefined,
  )
  const usersUsage = calculateUsagePercentage(
    dashboard.usage.users_count,
    tierDetails.features.max_users ?? undefined,
  )

  return (
    <section className="space-y-8" data-testid="dashboard-subscription">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
        <p className="text-slate-500">
          Review your current plan, usage, and billing history. Manage upgrades, cancellations, and payment methods from here.
        </p>
        {error.action && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mt-2">
            {error.action}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Current Plan
            </span>
            {renderStatusBadge(subscription.status)}
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 flex items-baseline gap-2">
            {tierLabels[subscription.tier]}
            <span className="text-base font-medium text-slate-500">
              ({subscription.billing_period === 'monthly' ? 'Monthly' : 'Annual'})
            </span>
          </h2>
          <div className="mt-4">
            <p className="text-4xl font-extrabold text-slate-900">
              {formatCurrency(tierDetails.price_monthly)}
              <span className="text-lg font-medium text-slate-500 ml-2">/ month</span>
            </p>
            <p className="mt-2 text-slate-500">
              {subscription.status === 'trialing'
                ? `Trial ends on ${formatDate(subscription.trial_end)}`
                : `Renews on ${formatDate(subscription.current_period_end)}`}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => {
                setSelectedTier(subscription.tier)
                setChangeTierOpen(true)
              }}
            >
              Change Tier
            </button>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setCancelImmediately(false)
                setCancellationConfirmed(false)
                setCancelOpen(true)
              }}
            >
              Cancel Subscription
            </button>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={handleOpenPortal}
              disabled={loading.portal}
            >
              {loading.portal ? 'Opening…' : 'Update Payment Method'}
            </button>
          </div>
        </article>

        <article className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Usage Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Active Deals</span>
                <span>
                  {dashboard.usage.deals_count}
                  {tierDetails.features.max_deals ? ` / ${tierDetails.features.max_deals}` : ''}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full">
                <div
                  className="h-2 rounded-full bg-indigo-600"
                  style={{ width: `${dealsUsage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Team Members</span>
                <span>
                  {dashboard.usage.users_count}
                  {tierDetails.features.max_users ? ` / ${tierDetails.features.max_users}` : ''}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full">
                <div
                  className="h-2 rounded-full bg-indigo-600"
                  style={{ width: `${usersUsage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Total Documents</span>
                <span>{dashboard.usage.documents_count}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Storage Used</span>
                <span>{Math.round(dashboard.usage.storage_used_mb / 1024)} GB</span>
              </div>
            </div>
          </div>
        </article>

        <article className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">What's Included</h3>
          <ul className="space-y-2 text-slate-600">
            <li>• Feature access: {tierDetails.features.ai_features ? 'AI Intelligence Engine' : 'Core Analytics'}</li>
            <li>• API Access: {tierDetails.features.api_access ? 'Included' : 'Not included'}</li>
            <li>• Priority Support: {tierDetails.features.priority_support ? 'Priority response' : 'Standard support'}</li>
            <li>• Storage: {tierDetails.features.storage_gb ? `${tierDetails.features.storage_gb} GB` : 'Unlimited'}</li>
          </ul>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-700">
            Need a custom plan?{' '}
            <a href="/contact" className="font-semibold">
              Contact our sales team
            </a>{' '}
            for enterprise packages or annual billing discounts.
          </div>
        </article>
      </div>

      <section className="bg-white shadow-sm border border-slate-200 rounded-xl">
        <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
            <p className="text-sm text-slate-500">Last 3 invoices from your billing history.</p>
          </div>
          {dashboard.upcoming_invoice_amount !== null && (
            <span className="text-sm font-medium text-indigo-600">
              Upcoming charge: {formatCurrency(dashboard.upcoming_invoice_amount)}
            </span>
          )}
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {dashboard.recent_invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                    No invoices yet. Your first invoice will appear after your trial ends.
                  </td>
                </tr>
              )}
              {dashboard.recent_invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-700">{formatDate(invoice.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatCurrency(
                      typeof invoice.amount === 'number' ? invoice.amount : Number(invoice.amount),
                      invoice.currency,
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 capitalize">{invoice.status}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600">
                    {invoice.invoice_pdf ? (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span className="text-slate-400">Processing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isChangeTierOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Change Subscription Tier</h3>
              <button onClick={() => setChangeTierOpen(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </header>
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-slate-600">
                Select the tier you would like to switch to. Upgrades take effect immediately. Downgrades will apply at the start of your next billing cycle.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {availableTiers.map((tier) => (
                  <label
                    key={tier.tier}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                      selectedTier === tier.tier ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-base font-semibold text-slate-900">{tier.label}</span>
                      {tier.priceMonthly !== null && (
                        <p className="text-sm text-slate-500">{formatCurrency(tier.priceMonthly)} / month</p>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="tier"
                      value={tier.tier}
                      checked={selectedTier === tier.tier}
                      onChange={() => setSelectedTier(tier.tier)}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                  </label>
                ))}
              </div>
            </div>
            <footer className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setChangeTierOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleChangeTier}
                disabled={loading.changeTier}
              >
                {loading.changeTier ? 'Updating…' : 'Confirm Change'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {isCancelOpen && subscription && (
        <div
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Cancel Subscription</h3>
              <button onClick={() => setCancelOpen(false)} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </header>
            <div className="px-6 py-4 space-y-4">
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                <strong>Warning:</strong> Cancelling your subscription will revoke access to premium features at the end of your billing period.
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="cancellation-option"
                    className="form-radio"
                    checked={!cancelImmediately}
                    onChange={() => setCancelImmediately(false)}
                  />
                  Cancel at the end of billing period ({formatDate(subscription.current_period_end) || 'unknown date'})
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="cancellation-option"
                    className="form-radio"
                    checked={cancelImmediately}
                    onChange={() => setCancelImmediately(true)}
                  />
                  Cancel immediately (you will lose access today)
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600"
                  checked={cancellationConfirmed}
                  onChange={(event) => setCancellationConfirmed(event.target.checked)}
                />
                I understand that I will lose access to premium features when the cancellation takes effect.
              </label>
            </div>
            <footer className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setCancelOpen(false)}
              >
                Keep Subscription
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleCancelSubscription}
                disabled={loading.cancel}
              >
                {loading.cancel ? 'Cancelling…' : 'Confirm Cancellation'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  )
}

