
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAnalytics } from './AnalyticsTracker';

// A/B Testing Context
interface ABTestContextType {
  getVariant: (testName: string) => string;
  trackConversion: (testName: string, conversionType: string, value?: number) => void;
  isTestActive: (testName: string) => boolean;
}

const ABTestContext = createContext<ABTestContextType | null>(null);

// A/B Test Configuration Interface
interface ABTestConfig {
  name: string;
  variants: {
    [key: string]: {
      weight: number;
      description: string;
    };
  };
  isActive: boolean;
  startDate: string;
  endDate?: string;
  targetAudience?: {
    includeRules?: string[];
    excludeRules?: string[];
  };
}

// Default A/B Tests Configuration
const DEFAULT_AB_TESTS: ABTestConfig[] = [
  {
    name: 'homepage_hero_cta',
    variants: {
      control: {
        weight: 50,
        description: 'Original "Book Free Consultation" button'
      },
      variant_a: {
        weight: 25,
        description: 'Enhanced "Get Your Free AI Assessment" button'
      },
      variant_b: {
        weight: 25,
        description: 'Urgent "Transform Your Finance Today" button'
      }
    },
    isActive: true,
    startDate: '2025-07-10'
  },
  {
    name: 'pricing_page_layout',
    variants: {
      control: {
        weight: 50,
        description: 'Standard pricing table layout'
      },
      variant_a: {
        weight: 50,
        description: 'Comparison-focused layout with ROI calculator'
      }
    },
    isActive: true,
    startDate: '2025-07-10'
  },
  {
    name: 'blog_cta_placement',
    variants: {
      control: {
        weight: 33,
        description: 'CTA at end of article only'
      },
      variant_a: {
        weight: 33,
        description: 'CTA at middle and end of article'
      },
      variant_b: {
        weight: 34,
        description: 'Floating CTA sidebar throughout article'
      }
    },
    isActive: true,
    startDate: '2025-07-10'
  },
  {
    name: 'contact_form_fields',
    variants: {
      control: {
        weight: 50,
        description: 'Standard contact form with 6 fields'
      },
      variant_a: {
        weight: 50,
        description: 'Simplified form with 3 essential fields'
      }
    },
    isActive: true,
    startDate: '2025-07-10'
  },
  {
    name: 'erp_comparison_format',
    variants: {
      control: {
        weight: 50,
        description: 'Traditional comparison table'
      },
      variant_a: {
        weight: 50,
        description: 'Interactive comparison tool with filters'
      }
    },
    isActive: true,
    startDate: '2025-07-10'
  }
];

// Helper functions defined at module level
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

const getUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

const isTestDateValid = (test: ABTestConfig): boolean => {
  const now = new Date();
  const startDate = new Date(test.startDate);
  const endDate = test.endDate ? new Date(test.endDate) : null;

  return now >= startDate && (!endDate || now <= endDate);
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const selectVariant = (test: ABTestConfig, userId: string): string => {
  // Use consistent hash-based assignment for stable user experience
  const hash = hashString(userId + test.name);
  const random = (hash % 100) + 1;
  
  let cumulativeWeight = 0;
  for (const [variantName, variant] of Object.entries(test.variants)) {
    cumulativeWeight += variant.weight;
    if (random <= cumulativeWeight) {
      return variantName;
    }
  }
  
  // Fallback to first variant
  return Object.keys(test.variants)[0];
};

// A/B Testing Provider Component
export const ABTestProvider: React.FC<{ children: React.ReactNode; tests?: ABTestConfig[] }> = ({ 
  children, 
  tests = DEFAULT_AB_TESTS 
}) => {
  const [userVariants, setUserVariants] = useState<{ [testName: string]: string }>({});
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Initialize user variants for active tests
    const initializeVariants = () => {
      const variants: { [testName: string]: string } = {};
      const userId = getUserId();

      tests.forEach(test => {
        if (test.isActive && isTestDateValid(test)) {
          const existingVariant = localStorage.getItem(`ab_test_${test.name}`);
          
          if (existingVariant && test.variants[existingVariant]) {
            variants[test.name] = existingVariant;
          } else {
            const selectedVariant = selectVariant(test, userId);
            variants[test.name] = selectedVariant;
            localStorage.setItem(`ab_test_${test.name}`, selectedVariant);
            
            // Track test participation
            trackEvent('ab_test_participation', { test: test.name, variant: selectedVariant });
          }
        }
      });

      setUserVariants(variants);
    };

    initializeVariants();
  }, [tests]);

  const getVariant = (testName: string): string => {
    return userVariants[testName] || 'control';
  };

  const trackConversion = (testName: string, conversionType: string, value?: number) => {
    const variant = getVariant(testName);
    const userId = getUserId();

    // Track conversion
    trackEvent('ab_test_conversion', { test: testName, variant, type: conversionType });
  };

  const isTestActive = (testName: string): boolean => {
    const test = tests.find(t => t.name === testName);
    return test ? test.isActive && isTestDateValid(test) : false;
  };

  const contextValue: ABTestContextType = {
    getVariant,
    trackConversion,
    isTestActive
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
};

// Hook for using A/B testing
export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

// Component for conditional rendering based on A/B test variant
export const ABTestVariant: React.FC<{
  testName: string;
  variant: string;
  children: React.ReactNode;
}> = ({ testName, variant, children }) => {
  const { getVariant } = useABTest();
  const currentVariant = getVariant(testName);

  return currentVariant === variant ? <>{children}</> : null;
};

// Component for A/B testing CTA buttons
export const ABTestCTA: React.FC<{
  testName: string;
  variants: {
    [key: string]: {
      text: string;
      style?: string;
      onClick?: () => void;
    };
  };
  conversionType: string;
  className?: string;
}> = ({ testName, variants, conversionType, className = '' }) => {
  const { getVariant, trackConversion } = useABTest();
  const currentVariant = getVariant(testName);
  const variantConfig = variants[currentVariant] || variants.control;

  const handleClick = () => {
    trackConversion(testName, conversionType);
    if (variantConfig.onClick) {
      variantConfig.onClick();
    }
  };

  return (
    <button
      className={`${className} ${variantConfig.style || ''}`}
      onClick={handleClick}
    >
      {variantConfig.text}
    </button>
  );
};

// Component for A/B testing form layouts
export const ABTestForm: React.FC<{
  testName: string;
  variants: {
    [key: string]: {
      fields: Array<{
        name: string;
        type: string;
        label: string;
        required?: boolean;
        placeholder?: string;
      }>;
      submitText: string;
      layout?: string;
    };
  };
  onSubmit: (data: Record<string, unknown>, variant: string) => void;
  className?: string;
}> = ({ testName, variants, onSubmit, className = '' }) => {
  const { getVariant, trackConversion } = useABTest();
  const currentVariant = getVariant(testName);
  const variantConfig = variants[currentVariant] || variants.control;
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion(testName, 'form_submission');
    onSubmit(formData, currentVariant);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} ${variantConfig.layout || ''}`}>
      {variantConfig.fields.map(field => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {variantConfig.submitText}
      </button>
    </form>
  );
};

// Hook for A/B testing analytics and reporting
export const useABTestAnalytics = () => {
  const { trackEvent } = useAnalytics();

  const getTestResults = async (testName: string, dateRange?: { start: string; end: string }) => {
    // This would typically integrate with your analytics platform
    // For now, we'll return a mock structure
    return {
      testName,
      dateRange,
      variants: {
        control: {
          participants: 1250,
          conversions: 87,
          conversionRate: 6.96,
          confidence: 95
        },
        variant_a: {
          participants: 1180,
          conversions: 102,
          conversionRate: 8.64,
          confidence: 95
        }
      },
      conversions: 189,
      views: 2430,
      conversionRate: 7.78,
      winner: 'variant_a',
      improvement: 24.1,
      significance: 0.02
    };
  };

  const exportTestData = (testName: string, format: 'csv' | 'json' = 'csv') => {
    // Track export
    trackEvent('ab_test_export', { test: testName, format });
    
    // Implementation would export actual test data
    import('@/utils/logger').then(({ logger }) => {
      logger.info(`Exporting ${testName} data in ${format} format`);
    });
  };

  return {
    getTestResults,
    exportTestData
  };
};

// Component for A/B test management dashboard
export const ABTestDashboard: React.FC = () => {
  const { getTestResults } = useABTestAnalytics();
  const [testResults, setTestResults] = useState<Array<{
    testName: string;
    variants: Record<string, unknown>;
    conversions: number;
    views: number;
    conversionRate: number;
    winner?: string;
    improvement?: number;
  }>>([]);

  useEffect(() => {
    // Load test results for active tests
    const loadTestResults = async () => {
      const results = await Promise.all(
        DEFAULT_AB_TESTS.filter(test => test.isActive).map(test => 
          getTestResults(test.name)
        )
      );
      setTestResults(results);
    };

    loadTestResults();
  }, [getTestResults]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">A/B Test Dashboard</h2>
      
      {testResults.map(result => (
        <div key={result.testName} className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{result.testName}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result.variants).map(([variantName, data]: [string, { conversions: number; participants: number; conversionRate: number }]) => (
              <div key={variantName} className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium text-gray-900">{variantName}</h4>
                <p className="text-sm text-gray-600">
                  {data.conversions} / {data.participants} conversions
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  {data.conversionRate}% conversion rate
                </p>
              </div>
            ))}
          </div>
          
          {result.winner && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">
                <strong>Winner:</strong> {result.winner} 
                <span className="ml-2">({result.improvement}% improvement)</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ABTestProvider;
