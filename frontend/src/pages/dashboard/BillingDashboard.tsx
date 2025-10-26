import { useEffect, useState } from 'react'
import {
  billingService,
  type BillingDashboard as BillingDashboardResponse,
} from '../../services/billingService'
import { ChangeTierModal } from '../../components/billing/ChangeTierModal'
import { CancelSubscriptionModal } from '../../components/billing/CancelSubscriptionModal'

const formatCurrency = (value: number | string, currency = 'GBP'): string => {
  const numeric = typeof value === 'number' ? value : parseFloat(value)
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numeric)
}

const formatDate = (value?: string | null): string => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

const percent = (current: number, max?: number | null): number => {
  if (!max || max <= 0) return 0
  return Math.min(100, Math.round((current / max) * 100))
}

export const BillingDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<BillingDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPortalLoading, setIsPortalLoading] = useState(false)
  const [isChangeTierOpen, setChangeTierOpen] = useState(false)
  const [isCancelOpen, setCancelOpen] = useState(false)

  const subscription = dashboard?.subscription
  const tierDetails = dashboard?.tier_details
  const usage = dashboard?.usage

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const result = await billingService.getBillingDashboard()
      setDashboard(result)
    } catch (err) {
      setDashboard(null)
      setActionError(err instanceof Error ? err.message : 'Failed to load billing data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const handleOpenPortal = async () => {
    try {
      setIsPortalLoading(true)
      setActionError(null)
      const { url } = await billingService.getCustomerPortalUrl()
      window.location.assign(url)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to open billing portal')
    } finally {
      setIsPortalLoading(false)
    }
  }

  if (loading && dashboard === null) {
    return (
      <section className="space-y-4" data-testid="billing-dashboard-loading">
        <div className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="mt-4 h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </section>
    )
  }

  if (!dashboard) {
    return (
      <section className="space-y-4" data-testid="billing-dashboard-error">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to load billing data</h2>
          <p className="text-red-700">{actionError ?? 'Please try again later.'}</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              setActionError(null)
              void loadDashboard()
            }}
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  // Null safety guard - ensure all required data is present
  if (!subscription || !tierDetails || !usage) {
    return (
      <section className="space-y-4" data-testid="billing-dashboard-incomplete">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Billing data incomplete</h2>
          <p className="text-yellow-700">Some billing information is missing. Please try refreshing the page.</p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
            onClick={() => {
              setActionError(null)
              void loadDashboard()
            }}
          >
            Refresh
          </button>
        </div>
      </section>
    )
  }

  const subscriptionStatus = subscription.status
  const monthlyPrice = formatCurrency(tierDetails.price_monthly)
  const nextBillingDate = subscription.cancel_at_period_end
    ? formatDate(subscription.current_period_end)
    : formatDate(subscription.current_period_end)

  return (
    <section className="space-y-8" data-testid="dashboard-subscription">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Subscription & Billing</h1>
        <p className="text-slate-500">
          Review your current plan, usage, and invoices. Upgrade, cancel, or manage payment methods from this dashboard.
        </p>
        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mt-2" role="alert">
            {actionError}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Current Plan</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {tierDetails.name}
              </h2>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {subscriptionStatus}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-500">Monthly price</p>
            <p className="text-3xl font-extrabold text-slate-900">{monthlyPrice}</p>
            <p className="text-sm text-slate-500 mt-2">Renews on {nextBillingDate}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              onClick={() => setChangeTierOpen(true)}
            >
              Change Tier
            </button>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => setCancelOpen(true)}
            >
              Cancel Subscription
            </button>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              onClick={() => void handleOpenPortal()}
              disabled={isPortalLoading}
            >
              {isPortalLoading ? 'Opening…' : 'Update Payment Method'}
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
                  {usage.deals_count}
                  {tierDetails.features.max_deals ? ` / ${tierDetails.features.max_deals}` : ''}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${percent(usage.deals_count, tierDetails.features.max_deals)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Team Members</span>
                <span>
                  {usage.users_count}
                  {tierDetails.features.max_users ? ` / ${tierDetails.features.max_users}` : ''}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded-full">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${percent(usage.users_count, tierDetails.features.max_users)}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Total Documents</span>
              <span>{usage.documents_count}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Storage Used</span>
              <span>
                {Math.round(usage.storage_used_mb / 1024)} GB
                {tierDetails.features.storage_gb ? ` / ${tierDetails.features.storage_gb} GB` : ''}
              </span>
            </div>
          </div>
        </article>

        <article className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Key Features</h3>
          <ul className="space-y-2 text-slate-600">
            {tierDetails.features.ai_features && <li>• AI insights & automation</li>}
            {tierDetails.features.api_access && <li>• API access for integrations</li>}
            {tierDetails.features.priority_support && <li>• Priority support (2h SLA)</li>}
            {tierDetails.features.max_deals === null && <li>• Unlimited deal pipelines</li>}
            {tierDetails.features.max_users === null && <li>• Unlimited team members</li>}
            {tierDetails.features.storage_gb === null && <li>• Unlimited document storage</li>}
            {!tierDetails.features.ai_features && !tierDetails.features.api_access && !tierDetails.features.priority_support && (
              <li>• Core deal pipeline & document room features</li>
            )}
          </ul>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-700">
            Need custom terms or annual billing? <a href="/contact" className="font-semibold">Contact sales</a> for enterprise packages.
          </div>
        </article>
      </div>

      <section className="bg-white shadow-sm border border-slate-200 rounded-xl">
        <header className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
            <p className="text-sm text-slate-500">Last 3 invoices in your billing history.</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice</th>
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
                  <td className="px-6 py-4 text-sm text-slate-700">{formatCurrency(invoice.amount, invoice.currency)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {invoice.invoice_pdf ? (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
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

      <ChangeTierModal
        isOpen={isChangeTierOpen}
        onClose={() => setChangeTierOpen(false)}
        currentTier={subscription.tier}
        onSuccess={() => void loadDashboard()}
      />

      <CancelSubscriptionModal
        isOpen={isCancelOpen}
        onClose={() => setCancelOpen(false)}
        subscription={subscription}
        onSuccess={() => void loadDashboard()}
      />
    </section>
  )
}
