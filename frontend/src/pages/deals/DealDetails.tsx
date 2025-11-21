import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  archiveDeal,
  Deal,
  DealStage,
  formatCurrency,
  getStageDisplayName,
  getStageColor,
} from '../../services/api/deals';
import { useDeal, useUpdateDeal } from '../../hooks/deals';
import { useQuery } from '@tanstack/react-query';
import { pmiApi } from '../../modules/pmi/services/pmiApi';

type TabType = 'overview' | 'financials' | 'documents' | 'team';

export const DealDetails: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();

  // React Query hooks
  const { data: deal, isLoading: loading, error: queryError } = useDeal(dealId || '');
  const { mutate: updateDealMutation, isPending: updating, error: updateQueryError } = useUpdateDeal();
  
  // Check if PMI project exists for this deal
  const { data: pmiProjects } = useQuery({
    queryKey: ['pmi', 'projects', { deal_id: dealId }],
    queryFn: () => pmiApi.listProjects({ deal_id: dealId || '', per_page: 1 }),
    enabled: !!dealId && (deal?.stage === 'won' || deal?.stage === 'closing'),
  });
  
  const hasPMIProject = pmiProjects && pmiProjects.items.length > 0;
  const pmiProjectId = pmiProjects?.items[0]?.id;

  // Local UI state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Deal>>({});
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Convert query error to string
  const error = queryError ? queryError.message : null;
  const updateError = updateQueryError ? updateQueryError.message : null;

  const stages: { value: DealStage; label: string }[] = [
    { value: 'sourcing', label: 'Sourcing' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closing', label: 'Closing' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
  ];

  const stageConfidence: Record<DealStage, number> = {
    sourcing: 35,
    evaluation: 45,
    due_diligence: 58,
    negotiation: 72,
    closing: 88,
    won: 100,
    lost: 0,
  };

  const currencies = ['GBP', 'USD', 'EUR'];

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
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    if (!dealId || !deal) return;

    const updates = {
      ...(editFormData.name && { name: editFormData.name }),
      ...(editFormData.target_company && { target_company: editFormData.target_company }),
      ...(editFormData.industry !== undefined && { industry: editFormData.industry || undefined }),
      ...(editFormData.deal_size !== undefined && { deal_size: editFormData.deal_size || undefined }),
      ...(editFormData.currency && { currency: editFormData.currency }),
      ...(editFormData.stage && { stage: editFormData.stage }),
      ...(editFormData.description !== undefined && { description: editFormData.description || undefined }),
    };

    updateDealMutation(
      { dealId, updates },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditFormData({});
        },
      }
    );
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

  const stageProbability = stageConfidence[deal.stage] ?? 0;
  const dealSizeLabel = deal.deal_size ? formatCurrency(deal.deal_size, deal.currency) : 'Not set';
  const createdTimestamp = new Date(deal.created_at).getTime();
  const updatedTimestamp = new Date(deal.updated_at).getTime();
  const pipelineDays = Math.max(1, Math.round((updatedTimestamp - createdTimestamp) / (1000 * 60 * 60 * 24)));

  const financialHighlights = [
    {
      label: 'Deal Size',
      value: dealSizeLabel,
      meta: deal.deal_size ? deal.currency : 'Enter valuation to firm up',
    },
    {
      label: 'Stage Confidence',
      value: `${stageProbability}%`,
      meta: `Based on ${getStageDisplayName(deal.stage)} probability curve`,
    },
    {
      label: 'Pipeline Velocity',
      value: `${pipelineDays} days`,
      meta: 'Time since creation',
    },
    {
      label: 'Working Capital Focus',
      value: deal.stage === 'closing' ? 'Finalize financing' : 'Monitor burn',
      meta: 'Recommendation from FP&A',
    },
  ];

  const documentShortcuts = [
    { label: 'Open Document Workspace', action: () => navigate(`/deals/${deal.id}/documents`) },
    { label: 'Launch Data Room', action: () => navigate(`/deals/${deal.id}/data-room`) },
    { label: 'Export Package', action: () => navigate(`/deals/${deal.id}/documents`) },
  ];

  const teamAssignments = [
    { role: 'Deal Owner', person: deal.owner_id || 'Unassigned', description: 'Primary accountability' },
    { role: 'Integration Lead', person: hasPMIProject ? 'Assigned via PMI' : 'Pending assignment', description: 'Coordinates PMI workstreams' },
    { role: 'Finance Lead', person: 'FP&A Workspace', description: 'Runs modeling + diligence' },
  ];

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
                onClick={() => navigate(`/deals/${deal.id}/data-room`)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #3b82f6',
                  background: 'white',
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                📂 Data Room
              </button>
              <button
                onClick={() => navigate(`/deals/${deal.id}/financial`)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #10b981',
                  background: 'white',
                  color: '#10b981',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                💰 Financial Intelligence
              </button>
              {(deal.stage === 'won' || deal.stage === 'closing') && (
                <button
                  onClick={() => {
                    if (hasPMIProject && pmiProjectId) {
                      navigate(`/pmi/projects/${pmiProjectId}`);
                    } else {
                      navigate(`/pmi/projects/new?deal_id=${deal.id}`);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: hasPMIProject ? '#8b5cf6' : '#7c3aed',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {hasPMIProject ? '📊 View PMI Project' : '🚀 Start PMI Project'}
                </button>
              )}
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

      {/* Tab Navigation */}
      <nav
        role="tablist"
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          background: 'white',
          borderRadius: '8px 8px 0 0',
          padding: '0 1rem',
        }}
      >
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '1rem 1.5rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'overview' ? '#f97316' : '#64748b',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '2px solid #f97316' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Overview
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'financials'}
          onClick={() => setActiveTab('financials')}
          style={{
            padding: '1rem 1.5rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'financials' ? '#f97316' : '#64748b',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'financials' ? '2px solid #f97316' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Financials
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'documents'}
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '1rem 1.5rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'documents' ? '#f97316' : '#64748b',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'documents' ? '2px solid #f97316' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Documents
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'team'}
          onClick={() => setActiveTab('team')}
          style={{
            padding: '1rem 1.5rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'team' ? '#f97316' : '#64748b',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'team' ? '2px solid #f97316' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Team
        </button>
      </nav>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
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
        </>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
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
            Financial Overview
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {financialHighlights.map((card) => (
              <div
                key={card.label}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                }}
              >
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  {card.label}
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</p>
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>{card.meta}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #c7d2fe',
                background: '#eef2ff',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#4338ca', fontWeight: 600 }}>Valuation Suite</p>
              <p style={{ color: '#312e81', marginTop: '0.5rem' }}>
                Run Monte Carlo, comparable companies, and precedent transactions to validate {deal.target_company}'s pricing.
              </p>
              <button
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#312e81',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/deals/${deal.id}/valuation`)}
              >
                Open Valuation Suite
              </button>
            </div>
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #a5b4fc',
                background: '#f5f3ff',
              }}
            >
              <p style={{ fontSize: '0.875rem', color: '#4c1d95', fontWeight: 600 }}>Financial Playbook</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#4338ca', fontSize: '0.875rem' }}>
                <li>Review FP&A What-If outcomes.</li>
                <li>Sync working capital guardrails.</li>
                <li>Share banker pack via Reports.</li>
              </ul>
            </div>
          </div>
        </article>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Deal Documents</h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
            Manage diligence folders, audit logs, and AI Q&A directly from the workspace.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {documentShortcuts.map((shortcut) => (
              <button
                key={shortcut.label}
                onClick={shortcut.action}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                {shortcut.label}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div
            style={{
              border: '1px dashed #cbd5f5',
              borderRadius: '12px',
              padding: '1rem',
              color: '#475569',
              background: '#eef2ff',
            }}
          >
            <p style={{ fontWeight: 600 }}>Data room readiness</p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>Watermarking + access logs enabled</li>
              <li>Bulk upload queue staged for next drop</li>
              <li>AI assistant primed for vendor Q&A</li>
            </ul>
          </div>
        </article>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <article
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Deal Team</h2>
          <p style={{ color: '#475569', marginBottom: '1rem' }}>
            Keep internal leaders, advisors, and PMI coordinators aligned across the lifecycle.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {teamAssignments.map((assignment) => (
              <div
                key={assignment.role}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    {assignment.role}
                  </p>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{assignment.person}</p>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>{assignment.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '12px',
              background: hasPMIProject ? '#ecfdf5' : '#fff7ed',
              border: `1px solid ${hasPMIProject ? '#a7f3d0' : '#fed7aa'}`,
            }}
          >
            <p style={{ fontWeight: 600, color: hasPMIProject ? '#065f46' : '#9a3412' }}>
              {hasPMIProject ? 'PMI project linked' : 'PMI project recommended'}
            </p>
            <p style={{ fontSize: '0.9rem', color: hasPMIProject ? '#047857' : '#c2410c' }}>
              {hasPMIProject
                ? 'Track day-one readiness, synergy targets, and risk register from the PMI module.'
                : 'Create the PMI project to align workstreams and day-one milestones.'}
            </p>
            <button
              onClick={() =>
                hasPMIProject ? navigate(`/pmi/projects/${pmiProjectId}`) : navigate('/pmi/projects/new')
              }
              style={{
                marginTop: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                background: hasPMIProject ? '#059669' : '#ea580c',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {hasPMIProject ? 'Open PMI project' : 'Create PMI project'}
            </button>
          </div>
        </article>
      )}
    </section>
  );
};
