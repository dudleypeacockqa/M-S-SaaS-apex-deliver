type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

const emitGtagEvent = (event: string, params: AnalyticsEventParams) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}

const emitHotjarEvent = (event: string, params: AnalyticsEventParams) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.hj === 'function') {
    window.hj('event', `${event}:${JSON.stringify(params)}`)
  }
}

export const trackMarketingEvent = (event: string, params: AnalyticsEventParams = {}) => {
  emitGtagEvent(event, params)
  emitHotjarEvent(event, params)
}

export const trackCtaClick = (ctaName: string, location: string) => {
  trackMarketingEvent('marketing_cta_click', {
    cta_name: ctaName,
    location,
    timestamp: Date.now()
  })
}

export const trackFormSubmission = (formName: string, location: string) => {
  trackMarketingEvent('marketing_form_submission', {
    form_name: formName,
    location,
    timestamp: Date.now()
  })
}

