import LoginForm from '../../components/auth/LoginForm';

function LoginPage() {
  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;