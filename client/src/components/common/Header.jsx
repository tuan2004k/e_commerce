import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getCurrentUser } from '../../services/authServices';
import { NotificationDropdown, UserProfileDropdown } from './Dropdowns';

function Header({ toggleSidebar, isSidebarOpen, collapsed, toggleCollapsed }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); 
    window.location.assign('/login');
  };

  const handleLogin = () => {
    window.location.assign('/login');
  };

  return (
    <div className={`bg-blue-800 shadow-md p-4 flex items-center justify-between z-50 fixed top-0 right-0 transition-all duration-300 ease-in-out left-0 md:${collapsed ? 'left-16' : 'left-64'}`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-white md:hidden p-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-white text-xl font-bold">Admin Panel</span>
        </div>
      </div>

      <div className="relative hidden md:flex flex-grow max-w-lg mx-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
      </div>

      <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationDropdown
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
              />
              <UserProfileDropdown
                user={user}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                setIsProfileModalOpen={setIsProfileModalOpen}
                handleLogout={handleLogout}
              />
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Đăng nhập
            </button>
          )}
        </div>
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hồ sơ người dùng</h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;