import api from '../config/api'; // Import instance axios đã cấu hình

export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng ký thất bại!' };
  }
};

export const login = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập thất bại!' };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const storedUser = localStorage.getItem('user'); // Retrieve user data
    return storedUser ? JSON.parse(storedUser) : response.data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    localStorage.removeItem('token'); 
    throw error.response?.data || { message: 'Không thể lấy thông tin người dùng!' };
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user data on logout
    // Optionally, call a backend logout endpoint if needed
    // await api.post('/auth/logout');
    return { message: 'Đăng xuất thành công!' };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error.response?.data || { message: 'Đăng xuất thất bại!' };
  }
};