import { useEffect } from 'react'

const GA_SCRIPT_ID = 'ga4-script'
const GA_CONFIG_ID = 'ga4-config'
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

  // LinkedIn Insight Tag
  useEffect(() => {
    const linkedInPartnerId = import.meta.env.VITE_LINKEDIN_PARTNER_ID

    if (!linkedInPartnerId) {
      return
    }

    // Initialize partner IDs array
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(linkedInPartnerId)

    loadScriptOnce(LINKEDIN_SCRIPT_ID, () => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = `(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`
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

