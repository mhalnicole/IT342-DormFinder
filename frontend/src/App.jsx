import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserProfile from './pages/UserProfile';
import Unauthorized from './pages/Unauthorized';
import StudentDashboard from './pages/student/StudentDashboard';
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function HomeRedirect() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0d14' }}>
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'LANDLORD') return <Navigate to="/landlord/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0d14', color: '#f8fafc' }}>
          <Navbar />
          <main className="flex-1" style={{ backgroundColor: '#0a0d14' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<UserProfile />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<RoleRoute allowedRoles={['LANDLORD']} />}>
                  <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
              </Route>

              <Route path="/" element={<HomeRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
