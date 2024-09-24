import React from 'react';
import { Home, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-90 backdrop-blur-md text-secondary fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">Measure Mate</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-primary transition-colors duration-200">Home</a>
          <a href="#" className="hover:text-primary transition-colors duration-200">About</a>
          <a href="#" className="hover:text-primary transition-colors duration-200">Contact</a>
          <Settings className="h-6 w-6 cursor-pointer hover:text-primary transition-colors duration-200" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
