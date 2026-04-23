
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PortalLayout from './layouts/PortalLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import Clinical from './pages/admin/Clinical';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminPatients from './pages/admin/AdminPatients';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminPharmacy from './pages/admin/AdminPharmacy';

// Portal Pages
import Home from './pages/portal/Home';
import Login from './pages/portal/Login';
import Signup from './pages/portal/Signup';
import ForgotPassword from './pages/portal/ForgotPassword';
import DoctorSearch from './pages/portal/DoctorSearch';
import Appointments from './pages/portal/Appointments';
import Health from './pages/portal/Health';
import Billing from './pages/portal/Billing';
import Profile from './pages/portal/Profile';
import DoctorDetail from './pages/portal/DoctorDetail';

// Loading Component
const Loading = () => (
  <div className="flex-center" style={{ height: '100vh' }}>
    <Loader2 className="animate-spin" size={40} color="#0EA5E9" />
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="clinical" element={<Clinical />} />
            <Route path="pharmacy" element={<AdminPharmacy />} />
            <Route path="reports" element={<AdminDashboard />} />
          </Route>

          {/* Portal Routes */}
          <Route path="/" element={<PortalLayout />}>
            <Route index element={<Home />} />
            <Route path="doctors" element={<DoctorSearch />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="health" element={<Health />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
            <Route path="doctor/:id" element={<DoctorDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
