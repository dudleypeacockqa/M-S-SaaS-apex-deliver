import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listDeals,
  Deal,
  DealStage,
  formatCurrency,
  getStageDisplayName,
  getStageColor,
} from '../../services/api/deals';

export const DealPipeline: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<DealStage | null>(null);

  const stages: DealStage[] = [
    'sourcing',
    'evaluation',
    'due_diligence',
    'negotiation',
    'closing',
  ];

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await listDeals({
        per_page: 100,
        include_archived: false,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      setDeals(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const getDealsByStage = (stage: DealStage): Deal[] => {
    return deals.filter((deal) => deal.stage === stage && !deal.archived_at);
  };

  const getStageTotalValue = (stage: DealStage): number => {
    return getDealsByStage(stage).reduce(
      (sum, deal) => sum + (deal.deal_size || 0),
      0
    );
  };

  if (loading) {
    return (
      <section data-testid="deal-pipeline" style={{ padding: '2rem' }}>
        <p>Loading pipeline...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section data-testid="deal-pipeline" style={{ padding: '2rem' }}>
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#991b1b',
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            Error Loading Pipeline
          </h3>
          <p>{error}</p>
          <button
            onClick={fetchDeals}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: '#dc2626',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid="deal-pipeline"
      style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Deal Pipeline</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {deals.length} active deals across all stages
          </p>
        </div>
        <button
          onClick={() => navigate('/deals/new')}
          style={{
            background: '#f97316',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#ea580c')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#f97316')}
        >
          + New Deal
        </button>
      </header>

      {/* Kanban Board */}
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          overflowX: 'auto',
        }}
      >
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const totalValue = getStageTotalValue(stage);

          return (
            <article
              key={stage}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: `2px solid ${
                  selectedStage === stage ? getStageColor(stage) : '#e5e7eb'
                }`,
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() =>
                setSelectedStage(selectedStage === stage ? null : stage)
              }
            >
              {/* Stage Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `2px solid ${getStageColor(stage)}`,
                }}
              >
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {getStageDisplayName(stage)}
                </h2>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: getStageColor(stage),
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {stageDeals.length}
                </span>
              </div>

              {/* Stage Value */}
              <div
                style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}
                >
                  Total Value
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                  {formatCurrency(totalValue)}
                </p>
              </div>

              {/* Deals in Stage */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {stageDeals.length === 0 ? (
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      marginTop: '2rem',
                    }}
                  >
                    No deals in this stage
                  </p>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/deals/${deal.id}`);
                      }}
                      style={{
                        padding: '0.75rem',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow =
                          '0 4px 8px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          marginBottom: '0.25rem',
                          color: '#0f172a',
                        }}
                      >
                        {deal.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {deal.target_company}
                      </p>
                      {deal.deal_size && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              color: '#16a34a',
                            }}
                          >
                            {formatCurrency(deal.deal_size, deal.currency)}
                          </span>
                          {deal.industry && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.125rem 0.5rem',
                                background: '#f1f5f9',
                                borderRadius: '4px',
                                color: '#64748b',
                              }}
                            >
                              {deal.industry}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Pipeline Summary */}
      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
          Pipeline Summary
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Total Deals
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{deals.length}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Total Pipeline Value
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>
              {formatCurrency(
                deals.reduce((sum, deal) => sum + (deal.deal_size || 0), 0)
              )}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Active Stages
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {stages.filter((stage) => getDealsByStage(stage).length > 0).length}/
              {stages.length}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};
