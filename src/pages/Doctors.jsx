import { useState, useEffect } from 'react'
import { getDoctors, createDoctor, deleteDoctor } from '../api/doctors'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import {
  Plus, Stethoscope, Mail, Phone,
  Trash2, Search, Eye, EyeOff
} from 'lucide-react'

const emptyForm = {
  full_name: '', username: '', specialization: '', email: '', phone: '', password: ''
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, doctor: null })
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await getDoctors()
      const data = Array.isArray(res.data) ? res.data : []
      setDoctors(data)
      setFiltered(data)
    } catch {
      toast.error('Doktorlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      doctors.filter(
        (d) =>
          d.full_name?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.email?.toLowerCase().includes(q)
      )
    )
  }, [search, doctors])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createDoctor(form)
      toast.success('Doktor muvaffaqiyatli qo\'shildi!')
      setAddModal(false)
      setForm(emptyForm)
      fetchDoctors()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Qo\'shishda xatolik')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteDoctor(deleteModal.doctor.id)
      toast.success('Doktor o\'chirildi')
      setDeleteModal({ open: false, doctor: null })
      fetchDoctors()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'O\'chirishda xatolik')
    } finally {
      setDeleting(false)
    }
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Doktorlar</h1>
            <p className="text-sage-500 mt-1 text-sm">{doctors.length} ta doktor ro'yxatda</p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setAddModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium shadow-lg shadow-sage-600/20"
          >
            <Plus className="w-4 h-4" />
            Doktor qo'shish
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
          <input
            type="text"
            placeholder="Ism, mutaxassislik yoki email bo'yicha qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-7 h-7 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">
                {search ? 'Doktor topilmadi' : 'Doktorlar yo\'q'}
              </h3>
              <p className="text-sage-500 text-sm">
                {search ? 'Boshqa kalit so\'z bilan qidiring' : 'Hali birorta doktor qo\'shilmagan'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Doktor</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Mutaxassislik</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Aloqa</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {filtered.map((doc, i) => (
                    <tr key={doc.id} className="hover:bg-sage-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-sage-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-sage-600 text-sm">
                            {doc.full_name?.charAt(0)?.toUpperCase() || 'D'}
                          </div>
                          <span className="font-medium text-sage-900 text-sm">{doc.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sage-50 text-sage-700 text-xs font-medium">
                          {doc.specialization || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-sage-600">
                            <Mail className="w-3.5 h-3.5 text-sage-400" />
                            {doc.email}
                          </div>
                          {doc.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-sage-600">
                              <Phone className="w-3.5 h-3.5 text-sage-400" />
                              {doc.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteModal({ open: true, doctor: doc })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => !saving && setAddModal(false)} title="Yangi doktor qo'shish">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">To'liq ism *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => update('full_name', e.target.value)}
              placeholder="Ism Familiya"
              required
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Username *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              placeholder="doktor_username"
              required
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Mutaxassislik *</label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) => update('specialization', e.target.value)}
              placeholder="Masalan: Kardiolog"
              required
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Telefon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+998901234567"
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Parol *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Kamida 6 ta belgi"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAddModal(false)}
              disabled={saving}
              className="flex-1 py-3 border border-sage-200 rounded-xl text-sage-700 font-medium hover:bg-sage-50 disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => !deleting && setDeleteModal({ open: false, doctor: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Doktorni o'chirish"
        message={`"${deleteModal.doctor?.full_name}" doktorni o'chirishni tasdiqlaysizmi?`}
      />
    </Layout>
  )
}
