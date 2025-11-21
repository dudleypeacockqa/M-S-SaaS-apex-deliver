import React from 'react';

interface FinanceFloLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'light' | 'dark';
}

export const FinanceFloLogo: React.FC<FinanceFloLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  background = 'light'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[120px]',
    md: 'h-10 w-auto max-w-[160px]',
    lg: 'h-16 w-auto max-w-[240px]',
    xl: 'h-20 w-auto max-w-[320px]'
  };

  const logoSrc = background === 'dark' ? '/FFDarkBG-Logo.svg' : '/FFLightBG-Logo.svg';

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <img
        src={logoSrc}
        alt="FinanceFlo.AI Logo"
        className="w-auto h-full object-contain"
        onError={(e) => {
          console.error('Logo failed to load:', logoSrc);
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
    </div>
  );
};

export default FinanceFloLogo;
