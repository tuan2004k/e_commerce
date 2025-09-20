import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

const Header = () => {
  const { user, signOut } = useAuth(); // Changed logout to signOut

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/admin" className="text-xl font-bold mr-4">{APP_NAME} Admin</Link>
      </div>
      <nav>
        {user ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.name || user.email}!</span>
            <button
              onClick={signOut} // Changed logout to signOut
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
