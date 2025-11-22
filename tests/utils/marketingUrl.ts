const DEFAULT_BASE_URL = process.env.MARKETING_BASE_URL ?? 'http://127.0.0.1:4173'
const DEFAULT_BRAND = process.env.PLAYWRIGHT_MARKETING_BRAND ?? 'apexdeliver'

export const buildMarketingUrl = (path: string): string => {
  const url = new URL(path, DEFAULT_BASE_URL)
  if (DEFAULT_BRAND && !url.searchParams.has('brand')) {
    url.searchParams.set('brand', DEFAULT_BRAND)
  }
  return url.toString()
}

