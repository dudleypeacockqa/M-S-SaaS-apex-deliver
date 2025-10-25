import { useEffect, useState } from 'react';
import { billingService, type SubscriptionTier, type TierDetails } from '../../services/billingService';

interface ChangeTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onSuccess: () => void;
}

export const ChangeTierModal: React.FC<ChangeTierModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSuccess,
}) => {
  const [tiers, setTiers] = useState<TierDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTiers();
    }
  }, [isOpen]);

  const loadTiers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allTiers = await billingService.getAllTiers();
      setTiers(allTiers);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTier = async () => {
    if (!selectedTier) return;

    try {
      setChanging(true);
      setError(null);
      await billingService.changeTier({
        new_tier: selectedTier,
        prorate: true,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to change subscription tier');
    } finally {
      setChanging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a New Tier</h2>
        <p className="text-gray-600 mb-6">
          Current tier: <span className="font-semibold capitalize">{currentTier}</span>
        </p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading tiers...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && tiers.length > 0 && (
          <div className="space-y-4 mb-6">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTier(tier.tier)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedTier(tier.tier);
                  }
                }}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTier === tier.tier
                    ? 'border-indigo-600 bg-indigo-50'
                    : tier.tier === currentTier
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 hover:border-indigo-300'
                } ${tier.tier === currentTier ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                    {tier.tier === currentTier && (
                      <span className="text-sm text-gray-500">(Current Plan)</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      £{typeof tier.price_monthly === 'number' ? tier.price_monthly : parseFloat(tier.price_monthly)}
                    </p>
                    <p className="text-sm text-gray-500">/month</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mt-3 space-y-1">
                  {tier.features.max_deals && (
                    <div>• Up to {tier.features.max_deals} deals</div>
                  )}
                  {!tier.features.max_deals && tier.features.max_deals === null && (
                    <div>• Unlimited deals</div>
                  )}
                  {tier.features.max_users && (
                    <div>• Up to {tier.features.max_users} users</div>
                  )}
                  {!tier.features.max_users && tier.features.max_users === null && (
                    <div>• Unlimited users</div>
                  )}
                  {tier.features.storage_gb && (
                    <div>• {tier.features.storage_gb}GB storage</div>
                  )}
                  {tier.features.ai_features && <div>• AI-powered features</div>}
                  {tier.features.api_access && <div>• API access</div>}
                  {tier.features.priority_support && <div>• Priority support</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={changing}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleChangeTier}
            disabled={!selectedTier || selectedTier === currentTier || changing}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changing ? 'Changing tier...' : 'Confirm Change'}
          </button>
        </div>
      </div>
    </div>
  );
};
