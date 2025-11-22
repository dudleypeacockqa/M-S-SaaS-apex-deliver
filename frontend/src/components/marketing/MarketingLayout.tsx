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
    name: 'FinanceFlo',
    alternateName: 'FinanceFlo.ai',
    url: 'https://financeflo.ai',
    logo: 'https://financeflo.ai/assets/brand/financeflo-wordmark.svg',
    description:
      'FinanceFlo unifies deal sourcing, valuations, secure data rooms, and post-merger execution into a single AI-powered M&A platform.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@financeflo.ai',
      availableLanguage: ['en-GB', 'en-US'],
    },
    sameAs: [
      'https://www.linkedin.com/company/financeflo',
      'https://twitter.com/financeflo',
      'https://www.youtube.com/@financeflo',
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
