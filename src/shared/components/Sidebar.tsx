import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Heart,
  Bell,
  Settings,
} from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDemoStore } from '@/features/auth/store/demoStore'
import { Avatar } from '@/shared/components/ui/Avatar'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { isDemoUser, setDemoUser } = useDemoStore()

  async function handleLogout() {
    setDemoUser(false)
    if (user) await logout()
    navigate('/login')
  }

  const displayName = isDemoUser ? 'Demo User' : (user?.displayName ?? user?.email?.split('@')[0] ?? 'User')

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
          <Heart size={16} className="text-white" strokeWidth={2.5} fill="white" />
        </div>
        <span className="font-bold text-slate-900 text-lg tracking-tight">Raga-ai</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-0.5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left cursor-pointer">
          <Bell size={18} />
          Notifications
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors w-full text-left cursor-pointer">
          <Settings size={18} />
          Settings
        </button>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-3 px-2">
          <Avatar name={displayName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{isDemoUser ? 'demo@raga-ai.app' : user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
            aria-label="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
