export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

const emitGtagEvent = (event: string, params: AnalyticsEventParams) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}

const emitBehaviorEvent = (event: string, params: AnalyticsEventParams) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.clarity === 'function') {
    window.clarity('event', event, params)
    return
  }

  if (typeof window.hj === 'function') {
    window.hj('event', `${event}:${JSON.stringify(params)}`)
  }
}

const emitLinkedInEvent = (conversionId?: number) => {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.lintrk === 'function') {
    if (conversionId) {
      window.lintrk('track', { conversion_id: conversionId })
    } else {
      window.lintrk('track', {})
    }
  }
}

const emitGTMEvent = (event: string, params: AnalyticsEventParams) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    ...params,
  })
}

export const trackMarketingEvent = (
  event: string,
  params: AnalyticsEventParams = {}
) => {
  emitGtagEvent(event, params)
  emitBehaviorEvent(event, params)
  emitGTMEvent(event, params)
  emitLinkedInEvent()
}

export const trackCtaClick = (ctaName: string, location: string) => {
  trackMarketingEvent('marketing_cta_click', {
    cta_name: ctaName,
    location,
    timestamp: Date.now(),
  })
}

export const trackFormSubmission = (formName: string, location: string) => {
  trackMarketingEvent('marketing_form_submission', {
    form_name: formName,
    location,
    timestamp: Date.now(),
  })
}

export const Events = {
  HeroBookClick: 'hero_book_click',
  HeroCalcClick: 'hero_calc_click',
  DemoBooked: 'demo_booked',
  CalculatorView: 'calculator_view',
  CalcSubmitted: 'calculator_submit',
  BookRequested: 'book_requested',
  DownloadInitiated: 'download_initiated',
  LeadCaptured: 'lead_captured',
  LeadCaptureModalOpened: 'lead_capture_modal_opened',
  LeadCapturedSuccess: 'lead_captured_success',
  LeadCaptureError: 'lead_capture_error',
  ThankYouPageViewed: 'thank_you_page_viewed',
  PdfDownloadClicked: 'pdf_download_clicked',
} as const

export const track = (event: string, params: AnalyticsEventParams = {}) => {
  trackMarketingEvent(event, params)
}

export const trackCalculatorView = () => {
  track(Events.CalculatorView, {
    timestamp: Date.now(),
    source: 'calculator_surface',
  })
}
