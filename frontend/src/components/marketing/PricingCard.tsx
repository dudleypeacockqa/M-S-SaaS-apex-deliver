import { Link } from 'react-router-dom';

export interface PricingCardProps {
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink?: string;
  highlighted?: boolean;
  onGetStarted?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  currency,
  period,
  description,
  features,
  cta,
  ctaLink = '/sign-up',
  highlighted = false,
  onGetStarted,
  loading = false,
  disabled = false,
}) => {
  const cardClasses = highlighted
    ? 'relative bg-white p-8 rounded-lg shadow-2xl border-4 border-indigo-900 transform scale-105'
    : 'bg-white p-8 rounded-lg shadow-md border border-gray-200';

  const buttonClasses = highlighted
    ? 'w-full bg-indigo-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-800 transition-colors disabled:opacity-50'
    : 'w-full bg-gray-100 text-indigo-900 border-2 border-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50';

  const content = loading ? 'Creating checkout…' : cta;

  if (onGetStarted) {
    return (
      <article className={cardClasses}>
        {highlighted && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </span>
          </div>
        )}
        {/* Tier Name & Description */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-extrabold text-gray-900">{currency}{price.toLocaleString()}</span>
            <span className="text-gray-600 ml-2">/ {period}</span>
          </div>
        </div>
        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-600 mr-3 flex-shrink-0 mt-0.5">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={buttonClasses}
          onClick={onGetStarted}
          disabled={disabled || loading}
        >
          {content}
        </button>
      </article>
    );
  }

  return (
    <article className={cardClasses}>
      {highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}
      {/* Tier Name & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-extrabold text-gray-900">{currency}{price.toLocaleString()}</span>
          <span className="text-gray-600 ml-2">/ {period}</span>
        </div>
      </div>
      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-600 mr-3 flex-shrink-0 mt-0.5">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to={ctaLink} className={buttonClasses}>
        {content}
      </Link>
    </article>
  );
};
