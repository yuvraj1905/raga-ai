import { create } from 'zustand'

type PermissionState = NotificationPermission | 'unsupported'

interface NotificationStore {
  permission: PermissionState
  setPermission: (p: PermissionState) => void
}

function readPermission(): PermissionState {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  permission: readPermission(),
  setPermission: (permission) => set({ permission }),
}))
