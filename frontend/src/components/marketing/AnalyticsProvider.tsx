import { useEffect } from 'react'

const GA_SCRIPT_ID = 'ga4-script'
const HOTJAR_SCRIPT_ID = 'hotjar-script'
const LINKEDIN_SCRIPT_ID = 'linkedin-insight-tag'

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

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    hj?: (...args: unknown[]) => void
    _hjSettings?: { hjid: number; hjsv: number }
    _linkedin_data_partner_ids?: string[]
    lintrk?: (...args: unknown[]) => void
  }
}

interface AnalyticsProviderProps {
  children?: React.ReactNode
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

    if (!measurementId) {
      return
    }

    // Initialize dataLayer and gtag function (no inline scripts - CSP compliant)
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
    window.gtag('config', measurementId, { anonymize_ip: true })

    // Load external GA4 script
    loadScriptOnce(GA_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.setAttribute('data-analytics', 'ga4')
      return script
    })

    // Note: Removed inline GA_CONFIG script to comply with CSP
    // Configuration is now done via JavaScript above
  }, [])

  useEffect(() => {
    const hotjarId = import.meta.env.VITE_HOTJAR_ID
    const hotjarVersion = import.meta.env.VITE_HOTJAR_VERSION

    if (!hotjarId || !hotjarVersion) {
      return
    }

    // Initialize Hotjar queue function (CSP compliant - no inline scripts)
    if (typeof window.hj !== 'function') {
      type HjFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
      const hj: HjFn = ((...args: unknown[]) => {
        hj.q = hj.q || []
        hj.q.push(args)
      }) as HjFn
      window.hj = hj
    }

    window._hjSettings = {
      hjid: Number(hotjarId),
      hjsv: Number(hotjarVersion),
    }

    // Load Hotjar script externally (CSP compliant)
    loadScriptOnce(HOTJAR_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=${hotjarVersion}`
      script.setAttribute('data-analytics', 'hotjar')
      return script
    })
  }, [])

  // LinkedIn Insight Tag
  useEffect(() => {
    const linkedInPartnerId = import.meta.env.VITE_LINKEDIN_PARTNER_ID

    if (!linkedInPartnerId) {
      return
    }

    // Initialize partner IDs array
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(linkedInPartnerId)

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
    if (typeof document !== 'undefined' && !document.getElementById('linkedin-noscript')) {
      const noscript = document.createElement('noscript')
      noscript.id = 'linkedin-noscript'
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

