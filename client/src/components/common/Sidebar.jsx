import { useState } from 'react';
import { MenuItem } from './MenuItems';

function Sidebar({ isSidebarOpen, collapsed, toggleCollapsed, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState('/admin');
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleLogout = () => {
    window.location.assign('/login');
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  const menuItems = [
    {
      key: '0',
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      key: '1',
      label: 'Quản lý sản phẩm',
      children: [
        {
          key: '1-1',
          label: 'Sản phẩm',
          path: '/admin/products',
        },
        {
          key: '1-2',
          label: 'Danh mục',
          path: '/admin/categories',
        },
        {
          key: '1-3',
          label: 'Thương hiệu',
          path: '/admin/brands',
        },
      ],
    },
    {
      key: '2',
      label: 'Quản lý người dùng',
      path: '/admin/users',
    },
    {
      key: '3',
      label: 'Quản lý đơn hàng',
      path: '/admin/orders',
    },
    {
      key: '4',
      label: 'Quản lý khuyến mãi',
      path: '/admin/discounts',
    },
    {
      key: '5',
      label: 'Báo cáo & Thống kê',
      path: '/admin/analytics',
    },
  ];

  return (
    <>
      <div
        className={`bg-blue-800 text-white transition-all duration-300 fixed top-16 left-0 bottom-0 z-40 flex flex-col 
        ${isSidebarOpen ? 'block' : 'hidden'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-16' : 'w-64'}
        md:block md:translate-x-0
      `}
      >
        <div className="flex items-center justify-between p-2 order-b border-blue-800">
        </div>
        <nav className="mt-4 flex-grow">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.path;
              const isOpen = openSubmenu === item.key;
              return (
                <MenuItem
                  key={item.key}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  toggleSubmenu={toggleSubmenu}
                  isOpen={isOpen}
                  setActiveItem={setActiveItem}
                />
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto w-full">
          <button
            onClick={toggleCollapsed}
            className="w-full text-white p-4 rounded hover:bg-blue-700 transition-colors duration-200 md:hidden"
          >
            {collapsed ? (
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </button>
          <div className="hidden md:block p-0 mb-0">
            <button
              onClick={toggleCollapsed}
              className="w-full text-white p-4 rounded hover:bg-blue-700 transition-colors duration-200 md:hidden"
            >
              {collapsed ? (
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}

export default Sidebar;

