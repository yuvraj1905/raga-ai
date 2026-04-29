import { useEffect, useRef, useCallback } from 'react'
import { subscribeFCM, onForegroundMessage } from '@/features/auth/services/firebase'
import { useNotificationStore } from '@/shared/store/notificationStore'

export function useNotifications() {
  const permission = useNotificationStore((s) => s.permission)
  const setPermission = useNotificationStore((s) => s.setPermission)
  const fcmSubscribed = useRef(false)

  // Keep the store in sync if the user changes browser-level permission outside the app.
  useEffect(() => {
    if (!('permissions' in navigator)) return
    let status: PermissionStatus | null = null
    let onChange: (() => void) | null = null

    navigator.permissions.query({ name: 'notifications' as PermissionName }).then((ps) => {
      status = ps
      onChange = () => setPermission(ps.state as NotificationPermission)
      ps.addEventListener('change', onChange)
    })

    return () => {
      if (status && onChange) status.removeEventListener('change', onChange)
    }
  }, [setPermission])

  // Reliable notification dispatch — uses live Notification.permission (not stale state)
  const showNotification = useCallback(async (title: string, body: string, tag?: string) => {
    if (Notification.permission !== 'granted') return

    // Race serviceWorker.ready against a 3 s timeout — it never rejects on its own,
    // so without this it can hang silently if the SW failed to activate.
    const swReady = Promise.race<ServiceWorkerRegistration | null>([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ])

    const reg = await swReady
    if (reg) {
      try {
        await reg.showNotification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: tag ?? 'raga-ai',
          data: '/',
        })
        return
      } catch {
        // fall through to direct Notification
      }
    }
    // Fallback: direct Notification API (works without SW, e.g. localhost / file://)
    new Notification(title, { body, icon: '/favicon.svg', tag })
  }, [])

  // Subscribe to FCM exactly once when permission is granted.
  // Using a ref guard prevents double-subscription in React StrictMode dev.
  useEffect(() => {
    if (permission !== 'granted' || fcmSubscribed.current) return
    fcmSubscribed.current = true

    let unsubForeground: (() => void) | undefined

    navigator.serviceWorker.ready.then((reg) => {
      subscribeFCM(reg).catch(() => {/* FCM token is optional */})

      unsubForeground = onForegroundMessage((payload) => {
        showNotification(
          payload.notification?.title ?? 'Raga-ai',
          payload.notification?.body ?? '',
          'fcm-foreground',
        )
      })
    })

    return () => {
      unsubForeground?.()
      fcmSubscribed.current = false
    }
  }, [permission, showNotification])

  async function requestPermission() {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  function notifyNewPatient(name: string) {
    showNotification('New Patient Admitted', `${name} has been added to the system.`, 'new-patient')
  }

  function notifyCritical(name: string) {
    showNotification('Critical Alert', `${name} requires immediate attention.`, 'critical')
  }

  return { permission, requestPermission, showNotification, notifyNewPatient, notifyCritical }
}
