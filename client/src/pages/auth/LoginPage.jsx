import LoginForm from '../../components/auth/LoginForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import RegisterForm from '../../components/auth/RegisterForm';
import GoogleLoginButton from '../../components/auth/ButtonGoogle'; // Thêm dòng này
import { useState } from 'react';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return (
          <>
            <LoginForm toggleForm={toggleForm} />
            <div className="my-4 text-center">
              <GoogleLoginButton /> {/* Thêm nút đăng nhập Google */}
            </div>
          </>
        );
      case 'register':
        return <RegisterForm toggleForm={toggleForm} />;
      case 'forgotPassword':
        return <ForgotPasswordForm toggleForm={toggleForm} />;
      default:
        return <LoginForm toggleForm={toggleForm} />;
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {renderForm()}
      </div>
    </div>
  );
}

export default LoginPage;