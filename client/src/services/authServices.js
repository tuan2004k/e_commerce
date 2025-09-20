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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Đăng nhập thất bại!' };
  }
};