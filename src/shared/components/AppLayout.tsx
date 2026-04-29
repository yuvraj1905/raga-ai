import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0" id="main-content">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
