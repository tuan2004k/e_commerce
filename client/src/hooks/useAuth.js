import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authServices';

export const useAuth = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await register(data);
      setMessage(response.message || 'Đăng ký thành công!');
      // Điều hướng đến trang chính sau khi đăng ký thành công
      navigate('/login');
      return response;
    } catch (error) {
      setMessage(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await login(data);
      console.log('API Response:', response); 
      console.log('User Object:', response.user);
      setMessage(response.message || 'Đăng nhập thành công!');

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      // Kiểm tra vai trò và điều hướng
      const role = response.user?.role;
      
      if (role === 'CUSTOMER') {
        navigate('/customer');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } 

      return response;
    } catch (error) {
      setMessage(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { register: handleRegister, login: handleLogin, message, loading };
};