import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Leaf
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">InvaStop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/education" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Invader Insight
            </Link>
            <Link 
              to="/insights" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Did you Know?
            </Link>
            <Link 
              to="/map" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Know Your Land
            </Link>
            <Link 
              to="/epic5" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Seasonal
            </Link>
            <Link 
              to="/land-simulator" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Patch Planner
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/education"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Invader Insight
              </Link>
              <Link
                to="/insights"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Did you Know?
              </Link>
              <Link
                to="/map"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Know Your Land
              </Link>
              <Link
                to="/epic5"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Seasonal
              </Link>
              <Link
                to="/land-simulator"
                className="block px-3 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Patch Planner
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;