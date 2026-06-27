import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClinicInfo from './pages/ClinicInfo'
import Doctors from './pages/Doctors'
import Nurses from './pages/Nurses'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import Screening from './pages/Screening'
import Assistants from './pages/Assistants'
import ProtectedRoute from './components/ProtectedRoute'

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '14px' },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/clinic" element={<Protected><ClinicInfo /></Protected>} />
        <Route path="/assistants" element={<Protected><Assistants /></Protected>} />
        <Route path="/doctors" element={<Protected><Doctors /></Protected>} />
        <Route path="/nurses" element={<Protected><Nurses /></Protected>} />
        <Route path="/patients" element={<Protected><Patients /></Protected>} />
        <Route path="/patients/:id" element={<Protected><PatientDetail /></Protected>} />
        <Route path="/screening" element={<Protected><Screening /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
