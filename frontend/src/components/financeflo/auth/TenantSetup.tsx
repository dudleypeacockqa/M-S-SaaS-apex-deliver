import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building, Globe, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const TenantSetup = () => {
  const { createTenant } = useTenant();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [tenantData, setTenantData] = useState({
    name: userProfile?.first_name && userProfile?.last_name 
      ? `${userProfile.first_name} ${userProfile.last_name}'s Organization`
      : '',
    subdomain: '',
    planTier: 'starter' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createTenant({
        name: tenantData.name,
        domain: tenantData.subdomain,
        settings: {
          onboarding_completed: false,
          features: ['basic_analytics', 'team_collaboration']
        }
      });

      toast({
        title: "Organization created successfully!",
        description: "Welcome to IntelliFlow. Let's get you started.",
      });
      navigate('/app/dashboard');
    } catch (err) {
      setError('Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSubdomain = () => {
    const name = tenantData.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setTenantData({ ...tenantData, subdomain: name });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set Up Your Organization</CardTitle>
          <CardDescription className="text-center">
            Create your organization to get started with IntelliFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="org-name"
                  placeholder="Enter your organization name"
                  value={tenantData.name}
                  onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="subdomain"
                  placeholder="your-org"
                  value={tenantData.subdomain}
                  onChange={(e) => setTenantData({ ...tenantData, subdomain: e.target.value.toLowerCase() })}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Your organization will be accessible at: {tenantData.subdomain}.intelliflow.com
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSubdomain}
                disabled={!tenantData.name}
              >
                Generate from name
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Plan Selection</Label>
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  className={`cursor-pointer border-2 ${
                    tenantData.planTier === 'starter' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setTenantData({ ...tenantData, planTier: 'starter' })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          tenantData.planTier === 'starter' 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Starter Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          Perfect for getting started with basic features
                        </p>
                        <p className="text-lg font-bold text-primary">Free</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Organization
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                By creating an organization, you agree to our{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};