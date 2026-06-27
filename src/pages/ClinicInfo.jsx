import { useState, useEffect } from 'react'
import { getClinic, updateClinic } from '../api/clinic'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Building2, MapPin, Phone, Save, RefreshCw } from 'lucide-react'

function InputField({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-sage-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm bg-sage-50 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  )
}

export default function ClinicInfo() {
  const [clinic, setClinic] = useState(null)
  const [form, setForm] = useState({
    name: '', address: '', phone: '', latitude: '', longitude: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchClinic = async () => {
    setLoading(true)
    try {
      const res = await getClinic()
      const data = res.data
      setClinic(data)
      setForm({
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
      })
    } catch {
      toast.error('Klinika ma\'lumotlarini yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchClinic() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateClinic({
        name: form.name,
        address: form.address,
        phone: form.phone,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      })
      toast.success('Klinika ma\'lumotlari yangilandi!')
      fetchClinic()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Saqlashda xatolik')
    } finally {
      setSaving(false)
    }
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-sage-900">Klinika ma'lumotlari</h1>
            <p className="text-sage-500 mt-1 text-sm">Klinika haqida ma'lumotlarni tahrirlang</p>
          </div>
          <button
            onClick={fetchClinic}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-sage-200 rounded-xl text-sage-600 hover:bg-sage-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Yangilash
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-sage-100 bg-sage-50/50">
                <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-sage-900 text-sm">{clinic?.name}</h2>
                  <p className="text-xs text-sage-500">Asosiy ma'lumotlar</p>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Klinika nomi"
                    icon={Building2}
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Klinika nomi"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField
                    label="Manzil"
                    icon={MapPin}
                    type="text"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="To'liq manzil"
                    required
                  />
                </div>
                <InputField
                  label="Telefon raqami"
                  icon={Phone}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+998901234567"
                  required
                />
                <div />
                <InputField
                  label="Kenglik (Latitude)"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update('latitude', e.target.value)}
                  placeholder="41.2995"
                  required
                />
                <InputField
                  label="Uzunlik (Longitude)"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update('longitude', e.target.value)}
                  placeholder="69.2401"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-all disabled:opacity-50 shadow-lg shadow-sage-600/20"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}
