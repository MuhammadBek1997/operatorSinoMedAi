import { useState, useEffect, useCallback } from 'react'
import { getAnketas, assignDoctor } from '../api/anketa'
import { getDoctors } from '../api/doctors'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'
import {
  FileBarChart2, Search, Filter,
  Stethoscope, Calendar, ChevronRight, UserCheck
} from 'lucide-react'

const STATUS_LABELS = {
  pending: { label: 'Kutilmoqda', color: 'bg-amber-50 text-amber-700' },
  assigned: { label: 'Biriktirilgan', color: 'bg-sage-50 text-sage-700' },
  completed: { label: 'Yakunlangan', color: 'bg-green-50 text-green-700' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_LABELS[status] || { label: status, color: 'bg-sage-50 text-sage-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

export default function Screening() {
  const [anketas, setAnketas] = useState([])
  const [filtered, setFiltered] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [assignModal, setAssignModal] = useState({ open: false, anketa: null })
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [assigning, setAssigning] = useState(false)

  const fetchAnketas = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      const res = await getAnketas(params)
      const data = Array.isArray(res.data) ? res.data : []
      setAnketas(data)
    } catch {
      toast.error('Scrining natijalarini yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchAnketas() }, [fetchAnketas])

  useEffect(() => {
    getDoctors()
      .then((res) => setDoctors(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      anketas.filter(
        (a) =>
          a.id?.toString().includes(q) ||
          a.patient?.full_name?.toLowerCase().includes(q) ||
          a.diagnosis?.toLowerCase().includes(q)
      )
    )
  }, [search, anketas])

  const handleAssign = async () => {
    if (!selectedDoctor) {
      toast.error('Doktorni tanlang')
      return
    }
    setAssigning(true)
    try {
      await assignDoctor(assignModal.anketa.id, selectedDoctor)
      toast.success('Doktor biriktirildi!')
      setAssignModal({ open: false, anketa: null })
      setSelectedDoctor('')
      fetchAnketas()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Biriktirishda xatolik')
    } finally {
      setAssigning(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Scrining natijalari</h1>
            <p className="text-sage-500 mt-1 text-sm">AI diagnostika natijalari</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
            <input
              type="text"
              placeholder="ID, bemor nomi yoki diagnoz bo'yicha qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-sage-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 appearance-none cursor-pointer"
            >
              <option value="">Barcha statuslar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="assigned">Biriktirilgan</option>
              <option value="completed">Yakunlangan</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileBarChart2 className="w-7 h-7 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">Natijalar topilmadi</h3>
              <p className="text-sage-500 text-sm">Hali scrining natijalari yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Bemor</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Diagnoz</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Sana</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {filtered.map((anketa) => (
                    <tr key={anketa.id} className="hover:bg-sage-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-sage-500">#{anketa.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-semibold text-xs">
                            {anketa.patient?.full_name?.charAt(0)?.toUpperCase() || 'B'}
                          </div>
                          <span className="text-sm font-medium text-sage-900">
                            {anketa.patient?.full_name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-sage-700">{anketa.diagnosis || anketa.grade_name || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={anketa.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-sage-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(anketa.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {anketa.status === 'pending' && (
                          <button
                            onClick={() => { setAssignModal({ open: true, anketa }); setSelectedDoctor('') }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 text-sage-700 hover:bg-sage-100 rounded-xl text-xs font-medium transition-all"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            Doktor biriktirish
                          </button>
                        )}
                        {anketa.status === 'assigned' && (
                          <div className="flex items-center justify-end gap-1.5 text-xs text-sage-500">
                            <UserCheck className="w-3.5 h-3.5" />
                            {anketa.doctor?.full_name || 'Biriktirilgan'}
                          </div>
                        )}
                        {anketa.status === 'completed' && (
                          <ChevronRight className="w-4 h-4 text-sage-300 ml-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Assign Doctor Modal */}
      <Modal
        isOpen={assignModal.open}
        onClose={() => !assigning && setAssignModal({ open: false, anketa: null })}
        title="Doktor biriktirish"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-amber-700">
              <span className="font-semibold">#{assignModal.anketa?.id}</span> raqamli scrining natijasiga doktor biriktirilmoqda
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Doktorni tanlang *</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <option value="">— Doktorni tanlang —</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.full_name} {doc.specialization ? `(${doc.specialization})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setAssignModal({ open: false, anketa: null })}
              disabled={assigning}
              className="flex-1 py-3 border border-sage-200 rounded-xl text-sage-700 font-medium hover:bg-sage-50 disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleAssign}
              disabled={assigning || !selectedDoctor}
              className="flex-1 py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {assigning && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {assigning ? 'Biriktirilmoqda...' : 'Biriktirish'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
