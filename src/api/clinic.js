import api from './axios'

export const getClinic = () => api.get('/clinic-admin/clinic')

export const updateClinic = (data) => api.patch('/clinic-admin/clinic', data)
