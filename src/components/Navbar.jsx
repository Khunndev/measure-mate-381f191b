import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Settings, LogOut, Ruler } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-90 backdrop-blur-md text-secondary fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <Home className="mr-2" /> Measure Mate
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center hover:text-primary transition-colors duration-200">
              <Home className="mr-1 h-5 w-5" /> Home
            </Link>
            <Link to="/measurement" className="flex items-center hover:text-primary transition-colors duration-200">
              <Ruler className="mr-1 h-5 w-5" /> Measurement
            </Link>
            <Link to="/templates" className="flex items-center hover:text-primary transition-colors duration-200">
              <FileText className="mr-1 h-5 w-5" /> Templates
            </Link>
            <Link to="/settings" className="flex items-center hover:text-primary transition-colors duration-200">
              <Settings className="mr-1 h-5 w-5" /> Settings
            </Link>
            <Link to="/login" className="flex items-center hover:text-primary transition-colors duration-200">
              <LogOut className="mr-1 h-5 w-5" /> Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
