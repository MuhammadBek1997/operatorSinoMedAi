import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      clinicLogo: null,
      setAuth: (token, email) => {
        localStorage.setItem('operator_token', token)
        set({ token, email })
      },
      setClinicLogo: (logo) => set({ clinicLogo: logo }),
      logout: () => {
        localStorage.removeItem('operator_token')
        set({ token: null, email: null, clinicLogo: null })
      },
    }),
    { name: 'operator-auth' }
  )
)

export default useAuthStore
