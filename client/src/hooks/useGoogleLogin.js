import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../services/authServices';

export function useGoogleLogin() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credential) => {
    try {
      const response = await googleLogin(credential);
      const role = response.user?.role;
      if (role === 'CUSTOMER') {
        navigate('/customer');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Google login failed on backend:", error);
    }
  };

  return { handleGoogleLogin };
}