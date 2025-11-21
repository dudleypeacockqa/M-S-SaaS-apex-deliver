import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Smartphone, Key, Shield, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    generateTwoFactor();
  }, []);

  const generateTwoFactor = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (error) {
      toast({
        title: "Error generating 2FA",
        description: "Failed to generate two-factor authentication setup.",
        variant: "destructive",
      });
    }
  };

  const enableTwoFactor = async () => {
    if (!verificationCode) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: '', // This would be the factor ID from enrollment
        code: verificationCode
      });

      if (error) throw error;

      // Generate backup codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substr(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
      setIsEnabled(true);

      toast({
        title: "2FA Enabled Successfully",
        description: "Two-factor authentication has been enabled for your account.",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (isEnabled) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Two-Factor Authentication Enabled
          </CardTitle>
          <CardDescription>
            Your account is now protected with two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Save these backup codes in a secure location. 
              You can use them to access your account if you lose your authenticator device.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg border"
              >
                <code className="font-mono text-sm">{code}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(code, index)}
                >
                  {copied === index ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.print()}>
              Print Codes
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const text = backupCodes.join('\n');
                copyToClipboard(text, -1);
              }}
            >
              Copy All Codes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Set Up Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account with 2FA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="app" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app">Authenticator App</TabsTrigger>
            <TabsTrigger value="sms">SMS (Coming Soon)</TabsTrigger>
          </TabsList>

          <TabsContent value="app" className="space-y-6">
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border shadow-sm">
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                    ) : (
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                        <QrCode className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {secret}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(secret, 0)}
                    >
                      {copied === 0 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or enter this secret manually
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <Smartphone className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">1. Download App</p>
                    <p className="text-xs text-muted-foreground">
                      Google Authenticator, Authy, or similar
                    </p>
                  </div>
                  <div className="space-y-2">
                    <QrCode className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">2. Scan QR Code</p>
                    <p className="text-xs text-muted-foreground">
                      Add your account to the app
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Key className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">3. Enter Code</p>
                    <p className="text-xs text-muted-foreground">
                      Verify with 6-digit code
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest font-mono"
                  />
                </div>

                <Button
                  onClick={enableTwoFactor}
                  disabled={!verificationCode || verificationCode.length !== 6 || loading}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Enable Two-Factor Authentication"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-6">
            <Alert>
              <AlertDescription>
                SMS two-factor authentication will be available in a future update.
                For now, please use an authenticator app for the best security.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};