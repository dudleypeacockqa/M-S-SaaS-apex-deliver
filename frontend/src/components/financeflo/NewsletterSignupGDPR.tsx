import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsletterSignupGDPRProps {
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export const NewsletterSignupGDPR: React.FC<NewsletterSignupGDPRProps> = ({
  variant = 'default',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setError('Please consent to receive marketing emails');
      return;
    }

    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GHL_API_KEY;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID;

      if (!apiKey || !locationId) {
        throw new Error('GHL API credentials not configured');
      }

      // Extract name from email or use generic
      const emailName = email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

      // Extract email domain from email address (without @ symbol)
      const emailDomain = email.includes('@')
        ? email.split('@')[1].toLowerCase()
        : '';

      // Get current date for datecode
      const now = new Date();
      const month = now.toLocaleString('en-US', { month: 'short' }).toLowerCase();
      const year = now.getFullYear();
      const dateCode = `${month}${year}`;

      // Get UTM params if present
      const utmSource = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase()
        : null;

      // Build tags
      const tags = ['src:website:newsletter_subscription', 'beh:subscribed:newsletter', 'offer:newsletter:insights'];

      if (utmSource) {
        const normalizedSource = utmSource === 'facebook' ? 'fb' :
                               utmSource === 'linkedin' ? 'li' :
                               utmSource === 'google_ads' ? 'gads' :
                               utmSource;
        tags.push(`src:${normalizedSource}:newsletter_${dateCode}`);
      }

      // Prepare custom fields for consent tracking
      const customFieldsArray = [
        {
          key: 'newsletter_consent',
          field_value: 'true'
        },
        {
          key: 'newsletter_consent_date',
          field_value: new Date().toISOString()
        }
      ];

      if (emailDomain) {
        customFieldsArray.push({
          key: 'email_domain',
          field_value: emailDomain
        });
      }

      const contactData = {
        firstName: firstName,
        lastName: 'Newsletter Subscriber',
        email: email.trim().toLowerCase(),
        source: 'Newsletter Subscription',
        tags: tags,
        customField: customFieldsArray
      };

      console.log('📧 Newsletter Signup - Submitting to GHL:', {
        email: email.split('@')[1], // Domain only for privacy
        tags: tags,
        consent: true,
        timestamp: new Date().toISOString()
      });

      // Submit to GHL API v1
      const response = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...contactData,
            locationId: locationId
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Check if contact already exists
        if (response.status === 422 || response.status === 409) {
          console.log('📧 Contact exists, updating subscription...');
          await updateExistingContact(contactData, apiKey, locationId);
        } else {
          throw new Error(errorData.message || `Subscription failed (${response.status})`);
        }
      } else {
        const responseData = await response.json();
        console.log('✅ Newsletter subscription successful:', responseData.contact?.id || responseData.id);
      }

      setIsSubscribed(true);
      setEmail('');
      setConsent(false);

      // Track successful submission
      console.log('✅ Newsletter Subscription Success');

    } catch (error) {
      console.error('❌ Newsletter subscription error:', error);
      setError('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExistingContact = async (contactData: any, apiKey: string, locationId: string): Promise<void> => {
    // Search for existing contact
    const searchResponse = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&email=${encodeURIComponent(contactData.email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to find existing contact');
    }

    const searchData = await searchResponse.json();

    if (!searchData.contacts || searchData.contacts.length === 0) {
      throw new Error('Contact not found for update');
    }

    const contactId = searchData.contacts[0].id;

    // Update existing contact with newsletter subscription
    const updateResponse = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactData,
          tags: [...searchData.contacts[0].tags || [], ...contactData.tags] // Merge tags
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update existing contact');
    }

    console.log('✅ Contact updated with newsletter subscription:', contactId);
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-green-600 font-medium">Subscribed! Check your email.</span>
      </div>
    );
  }

  // Compact variant (for sidebar/footer secondary)
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            className="bg-white text-gray-900 border-gray-300 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent-compact"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              disabled={isSubmitting}
              className="mt-0.5 border-2 border-white data-[state=unchecked]:bg-white/20"
            />
            <label htmlFor="consent-compact" className="text-xs text-gray-100 leading-tight cursor-pointer">
              I consent to receive marketing emails about AI automation and product updates.{' '}
              <Link to="/privacy" className="underline hover:text-white font-semibold">
                Privacy Policy
              </Link>
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white text-sm hover:bg-primary/90"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-400">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Inline variant (for blog hero)
  if (variant === 'inline') {
    return (
      <div className={`space-y-3 ${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your business email"
            className="flex-1 bg-white text-gray-900 border-0 h-12 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="lg"
            className="bg-brand-green hover:bg-brand-green-dark h-12 px-8 font-semibold"
            disabled={isSubmitting || !consent}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                Get Free Insights
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="flex items-start gap-2">
          <Checkbox
            id="consent-inline"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
            disabled={isSubmitting}
            className="mt-1 bg-white border-2 border-white data-[state=unchecked]:bg-white/20"
          />
          <label htmlFor="consent-inline" className="text-sm text-white leading-tight cursor-pointer">
            I consent to receive marketing emails from FinanceFlo.ai about AI automation, finance insights, and product updates.{' '}
            <Link to="/privacy" className="text-white underline hover:text-gray-200 font-semibold">
              Privacy Policy
            </Link>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <p className="text-sm text-blue-100 opacity-90">
          No spam. Unsubscribe anytime. Your data is protected and never shared.
        </p>
      </div>
    );
  }

  // Default variant (for footer main CTA)
  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <Input
          type="email"
          placeholder="Enter your business email"
          className="flex-1 bg-white text-gray-900 border-0 h-12 text-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="lg"
          className="bg-white text-primary hover:bg-gray-100 h-12 px-8 font-semibold"
          disabled={isSubmitting || !consent}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              Get Free Insights
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-start gap-2">
        <Checkbox
          id="consent-default"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked as boolean)}
          disabled={isSubmitting}
          className="mt-1 bg-white border-2 border-white data-[state=unchecked]:bg-white/20"
        />
        <label htmlFor="consent-default" className="text-sm text-white leading-tight cursor-pointer">
          I consent to receive marketing emails from FinanceFlo.ai about AI automation, finance insights, and product updates.{' '}
          <Link to="/privacy" className="underline hover:text-gray-200 font-semibold">
            Privacy Policy
          </Link>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <p className="text-sm opacity-90">
        No spam. Unsubscribe anytime. Your data is protected and never shared.
      </p>
    </div>
  );
};

export default NewsletterSignupGDPR;
