import api from './axios'

export const getNurses = () => api.get('/clinic-admin/nurses')

export const createNurse = (data) => api.post('/clinic-admin/nurses', data)

export const deleteNurse = (id) => api.delete(`/clinic-admin/nurses/${id}`)
