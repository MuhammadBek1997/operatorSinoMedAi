import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { getPatient } from '../api/patients'
import Layout from '../components/Layout'
import {
  ChevronLeft, User, Phone, Mail, Calendar, FileBarChart2
} from 'lucide-react'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-sage-500" />
      </div>
      <div>
        <p className="text-xs text-sage-400 mb-0.5">{label}</p>
        <p className="font-medium text-sage-900 text-sm">{value}</p>
      </div>
    </div>
  )
}

export default function PatientDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(location.state?.patient || null)
  const [loading, setLoading] = useState(!location.state?.patient)

  useEffect(() => {
    if (!location.state?.patient) {
      setLoading(true)
      getPatient(id)
        .then((res) => setPatient(res.data))
        .catch(() => navigate('/patients'))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!patient) return null

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-sage-500 hover:text-sage-800 mb-6 text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Bemorlar ro'yxatiga qaytish
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sage-900">Bemor tafsilotlari</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {patient.full_name?.charAt(0)?.toUpperCase() || 'B'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{patient.full_name}</h2>
                <p className="text-purple-200 text-sm mt-0.5">#{patient.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <InfoRow icon={User} label="To'liq ism" value={patient.full_name} />
            <InfoRow icon={Phone} label="Telefon raqami" value={patient.phone} />
            <InfoRow icon={Mail} label="Email manzil" value={patient.email} />
            <InfoRow
              icon={Calendar}
              label="Tug'ilgan sana"
              value={
                patient.date_of_birth
                  ? new Date(patient.date_of_birth).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : null
              }
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/screening')}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-sage-200 text-sage-700 rounded-xl font-medium hover:bg-sage-50 transition-all text-sm"
          >
            <FileBarChart2 className="w-4 h-4" />
            Scrining natijalari
          </button>
        </div>
      </div>
    </Layout>
  )
}
