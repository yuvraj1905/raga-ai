import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: number
  className?: string
  label?: string
}

export function Spinner({ size = 20, className = '', label = 'Loading…' }: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-sky-500" />
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <Spinner size={28} />
    </div>
  )
}
