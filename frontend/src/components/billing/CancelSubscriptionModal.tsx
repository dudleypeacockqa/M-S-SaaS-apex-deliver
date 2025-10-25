import { useState } from 'react';
import { billingService, type Subscription } from '../../services/billingService';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onSuccess: () => void;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}) => {
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    try {
      setCanceling(true);
      setError(null);
      await billingService.cancelSubscription({
        immediately: cancelImmediately,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription</h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel your <span className="font-semibold capitalize">{subscription.tier}</span> subscription?
        </p>

        {!cancelImmediately && subscription.current_period_end && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              Your subscription will remain active until{' '}
              <span className="font-semibold">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
              . You'll retain full access until then.
            </p>
          </div>
        )}

        {cancelImmediately && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-semibold">
              ⚠️ Warning: Your subscription will be canceled immediately and you'll lose access right away.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={cancelImmediately}
              onChange={(e) => setCancelImmediately(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              aria-label="Cancel immediately (lose access now)"
            />
            <span className="ml-3 text-sm text-gray-700">
              Cancel immediately (lose access now)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={canceling}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleCancel}
            disabled={canceling}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {canceling ? 'Canceling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
};
