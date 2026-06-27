import { useState, useEffect } from 'react'
import { getNurses, createNurse, deleteNurse } from '../api/nurses'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import { Plus, Heart, Mail, Phone, Trash2, Search, Eye, EyeOff, Copy, Check } from 'lucide-react'

const emptyForm = { full_name: '', email: '', phone: '', password: '' }

function ReferralBadge({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!code) return <span className="text-sage-400 text-xs">—</span>

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-mono font-bold tracking-wider">
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="text-sage-400 hover:text-sage-600 transition-colors"
        title="Nusxa olish"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  )
}

export default function Nurses() {
  const [nurses, setNurses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, nurse: null })
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const fetchNurses = async () => {
    setLoading(true)
    try {
      const res = await getNurses()
      const data = Array.isArray(res.data) ? res.data : []
      setNurses(data)
      setFiltered(data)
    } catch {
      toast.error('Hamshiralarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNurses() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      nurses.filter(
        (n) =>
          n.full_name?.toLowerCase().includes(q) ||
          n.email?.toLowerCase().includes(q) ||
          n.referral_code?.toLowerCase().includes(q)
      )
    )
  }, [search, nurses])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createNurse(form)
      toast.success('Hamshira muvaffaqiyatli qo\'shildi!')
      setAddModal(false)
      setForm(emptyForm)
      fetchNurses()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Qo\'shishda xatolik')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteNurse(deleteModal.nurse.id)
      toast.success('Hamshira o\'chirildi')
      setDeleteModal({ open: false, nurse: null })
      fetchNurses()
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
            <h1 className="text-2xl font-bold text-sage-900">Hamshiralar</h1>
            <p className="text-sage-500 mt-1 text-sm">{nurses.length} ta hamshira ro'yxatda</p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setAddModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium shadow-lg shadow-sage-600/20"
          >
            <Plus className="w-4 h-4" />
            Hamshira qo'shish
          </button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
          <input
            type="text"
            placeholder="Ism, email yoki referal kod bo'yicha qidiring..."
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
                <Heart className="w-7 h-7 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">
                {search ? 'Hamshira topilmadi' : 'Hamshiralar yo\'q'}
              </h3>
              <p className="text-sage-500 text-sm">
                {search ? 'Boshqa kalit so\'z bilan qidiring' : 'Hali birorta hamshira qo\'shilmagan'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Hamshira</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Aloqa</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Referal kod</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {filtered.map((nurse, i) => (
                    <tr key={nurse.id} className="hover:bg-sage-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-sage-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-pink-600 text-sm">
                            {nurse.full_name?.charAt(0)?.toUpperCase() || 'H'}
                          </div>
                          <span className="font-medium text-sage-900 text-sm">{nurse.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-sage-600">
                            <Mail className="w-3.5 h-3.5 text-sage-400" />
                            {nurse.email}
                          </div>
                          {nurse.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-sage-600">
                              <Phone className="w-3.5 h-3.5 text-sage-400" />
                              {nurse.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ReferralBadge code={nurse.referral_code} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteModal({ open: true, nurse })}
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

      <Modal isOpen={addModal} onClose={() => !saving && setAddModal(false)} title="Yangi hamshira qo'shish">
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
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-3 border border-sage-200 rounded-xl text-sm bg-sage-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Telefon *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+998901234567"
              required
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
            <p className="text-xs text-sage-400 mt-1">Referal kod tizim tomonidan avtomatik yaratiladi</p>
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
        onClose={() => !deleting && setDeleteModal({ open: false, nurse: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hamshirani o'chirish"
        message={`"${deleteModal.nurse?.full_name}" hamshirani o'chirishni tasdiqlaysizmi?`}
      />
    </Layout>
  )
}
