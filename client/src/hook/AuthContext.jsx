import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/auth';
import API from '../api/api'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role?.toLowerCase() === 'admin'; 

  useEffect(() => {
    if (token) {
      const fetchUserProfile = async () => {
        try {
          // Đảm bảo token được đính kèm trong header
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await getProfile();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          logout();
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, error: error.response?.data?.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      return { success: false, error: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
