import React from 'react';
import { LayoutDashboard, PieChart, Wallet, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label }) => (
    <li className="mb-4">
      <Link
        to={path}
        className={`flex items-center p-2 rounded transition ${
          isActive(path)
            ? 'bg-gray-800 text-white border-l-4 border-blue-500'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Icon size={20} className="mr-3" />
        {label}
      </Link>
    </li>
  );

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6 hidden md:block">
      <div className="flex items-center mb-10">
        <span className="text-2xl font-bold text-blue-400">Sentinel</span>
        <span className="text-2xl font-light ml-1">Finance</span>
      </div>

      <nav>
        <ul>
          <NavItem path="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem path="/analytics" icon={PieChart} label="Analytics" />
          <NavItem path="/transactions" icon={Wallet} label="Transactions" />

          <li className="mt-10 pt-10 border-t border-gray-700">
             <NavItem path="/settings" icon={Settings} label="Settings" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
