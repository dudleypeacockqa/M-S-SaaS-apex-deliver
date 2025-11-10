/**
 * CreateDealModal Component
 *
 * Modal dialog for creating and editing deals
 * Supports full validation and both create/update modes
 */

import React, { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Deal, DealCreate, DealUpdate, DealStage } from '@/services/api/deals'
import { useCreateDeal, useUpdateDeal } from '@/hooks/deals'
import { cn } from '@/styles/design-tokens'

export interface CreateDealModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onCreate?: (data: DealCreate) => void
  onUpdate?: (dealId: string, data: DealUpdate) => void
  deal?: Deal | null
}

const PIPELINE_STAGES: Array<{ value: DealStage; label: string }> = [
  { value: 'sourcing', label: 'Sourcing' },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'due_diligence', label: 'Due Diligence' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closing', label: 'Closing' },
]

const CURRENCIES = [
  { value: 'GBP', label: '£ GBP' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
]

interface FormData {
  name: string
  target_company: string
  industry: string
  deal_size: string
  currency: string
  stage: DealStage
  description: string
}

interface FormErrors {
  name?: string
  target_company?: string
  deal_size?: string
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onCreate,
  onUpdate,
  deal,
}) => {
  const isEditMode = !!deal
  const createDeal = useCreateDeal()
  const updateDeal = useUpdateDeal()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    target_company: '',
    industry: '',
    deal_size: '',
    currency: 'GBP',
    stage: 'sourcing',
    description: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Reset form when modal opens/closes or deal changes
  useEffect(() => {
    if (isOpen && deal) {
      setFormData({
        name: deal.name,
        target_company: deal.target_company,
        industry: deal.industry || '',
        deal_size: deal.deal_size?.toString() || '',
        currency: deal.currency,
        stage: deal.stage,
        description: deal.description || '',
      })
    } else if (isOpen && !deal) {
      setFormData({
        name: '',
        target_company: '',
        industry: '',
        deal_size: '',
        currency: 'GBP',
        stage: 'sourcing',
        description: '',
      })
    }
    setErrors({})
    setTouched(new Set())
  }, [isOpen, deal])

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstInput = document.querySelector<HTMLInputElement>('[name="name"]')
        firstInput?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle Escape key globally
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required'
    }

    if (!formData.target_company.trim()) {
      newErrors.target_company = 'Target company is required'
    }

    if (formData.deal_size && parseFloat(formData.deal_size) < 0) {
      newErrors.deal_size = 'Deal size must be positive'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Mark field as touched
    setTouched(prev => new Set(prev).add(name))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched(prev => new Set(prev).add(name))

    // Validate deal_size specifically for negative values
    if (name === 'deal_size' && value && parseFloat(value) < 0) {
      setErrors(prev => ({ ...prev, deal_size: 'Deal size must be positive' }))
    } else if (name === 'deal_size') {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.deal_size
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched before validation
    setTouched(new Set(['name', 'target_company', 'deal_size']))

    if (!validate()) {
      return
    }

    const dealData: DealCreate = {
      name: formData.name.trim(),
      target_company: formData.target_company.trim(),
      industry: formData.industry.trim() || undefined,
      deal_size: formData.deal_size ? parseFloat(formData.deal_size) : undefined,
      currency: formData.currency,
      stage: formData.stage,
      description: formData.description.trim() || undefined,
    }

    try {
      if (isEditMode && deal) {
        if (onUpdate) {
          onUpdate(deal.id, dealData)
        } else {
          await updateDeal.mutateAsync({ dealId: deal.id, data: dealData })
        }
      } else {
        if (onCreate) {
          onCreate(dealData)
        } else {
          await createDeal.mutateAsync(dealData)
        }
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to save deal:', error)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  const isPending = createDeal.isPending || updateDeal.isPending

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Deal' : 'Create New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Deal Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Deal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-label="Deal name"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.name && touched.has('name') ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="e.g., Acme Corp Acquisition"
            />
            {errors.name && touched.has('name') && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Target Company */}
          <div>
            <label htmlFor="target_company" className="block text-sm font-medium text-gray-700 mb-1">
              Target Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="target_company"
              name="target_company"
              value={formData.target_company}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-label="Target company"
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.target_company && touched.has('target_company') ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="e.g., Acme Corporation Ltd"
            />
            {errors.target_company && touched.has('target_company') && (
              <p className="mt-1 text-sm text-red-600">{errors.target_company}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              aria-label="Industry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Technology, Healthcare, Finance"
            />
          </div>

          {/* Deal Size and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="deal_size" className="block text-sm font-medium text-gray-700 mb-1">
                Deal Size
              </label>
              <input
                type="number"
                id="deal_size"
                name="deal_size"
                value={formData.deal_size}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-label="Deal size"
                className={cn(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.deal_size && touched.has('deal_size') ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="1000000"
                step="1000"
                min="0"
              />
              {errors.deal_size && touched.has('deal_size') && (
                <p className="mt-1 text-sm text-red-600">{errors.deal_size}</p>
              )}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                aria-label="Currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              id="stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              aria-label="Stage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PIPELINE_STAGES.map(stage => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              aria-label="Description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes or context about this deal..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2',
                isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
