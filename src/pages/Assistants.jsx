import { useState, useEffect } from 'react'
import { getAssistants, createAssistant, deleteAssistant } from '../api/assistants'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import { Plus, ShieldCheck, Mail, Phone, Trash2, Eye, EyeOff } from 'lucide-react'

const emptyForm = { full_name: '', email: '', phone: '', password: '' }

export default function Assistants() {
  const [assistants, setAssistants] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModal, setAddModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, assistant: null })
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const fetchAssistants = async () => {
    setLoading(true)
    try {
      const res = await getAssistants()
      setAssistants(Array.isArray(res.data) ? res.data : [])
    } catch {
      toast.error('Yordamchi operatorlarni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssistants() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createAssistant(form)
      toast.success('Yordamchi operator qo\'shildi!')
      setAddModal(false)
      setForm(emptyForm)
      fetchAssistants()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Qo\'shishda xatolik')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteAssistant(deleteModal.assistant.id)
      toast.success('Yordamchi operator o\'chirildi')
      setDeleteModal({ open: false, assistant: null })
      fetchAssistants()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'O\'chirishda xatolik')
    } finally {
      setDeleting(false)
    }
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Yordamchi operatorlar</h1>
            <p className="text-sage-500 mt-1 text-sm">
              {assistants.length} ta yordamchi operator — klinika ma'lumotini o'zgartira olmaydi
            </p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setAddModal(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium shadow-lg shadow-sage-600/20"
          >
            <Plus className="w-4 h-4" />
            Yordamchi qo'shish
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : assistants.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-sage-400" />
              </div>
              <h3 className="text-sage-900 font-medium mb-1">Yordamchi operatorlar yo'q</h3>
              <p className="text-sage-500 text-sm mb-5">
                Hali birorta yordamchi operator qo'shilmagan
              </p>
              <button
                onClick={() => { setForm(emptyForm); setAddModal(true) }}
                className="px-4 py-2.5 bg-sage-600 text-white rounded-xl hover:bg-sage-700 text-sm font-medium"
              >
                Birinchi yordamchini qo'shing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sage-50 border-b border-sage-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Ism</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Aloqa</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Huquq</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-sage-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-50">
                  {assistants.map((ast, i) => (
                    <tr key={ast.id} className="hover:bg-sage-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-sage-400">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-orange-600 text-sm">
                            {ast.full_name?.charAt(0)?.toUpperCase() || 'Y'}
                          </div>
                          <span className="font-medium text-sage-900 text-sm">{ast.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-sage-600">
                            <Mail className="w-3.5 h-3.5 text-sage-400" />
                            {ast.email}
                          </div>
                          {ast.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-sage-600">
                              <Phone className="w-3.5 h-3.5 text-sage-400" />
                              {ast.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium">
                          Yordamchi operator
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteModal({ open: true, assistant: ast })}
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

      <Modal isOpen={addModal} onClose={() => !saving && setAddModal(false)} title="Yordamchi operator qo'shish">
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
        onClose={() => !deleting && setDeleteModal({ open: false, assistant: null })}
        onConfirm={handleDelete}
        loading={deleting}
        title="Yordamchi operatorni o'chirish"
        message={`"${deleteModal.assistant?.full_name}" ni o'chirishni tasdiqlaysizmi?`}
      />
    </Layout>
  )
}
