import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const usePageAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }

    if (typeof window.hj === 'function') {
      window.hj('stateChange', location.pathname + location.search)
    }
  }, [location])
}

export default usePageAnalytics
