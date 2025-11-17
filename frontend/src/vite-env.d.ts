/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_CLARITY_PROJECT_ID?: string
  readonly VITE_HOTJAR_ID?: string
  readonly VITE_HOTJAR_VERSION?: string
  readonly VITE_LINKEDIN_PARTNER_ID?: string
  readonly VITE_APP_BUILD_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] }
  hj?: ((...args: unknown[]) => void) & { q?: unknown[][] }
  _hjSettings?: { hjid: number; hjsv: number }
  _linkedin_data_partner_ids?: string[]
  lintrk?: ((...args: unknown[]) => void) & { q?: unknown[][] }
}

declare const __APP_BUILD_ID__: string
