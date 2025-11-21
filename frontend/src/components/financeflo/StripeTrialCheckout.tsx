import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StripeTrialCheckoutProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const StripeTrialCheckout: React.FC<StripeTrialCheckoutProps> = ({
  onSuccess,
  onError,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTrialStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Create Stripe checkout session for £0 trial with card verification
      const { data, error: functionError } = await supabase.functions.invoke('create-trial-checkout', {
        body: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          trialDays: 7,
          currency: 'gbp'
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to create trial checkout');
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        onSuccess?.();
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`shadow-2xl border-0 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Shield className="h-6 w-6" />
          <CardTitle className="text-2xl text-center">Secure 7-Day Free Trial</CardTitle>
        </div>
        <div className="text-center">
          <Badge className="bg-yellow-500 text-yellow-900">
            £0 to start - Card verification only
          </Badge>
          <p className="text-blue-100 mt-2">Full access to Cognitive Professional features</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleTrialStart} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                placeholder="John"
                className="h-12"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                placeholder="Smith"
                className="h-12"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="john.smith@company.com"
              className="h-12"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              required
              placeholder="Your Company Ltd"
              className="h-12"
              disabled={isProcessing}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-blue-900 mb-2">What happens next:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Secure card verification (£0 charge)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Instant access to full platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">Personal onboarding within 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">No automatic charges after trial</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold h-14"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating Your Trial...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Start 7-Day Free Trial
              </>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            By starting your trial, you agree to our Terms of Service and Privacy Policy. 
            Card verification required but no charges will be made during the 7-day trial period.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripeTrialCheckout;