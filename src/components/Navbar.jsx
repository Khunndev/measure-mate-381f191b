import React from 'react';
import { Home, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Home className="h-6 w-6" />
          <span className="text-xl font-bold">Measure Mate</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
          <Settings className="h-6 w-6 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;