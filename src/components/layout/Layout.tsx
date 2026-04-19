import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LayoutDashboard, Calendar, BookOpen, Music, Settings,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../common/Button'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'navigation.home' },
  { path: '/planner', icon: Calendar, label: 'navigation.planner' },
  { path: '/reader', icon: BookOpen, label: 'navigation.reader' },
  { path: '/player', icon: Music, label: 'navigation.player' },
  { path: '/settings', icon: Settings, label: 'navigation.settings' },
]

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="font-semibold text-slate-100">DyPlanner</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center mx-auto">
              <span className="text-white font-bold">D</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  active ? "bg-sky-500/10 text-sky-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                  !sidebarOpen && "justify-center"
                )}
                title={t(item.label)}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{t(item.label)}</span>}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="font-semibold text-slate-100">DyPlanner</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-900 z-40 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    active ? "bg-sky-500/10 text-sky-400" : "text-slate-400 hover:bg-slate-800"
                  )}
                >
                  <Icon size={22} />
                  <span>{t(item.label)}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}