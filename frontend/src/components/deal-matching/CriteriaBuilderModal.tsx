/**
 * CriteriaBuilderModal Component
 * Form to create/edit matching criteria profiles with dynamic filters
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMatchCriteria,
  updateMatchCriteria,
  type MatchCriteria,
} from '../../services/dealMatchingService';

export interface CriteriaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (criteria: MatchCriteria) => void;
  initialCriteria?: MatchCriteria | null;
}

type CreateMatchCriteriaPayload = Parameters<typeof createMatchCriteria>[0];

type DealType = CreateMatchCriteriaPayload['deal_type'];

interface CustomField {
  id: string;
  key: string;
  value: string;
}

interface FormData {
  name: string;
  deal_type: DealType;
  industries: string[];
  min_deal_size: string;
  max_deal_size: string;
  geographies: string[];
  customFields: CustomField[];
}

interface FormErrors {
  name?: string;
  industries?: string;
  min_deal_size?: string;
  max_deal_size?: string;
  customFields?: string;
}

const GEOGRAPHY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'united_kingdom', label: 'United Kingdom' },
  { value: 'europe', label: 'Europe' },
  { value: 'united_states', label: 'United States' },
  { value: 'canada', label: 'Canada' },
  { value: 'asia_pacific', label: 'Asia Pacific' },
  { value: 'latin_america', label: 'Latin America' },
];

const DEFAULT_FORM_STATE: FormData = {
  name: '',
  deal_type: 'buy_side',
  industries: [],
  min_deal_size: '',
  max_deal_size: '',
  geographies: [],
  customFields: [],
};

const generateFieldId = () => `field-${Math.random().toString(36).slice(2, 9)}`;

const parseStructures = (structures?: string[]): CustomField[] => {
  if (!structures || structures.length === 0) {
    return [];
  }

  return structures.map((entry) => {
    const [rawKey = '', rawValue = ''] = entry.split('::');
    return {
      id: generateFieldId(),
      key: rawKey,
      value: rawValue,
    };
  });
};

const serialiseCustomFields = (fields: CustomField[]): string[] =>
  fields
    .filter((field) => field.key.trim() && field.value.trim())
    .map((field) => `${field.key.trim()}::${field.value.trim()}`);

export const CriteriaBuilderModal: React.FC<CriteriaBuilderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCriteria = null,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_STATE);
  const [industryInput, setIndustryInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialCriteria) {
      setFormData({
        name: initialCriteria.name ?? '',
        deal_type: initialCriteria.deal_type ?? 'buy_side',
        industries: [...(initialCriteria.industries ?? [])],
        min_deal_size: (initialCriteria.min_deal_size ?? '').toString(),
        max_deal_size: (initialCriteria.max_deal_size ?? '').toString(),
        geographies: [...(initialCriteria.geographies ?? [])],
        customFields: parseStructures(initialCriteria.structures),
      });
    } else {
      setFormData(DEFAULT_FORM_STATE);
    }

    setIndustryInput('');
    setErrors({});
  }, [isOpen, initialCriteria]);

  const hasCustomFields = useMemo(() => formData.customFields.length > 0, [formData.customFields]);

  const saveCriteriaMutation = useMutation({
    mutationFn: async (payload: { data: CreateMatchCriteriaPayload; id?: string }) => {
      if (payload.id) {
        return updateMatchCriteria(payload.id, payload.data);
      }

      return createMatchCriteria(payload.data);
    },
    onSuccess: (savedCriteria) => {
      queryClient.invalidateQueries({ queryKey: ['matchCriteria'] });
      onSuccess(savedCriteria);
      onClose();
      setFormData(DEFAULT_FORM_STATE);
      setIndustryInput('');
      setErrors({});
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Criteria name is required';
    }

    if (formData.industries.length === 0) {
      newErrors.industries = 'Add at least one industry';
    }

    const minSize = Number(formData.min_deal_size);
    const maxSize = Number(formData.max_deal_size);

    if (!formData.min_deal_size || Number.isNaN(minSize) || minSize <= 0) {
      newErrors.min_deal_size = 'Minimum deal size is required';
    }

    if (!formData.max_deal_size || Number.isNaN(maxSize) || maxSize <= 0) {
      newErrors.max_deal_size = 'Maximum deal size is required';
    }

    if (!newErrors.min_deal_size && !newErrors.max_deal_size && minSize >= maxSize) {
      newErrors.max_deal_size = 'Minimum must be less than maximum';
    }

    const incompleteField = formData.customFields.find(
      (field) => (field.key.trim() && !field.value.trim()) || (!field.key.trim() && field.value.trim()),
    );

    if (incompleteField) {
      newErrors.customFields = 'Custom fields require both a label and a value';
    }

    const duplicateKey = formData.customFields
      .map((field) => field.key.trim().toLowerCase())
      .filter((key) => key)
      .some((key, index, array) => array.indexOf(key) !== index);

    if (duplicateKey) {
      newErrors.customFields = 'Custom field labels must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateMatchCriteriaPayload = {
      name: formData.name.trim(),
      deal_type: formData.deal_type,
      industries: formData.industries.map((industry) => industry.trim().toLowerCase()),
      min_deal_size: formData.min_deal_size.trim(),
      max_deal_size: formData.max_deal_size.trim(),
      geographies: [...formData.geographies],
      structures: serialiseCustomFields(formData.customFields),
      negative_filters: {},
      weights: {},
    };

    saveCriteriaMutation.mutate({ data: payload, id: initialCriteria?.id });
  };

  const handleAddIndustry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && industryInput.trim()) {
      e.preventDefault();
      const value = industryInput.trim();
      const exists = formData.industries.some((industry) => industry.toLowerCase() === value.toLowerCase());

      if (!exists) {
        setFormData((previous) => ({
          ...previous,
          industries: [...previous.industries, value],
        }));
      }
      setIndustryInput('');
    }
  };

  const handleRemoveIndustry = (industry: string) => {
    setFormData((previous) => ({
      ...previous,
      industries: previous.industries.filter((value) => value !== industry),
    }));
  };

  const handleToggleGeography = (value: string) => {
    setFormData((previous) => {
      const exists = previous.geographies.includes(value);
      return {
        ...previous,
        geographies: exists
          ? previous.geographies.filter((geo) => geo !== value)
          : [...previous.geographies, value],
      };
    });
  };

  const handleAddCustomField = () => {
    setFormData((previous) => ({
      ...previous,
      customFields: [...previous.customFields, { id: generateFieldId(), key: '', value: '' }],
    }));
  };

  const handleUpdateCustomField = (id: string, key: 'key' | 'value', value: string) => {
    setFormData((previous) => ({
      ...previous,
      customFields: previous.customFields.map((field) =>
        field.id === id
          ? {
              ...field,
              [key]: value,
            }
          : field,
      ),
    }));
  };

  const handleRemoveCustomField = (id: string) => {
    setFormData((previous) => ({
      ...previous,
      customFields: previous.customFields.filter((field) => field.id !== id),
    }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const submitting = saveCriteriaMutation.isPending;
  const isEditing = Boolean(initialCriteria?.id);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="criteria-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="criteria-modal-title" className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Matching Criteria' : 'Create Matching Criteria'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Define and store reusable deal matching presets for your team
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Criteria Name */}
          <div>
            <label htmlFor="criteria-name" className="block text-sm font-medium text-gray-700 mb-1">
              Criteria Name *
            </label>
            <input
              id="criteria-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Tech Acquisitions Q4 2025"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Deal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deal_type"
                  value="buy_side"
                  checked={formData.deal_type === 'buy_side'}
                  onChange={() => setFormData({ ...formData, deal_type: 'buy_side' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Buy-Side (Looking to acquire)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deal_type"
                  value="sell_side"
                  checked={formData.deal_type === 'sell_side'}
                  onChange={() => setFormData({ ...formData, deal_type: 'sell_side' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sell-Side (Looking to sell)</span>
              </label>
            </div>
          </div>

          {/* Industries */}
          <div>
            <label htmlFor="industries-input" className="block text-sm font-medium text-gray-700 mb-1">
              Industries * (Press Enter to add)
            </label>
            <input
              id="industries-input"
              type="text"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
              onKeyDown={handleAddIndustry}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.industries ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., SaaS, FinTech, Healthcare"
            />
            {errors.industries && <p className="text-red-600 text-sm mt-1">{errors.industries}</p>}

            {formData.industries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2" data-testid="industry-tags">
                {formData.industries.map((industry) => (
                  <span
                    key={industry}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(industry)}
                      className="hover:text-indigo-900"
                      aria-label={`Remove ${industry}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Deal Size Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="min-deal-size" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Deal Size (£) *
              </label>
              <input
                id="min-deal-size"
                type="number"
                value={formData.min_deal_size}
                onChange={(e) => setFormData({ ...formData, min_deal_size: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.min_deal_size ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1000000"
                min="0"
              />
              {errors.min_deal_size && <p className="text-red-600 text-sm mt-1">{errors.min_deal_size}</p>}
            </div>

            <div>
              <label htmlFor="max-deal-size" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Deal Size (£) *
              </label>
              <input
                id="max-deal-size"
                type="number"
                value={formData.max_deal_size}
                onChange={(e) => setFormData({ ...formData, max_deal_size: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.max_deal_size ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10000000"
                min="0"
              />
              {errors.max_deal_size && <p className="text-red-600 text-sm mt-1">{errors.max_deal_size}</p>}
            </div>
          </div>

          {/* Geographies */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Target Geographies</span>
            <p className="text-xs text-gray-500 mb-3">
              Select the countries or regions where you want to focus your deal matching
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="geography-options">
              {GEOGRAPHY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:border-indigo-300"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={formData.geographies.includes(option.value)}
                    onChange={() => handleToggleGeography(option.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div>
            <div className="flex items-center justify-between">
              <span className="block text-sm font-medium text-gray-700">Custom Filters</span>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + Add custom field
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Capture niche qualifiers (e.g. integration requirements, deal structure preferences)
            </p>

            {hasCustomFields ? (
              <div className="space-y-3" data-testid="custom-fields">
                {formData.customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-[1fr,1fr,auto] items-center gap-2">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(event) => handleUpdateCustomField(field.id, 'key', event.target.value)}
                      placeholder="Label (e.g., Integration)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(event) => handleUpdateCustomField(field.id, 'value', event.target.value)}
                      placeholder="Value (e.g., Salesforce)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(field.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                      aria-label={`Remove ${field.key || 'custom'} field`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                Add bespoke qualifiers to sharpen matching accuracy.
              </div>
            )}
            {errors.customFields && <p className="text-red-600 text-sm mt-2">{errors.customFields}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save Criteria' : 'Create Criteria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
