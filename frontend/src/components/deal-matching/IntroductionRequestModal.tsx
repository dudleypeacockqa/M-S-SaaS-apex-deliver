/**
 * IntroductionRequestModal Component
 * Form to request introduction for a matched deal
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordMatchAction } from '../../services/dealMatchingService';

export interface IntroductionRequestModalProps {
  matchId: string;
  dealName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  message: string;
  disclosure_level: 'full' | 'limited' | 'anonymous';
}

interface FormErrors {
  message?: string;
}

export const IntroductionRequestModal: React.FC<IntroductionRequestModalProps> = ({
  matchId,
  dealName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    message: '',
    disclosure_level: 'full',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const requestIntroMutation = useMutation({
    mutationFn: () => recordMatchAction(matchId, {
      action: 'request_intro',
      metadata: {
        message: formData.message,
        disclosure_level: formData.disclosure_level,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealMatches'] });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        message: '',
        disclosure_level: 'full',
      });
      setErrors({});
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    requestIntroMutation.mutate();
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
              Request Introduction
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Request an introduction to <span className="font-medium">{dealName}</span>
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
          {/* Introduction Message */}
          <div>
            <label htmlFor="intro-message" className="block text-sm font-medium text-gray-700 mb-1">
              Introduction Message *
            </label>
            <textarea
              id="intro-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explain why you believe there is a strong fit and what value you can bring to the introduction..."
            />
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              This message will be shared with the match owner to facilitate the introduction.
            </p>
          </div>

          {/* Disclosure Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disclosure Level *
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Choose how much information you want to share about your mandate
            </p>
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="radio"
                  name="disclosure_level"
                  value="full"
                  checked={formData.disclosure_level === 'full'}
                  onChange={(e) => setFormData({ ...formData, disclosure_level: 'full' })}
                  className="mr-3 mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Full Disclosure</span>
                  <p className="text-xs text-gray-600">
                    Share all deal details including company name, financials, and mandate parameters
                  </p>
                </div>
              </label>
              <label className="flex items-start">
                <input
                  type="radio"
                  name="disclosure_level"
                  value="limited"
                  checked={formData.disclosure_level === 'limited'}
                  onChange={(e) => setFormData({ ...formData, disclosure_level: 'limited' })}
                  className="mr-3 mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Limited Disclosure</span>
                  <p className="text-xs text-gray-600">
                    Share industry, size range, and general parameters without specific company details
                  </p>
                </div>
              </label>
              <label className="flex items-start">
                <input
                  type="radio"
                  name="disclosure_level"
                  value="anonymous"
                  checked={formData.disclosure_level === 'anonymous'}
                  onChange={(e) => setFormData({ ...formData, disclosure_level: 'anonymous' })}
                  className="mr-3 mt-1"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Anonymous</span>
                  <p className="text-xs text-gray-600">
                    Request introduction without revealing your mandate details initially
                  </p>
                </div>
              </label>
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
              disabled={requestIntroMutation.isPending}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {requestIntroMutation.isPending ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
