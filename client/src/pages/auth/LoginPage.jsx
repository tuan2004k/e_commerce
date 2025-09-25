import LoginForm from '../../components/auth/LoginForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import RegisterForm from '../../components/auth/RegisterForm'; // Import RegisterForm
import { useState } from 'react';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', or 'forgotPassword'

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return <LoginForm toggleForm={toggleForm} />;
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