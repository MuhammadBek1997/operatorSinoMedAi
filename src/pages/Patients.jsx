import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatients } from '../api/patients'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Users, Phone, Mail, Search, ChevronRight } from 'lucide-react'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const res = await getPatients()
      const data = Array.isArray(res.data) ? res.data : []
      setPatients(data)
      setFiltered(data)
    } catch {
      toast.error('Bemorlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      patients.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(q) ||
          p.phone?.includes(q) ||
          p.email?.toLowerCase().includes(q)
      )
    )
  }, [search, patients])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Bemorlar</h1>
            <p className="text-sage-500 mt-1 text-sm">{patients.length} ta bemor ro'yxatda</p>
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
          <input
            type="text"
            placeholder="Ism, telefon yoki email bo'yicha qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">
                {search ? 'Bemor topilmadi' : 'Bemorlar yo\'q'}
              </h3>
              <p className="text-sage-500 text-sm">
                {search ? 'Boshqa kalit so\'z bilan qidiring' : 'Hali birorta bemor ro\'yxatdan o\'tmagan'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Bemor</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Telefon</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Tug'ilgan sana</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {filtered.map((patient, i) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-sage-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/patients/${patient.id}`, { state: { patient } })}
                    >
                      <td className="px-6 py-4 text-sm text-sage-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-purple-600 text-sm">
                            {patient.full_name?.charAt(0)?.toUpperCase() || 'B'}
                          </div>
                          <span className="font-medium text-sage-900 text-sm">{patient.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-sage-700">
                          <Phone className="w-3.5 h-3.5 text-sage-400" />
                          {patient.phone || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-sage-600">
                          <Mail className="w-3.5 h-3.5 text-sage-400" />
                          {patient.email || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-sage-600">
                        {patient.date_of_birth
                          ? new Date(patient.date_of_birth).toLocaleDateString('uz-UZ')
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <ChevronRight className="w-5 h-5 text-sage-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
