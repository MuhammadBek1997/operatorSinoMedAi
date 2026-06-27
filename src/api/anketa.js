import api from './axios'

export const getAnketas = (params = {}) =>
  api.get('/anketa/admin', { params })

export const assignDoctor = (anketaId, doctorId) =>
  api.patch(`/anketa/admin/${anketaId}/assign/${doctorId}`)
