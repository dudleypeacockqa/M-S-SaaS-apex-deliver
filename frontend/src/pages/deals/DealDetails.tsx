import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDeal,
  updateDeal,
  archiveDeal,
  Deal,
  DealStage,
  formatCurrency,
  getStageDisplayName,
  getStageColor,
} from '../../services/api/deals';

export const DealDetails: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Deal>>({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const stages: { value: DealStage; label: string }[] = [
    { value: 'sourcing', label: 'Sourcing' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closing', label: 'Closing' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  const currencies = ['GBP', 'USD', 'EUR'];

  const fetchDeal = async () => {
    if (!dealId) {
      setError('Deal ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getDeal(dealId);
      setDeal(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  const handleEditClick = () => {
    if (deal) {
      setEditFormData({
        name: deal.name,
        target_company: deal.target_company,
        industry: deal.industry || '',
        deal_size: deal.deal_size || undefined,
        currency: deal.currency,
        stage: deal.stage,
        description: deal.description || '',
      });
      setIsEditing(true);
      setUpdateError(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setUpdateError(null);
  };

  const handleSaveEdit = async () => {
    if (!dealId || !deal) return;

    try {
      setUpdating(true);
      setUpdateError(null);

      const updates = {
        ...(editFormData.name && { name: editFormData.name }),
        ...(editFormData.target_company && { target_company: editFormData.target_company }),
        ...(editFormData.industry !== undefined && { industry: editFormData.industry || undefined }),
        ...(editFormData.deal_size !== undefined && { deal_size: editFormData.deal_size || undefined }),
        ...(editFormData.currency && { currency: editFormData.currency }),
        ...(editFormData.stage && { stage: editFormData.stage }),
        ...(editFormData.description !== undefined && { description: editFormData.description || undefined }),
      };

      const updatedDeal = await updateDeal(dealId, updates);
      setDeal(updatedDeal);
      setIsEditing(false);
      setEditFormData({});
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update deal');
    } finally {
      setUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!dealId || !deal) return;

    const confirmed = window.confirm(
      `Are you sure you want to archive "${deal.name}"? This will remove it from active pipeline views.`
    );

    if (!confirmed) return;

    try {
      await archiveDeal(dealId);
      navigate('/deals');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to archive deal');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <section data-testid="deal-details" style={{ padding: '2rem' }}>
        <p>Loading deal details...</p>
      </section>
    );
  }

  if (error || !deal) {
    return (
      <section data-testid="deal-details" style={{ padding: '2rem' }}>
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#991b1b',
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Error Loading Deal</h3>
          <p>{error || 'Deal not found'}</p>
          <button
            onClick={() => navigate('/deals')}
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
            Back to Pipeline
          </button>
        </div>
      </section>
    );
  }

  return (
    <section data-testid="deal-details" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{deal.name}</h1>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: getStageColor(deal.stage),
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {getStageDisplayName(deal.stage)}
            </span>
          </div>
          <p style={{ color: '#64748b' }}>{deal.target_company}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/deals')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to Pipeline
          </button>
          {!isEditing && !deal.archived_at && (
            <>
              <button
                onClick={handleEditClick}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#f97316',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Edit Deal
              </button>
              <button
                onClick={handleArchive}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #dc2626',
                  background: 'white',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Archive
              </button>
            </>
          )}
        </div>
      </header>

      {updateError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#991b1b',
          }}
        >
          <p style={{ fontWeight: 600 }}>Error updating deal: {updateError}</p>
        </div>
      )}

      {/* Deal Information */}
      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Deal Information
        </h2>

        {isEditing ? (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Edit Form */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Deal Name
              </label>
              <input
                type="text"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Target Company
              </label>
              <input
                type="text"
                value={editFormData.target_company || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, target_company: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Industry
              </label>
              <input
                type="text"
                value={editFormData.industry || ''}
                onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#0f172a',
                  }}
                >
                  Deal Size
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={editFormData.deal_size || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      deal_size: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#0f172a',
                  }}
                >
                  Currency
                </label>
                <select
                  value={editFormData.currency || 'GBP'}
                  onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'white',
                  }}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Stage
              </label>
              <select
                value={editFormData.stage || 'sourcing'}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, stage: e.target.value as DealStage })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: 'white',
                }}
              >
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Description
              </label>
              <textarea
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Edit Actions */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updating}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: updating ? 'not-allowed' : 'pointer',
                  opacity: updating ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={updating}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: updating ? '#94a3b8' : '#f97316',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: updating ? 'not-allowed' : 'pointer',
                }}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* View Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Deal Name
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{deal.name}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Target Company
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{deal.target_company}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Industry
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{deal.industry || 'N/A'}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Deal Size
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#16a34a' }}>
                  {formatCurrency(deal.deal_size, deal.currency)}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Stage
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{getStageDisplayName(deal.stage)}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Created
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{formatDate(deal.created_at)}</p>
              </div>

              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                  Last Updated
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{formatDate(deal.updated_at)}</p>
              </div>
            </div>

            {deal.description && (
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
                  Description
                </p>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                  {deal.description}
                </p>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Technical Details */}
      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Technical Details</h3>
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Deal ID:</span>
            <span style={{ color: '#0f172a' }}>{deal.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Organization ID:</span>
            <span style={{ color: '#0f172a' }}>{deal.organization_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Owner ID:</span>
            <span style={{ color: '#0f172a' }}>{deal.owner_id}</span>
          </div>
          {deal.archived_at && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#dc2626' }}>Archived:</span>
              <span style={{ color: '#dc2626' }}>{formatDate(deal.archived_at)}</span>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};
