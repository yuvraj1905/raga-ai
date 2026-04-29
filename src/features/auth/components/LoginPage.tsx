import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Heart, AlertCircle } from 'lucide-react'
import { loginWithEmail } from '../services/firebase'
import { useDemoStore } from '../store/demoStore'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof schema>

// Demo credentials shown in UI
const DEMO = { email: 'demo@raga-ai.app', password: 'demo123' }

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const setDemoUser = useDemoStore((s) => s.setDemoUser)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  async function onSubmit(data: LoginForm) {
    setError(null)

    // Demo mode — skip Firebase entirely
    if (data.email === DEMO.email && data.password === DEMO.password) {
      setDemoUser(true)
      navigate('/dashboard')
      return
    }

    try {
      await loginWithEmail(data.email, data.password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else if (code === 'auth/configuration-not-found' || code === 'auth/invalid-api-key') {
        setError('Firebase is not configured. Use the demo credentials below.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  function fillDemo() {
    setValue('email', DEMO.email)
    setValue('password', DEMO.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-sky-500/25">
            <Heart size={22} className="text-white" fill="white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Raga-ai</h1>
          <p className="text-sm text-slate-500 mt-1">Healthcare Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to access the platform.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@hospital.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full" size="lg">
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-700 transition-colors">
              Sign up
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-2">Demo credentials for guest user to have a look to the app:</p>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="font-mono">{DEMO.email}</span> / <span className="font-mono">{DEMO.password}</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Raga-ai &middot; HIPAA Compliant
        </p>
      </div>
    </div>
  )
}
