import { useEffect } from 'react'

interface StructuredDataProps {
  json: Record<string, unknown>
  id?: string
}

export const StructuredData: React.FC<StructuredDataProps> = ({ json, id = 'structured-data-general' }) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const existing = document.getElementById(id)
    const script = existing ?? document.createElement('script')

    script.type = 'application/ld+json'
    script.id = id
    script.text = JSON.stringify(json)

    if (!existing) {
      document.head.appendChild(script)
    }

    return () => {
      if (existing) {
        return
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [id, json])

  return null
}
