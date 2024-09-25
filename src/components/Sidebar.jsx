import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, Ruler } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Measurement', icon: Ruler, path: '/measurement' },
    { name: 'Templates', icon: FileText, path: '/templates' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-md">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-primary">Measure Mate</h1>
      </div>
      <ul className="flex flex-col py-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                location.pathname === item.path ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                <item.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/login"
            className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
              <LogOut className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;