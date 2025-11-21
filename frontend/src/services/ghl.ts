import api from './api'
import type { ContactFormResponse } from './contactService'
import type { FormSubmissionResult } from '@/types/financeflo/api'

export type LeadFormData = Record<string, unknown>

const EMAIL_KEYS = ['email', 'workEmail', 'businessEmail', 'contactEmail'] as const
const COMPANY_KEYS = ['company', 'companyName', 'organization', 'orgName'] as const
const PHONE_KEYS = ['phone', 'phoneNumber', 'contactPhone'] as const

const extractString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim()
  }
  return undefined
}

const selectFirstAvailable = (keys: readonly string[], data: LeadFormData): string | undefined => {
  for (const key of keys) {
    const value = extractString(data[key])
    if (value) {
      return value
    }
  }
  return undefined
}

const buildLeadName = (data: LeadFormData): string => {
  const first = extractString(data.firstName || data.firstname)
  const last = extractString(data.lastName || data.lastname)
  const full = [first, last].filter(Boolean).join(' ').trim()
  if (full.length > 0) {
    return full
  }
  const fallback = extractString(data.name) || selectFirstAvailable(COMPANY_KEYS, data)
  return fallback ?? 'Website Lead'
}

const normalizeMessage = (formName: string, formData: LeadFormData): string => {
  const lines = Object.entries(formData)
    .filter(([, value]) => value !== undefined && value !== null && `${value}`.length > 0)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: ${value}`
      }
      try {
        return `${key}: ${JSON.stringify(value)}`
      } catch {
        return `${key}: ${String(value)}`
      }
    })

  const serialized = lines.join('\n')
  return [`Form: ${formName}`, serialized].filter(Boolean).join('\n')
}

const buildContactPayload = (formData: LeadFormData, formName: string) => {
  const email = selectFirstAvailable(EMAIL_KEYS, formData)
  if (!email) {
    throw new Error('Email is required for lead submission')
  }

  const company = selectFirstAvailable(COMPANY_KEYS, formData)
  const phone = selectFirstAvailable(PHONE_KEYS, formData)

  return {
    name: buildLeadName(formData),
    email,
    company,
    phone,
    message: normalizeMessage(formName, formData),
  }
}

const parseNumeric = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '')
    const parsed = Number.parseFloat(cleaned)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }
  return undefined
}

const calculateLeadScore = (formData: LeadFormData): number => {
  let score = 55

  const revenue = parseNumeric(formData.revenue ?? formData.annualRevenue ?? formData.arr)
  if (typeof revenue === 'number') {
    if (revenue >= 1_000_000) score += 25
    else if (revenue >= 250_000) score += 15
    else if (revenue >= 50_000) score += 5
  }

  const employees = parseNumeric(formData.employees ?? formData.headcount)
  if (typeof employees === 'number') {
    if (employees >= 200) score += 10
    else if (employees >= 50) score += 6
    else if (employees >= 10) score += 3
  }

  const urgency = extractString(formData.timeline || formData.urgency)
  if (urgency) {
    const normalized = urgency.toLowerCase()
    if (normalized.includes('immediate') || normalized.includes('30')) score += 10
    else if (normalized.includes('90') || normalized.includes('soon')) score += 5
  }

  const challenge = extractString(formData.mainChallenge ?? formData.pain_points)
  if (challenge) {
    score += 2
  }

  return Math.max(10, Math.min(100, Math.round(score)))
}

const deriveQualification = (leadScore: number): string => {
  if (leadScore >= 85) return 'qualified'
  if (leadScore >= 65) return 'review'
  return 'nurture'
}

const generateContactId = (id?: number) => {
  if (typeof id === 'number') {
    return `contact-${id}`
  }
  return `contact-${Date.now()}`
}

export const handleFormSubmission = async (
  formData: LeadFormData,
  formName = 'Website Lead',
): Promise<FormSubmissionResult> => {
  try {
    const contactPayload = buildContactPayload(formData, formName)
    const { data } = await api.post<ContactFormResponse>('/marketing/contact', contactPayload)

    const leadScore = calculateLeadScore(formData)
    return {
      success: data.success,
      message: data.message,
      contactId: generateContactId(data.id),
      leadScore,
      qualificationStatus: deriveQualification(leadScore),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed to submit lead to marketing contact endpoint', error)
    return {
      success: false,
      message: 'Failed to submit lead form. Please try again later.',
      error: message,
    }
  }
}

export const handleContactFormSubmissionAPI = async (formData: LeadFormData, formName = 'Contact Form') => {
  return handleFormSubmission(formData, formName)
}

