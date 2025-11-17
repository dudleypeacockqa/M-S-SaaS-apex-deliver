'use strict'

const buildVersion = (() => {
  try {
    const url = new URL(self.location.href)
    return url.searchParams.get('v') || '2'
  } catch {
    return '2'
  }
})()

const CACHE_VERSION = `v${buildVersion}`
const STATIC_CACHE = 'apexdeliver-static-' + CACHE_VERSION
const RUNTIME_CACHE = 'apexdeliver-runtime-' + CACHE_VERSION

const PRECACHE_ASSETS = [
  '/',
  '/pricing',
  '/features',
  '/about',
  '/contact',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/sitemap.xml',
  '/robots.txt',
  '/assets/brand/apexdeliver-wordmark.svg',
  '/assets/dashboard-preview.webp',
  '/assets/financial-analysis-visual.webp',
  '/assets/hero-background.webp',
  '/assets/pmi-integration-graphic.webp',
  '/assets/security-trust-visual.webp',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
]

const ASSET_PATTERN = /\.(?:js|css|webp|png|svg|ico|woff2?)$/i

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const cleanCaches = caches.keys().then((keys) =>
    Promise.all(
      keys
        .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
        .map((key) => caches.delete(key))
    )
  )

  const tasks = [cleanCaches, self.clients.claim()]

  if (self.registration.navigationPreload) {
    tasks.push(self.registration.navigationPreload.enable())
  }

  event.waitUntil(Promise.all(tasks))
})

const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(request)
  cache.put(request, response.clone())
  return response
}

const networkFirst = async (request, event) => {
  const cache = await caches.open(RUNTIME_CACHE)
  try {
    if (event && event.preloadResponse) {
      const preloadResponse = await event.preloadResponse
      if (preloadResponse) {
        cache.put(request, preloadResponse.clone())
        return preloadResponse
      }
    }

    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  let url
  try {
    url = new URL(request.url)
  } catch {
    return
  }

  const isSupportedProtocol = url.protocol === 'http:' || url.protocol === 'https:'
  const isSameOrigin = url.origin === self.location.origin

  if (!isSupportedProtocol || !isSameOrigin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, event).catch(async () => {
        const cache = await caches.open(STATIC_CACHE)
        return cache.match('/')
      })
    )
    return
  }

  if (ASSET_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(networkFirst(request, event))
})
