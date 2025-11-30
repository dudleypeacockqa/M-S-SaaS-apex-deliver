import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CalculatorInputs } from '@/lib/financeflo/calculator';
import { getRevenueBracket, getExactRevenueForGHL } from '@/utils/financeflo/revenueMatching';
import { track } from '@/lib/analytics';

interface LeadCaptureFormProps {
  calculatorInputs: CalculatorInputs;
  onSuccess: (email: string, firstName: string, companyName: string) => void;
  onError?: (error: string) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  consentTransactional: boolean;
  consentMarketing: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  consentTransactional?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  calculatorInputs,
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    consentTransactional: false,
    consentMarketing: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile phone is required';
    } else if (!/^[\d\s+\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Company Name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Transactional Consent (required)
    if (!formData.consentTransactional) {
      newErrors.consentTransactional = 'You must consent to receive your report';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiKey = import.meta.env.VITE_GHL_API_KEY;
      const locationId = import.meta.env.VITE_GHL_LOCATION_ID;

      if (!apiKey || !locationId) {
        throw new Error('GHL API credentials not configured');
      }

      // Prepare contact data
      const revenueBracket = getRevenueBracket(calculatorInputs.annualRevenue);
      const exactRevenue = getExactRevenueForGHL(calculatorInputs.annualRevenue);

      // Extract email domain from email address (without @ symbol)
      const emailDomain = formData.email.includes('@')
        ? formData.email.split('@')[1].toLowerCase()
        : '';

      // Build tags array dynamically based on consent
      const tags = ['src:working_capital:lead'];
      if (formData.consentTransactional) {
        tags.push('beh:consent:transactional_msgs');
      }
      if (formData.consentMarketing) {
        tags.push('beh:consent:marketing_msgs');
      }

      // Prepare custom fields data
      const customFieldsArray = [
        {
          key: 'annual_revenue',
          field_value: revenueBracket
        },
        {
          key: 'revenue_in_000s_usd',  // Fixed: removed parentheses from field name
          field_value: String(exactRevenue)
        },
        {
          key: 'employees',
          field_value: String(calculatorInputs.employees)
        },
        {
          key: 'primary_industry_zoominfo',
          field_value: calculatorInputs.industry
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        },
        {
          key: 'email_domain',
          field_value: emailDomain
        }
      ];

      const contactData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        source: 'Working Capital Calculator',
        tags: tags,
        customField: customFieldsArray
      };

      // Debug logging - will help troubleshoot in production
      console.log('Submitting to GHL with data:', {
        ...contactData,
        customField: contactData.customField.map(f => ({
          key: f.key,
          value: f.field_value,
          type: typeof f.field_value
        }))
      });

      // Submit to GHL API
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

      let contactId: string | null = null;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Check if contact already exists
        if (response.status === 422 || response.status === 409) {
          // Contact exists, try to update instead
          contactId = await updateExistingContact(contactData, apiKey, locationId);
        } else {
          throw new Error(errorData.message || `Failed to submit form (${response.status})`);
        }
      } else {
        // Contact created successfully, get contact ID from response
        const responseData = await response.json();
        contactId = responseData.contact?.id || responseData.id || null;
        console.log('✅ Contact created successfully:', contactId);
        console.log('GHL Response - FULL:', JSON.stringify(responseData, null, 2));
        console.log('GHL Response - Custom Fields:', responseData.contact?.customField || responseData.customField || 'NOT FOUND');
        console.log('GHL Response - Object:', responseData);
      }

      // Note: Opportunity creation is handled by GHL workflow
      // Workflow triggers on tag: src:working_capital:lead
      // This ensures opportunities are created reliably using native GHL functionality

      // Track success
      track('lead_captured', {
        industry: calculatorInputs.industry,
        revenue_bracket: revenueBracket,
        source: 'calculator_modal'
      });

      // Call success callback
      onSuccess(formData.email, formData.firstName, formData.companyName);

    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form. Please try again.';
      setErrors({ email: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExistingContact = async (contactData: any, apiKey: string, locationId: string): Promise<string> => {
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

    // Update existing contact
    const updateResponse = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update existing contact');
    }

    return contactId;
  };

  // Opportunity creation removed - now handled by GHL workflow
  // Workflow triggers on tag: src:working_capital:lead
  // See workflow setup instructions in project documentation

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleFirstNameBlur = () => {
    const trimmedFirstName = formData.firstName.trim();

    // Check if there's a space in the first name (indicating multiple words)
    if (trimmedFirstName.includes(' ')) {
      const firstSpaceIndex = trimmedFirstName.indexOf(' ');
      const actualFirstName = toTitleCase(trimmedFirstName.substring(0, firstSpaceIndex));
      const remainingNames = toTitleCase(trimmedFirstName.substring(firstSpaceIndex + 1).trim());

      // Only auto-split if last name is empty
      if (!formData.lastName.trim() && remainingNames) {
        setFormData(prev => ({
          ...prev,
          firstName: actualFirstName,
          lastName: remainingNames
        }));
      }
    } else {
      // Just apply title case if no space
      setFormData(prev => ({
        ...prev,
        firstName: toTitleCase(trimmedFirstName)
      }));
    }
  };

  const handleLastNameBlur = () => {
    const trimmedLastName = formData.lastName.trim();
    if (trimmedLastName) {
      setFormData(prev => ({
        ...prev,
        lastName: toTitleCase(trimmedLastName)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Two Column Layout for Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            onBlur={handleFirstNameBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="First Name"
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            onBlur={handleLastNameBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Last Name"
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Two Column Layout for Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Business Email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mobile Number"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent ${
            errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Please enter your organisation name"
          disabled={isSubmitting}
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-3 pt-2">
        {/* Transactional Consent (Required) */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consentTransactional"
            checked={formData.consentTransactional}
            onChange={(e) => handleInputChange('consentTransactional', e.target.checked)}
            className="mt-1 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
            disabled={isSubmitting}
          />
          <label htmlFor="consentTransactional" className="ml-2 text-xs text-gray-700">
            <span className="text-red-500">*</span> By checking this box, I consent to receive transactional messages related to services I have requested. These messages may include appointment reminders, order confirmations, and account notifications among others. Message frequency may vary. Reply HELP for help or STOP to opt-out.
          </label>
        </div>
        {errors.consentTransactional && (
          <p className="ml-6 text-sm text-red-600">{errors.consentTransactional}</p>
        )}

        {/* Marketing Consent (Optional) */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consentMarketing"
            checked={formData.consentMarketing}
            onChange={(e) => handleInputChange('consentMarketing', e.target.checked)}
            className="mt-1 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
            disabled={isSubmitting}
          />
          <label htmlFor="consentMarketing" className="ml-2 text-xs text-gray-700">
            By checking this box, I consent to receive marketing and promotional messages, including special offers, discounts, new product updates among others. Message frequency may vary. Reply HELP for help or STOP to opt-out.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-teal-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-brand-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Access Board Report'
        )}
      </button>

      {/* Privacy Links */}
      <div className="text-center text-xs text-gray-600 pt-2">
        <a href="/privacy-policy" target="_blank" className="hover:text-brand-blue">Privacy Policy</a>
        {' | '}
        <a href="/terms-of-service" target="_blank" className="hover:text-brand-blue">Terms of Service</a>
      </div>
    </form>
  );
};
