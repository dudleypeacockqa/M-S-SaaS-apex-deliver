import { useEffect } from 'react'

const GA_SCRIPT_ID = 'ga4-script'
const CLARITY_SCRIPT_ID = 'clarity-script'
const LINKEDIN_SCRIPT_ID = 'linkedin-insight-tag'
const LINKEDIN_NOSCRIPT_ID = 'linkedin-noscript'

const loadScriptOnce = (id: string, create: () => HTMLScriptElement) => {
  if (typeof document === 'undefined') {
    return
  }

  if (document.getElementById(id)) {
    return
  }

  const script = create()
  script.id = id
  document.head.appendChild(script)
}

interface AnalyticsProviderProps {
  children?: React.ReactNode
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId || measurementId.includes('PLACEHOLDER')) {
      return
    }

    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = []
    }

    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }

    // Configure GA4 via JavaScript (not inline script)
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    })

    // Load external GA4 script
    loadScriptOnce(GA_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.setAttribute('data-analytics', 'ga4')
      return script
    })

  }, [])

  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID
    if (!clarityId || clarityId.includes('PLACEHOLDER')) {
      return
    }

    if (typeof window.clarity !== 'function') {
      type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
      const clarity: ClarityFn = ((...args: unknown[]) => {
        clarity.q = clarity.q || []
        clarity.q.push(args)
      }) as ClarityFn
      window.clarity = clarity
    }

    loadScriptOnce(CLARITY_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.clarity.ms/tag/${clarityId}`
      script.setAttribute('data-analytics', 'clarity')
      return script
    })
  }, [])

  // LinkedIn Insight Tag
  useEffect(() => {
    const linkedInPartnerId = import.meta.env.VITE_LINKEDIN_PARTNER_ID

    if (!linkedInPartnerId || linkedInPartnerId.includes('PLACEHOLDER')) {
      return
    }

    // Initialize partner IDs array
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    if (!window._linkedin_data_partner_ids.includes(linkedInPartnerId)) {
      window._linkedin_data_partner_ids.push(linkedInPartnerId)
    }

    // Initialize LinkedIn tracking function (CSP compliant - no inline scripts)
    if (typeof window.lintrk !== 'function') {
      type LintrkFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
      const lintrk: LintrkFn = ((...args: unknown[]) => {
        lintrk.q = lintrk.q || []
        lintrk.q.push(args)
      }) as LintrkFn
      window.lintrk = lintrk
    }

    // Load LinkedIn script externally (CSP compliant)
    loadScriptOnce(LINKEDIN_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
      script.setAttribute('data-analytics', 'linkedin')
      return script
    })

    // Add noscript image tag for LinkedIn (noscript tags are CSP compliant)
    if (typeof document !== 'undefined' && !document.getElementById(LINKEDIN_NOSCRIPT_ID)) {
      const noscript = document.createElement('noscript')
      noscript.id = LINKEDIN_NOSCRIPT_ID
      const img = document.createElement('img')
      img.height = 1
      img.width = 1
      img.style.display = 'none'
      img.alt = ''
      img.src = `https://px.ads.linkedin.com/collect/?pid=${linkedInPartnerId}&fmt=gif`
      noscript.appendChild(img)
      document.body.appendChild(noscript)
    }
  }, [])

  return <>{children}</>
}
