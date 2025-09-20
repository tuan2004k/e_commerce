import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path if necessary
import { ROLES } from '../../utils/constants'; // Assuming you have ROLES defined

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute Debug:', { isAuthenticated: !!user, user, loading, allowedRoles });

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Check if user is authenticated (user object exists)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has one of the allowed roles
  if (allowedRoles && !allowedRoles.map(role => role.toLowerCase()).includes(user?.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
