import { useState, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string;
}

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showErrorsImmediately?: boolean;
}

/**
 * Enhanced form validation hook with comprehensive validation features
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules,
  options: UseFormValidationOptions = {}
) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    showErrorsImmediately = false
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate single field
  const validateField = useCallback((name: string, value: any): string => {
    const rule = rules[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${name} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return '';
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${name} must be at least ${rule.minLength} characters`;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${name} must not exceed ${rule.maxLength} characters`;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${name} format is invalid`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return '';
  }, [rules]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Validate all fields
      const formErrors: FormErrors = {};
      Object.keys(rules).forEach(fieldName => {
        const error = validateField(fieldName, values[fieldName as keyof T]);
        if (error) {
          formErrors[fieldName] = error;
        }
      });

      setErrors(formErrors);

      // Check if form is valid
      if (Object.keys(formErrors).length > 0) {
        logger.warn('Form validation failed', {
          errors: formErrors,
          values: values 
        });
        return false;
      }

      // Submit the form
      await onSubmit(values);
      return true;
    } catch (error) {
      logger.error('Form submission failed', error instanceof Error ? error : new Error('Unknown error'), {
        values,
        formName: 'unknown'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateField, rules, values]);

  // Handle field change
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit
  };
};

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  
  phone: {
    required: true,
    pattern: /^\+?[1-9]\d{0,15}$/,
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  
  company: {
    required: true,
    minLength: 2,
    maxLength: 100
  }
};

export default useFormValidation;