import { memo } from 'react'

export interface FeatureCardIcon {
  src: string
  alt: string
}

export interface FeatureCardProps {
  title: string
  description: string
  icon: FeatureCardIcon
}

export const FeatureCard: React.FC<FeatureCardProps> = memo(({ title, description, icon }) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100" aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100">
        <img
          src={icon.src}
          alt={icon.alt}
          className="h-12 w-12"
          loading="lazy"
        />
      </div>

      <h3 id={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`} className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">{description}</p>
    </article>
  )
})

FeatureCard.displayName = 'FeatureCard'
