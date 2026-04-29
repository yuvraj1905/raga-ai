import { useState } from 'react'
import { Bell, BellOff, CheckCircle, Plus, AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { useNotifications } from '@/shared/hooks/useNotifications'

export function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const { permission, requestPermission, notifyNewPatient, notifyCritical } = useNotifications()

  return (
    <>
      <Button variant="outline" size="sm" icon={<Bell size={15} />} onClick={() => setOpen(true)}>
        Notifications
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Push Notifications" size="sm">
        <div className="flex flex-col gap-4">
          {/* Permission status */}
          <div className={`flex items-center gap-3 rounded-lg p-3 ${
            permission === 'granted' ? 'bg-emerald-50' : 'bg-amber-50'
          }`}>
            {permission === 'granted' ? (
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <BellOff size={18} className="text-amber-600 shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-800">
                {permission === 'granted' ? 'Notifications enabled' :
                 permission === 'denied' ? 'Notifications blocked' :
                 permission === 'unsupported' ? 'Not supported in this browser' :
                 'Notifications not enabled'}
              </p>
              <p className="text-xs text-slate-500">
                {permission === 'granted'
                  ? 'You will receive real-time alerts.'
                  : 'Click below to enable alerts.'}
              </p>
            </div>
          </div>

          {permission !== 'granted' && permission !== 'unsupported' && (
            <Button onClick={requestPermission} icon={<Bell size={15} />} className="w-full">
              Enable Notifications
            </Button>
          )}

          {/* Test notifications */}
          {permission === 'granted' && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
                Test Notifications
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  icon={<Plus size={15} />}
                  onClick={() => notifyNewPatient('John Doe')}
                  className="w-full justify-start"
                >
                  Simulate: New Patient Added
                </Button>
                <Button
                  variant="outline"
                  icon={<AlertTriangle size={15} />}
                  onClick={() => notifyCritical('Robert Tanaka')}
                  className="w-full justify-start text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Simulate: Critical Alert
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
