const CACHE_NAME = 'raga-ai-v1'
const STATIC_ASSETS = ['/', '/index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})

// Handles both our local format { title, body, tag, url }
// and FCM notification format { notification: { title, body }, data: { tag, url } }
self.addEventListener('push', (event) => {
  const raw = event.data?.json() ?? {}
  const title = raw.notification?.title ?? raw.title ?? 'Raga-ai'
  const body = raw.notification?.body ?? raw.body ?? 'New notification'
  const tag = raw.data?.tag ?? raw.tag ?? 'raga-ai-notification'
  const url = raw.data?.url ?? raw.url ?? '/'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag,
      data: url,
    })
  )
})

// Triggered by the app via reg.showNotification() directly — no postMessage needed.
// This handler is kept for any legacy postMessage callers.
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'SHOW_NOTIFICATION') return
  const { title = 'Raga-ai', body = '', tag } = event.data
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: tag ?? 'raga-ai-notification',
    data: '/',
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const url = event.notification.data ?? '/'
      const existing = clients.find((c) => c.url.includes(url) && 'focus' in c)
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})
