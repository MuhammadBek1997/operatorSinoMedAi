import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Stethoscope, Heart, Users,
  FileBarChart2, ShieldCheck, LogOut,
  PanelLeftClose, PanelLeft, ChevronsUpDown, ChevronDown
} from 'lucide-react'
import useAuthStore from '../store/authStore'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clinic', icon: Building2, label: 'Klinika' },
  { to: '/assistants', icon: ShieldCheck, label: 'Yordamchi operatorlar' },
  { to: '/doctors', icon: Stethoscope, label: 'Doktorlar' },
  { to: '/nurses', icon: Heart, label: 'Hamshiralar' },
  { to: '/patients', icon: Users, label: 'Bemorlar' },
  { to: '/screening', icon: FileBarChart2, label: 'Scrining natijalari' },
]

export default function Sidebar({ collapsed, onToggle, clinicLogo }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, email, clinicLogo: storedLogo } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const logo = clinicLogo || storedLogo || '/sinomed-logo.png'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <aside
      style={{ width: collapsed ? '72px' : '260px', transition: 'width 0.3s ease' }}
      className="bg-sage-900 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30 overflow-hidden"
    >
      {/* Header */}
      <div className={`flex items-center px-4 py-4 border-b border-sage-800 ${collapsed ? 'flex-col gap-3' : 'justify-between'}`}>
        {collapsed ? (
          <>
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 rounded-xl object-contain bg-white/10 p-1"
              onError={(e) => { e.target.src = '/sinomed-logo.png' }}
            />
            <button
              onClick={onToggle}
              className="text-sage-400 hover:text-white p-1.5 rounded-lg hover:bg-sage-800 transition-colors"
              title="Kengaytirish"
            >
              <PanelLeft size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={logo}
                alt="Logo"
                className="w-8 h-8 rounded-xl object-contain bg-white/10 p-1 flex-shrink-0"
                onError={(e) => { e.target.src = '/sinomed-logo.png' }}
              />
              <div className="min-w-0">
                <div className="text-white font-bold text-sm tracking-wide">SinomedAI</div>
                <div className="text-sage-400 text-xs">Operator Panel</div>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="text-sage-400 hover:text-white p-1.5 rounded-lg hover:bg-sage-800 transition-colors flex-shrink-0"
              title="Yig'ish"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
              collapsed ? 'justify-center' : ''
            } ${
              isActive(to)
                ? 'bg-sage-600 text-white shadow-lg shadow-sage-600/30'
                : 'text-sage-400 hover:bg-sage-800 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sage-800 relative">
        {showUserMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-sage-800 rounded-xl border border-sage-700 shadow-xl overflow-hidden">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-red-400 hover:bg-red-600/10 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && 'Chiqish'}
            </button>
          </div>
        )}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          title={collapsed ? (email || 'Operator') : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-sage-800 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 bg-sage-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
            {email?.charAt(0)?.toUpperCase() || 'O'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sage-400 text-xs truncate">{email || 'Operator'}</div>
              </div>
              {showUserMenu
                ? <ChevronDown size={14} className="text-sage-400 flex-shrink-0" />
                : <ChevronsUpDown size={14} className="text-sage-400 flex-shrink-0" />
              }
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
