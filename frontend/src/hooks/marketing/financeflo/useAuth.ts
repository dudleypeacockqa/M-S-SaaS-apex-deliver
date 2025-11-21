import { useCallback } from 'react';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/marketing/financeflo/use-toast';

export const useAuth = () => {
  const authContext = useAuthContext();

  const signInWithOAuth = useCallback(async (provider: 'google' | 'azure') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app/setup`
        }
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (err) {
      const error = new Error('An unexpected error occurred');
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for reset instructions.",
      });

      return { error: null };
    } catch (err) {
      const error = new Error('An unexpected error occurred');
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been updated.",
      });

      return { error: null };
    } catch (err) {
      const error = new Error('An unexpected error occurred');
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  }, []);

  const checkEmailAvailability = useCallback(async (email: string) => {
    try {
      // This would typically be an API call to check if email exists
      // For now, we'll just return true as this would need backend implementation
      return { available: true };
    } catch (err) {
      return { available: false };
    }
  }, []);

  return {
    ...authContext,
    signInWithOAuth,
    resetPassword,
    updatePassword,
    checkEmailAvailability
  };
};