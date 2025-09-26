import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SimpleHeader: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Species Profile', href: '/education' },
    { label: 'Did you Know?', href: '/insights' },
    { label: 'Map', href: '/map' },
    { label: 'Seasonal', href: '/epic5' }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-green-800 text-white fixed top-0 inset-x-0 z-50 w-full h-20">
      <div className="px-3 sm:px-4 lg:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo as a separate entity */}
          <a className="flex items-center space-x-3" href="/">
            <img src="/Invastop-Logo.png" alt="InvaStop" className="h-40 w-40 object-contain" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={scrollToTop}
                className={`
                  group relative px-6 py-3 text-white hover:text-green-100 hover:bg-gradient-to-r hover:from-green-600/20 hover:to-green-700/20 rounded-xl transition-all duration-300 font-medium border border-green-300/30 hover:border-green-300/60 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105 active:scale-95
                  ${isActive(item.href) 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-400 shadow-lg shadow-green-500/30' 
                    : ''
                  }
                `}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-green-100 hover:bg-green-700/30 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-700">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href} 
                  onClick={() => { 
                    setIsMobileMenuOpen(false); 
                    scrollToTop(); 
                  }} 
                  className={`
                    px-4 py-2 text-white hover:text-green-100 hover:bg-green-700/30 rounded-lg transition-colors
                    ${isActive(item.href) ? 'text-green-200 bg-green-700/50 font-semibold' : ''}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default SimpleHeader;
