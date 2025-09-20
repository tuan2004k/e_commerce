import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function RegisterForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', // Đặt mặc định là CUSTOMER
  });
  const { register, message, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    if (!message.includes('thất bại')) {
      setTimeout(() => toggleForm('login'), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Đăng ký</h2>
      {message && <p className="text-center text-sm text-red-500">{message}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
        <input
          id="name"
          name="name"
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          id="register-password"
          name="password"
          type="password"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          placeholder="password123"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        {loading ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
      <p className="text-center text-sm">
        Đã có tài khoản?{' '}
        <a href="/login" onClick={() => toggleForm('login')} className="text-blue-600 hover:underline">
          Đăng nhập
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;