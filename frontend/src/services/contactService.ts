import api from './api'

export interface ContactFormPayload {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
  id?: number
}

export const submitContactForm = async (
  payload: ContactFormPayload,
): Promise<ContactFormResponse> => {
  const response = await api.post<ContactFormResponse>('/marketing/contact', payload)
  return response.data
}
