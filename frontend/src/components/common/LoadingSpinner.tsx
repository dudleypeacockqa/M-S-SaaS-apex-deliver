interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

/**
 * LoadingSpinner Component
 *
 * A simple, accessible loading indicator.
 *
 * @param size - Size variant: 'sm' (16px), 'md' (32px, default), 'lg' (48px)
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: '16px',
    md: '32px',
    lg: '48px'
  }

  const spinnerSize = sizeMap[size]

  return (
    <div
      data-testid="loading-spinner"
      role="status"
      aria-label="Loading"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    >
      <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
        Loading...
      </span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
