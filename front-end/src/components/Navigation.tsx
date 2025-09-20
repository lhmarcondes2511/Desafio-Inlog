import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-white text-xl font-bold">🚗 Vehicle Manager</h2>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              📋 Lista de Veículos
            </Link>
            <Link 
              to="/register" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/register' 
                  ? 'bg-white text-purple-600 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              ➕ Cadastrar Veículo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
