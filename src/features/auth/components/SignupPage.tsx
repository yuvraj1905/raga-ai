import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Heart, AlertCircle } from 'lucide-react'
import { registerWithEmail } from '../services/firebase'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupForm = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(schema) })

  async function onSubmit(data: SignupForm) {
    setError(null)
    try {
      await registerWithEmail(data.email, data.password, data.name)
      navigate('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger one.')
      } else if (code === 'auth/configuration-not-found' || code === 'auth/invalid-api-key') {
        setError('Firebase is not configured. Check your environment variables.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
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
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Create an account</h2>
          <p className="text-sm text-slate-500 mb-6">Fill in the details below to get started.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Dr. Yuvraj Kumar"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
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
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" loading={isSubmitting} className="mt-2 w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Raga-ai &middot; HIPAA Compliant
        </p>
      </div>
    </div>
  )
}
