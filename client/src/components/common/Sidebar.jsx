import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-700 text-white p-4 space-y-2">
      <h2 className="text-2xl font-bold mb-4">Admin Menu</h2>
      <nav>
        <ul>
          <li>
            <Link to="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">
              Products
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-600">
              Users
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
