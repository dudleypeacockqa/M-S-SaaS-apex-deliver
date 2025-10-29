/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_HOTJAR_ID?: string
  readonly VITE_HOTJAR_VERSION?: string
  readonly VITE_LINKEDIN_PARTNER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

