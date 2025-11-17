import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const usePageAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const pagePath = location.pathname + location.search

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: document.title,
      })
    }

    if (typeof window.clarity === 'function') {
      window.clarity('set', 'page_path', pagePath)
      window.clarity('event', 'page_view', {
        page_path: pagePath,
        page_title: document.title,
      })
    } else if (typeof window.hj === 'function') {
      window.hj('stateChange', pagePath)
    }
  }, [location])
}

export default usePageAnalytics
