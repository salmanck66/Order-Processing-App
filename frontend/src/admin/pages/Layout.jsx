import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { UserOutlined, DashboardOutlined, ShoppingCartOutlined, AppstoreAddOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('dashboard'); // default selected item

  return (
    <>
      <div className="relative md:flex  h-screen ">
        {/* Sidebar Toggle Button */}
        <div className="lg:hidden items-center justify-between px-3  flex h-fit ">
        <button
          aria-label="Toggle Menu"
          className="lg:hidden p-4 h-fit    m-2 rounded-lg "
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>
        <Avatar
        src='data:image/jpeg;base64,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'
        />
        </div>

        {/* Sidebar */}
        <nav
          className={`fixed top-0 left-0 h-full z-50 bg-blue-900 text-white w-64 p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:flex lg:flex-col lg:w-64`}
        >
          <div className="text-xl font-bold mb-4   ">EduDash</div>
          <img src="data:image/jpeg;base64,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" alt=""
          className='rounded-full size-40  mx-auto'
          />

<ul className="flex flex-col my-4 bg-gray-800 rounded-lg shadow-lg">
  <Link 
    to="/admin/" 
    className={`flex items-center px-4 py-2 space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200 cursor-pointer 
    ${selectedItem === 'dashboard' ? 'bg-gray-700 border rounded-lg' : ''}`} 
    onClick={() => setSelectedItem('dashboard')}
  >
    <li className="flex items-center space-x-3">
      <DashboardOutlined />
      <span className="font-semibold">Home</span>
    </li>
  </Link>

  <Link 
    to="/admin/orders" 
    className={`flex items-center px-4 py-2 space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200 cursor-pointer 
    ${selectedItem === 'orders' ? 'bg-gray-700 border rounded-lg' : ''}`} 
    onClick={() => setSelectedItem('orders')}
  >
    <li className="flex items-center space-x-3">
      <ShoppingCartOutlined />
      <span className="font-semibold">Orders</span>
    </li>
  </Link>

  <Link 
    to="/admin/products" 
    className={`flex items-center px-4 py-2 space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200 cursor-pointer 
    ${selectedItem === 'products' ? 'bg-gray-700 border rounded-lg' : ''}`} 
    onClick={() => setSelectedItem('products')}
  >
    <li className="flex items-center space-x-3">
      <AppstoreAddOutlined />
      <span className="font-semibold">Products</span>
    </li>
  </Link>

  <Link 
    to="/admin/account" 
    className={`flex items-center px-4 py-2 space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200 cursor-pointer 
    ${selectedItem === 'accounts' ? 'bg-gray-700 border rounded-lg' : ''}`} 
    onClick={() => setSelectedItem('accounts')}
  >
    <li className="flex items-center space-x-3">
      <UserOutlined />
      <span className="font-semibold">Accounts</span>
    </li>
  </Link>
</ul>


<ul className="flex flex-col space-y-4 p-4 bg-gray-800 rounded-lg shadow-lg">
  <li className="flex items-center space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200">
    <SettingOutlined />
    <Link to="/admin/settings" className="font-semibold">Settings</Link>
  </li>
  <li className="flex items-center space-x-3 text-gray-300 hover:text-blue-300 transition-colors duration-200">
    <LogoutOutlined />
    <button className="font-semibold text-red-500">Logout</button>
  </li>
</ul>

        </nav>

        {/* Overlay for closing sidebar on click */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Content Area */}
        <div className="flex-1 h-screen overflow-y-scroll bg-gray-100">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
