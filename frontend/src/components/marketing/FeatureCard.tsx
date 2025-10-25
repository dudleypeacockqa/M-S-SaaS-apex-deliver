export interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </article>
  );
};
