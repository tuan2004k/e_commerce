import React from 'react';
import { Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react';

function NotificationDropdown({ showNotifications, setShowNotifications }) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
      >
        <Bell className="text-white" size={20} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          5
        </span>
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                <p className="text-sm text-gray-800">Thông báo #{i}</p>
                <p className="text-xs text-gray-500">{i} phút trước</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserProfileDropdown({ user, showDropdown, setShowDropdown, setIsProfileModalOpen, handleLogout }) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
          ) : (
            <User className="text-white" size={16} />
          )}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-white font-semibold text-sm">{user?.name || 'Admin User'}</span>
          <span className="text-gray-200 text-xs">{user?.email || 'admin@example.com'}</span>
        </div>
        <ChevronDown className="text-white hidden sm:block" size={16} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          <button
            onClick={() => {
              setIsProfileModalOpen(true);
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <User size={16} className="text-gray-600" />
            <span className="text-gray-700">Hồ sơ</span>
          </button>

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => {
                window.location.assign('/customer');
                setShowDropdown(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <User size={16} className="text-gray-600" />
              <span className="text-gray-700">Chuyển sang giao diện người dùng</span>
            </button>
          )}

          <button
            onClick={() => setShowDropdown(false)}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <Settings size={16} className="text-gray-600" />
            <span className="text-gray-700">Cài đặt</span>
          </button>

          <hr className="my-1" />

          <button
            onClick={() => {
              handleLogout();
              setShowDropdown(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors duration-200"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}

export { NotificationDropdown, UserProfileDropdown };
