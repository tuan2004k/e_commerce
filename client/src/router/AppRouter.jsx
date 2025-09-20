import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
// import ProtectedRoute from '../components/auth/Protect'; // Comment out ProtectedRoute

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/customer" element={<CustomerDashboard />} />
    </Routes>
  );
}

export default AppRouter;