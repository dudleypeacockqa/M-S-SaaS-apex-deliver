import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/marketing/financeflo/ui/card';
import { Button } from '@/components/marketing/financeflo/ui/button';
import { Input } from '@/components/marketing/financeflo/ui/input';
import { Textarea } from '@/components/marketing/financeflo/ui/textarea';
import { Badge } from '@/components/marketing/financeflo/ui/badge';
import { 
  Building2, 
  Users, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

const TenantSetupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTenant, tenants, loading } = useTenant();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subscription_tier: 'starter' as 'starter' | 'professional' | 'enterprise'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      await createTenant({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        subscription_tier: formData.subscription_tier,
      });
      
      // Navigate to dashboard after creation
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const subscriptionPlans = [
    {
      tier: 'starter' as const,
      name: 'Starter',
      price: '£3,500/month',
      description: 'Perfect for small teams getting started with AI-powered integration',
      features: [
        '5 AI Agents',
        '10 Integrations',
        '25 Workflows',
        'Standard Support',
        'Basic Analytics'
      ]
    },
    {
      tier: 'professional' as const,
      name: 'Professional',
      price: '£8,500/month',
      description: 'Advanced features for growing businesses',
      features: [
        '20 AI Agents',
        '50 Integrations',
        'Unlimited Workflows',
        'Priority Support',
        'Advanced Analytics',
        'Custom Connectors'
      ],
      popular: true
    },
    {
      tier: 'enterprise' as const,
      name: 'Enterprise',
      price: 'Custom Pricing',
      description: 'Enterprise-grade solution with dedicated support',
      features: [
        'Unlimited AI Agents',
        'Unlimited Integrations',
        'Unlimited Workflows',
        '24/7 Dedicated Support',
        'Enterprise Analytics',
        'Custom Development',
        'On-premise Deployment'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // If user already has tenants, show tenant selection
  if (tenants.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h1>
            <p className="text-lg text-gray-600">Choose your workspace or create a new one</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{tenant.name}</h3>
                      <Badge variant="secondary" className="capitalize">{tenant.subscription_tier}</Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/app/dashboard')}
                    className="w-full"
                  >
                    Open Workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => setFormData({ name: '', description: '', subscription_tier: 'starter' })}>
              <Building2 className="mr-2 h-4 w-4" />
              Create New Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to IntelliFlow</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set up your AI-powered integration platform and start automating your business processes
          </p>
        </div>

        {/* Setup Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Organization Setup */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Create Your Organization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTenant} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your Company Ltd"
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of your organization..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!formData.name || isCreating}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Organization...
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Create Organization
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Plans */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <Card 
                  key={plan.tier}
                  className={`cursor-pointer transition-all ${
                    formData.subscription_tier === plan.tier
                      ? 'ring-2 ring-blue-600 bg-blue-50'
                      : 'hover:shadow-md'
                  } ${plan.popular ? 'border-blue-600' : ''}`}
                  onClick={() => handleInputChange('subscription_tier', plan.tier)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                          {plan.popular && (
                            <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{plan.price}</p>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.subscription_tier === plan.tier
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {formData.subscription_tier === plan.tier && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What happens next?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Instant Setup</h3>
              <p className="text-gray-600">Your AI-powered workspace is created immediately</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Guided Onboarding</h3>
              <p className="text-gray-600">Step-by-step setup of your first integrations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Automation</h3>
              <p className="text-gray-600">Start automating processes immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSetupPage;