import React from 'react';
import BillingDashboard from '@/components/marketing/financeflo/billing/BillingDashboard';

const BillingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <BillingDashboard />
      </div>
    </div>
  );
};

export default BillingPage;