import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeal, DealCreate, DealStage } from '../../services/api/deals';

export const NewDealPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<DealCreate>({
    name: '',
    target_company: '',
    industry: '',
    deal_size: undefined,
    currency: 'GBP',
    stage: 'sourcing',
    description: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const stages: { value: DealStage; label: string }[] = [
    { value: 'sourcing', label: 'Sourcing' },
    { value: 'evaluation', label: 'Evaluation' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closing', label: 'Closing' },
  ];

  const currencies = ['GBP', 'USD', 'EUR'];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Deal name is required';
    }

    if (!formData.target_company.trim()) {
      errors.target_company = 'Target company is required';
    }

    if (formData.deal_size !== undefined && formData.deal_size <= 0) {
      errors.deal_size = 'Deal size must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dealPayload: DealCreate = {
        name: formData.name,
        target_company: formData.target_company,
        ...(formData.industry && { industry: formData.industry }),
        ...(formData.deal_size && { deal_size: formData.deal_size }),
        currency: formData.currency,
        stage: formData.stage,
        ...(formData.description && { description: formData.description }),
      };

      const createdDeal = await createDeal(dealPayload);

      // Navigate to the newly created deal's detail page
      navigate(`/deals/${createdDeal.id}`);
    } catch (err) {
      // Provide more detailed error messages
      let errorMessage = 'Failed to create deal';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Check for specific error types
        if (err.message.includes('Unable to connect')) {
          errorMessage = err.message;
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed. Please sign in again.';
        } else if (err.message.includes('403') || err.message.includes('Forbidden')) {
          errorMessage = 'You do not have permission to create deals.';
        } else if (err.message.includes('404')) {
          errorMessage = 'API endpoint not found. Please contact support.';
        } else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
          errorMessage = 'Server error occurred. Please try again later.';
        }
      }
      
      setError(errorMessage);
      console.error('Error creating deal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/deals');
  };

  return (
    <section data-testid="deal-new" style={{ display: 'grid', gap: '1.5rem', padding: '2rem' }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create New Deal</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Capture core transaction details to initiate a new opportunity in the pipeline.
        </p>
      </header>

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#991b1b',
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Error Creating Deal</h3>
          <p>{error}</p>
        </div>
      )}

      <article
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Deal Name */}
            <div>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Deal Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${validationErrors.name ? '#dc2626' : '#e2e8f0'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                placeholder="e.g., Acme Corp Acquisition"
              />
              {validationErrors.name && (
                <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Target Company */}
            <div>
              <label
                htmlFor="target_company"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Target Company <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="target_company"
                type="text"
                value={formData.target_company}
                onChange={(e) => setFormData({ ...formData, target_company: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${validationErrors.target_company ? '#dc2626' : '#e2e8f0'}`,
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                placeholder="e.g., Acme Corporation Ltd"
              />
              {validationErrors.target_company && (
                <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                  {validationErrors.target_company}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label
                htmlFor="industry"
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
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                placeholder="e.g., Technology, Healthcare, Manufacturing"
              />
            </div>

            {/* Deal Size and Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="deal_size"
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
                  id="deal_size"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.deal_size || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deal_size: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${validationErrors.deal_size ? '#dc2626' : '#e2e8f0'}`,
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  placeholder="e.g., 5000000"
                />
                {validationErrors.deal_size && (
                  <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                    {validationErrors.deal_size}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="currency"
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
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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

            {/* Stage */}
            <div>
              <label
                htmlFor="stage"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#0f172a',
                }}
              >
                Initial Stage <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                id="stage"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
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

            {/* Description */}
            <div>
              <label
                htmlFor="description"
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
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                placeholder="Additional notes or context about this deal..."
              />
            </div>

            {/* Form Actions */}
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
                onClick={handleCancel}
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#0f172a',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
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
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!loading) e.currentTarget.style.background = '#ea580c';
                }}
                onMouseOut={(e) => {
                  if (!loading) e.currentTarget.style.background = '#f97316';
                }}
              >
                {loading ? 'Creating...' : 'Create Deal'}
              </button>
            </div>
          </div>
        </form>
      </article>
    </section>
  );
};
