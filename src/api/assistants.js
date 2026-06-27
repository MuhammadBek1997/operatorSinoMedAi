import api from './axios'

export const getAssistants = () => api.get('/clinic-admin/assistants')

export const createAssistant = (data) => api.post('/clinic-admin/assistants', data)

export const deleteAssistant = (id) => api.delete(`/clinic-admin/assistants/${id}`)
