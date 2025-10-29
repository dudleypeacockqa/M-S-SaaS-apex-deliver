/**
 * CriteriaBuilderModal Component
 * Form to create/edit matching criteria profiles
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMatchCriteria } from '../../services/dealMatchingService';

export interface CriteriaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CreateMatchCriteriaPayload = Parameters<typeof createMatchCriteria>[0]

type DealType = CreateMatchCriteriaPayload['deal_type']

interface FormData {
  name: string;
  deal_type: DealType;
  industries: string[];
  min_deal_size: string;
  max_deal_size: string;
  geographies: string[];
  structures: string[];
}

interface FormErrors {
  name?: string;
  industries?: string;
  min_deal_size?: string;
  max_deal_size?: string;
}

export const CriteriaBuilderModal: React.FC<CriteriaBuilderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    deal_type: 'buy_side',
    industries: [],
    min_deal_size: '',
    max_deal_size: '',
    geographies: [],
    structures: [],
  });

  const [industryInput, setIndustryInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useMutation({
    mutationFn: async (payload: CreateMatchCriteriaPayload) => createMatchCriteria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matchCriteria'] });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: '',
        deal_type: 'buy_side',
        industries: [],
        min_deal_size: '',
        max_deal_size: '',
        geographies: [],
        structures: [],
      });
      setErrors({});
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Criteria name is required';
    }

    if (formData.industries.length === 0) {
      newErrors.industries = 'At least one industry is required';
    }

    const minSize = parseFloat(formData.min_deal_size);
    const maxSize = parseFloat(formData.max_deal_size);

    if (!formData.min_deal_size || isNaN(minSize)) {
      newErrors.min_deal_size = 'Minimum deal size is required';
    }

    if (!formData.max_deal_size || isNaN(maxSize)) {
      newErrors.max_deal_size = 'Maximum deal size is required';
    }

    if (minSize && maxSize && minSize >= maxSize) {
      newErrors.max_deal_size = 'Minimum must be less than maximum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createMutation.mutate({
      name: formData.name,
      deal_type: formData.deal_type,
      industries: formData.industries.map((industry) => industry.toLowerCase()),
      min_deal_size: formData.min_deal_size || '0',
      max_deal_size: formData.max_deal_size || '0',
      geographies: formData.geographies,
      structures: formData.structures,
    });
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
    setFormData({
      ...formData,
      industries: formData.industries.filter((i) => i !== industry),
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

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
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              Create Matching Criteria
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Define your ideal deal profile for intelligent matching
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

            {/* Industry Tags */}
            {formData.industries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
          <div className="grid grid-cols-2 gap-4">
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
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Criteria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
