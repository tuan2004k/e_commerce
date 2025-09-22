import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import DashboardContent from '../../components/admin/DashboardContent';
import { Routes, Route } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import BrandManagement from './BrandManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import DiscountManagement from './DiscountManagement';
import AnalyticsPage from './AnalyticsPage';

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div className={`flex-1 flex flex-col mt-16 transition-all duration-300 ease-in-out md:${collapsed ? 'ml-16' : 'ml-64'}`}>
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardContent />} /> 
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="brands" element={<BrandManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="discounts" element={<DiscountManagement />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;