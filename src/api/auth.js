import api from './axios'

export const login = (username, password) =>
  api.post('/auth/clinic-admin/login', { username, password })
