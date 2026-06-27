import api from './axios'

export const getDoctors = () => api.get('/clinic-admin/doctors')

export const createDoctor = (data) => api.post('/clinic-admin/doctors', data)

export const deleteDoctor = (id) => api.delete(`/clinic-admin/doctors/${id}`)
