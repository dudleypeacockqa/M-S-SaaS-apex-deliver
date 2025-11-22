import { useEffect } from 'react'

const GA_SCRIPT_ID = 'ga4-script'
const GA_CONFIG_ID = 'ga4-config'
const GTM_SCRIPT_ID = 'gtm-script'
const HOTJAR_SCRIPT_ID = 'hotjar-script'
const LINKEDIN_SCRIPT_ID = 'linkedin-insight-tag'
const CLARITY_SCRIPT_ID = 'clarity-script'

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
    clarity?: (...args: unknown[]) => void
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

    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = []
    }

    if (typeof window.gtag !== 'function') {
      window.gtag = (...args: unknown[]) => {
        window.dataLayer?.push(args)
      }
    }

    window.gtag('js', new Date())
    window.gtag('config', measurementId, { anonymize_ip: true })

    loadScriptOnce(GA_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.setAttribute('data-analytics', 'ga4')
      return script
    })

    loadScriptOnce(GA_CONFIG_ID, () => {
      const script = document.createElement('script')
      script.setAttribute('data-analytics', 'ga4-config')
      script.innerHTML = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });`
      return script
    })
  }, [])

  useEffect(() => {
    const hotjarId = import.meta.env.VITE_HOTJAR_ID
    const hotjarVersion = import.meta.env.VITE_HOTJAR_VERSION

    if (!hotjarId || !hotjarVersion) {
      return
    }

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

    loadScriptOnce(HOTJAR_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.innerHTML = `window.hj=window.hj||function(){(hj.q=hj.q||[]).push(arguments)};
window._hjSettings={hjid:${hotjarId},hjsv:${hotjarVersion}};
(function(){
  const a=document.getElementsByTagName('head')[0];
  const b=document.createElement('script');
  b.async=1;
  b.src='https://static.hotjar.com/c/hotjar-'+window._hjSettings.hjid+'.js?sv='+window._hjSettings.hjsv;
  a.appendChild(b);
})();`
      return script
    })
  }, [])

  // Google Tag Manager
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID

    // Skip if no GTM ID or if it's the placeholder
    if (!gtmId || gtmId === 'GTM-XXXXXXX') {
      return
    }

    // Initialize dataLayer if it doesn't exist
    if (!Array.isArray(window.dataLayer)) {
      window.dataLayer = []
    }

    // Push GTM start event
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })

    loadScriptOnce(GTM_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
      script.setAttribute('data-analytics', 'gtm')
      return script
    })

    // Add noscript iframe for GTM
    if (typeof document !== 'undefined' && !document.getElementById('gtm-noscript')) {
      const noscript = document.createElement('noscript')
      noscript.id = 'gtm-noscript'
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      document.body.appendChild(noscript)
    }
  }, [])

  // Microsoft Clarity
  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID

    if (!clarityId) {
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
      script.defer = true
      script.src = `https://www.clarity.ms/tag/${clarityId}`
      script.setAttribute('data-analytics', 'clarity')
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

    if (typeof window.lintrk !== 'function') {
      type LintrkFn = ((...args: unknown[]) => void) & { q?: unknown[][] }
      const lintrk: LintrkFn = ((...args: unknown[]) => {
        lintrk.q = lintrk.q || []
        lintrk.q.push(args)
      }) as LintrkFn
      window.lintrk = lintrk
    }

    loadScriptOnce(LINKEDIN_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
      script.setAttribute('data-analytics', 'linkedin')
      return script
    })

    // Add noscript image tag for LinkedIn
    if (typeof document !== 'undefined' && !document.getElementById('linkedin-noscript')) {
      const noscript = document.createElement('noscript')
      noscript.id = 'linkedin-noscript'
      noscript.innerHTML = `<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${linkedInPartnerId}&fmt=gif" />`
      document.body.appendChild(noscript)
    }
  }, [])

  return <>{children}</>
}
