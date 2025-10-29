'use strict'

const CACHE_NAME = 'apexdeliver-marketing-cache-v1'
const ASSETS = [
  '/',
  '/sitemap.xml',
  '/robots.txt'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return caches.open(CACHE_NAME).then((cache) =>
        fetch(event.request)
          .then((response) => {
            if (response.status === 200 && response.type === 'basic') {
              cache.put(event.request, response.clone())
            }
            return response
          })
          .catch(() => cachedResponse)
      )
    })
  )
})

