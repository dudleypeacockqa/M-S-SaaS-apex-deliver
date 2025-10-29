import React from 'react';

interface SaveMatchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const SaveMatchButton: React.FC<SaveMatchButtonProps> = ({
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
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-indigo-600 text-white hover:bg-indigo-700'
    } ${className}`.trim()}
    data-testid="save-match-button"
  >
    {loading ? 'Saving…' : 'Save Match'}
  </button>
);
