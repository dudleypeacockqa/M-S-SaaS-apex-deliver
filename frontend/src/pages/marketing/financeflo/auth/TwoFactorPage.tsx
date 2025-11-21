import { TwoFactorSetup } from '@/components/marketing/financeflo/auth/TwoFactorSetup';

const TwoFactorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <TwoFactorSetup />
    </div>
  );
};

export default TwoFactorPage;