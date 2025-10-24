import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { getDashboardMetrics, DashboardMetrics } from '../../services/api/admin';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <section data-testid="admin-dashboard" style={{ padding: '2rem' }}>
        <p>Loading dashboard metrics...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid="admin-dashboard" style={{ padding: '2rem' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', color: '#991b1b' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Error Loading Dashboard</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="admin-dashboard" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Admin Dashboard</h1>
          <p style={{ color: '#f97316', fontWeight: 600, marginTop: '0.5rem' }}>
            Real-time platform metrics and KPIs
          </p>
        </div>
        <UserButton />
      </header>

      {/* User Metrics */}
      <div
        style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Users
          </h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
            {metrics?.users.total || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            {metrics?.users.active_last_30_days || 0} active in last 30 days
          </p>
        </article>

        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New Users This Month
          </h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
            {metrics?.users.new_this_month || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            User growth tracking
          </p>
        </article>

        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Organizations
          </h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
            {metrics?.organizations.total || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '0.5rem' }}>
            {metrics?.organizations.new_this_month || 0} new this month
          </p>
        </article>
      </div>

      {/* Revenue Metrics */}
      <div
        style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <article
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
            color: 'white',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            Monthly Recurring Revenue
          </h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {formatCurrency(metrics?.revenue.mrr || 0)}
          </p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
            MRR from subscription tiers
          </p>
        </article>

        <article
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(240, 147, 251, 0.3)',
            color: 'white',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
            ARR Projection
          </h2>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>
            {formatCurrency(metrics?.revenue.arr_projection || 0)}
          </p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.9 }}>
            Annual recurring revenue
          </p>
        </article>

        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Platform Activity
          </h2>
          <ul style={{ marginTop: '1rem', color: '#475569', lineHeight: 1.8 }}>
            <li>Deals created: {metrics?.activity.deals_created_this_month || 0}</li>
            <li>Documents uploaded: {metrics?.activity.documents_uploaded_this_month || 0}</li>
          </ul>
        </article>
      </div>

      {/* Quick Actions */}
      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="/admin/users"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f97316',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#ea580c'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f97316'}
          >
            Manage Users
          </a>
          <a
            href="/admin/organizations"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0f172a',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
          >
            View Organizations
          </a>
          <a
            href="/admin/system"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#64748b',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#475569'}
            onMouseOut={(e) => e.currentTarget.style.background = '#64748b'}
          >
            System Health
          </a>
        </div>
      </article>
    </section>
  );
};
