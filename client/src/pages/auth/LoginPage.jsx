import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import RegisterForm from '../../components/auth/RegisterForm';
import GoogleLoginButton from '../../components/auth/ButtonGoogle';
import { motion, AnimatePresence } from 'framer-motion';

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
              <GoogleLoginButton />
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
    <div className="min-h-screen flex overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentForm === 'login' && (
          <>
            {/* Ảnh bên phải */}
            <motion.div
              key="image-login"
              className="hidden lg:flex absolute right-0 top-0 w-1/2 h-screen items-center justify-center bg-white z-10"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/thoitrangnam.jpg"
                alt="Login illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              key="form-login"
              className="absolute left-0 top-0 w-1/2 h-screen flex items-center justify-center bg-gray-50 p-8 z-20"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  {renderForm()}
                </div>
              </div>
            </motion.div>
          </>
        )}
        {currentForm === 'register' && (
          <>
            <motion.div
              key="image-register"
              className="hidden lg:flex absolute left-0 top-0 w-1/2 h-screen items-center justify-center bg-white z-10"
              initial={{ x: window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/thoitrangnam.jpg"
                alt="Login illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              key="form-register"
              className="absolute right-0 top-0 w-1/2 h-screen flex items-center justify-center bg-gray-50 p-8 z-20"
              initial={{ x: -window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  {renderForm()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;