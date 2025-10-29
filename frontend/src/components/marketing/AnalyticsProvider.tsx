import { useEffect } from 'react'

const GA_SCRIPT_ID = 'ga4-script'
const GA_CONFIG_ID = 'ga4-config'
const HOTJAR_SCRIPT_ID = 'hotjar-script'

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
  }
}

export const AnalyticsProvider: React.FC = () => {
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

  return null
}

