import { useEffect, useState } from 'react';
import { getSystemHealth, SystemHealth as SystemHealthType } from '../../services/api/admin';

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const data = await getSystemHealth();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'healthy' || status === 'ok') return '#16a34a';
    if (status === 'degraded') return '#f59e0b';
    if (status === 'error' || status === 'unhealthy') return '#dc2626';
    return '#64748b';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'healthy' || status === 'ok') return '✓';
    if (status === 'degraded') return '⚠';
    if (status === 'error' || status === 'unhealthy') return '✗';
    return '?';
  };

  if (loading && !health) {
    return (
      <section data-testid="admin-system-health" style={{ padding: '2rem' }}>
        <p>Loading system health...</p>
      </section>
    );
  }

  if (error && !health) {
    return (
      <section data-testid="admin-system-health" style={{ padding: '2rem' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', color: '#991b1b' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Error Loading System Health</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="admin-system-health" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>System Health Monitor</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Real-time platform infrastructure status
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            background: loading ? '#94a3b8' : '#f97316',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      {health && (
        <>
          {/* Service Status Cards */}
          <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Database Health */}
            <article
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                border: `2px solid ${getStatusColor(health.database.status)}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Database</h2>
                <span
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getStatusColor(health.database.status),
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {getStatusIcon(health.database.status)}
                </span>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Status:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getStatusColor(health.database.status), textTransform: 'capitalize' }}>
                    {health.database.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Connections:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {health.database.connections}
                  </span>
                </div>
              </div>
            </article>

            {/* Clerk Authentication Health */}
            <article
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                border: `2px solid ${getStatusColor(health.clerk.status)}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Authentication (Clerk)</h2>
                <span
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getStatusColor(health.clerk.status),
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {getStatusIcon(health.clerk.status)}
                </span>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Status:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getStatusColor(health.clerk.status), textTransform: 'capitalize' }}>
                    {health.clerk.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Configured:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: health.clerk.configured ? '#16a34a' : '#dc2626' }}>
                    {health.clerk.configured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </article>

            {/* API Metrics */}
            <article
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
                border: `2px solid ${getStatusColor(health.api_metrics.status)}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>API Performance</h2>
                <span
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getStatusColor(health.api_metrics.status),
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {getStatusIcon(health.api_metrics.status)}
                </span>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Avg Response:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {health.api_metrics.avg_response_time_ms}ms
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Requests (1h):</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {health.api_metrics.requests_last_hour}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Error Rate:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {typeof health.api_metrics.error_rate === 'number'
                      ? (health.api_metrics.error_rate * 100).toFixed(2)
                      : health.api_metrics.error_rate}%
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* Environment Information */}
          <article
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
              Environment Configuration
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Environment
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {health.environment}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Debug Mode
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: health.debug_mode ? '#f59e0b' : '#16a34a' }}>
                  {health.debug_mode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </article>

          {/* Auto-refresh Notice */}
          <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
            Status automatically refreshes every 30 seconds
          </p>
        </>
      )}
    </section>
  );
};
