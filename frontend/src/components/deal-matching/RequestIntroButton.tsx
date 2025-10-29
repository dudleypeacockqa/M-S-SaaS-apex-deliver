import React from 'react';

interface RequestIntroButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const RequestIntroButton: React.FC<RequestIntroButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      disabled || loading
        ? 'bg-green-200 text-green-700 cursor-not-allowed'
        : 'bg-green-600 text-white hover:bg-green-700'
    } ${className}`.trim()}
    data-testid="request-intro-button"
  >
    {loading ? 'Requesting…' : 'Request Introduction'}
  </button>
);
