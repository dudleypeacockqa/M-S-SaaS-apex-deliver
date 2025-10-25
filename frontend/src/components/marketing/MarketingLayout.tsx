import { MarketingNav } from './MarketingNav';
import { Footer } from './Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
