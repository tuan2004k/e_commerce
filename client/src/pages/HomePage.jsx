import React from 'react';
import { useAuth } from '../hook/useAuth';

const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to E-commerce!</h1>
        {isAuthenticated ? (
          <p className="text-gray-600 mb-6">You are logged in as {user?.email} ({user?.role}).</p>
        ) : (
          <p className="text-gray-600 mb-6">Please login or register to continue.</p>
        )}
        <div className="flex flex-col gap-4">
          {!isAuthenticated && (
            <a
              href="/login"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </a>
          )}
          {!isAuthenticated && (
            <a
              href="/register"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Register
            </a>
          )}
          {isAuthenticated && user?.role?.toLowerCase() === 'customer' && (
            <a
              href="/dashboard"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Go to User Dashboard
            </a>
          )}
          {isAuthenticated && user?.role?.toLowerCase() === 'admin' && (
            <a
              href="/admin"
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Go to Admin Dashboard
            </a>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
