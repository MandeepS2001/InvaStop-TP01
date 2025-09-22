import React from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';

const NewHeader: React.FC = () => {
  const location = useLocation();

  // Define navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Species Profile', href: '/education' },
    { label: 'Did you Know?', href: '/insights' },
    { label: 'Map', href: '/map' },
    { label: 'Seasonal', href: '/epic5' }
  ];

  // Get current active route
  const getActiveHref = () => {
    const pathname = location.pathname;
    if (pathname === '/') return '/';
    if (pathname === '/education') return '/education';
    if (pathname === '/insights') return '/insights';
    if (pathname === '/map') return '/map';
    if (pathname === '/epic5') return '/epic5';
    return '/';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PillNav
          logo="/Invastop-Logo.png"
          logoAlt="InvaStop Logo"
          items={navItems}
          activeHref={getActiveHref()}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="rgba(34, 197, 94, 0.95)" // green-500 with transparency
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="rgba(34, 197, 94, 0.95)"
        />
      </div>
    </div>
  );
};

export default NewHeader;
