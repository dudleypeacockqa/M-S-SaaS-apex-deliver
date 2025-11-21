import { MarketingNav } from './MarketingNav';
import { Footer } from './Footer';
import { OptInPopup } from './OptInPopup';
import { StructuredData } from '../common/StructuredData';
import { HelmetProvider } from 'react-helmet-async';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  // Organization structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ApexDeliver',
    alternateName: '100 Days & Beyond',
    url: 'https://100daysandbeyond.com',
    logo: 'https://100daysandbeyond.com/assets/brand/apexdeliver-wordmark.svg',
    description:
      'ApexDeliver unites CapLiquify FP&A, deal rooms, valuations, and revenue execution so ambitious teams can own the first 100 days and the next 1,000 from a single operating system.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@apexdeliver.com',
      availableLanguage: ['en-GB', 'en-US'],
    },
    sameAs: [
      'https://www.linkedin.com/company/apexdeliver',
      'https://twitter.com/apexdeliver',
      'https://www.youtube.com/@apexdeliver',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressRegion: 'England',
    },
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <StructuredData json={organizationSchema} id="organization-schema" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-indigo-900 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <MarketingNav />
        <main id="main-content" tabIndex={-1} className="flex-grow" aria-label="Main content">
          {children}
        </main>
        <Footer />
        <OptInPopup />
      </div>
    </HelmetProvider>
  );
};
