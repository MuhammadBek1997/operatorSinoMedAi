import api from './axios'

export const getPatients = () => api.get('/clinic-admin/patients')

export const getPatient = (id) => api.get(`/clinic-admin/patients/${id}`)
