import api from './api'

export interface NewsletterSubscriptionPayload {
  email: string
  source?: string
}

export interface NewsletterSubscriptionResponse {
  success: boolean
  message: string
}

export const subscribeToNewsletter = async (
  payload: NewsletterSubscriptionPayload,
): Promise<NewsletterSubscriptionResponse> => {
  const response = await api.post<NewsletterSubscriptionResponse>('/marketing/subscribe', {
    ...payload,
  })
  return response.data
}
