import { Navigate, Route, Routes } from 'react-router-dom'
import CafesPage from './pages/CafesPage'
import EmployeesPage from './pages/EmployeesPage'
import CafeCreatePage from './pages/CafeCreatePage'
import CafeEditPage from './pages/CafeEditPage'
import EmployeeCreatePage from './pages/EmployeeCreatePage'
import EmployeeEditPage from './pages/EmployeeEditPage'
import AppLayout from './layout/AppLayout'

function AppShell() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/cafes" replace />} />
        <Route path="cafes" element={<CafesPage />} />
        <Route path="cafes/new" element={<CafeCreatePage />} />
        <Route path="cafes/edit/:cafeId" element={<CafeEditPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/new" element={<EmployeeCreatePage />} />
        <Route path="employees/edit/:employeeId" element={<EmployeeEditPage />} />
        <Route path="*" element={<Navigate to="/cafes" replace />} />
      </Route>
    </Routes>
  )
}

export default AppShell
