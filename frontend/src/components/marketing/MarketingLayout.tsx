import { MarketingNav } from './MarketingNav';
import { Footer } from './Footer';
import { AnalyticsProvider } from './AnalyticsProvider';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsProvider />
      <MarketingNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
