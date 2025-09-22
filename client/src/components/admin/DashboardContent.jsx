import React from 'react';
import { ShoppingBag, DollarSign, Users, Package } from 'lucide-react';

function StatCard({ icon: Icon, title, value, change, changeType }) {
  const changeColorClass = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">{value}</h2>
        <p className={`text-sm mt-1 ${changeColorClass}`}>
          {changeType === 'increase' ? '+' : '-'}{change}% so với tháng trước
        </p>
      </div>
      <div className="p-3 bg-blue-100 rounded-full text-blue-600">
        <Icon size={24} />
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={ShoppingBag}
          title="Tổng đơn hàng"
          value="1,234"
          change={12}
          changeType="increase"
        />
        <StatCard
          icon={DollarSign}
          title="Tổng doanh thu"
          value="56,789,000 VND"
          change={8}
          changeType="increase"
        />
        <StatCard
          icon={Users}
          title="Khách hàng mới"
          value="250"
          change={5}
          changeType="increase"
        />
        <StatCard
          icon={Package}
          title="Sản phẩm tồn kho"
          value="3,456"
          change={2}
          changeType="decrease"
        />
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center text-gray-500">
        <p>Biểu đồ và bảng sẽ ở đây...</p>
      </div>
    </div>
  );
}

export default DashboardContent;
