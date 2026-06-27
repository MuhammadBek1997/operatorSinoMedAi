import axios from 'axios'

const api = axios.create({
  baseURL: 'https://aidiagnostikapi.sangilov.uz',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('operator_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('operator_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
