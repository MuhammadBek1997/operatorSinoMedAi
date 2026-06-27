import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getClinic } from '../api/clinic'
import useAuthStore from '../store/authStore'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('op_sidebar_collapsed') === 'true'
  })
  const { clinicLogo, setClinicLogo } = useAuthStore()

  useEffect(() => {
    if (!clinicLogo) {
      getClinic()
        .then((res) => {
          const logo = res.data?.logo || res.data?.logo_url || null
          if (logo) setClinicLogo(logo)
        })
        .catch(() => {})
    }
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('op_sidebar_collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-sage-50">
      <Sidebar collapsed={collapsed} onToggle={toggle} clinicLogo={clinicLogo} />
      <main
        style={{
          marginLeft: collapsed ? '72px' : '260px',
          transition: 'margin-left 0.3s ease',
        }}
        className="flex-1 p-8 min-h-screen"
      >
        {children}
      </main>
    </div>
  )
}
