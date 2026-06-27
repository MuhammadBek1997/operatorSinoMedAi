import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClinic } from '../api/clinic'
import { getDoctors } from '../api/doctors'
import { getNurses } from '../api/nurses'
import { getPatients } from '../api/patients'
import { getAnketas } from '../api/anketa'
import Layout from '../components/Layout'
import useAuthStore from '../store/authStore'
import { Stethoscope, Heart, Users, FileBarChart2, Building2, MapPin, Phone, ArrowRight } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, to, navigate }) {
  return (
    <div
      onClick={() => navigate(to)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-sage-100 cursor-pointer hover:shadow-md hover:border-sage-200 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowRight className="w-4 h-4 text-sage-300 group-hover:text-sage-500 transition-colors" />
      </div>
      <div className="text-3xl font-bold text-sage-900 mb-0.5">
        {value === null ? <div className="w-8 h-7 bg-sage-100 rounded animate-pulse" /> : value}
      </div>
      <div className="text-sm text-sage-500">{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { setClinicLogo } = useAuthStore()
  const [clinic, setClinic] = useState(null)
  const [stats, setStats] = useState({ doctors: null, nurses: null, patients: null, anketas: null })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clinicRes, doctorsRes, nursesRes, patientsRes, anketasRes] = await Promise.allSettled([
          getClinic(), getDoctors(), getNurses(), getPatients(), getAnketas({ limit: 1 }),
        ])
        if (clinicRes.status === 'fulfilled') {
          setClinic(clinicRes.value.data)
          const logo = clinicRes.value.data?.logo || clinicRes.value.data?.logo_url
          if (logo) setClinicLogo(logo)
        }
        setStats({
          doctors: doctorsRes.status === 'fulfilled' ? (Array.isArray(doctorsRes.value.data) ? doctorsRes.value.data.length : 0) : 0,
          nurses: nursesRes.status === 'fulfilled' ? (Array.isArray(nursesRes.value.data) ? nursesRes.value.data.length : 0) : 0,
          patients: patientsRes.status === 'fulfilled' ? (Array.isArray(patientsRes.value.data) ? patientsRes.value.data.length : 0) : 0,
          anketas: anketasRes.status === 'fulfilled' ? (Array.isArray(anketasRes.value.data) ? anketasRes.value.data.length : 0) : 0,
        })
      } catch {}
    }
    fetchAll()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sage-900">Dashboard</h1>
          <p className="text-sage-500 mt-1 text-sm">Klinika boshqaruv paneli</p>
        </div>

        {clinic && (
          <div className="bg-gradient-to-r from-sage-700 to-sage-900 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-sage-900/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 opacity-70" />
                  <span className="text-sage-300 text-sm font-medium">Klinikam</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">{clinic.name}</h2>
                <div className="space-y-1">
                  {clinic.address && (
                    <div className="flex items-center gap-2 text-sage-300 text-sm">
                      <MapPin className="w-4 h-4" />
                      {clinic.address}
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center gap-2 text-sage-300 text-sm">
                      <Phone className="w-4 h-4" />
                      {clinic.phone}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/clinic')}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-all"
              >
                Tahrirlash
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Stethoscope} label="Doktorlar" value={stats.doctors} color="bg-sage-600" to="/doctors" navigate={navigate} />
          <StatCard icon={Heart} label="Hamshiralar" value={stats.nurses} color="bg-sage-500" to="/nurses" navigate={navigate} />
          <StatCard icon={Users} label="Bemorlar" value={stats.patients} color="bg-sage-700" to="/patients" navigate={navigate} />
          <StatCard icon={FileBarChart2} label="Scrining" value={stats.anketas} color="bg-sage-800" to="/screening" navigate={navigate} />
        </div>
      </div>
    </Layout>
  )
}
