import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
} from 'firebase/auth'
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
  type MessagePayload,
} from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Messaging is initialized lazily so a missing/unsupported config never breaks auth exports.
let _messaging: Messaging | null = null
function getMessagingInstance(): Messaging | null {
  if (_messaging) return _messaging
  try {
    _messaging = getMessaging(app)
  } catch {
    // Messaging unsupported or Firebase project not configured for FCM
  }
  return _messaging
}

setPersistence(auth, browserLocalPersistence)

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  return result.user
}

/** Returns the FCM registration token. Requires notification permission + VAPID key in env. */
export async function subscribeFCM(swRegistration: ServiceWorkerRegistration): Promise<string | null> {
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
  const m = getMessagingInstance()
  if (!vapidKey || !m) return null
  try {
    return await getToken(m, { vapidKey, serviceWorkerRegistration: swRegistration })
  } catch {
    return null
  }
}

/** Listen for FCM messages while the app is in the foreground. Returns unsubscribe fn. */
export function onForegroundMessage(handler: (payload: MessagePayload) => void): () => void {
  const m = getMessagingInstance()
  if (!m) return () => {}
  return onMessage(m, handler)
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
