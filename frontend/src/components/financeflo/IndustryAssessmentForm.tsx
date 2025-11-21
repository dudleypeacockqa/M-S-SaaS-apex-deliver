import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IndustryAssessmentFormProps {
  industry: string;
  assessmentType: string;
  buttonText: string;
  buttonColor: 'orange' | 'blue';
  companyLabel?: string;
  field1Label?: string;
  field1Placeholder?: string;
  field2Label?: string;
  field2Placeholder?: string;
}

export const IndustryAssessmentForm: React.FC<IndustryAssessmentFormProps> = ({
  industry,
  assessmentType,
  buttonText,
  buttonColor,
  companyLabel = 'Company Name',
  field1Label = 'Annual Revenue',
  field1Placeholder = 'e.g., £5M-£50M',
  field2Label = 'Active Projects/Portfolio',
  field2Placeholder = 'e.g., 5-20'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    field1: '',
    field2: '',
    challenges: ''
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      setError('Please consent to receive communications about your assessment');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GHL_API_KEY;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID;

      if (!apiKey || !locationId) {
        throw new Error('GHL API credentials not configured');
      }

      // Extract email domain from email address (without @ symbol)
      const emailDomain = formData.email.includes('@')
        ? formData.email.split('@')[1].toLowerCase()
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
      const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '_');
      const tags = [
        `src:website:industry_assessment_${normalizedIndustry}`,
        'beh:requested:assessment',
        'life:lead:new'
      ];

      if (utmSource) {
        const normalizedSource = utmSource === 'facebook' ? 'fb' :
                               utmSource === 'linkedin' ? 'li' :
                               utmSource === 'google_ads' ? 'gads' :
                               utmSource;
        tags.push(`src:${normalizedSource}:assessment_${dateCode}`);
      }

      // Prepare custom fields
      const customFieldsArray = [
        {
          key: 'industry',
          field_value: industry
        },
        {
          key: 'assessment_type',
          field_value: assessmentType
        },
        {
          key: 'assessment_consent',
          field_value: 'true'
        },
        {
          key: 'assessment_consent_date',
          field_value: new Date().toISOString()
        }
      ];

      if (emailDomain) {
        customFieldsArray.push({
          key: 'email_domain',
          field_value: emailDomain
        });
      }

      if (formData.field1) {
        customFieldsArray.push({
          key: 'annual_revenue_or_aum',
          field_value: formData.field1
        });
      }

      if (formData.field2) {
        customFieldsArray.push({
          key: 'projects_or_portfolio_count',
          field_value: formData.field2
        });
      }

      // Generate contact note
      const timestamp = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const utmData = {
        source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || 'Direct' : 'Direct',
        medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || 'N/A' : 'N/A',
        campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || 'N/A' : 'N/A'
      };

      const contactNote = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 INDUSTRY ASSESSMENT REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formData.firstName} ${formData.lastName} from ${formData.companyName} has requested an industry assessment.

📊 ASSESSMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Industry: ${industry}
Assessment Type: ${assessmentType}
${field1Label}: ${formData.field1 || 'Not provided'}
${field2Label}: ${formData.field2 || 'Not provided'}

💼 CURRENT CHALLENGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.challenges || 'Not provided'}

📅 SUBMISSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Form Source: FinanceFlo.ai - ${industry} Assessment
Submission Date: ${timestamp}
Page URL: ${pageUrl}

📊 UTM TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: ${utmData.source}
Medium: ${utmData.medium}
Campaign: ${utmData.campaign}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      const contactData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        companyName: formData.companyName.trim(),
        source: `${industry} Assessment`,
        tags: tags,
        customField: customFieldsArray,
        notes: contactNote
      };

      console.log('🏢 Industry Assessment - Submitting to GHL:', {
        industry,
        assessmentType,
        email: formData.email.split('@')[1], // Domain only for privacy
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
          console.log('Contact exists, updating assessment request...');
          await updateExistingContact(contactData, apiKey, locationId);
        } else {
          throw new Error(errorData.message || `Assessment submission failed (${response.status})`);
        }
      } else {
        const responseData = await response.json();
        console.log('✅ Industry assessment submitted successfully:', responseData.contact?.id || responseData.id);
      }

      setIsSubmitted(true);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        field1: '',
        field2: '',
        challenges: ''
      });
      setConsent(false);

      console.log('✅ Industry Assessment Submission Success');

    } catch (error) {
      console.error('❌ Industry assessment submission error:', error);
      setError('Submission failed. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExistingContact = async (contactData: any, apiKey: string, locationId: string): Promise<void> => {
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
          tags: [...searchData.contacts[0].tags || [], ...contactData.tags]
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update existing contact');
    }

    console.log('✅ Contact updated with assessment request:', contactId);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h3 className="text-2xl font-bold text-gray-900">Assessment Request Received!</h3>
        </div>
        <p className="text-gray-600">
          Thank you for your interest. Our team will review your information and contact you within 24 hours
          to discuss how we can help transform your {industry.toLowerCase()} operations.
        </p>
        <p className="text-sm text-gray-500">
          Check your email for confirmation and next steps.
        </p>
      </div>
    );
  }

  const buttonColorClass = buttonColor === 'orange'
    ? 'bg-orange-600 hover:bg-orange-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          placeholder="First Name *"
          className="border-gray-200"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          required
          disabled={isSubmitting}
        />
        <Input
          placeholder="Last Name *"
          className="border-gray-200"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <Input
        placeholder="Business Email *"
        type="email"
        className="border-gray-200"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required
        disabled={isSubmitting}
      />

      <Input
        placeholder={`${companyLabel} *`}
        className="border-gray-200"
        value={formData.companyName}
        onChange={(e) => handleInputChange('companyName', e.target.value)}
        required
        disabled={isSubmitting}
      />

      <Input
        placeholder={field1Placeholder}
        className="border-gray-200"
        value={formData.field1}
        onChange={(e) => handleInputChange('field1', e.target.value)}
        disabled={isSubmitting}
      />

      <Input
        placeholder={field2Placeholder}
        className="border-gray-200"
        value={formData.field2}
        onChange={(e) => handleInputChange('field2', e.target.value)}
        disabled={isSubmitting}
      />

      <Textarea
        placeholder="Describe your current challenges (optional)..."
        className="border-gray-200 min-h-[100px]"
        value={formData.challenges}
        onChange={(e) => handleInputChange('challenges', e.target.value)}
        disabled={isSubmitting}
      />

      <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => setConsent(checked as boolean)}
          disabled={isSubmitting}
          className="mt-0.5"
        />
        <label htmlFor="consent" className="text-sm text-gray-700 leading-tight cursor-pointer">
          I consent to receive communications from FinanceFlo.ai about my industry assessment and related insights.
          By submitting this form, I agree to be contacted regarding my {industry.toLowerCase()} assessment request.{' '}
          <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800">
            Privacy Policy
          </Link>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className={`w-full ${buttonColorClass}`}
        size="lg"
        disabled={isSubmitting || !consent}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          buttonText
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        * Required fields. We respect your privacy and will only use your information to contact you about your assessment.
      </p>
    </form>
  );
};

export default IndustryAssessmentForm;
