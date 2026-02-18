import React from 'react';
import { LayoutDashboard, PieChart, Wallet, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6 hidden md:block">
      <div className="flex items-center mb-10">
        <span className="text-2xl font-bold text-blue-400">Sentinel</span>
        <span className="text-2xl font-light ml-1">Finance</span>
      </div>

      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition">
              <LayoutDashboard size={20} className="mr-3" />
              Dashboard
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition">
              <PieChart size={20} className="mr-3" />
              Analytics
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition">
              <Wallet size={20} className="mr-3" />
              Transactions
            </a>
          </li>
          <li className="mt-10 pt-10 border-t border-gray-700">
            <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition">
              <Settings size={20} className="mr-3" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
