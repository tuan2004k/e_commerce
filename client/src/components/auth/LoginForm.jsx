import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

function LoginForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, message, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
      {message && <p className="text-center text-sm text-red-500">{message}</p>}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="login-email"
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
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          id="login-password"
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
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
      <p className="text-center text-sm">
        Chưa có tài khoản?{' '}
        <a href="/register" onClick={(e) => { e.preventDefault(); toggleForm('register'); }} className="text-blue-600 hover:underline">
          Đăng ký
        </a>
      </p>
    </div>
  );
}

export default LoginForm;