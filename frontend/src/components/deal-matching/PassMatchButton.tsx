import React from 'react';

interface PassMatchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const PassMatchButton: React.FC<PassMatchButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
      disabled || loading
        ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
    } ${className}`.trim()}
    data-testid="pass-match-button"
  >
    {loading ? 'Passing…' : 'Pass'}
  </button>
);
