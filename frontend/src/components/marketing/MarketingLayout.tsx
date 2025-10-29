import { MarketingNav } from './MarketingNav';
import { Footer } from './Footer';
import { AnalyticsProvider } from './AnalyticsProvider';
import { StructuredData } from '../common/StructuredData';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  // Organization structured data for SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ApexDeliver',
    alternateName: 'M&A Intelligence Platform',
    url: 'https://apexdeliver.com',
    logo: 'https://apexdeliver.com/assets/brand/apexdeliver-wordmark.svg',
    description: 'ApexDeliver is the only end-to-end M&A intelligence platform combining deal flow management, AI-powered financial analysis, intelligent deal matching, and post-merger integration tools—all in one affordable subscription.',
    foundingDate: '2025',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-20-XXXX-XXXX',
      contactType: 'sales',
      email: 'sales@apexdeliver.com',
      availableLanguage: ['en-GB', 'en-US'],
    },
    sameAs: [
      'https://www.linkedin.com/company/apexdeliver',
      'https://twitter.com/apexdeliver',
      'https://www.facebook.com/apexdeliver',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
      addressRegion: 'England',
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData json={organizationSchema} id="organization-schema" />
      <AnalyticsProvider>
        <MarketingNav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </AnalyticsProvider>
    </div>
  );
};
