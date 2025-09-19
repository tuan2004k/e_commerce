import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import HomePage from '../pages/HomePage';
import { useAuth } from '../hook/useAuth';

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
      <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
      <a href="/" className="text-blue-500 hover:underline">Go to Home</a>
    </div>
  </div>
);

const AppRouter = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Root Route Redirection */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role?.toLowerCase() === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <HomePage />
          )
        }
      />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
